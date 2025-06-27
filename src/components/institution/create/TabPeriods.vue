<script lang="ts" setup>
/**
 * TabContacts - Componente para  de pessoas de contato de instituições
 * 
 * Funcionalidades:
 * - Listagem de contatos
 * - Criação/Edição de contatos
 * - Visualização de detalhes
 * - Exclusão de contatos
 */

import { ref, watch, computed, onMounted, onBeforeUnmount, PropType } from "vue";
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useI18n } from "vue-i18n";
import { v4 as uuidv4 } from "uuid";

// Components
import DataTableServer from "@/app/common/components/DataTableServer.vue";
import Status from "@/app/common/components/Status.vue";
import ListMenuWithIcon from "@/app/common/components/ListMenuWithIcon.vue";
import QuerySearch from "@/app/common/components/filters/QuerySearch.vue";
import CreateEditCoveragePeriod from "@/components/institution/create/CreateEditCoveragePeriod.vue";
import ViewCoveragePeriod from "@/components/institution/create/ViewCoveragePeriod.vue";
import RemoveItemConfirmationDialog from "@/app/common/components/RemoveItemConfirmationDialog.vue";
import PeriodStartConfirmationDialog from "@/app/common/components/PeriodStartConfirmationDialog.vue";
import PeriodClosedConfirmationDialog from "@/app/common/components/PeriodClosedConfirmationDialog.vue";
import TableAction from "@/app/common/components/TableAction.vue";
// Stores e Services
import { useCoveragePeriodStore } from "@/store/institution/coveragePeriodStore";
import { coveragePeriodService } from "@/app/http/httpServiceProvider";

// Types
import type {
  CoveragePeriodListingType,
  CoveragePeriodInsertType
} from "@/components/institution/types";

// Utils
import { coveragePeriodHeader } from "@/components/institution/create/utils";
import { Options } from "@/components/institution/create/utils";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const toast = useToast();
const coveragePeriodStore = useCoveragePeriodStore();

// props
const props = defineProps({
  institutionId: {
    type: String as PropType<string | null>,
    default: null
  }
});

// Modifique a lógica para usar o prop institutionId
const institutionId = ref(props.institutionId);

// constants
const dialog = ref(false);
const viewDialog = ref(false);
const deleteDialog = ref(false);
const deleteLoading = ref(false);
const startDialog = ref(false);
const closeDialog = ref(false);
const selectedPeriod = ref<CoveragePeriodListingType | null>(null);
const coveragePeriodData = ref<CoveragePeriodInsertType | null>(null);
const deleteId = ref<string | null>(null);
const errorMsg = ref("");
const searchQuery = ref("");
const searchProps = "name"; // Propriedades de busca
const itemsPerPage = ref(10);
const selectedContactPersons = ref<CoveragePeriodListingType[]>([]);
const customerDetail = ref<any>(null); // Adicionado para resolver o erro

let alertTimeout: ReturnType<typeof setTimeout> | null = null;

// Computed properties
const loadingList = computed(() => coveragePeriodStore.loading);
const totalItems = computed(() => coveragePeriodStore.pagination.totalElements);

interface FetchParams {
  page: number;
  itemsPerPage: number;
  sortBy: Array<{ key: string; order: 'asc' | 'desc' }>;
  search: string;
}

/**
 * Busca pessoas de contato com paginação e filtros
 */
const fetchCoveragePeriods = async ({ page, itemsPerPage, sortBy, search }: FetchParams) => {
  if (!institutionId.value) return;

  await coveragePeriodStore.fetchCoveragePeriods(
    institutionId.value,
    page - 1, // Ajuste para API que começa em 0
    itemsPerPage,
    sortBy[0]?.key || 'createdAt',
    sortBy[0]?.order || 'asc',
    search,
    searchProps
  );
};

/**
 * Alterna seleção de pessoas de contato
 */
const toggleSelection = (item: CoveragePeriodListingType) => {
  const index = selectedContactPersons.value.findIndex(selected => selected.id === item.id);
  if (index === -1) {
    selectedContactPersons.value = [...selectedContactPersons.value, item];
  } else {
    selectedContactPersons.value = selectedContactPersons.value.filter(selected => selected.id !== item.id);
  }
};

/**
 * Prepara dados para criação/edição
 */
watch(dialog, (newVal: boolean) => {
  if (!newVal) {
    coveragePeriodData.value = null;
  }
});
const onCreateEditClick = (data: CoveragePeriodInsertType | null) => {
  const company = institutionId.value || "";

  coveragePeriodData.value = data
    ? {
      ...data,
      company: company // sobrescreve com o institutionId atual
    }
    : {
      id: undefined,
      name: "",
      startDate: "",
      endDate: "",
      company: company
    };

  dialog.value = true;
};


/**
 * Submete dados do formulário
 */
const onSubmit = async (
  data: CoveragePeriodInsertType,
  callbacks?: {
    onSuccess?: () => void,
    onFinally?: () => void
  }
) => {
  try {
    if (!data.id) {
      await coveragePeriodService.createCoveragePeriod(data);
      toast.success(t('t-toast-message-created'));
    } else {
      await coveragePeriodService.updateCoveragePeriod(data.id, data);
      toast.success(t('t-toast-message-update'));
    }

    await coveragePeriodStore.fetchCoveragePeriods(
      institutionId.value,
      0,
      itemsPerPage.value
    );
    callbacks?.onSuccess?.();
  } catch (error) {
    console.error("Erro ao gravar pessoa de contacto:", error);
    toast.error(t('t-message-save-error'));
  } finally {
    callbacks?.onFinally?.();
  }
};

/**
 * Prepara dados para visualização
 */
watch(viewDialog, (newVal: boolean) => {
  if (!newVal) {
    coveragePeriodData.value = null;
  }
});
const onViewClick = (data: CoveragePeriodInsertType) => {
  coveragePeriodData.value = { ...data };
  viewDialog.value = true;
};

/**
 * Prepara exclusão de contato
 */
const onDelete = (id: string) => {
  deleteId.value = id;
  deleteDialog.value = true;
};

/**
 * Confirma exclusão de contato
 */
const onConfirmDelete = async () => {
  if (!deleteId.value) return;

  deleteLoading.value = true;
  try {
    await coveragePeriodService.deleteCoveragePeriod(deleteId.value);
    selectedContactPersons.value = selectedContactPersons.value.filter(
      user => user.id !== deleteId.value
    );
    await coveragePeriodStore.fetchCoveragePeriods(
      institutionId.value,
      0,
      itemsPerPage.value
    );
    toast.success(t('t-toast-message-deleted'));
  } catch (error) {
    toast.error(t('t-toast-message-deleted-erros'));
    console.error("Delete error:", error);
  } finally {
    deleteLoading.value = false;
    deleteDialog.value = false;
    deleteId.value = null;
  }
};

const getDynamicOptions = (item: CoveragePeriodListingType) => {
  let availableOptions = [...Options];

  // Se estiver CLOSED, mostrar apenas "view"
  if (item.status === 'CLOSED') {
    availableOptions = availableOptions.filter(option => option.value === 'view');
  }
  // Se estiver INACTIVE, mostrar "start", "edit", "view", "delete"
  else if (item.status === 'INACTIVE') {
    availableOptions = availableOptions.filter(option =>
      ['start', 'edit', 'view', 'delete'].includes(option.value)
    );
  }
  // Se estiver RUNNING, ocultar "start"
  else if (item.status === 'RUNNING') {
    availableOptions = availableOptions.filter(option => option.value !== 'start');
  }

  return availableOptions.map(option => ({
    ...option,
    title: t(`t-${option.title}`)
  }));
};





const onSelect = (option: string, data: CoveragePeriodListingType) => {
  switch (option) {
    case "view":
      onViewClick(data);
      break;
    case "edit":
      onCreateEditClick(data);
      break;
    case "delete":
      onDelete(data.id);
      break;
    case "start":
      selectedPeriod.value = data;
      startDialog.value = true;
      break;
    case "closed":
      selectedPeriod.value = data;
      closeDialog.value = true;
      break;
  }
};

const onConfirmStart = async () => {
  if (!selectedPeriod.value) return;

  try {
    await coveragePeriodService.startCoveragePeriod(selectedPeriod.value.id);
    toast.success(t('t-period-started'));
    await coveragePeriodStore.fetchCoveragePeriods(institutionId.value, 0, itemsPerPage.value);
  } catch (err) {
    toast.error(t('t-error-starting-period'));
    console.error(err);
  } finally {
    startDialog.value = false;
    selectedPeriod.value = null;
  }
};

const onConfirmClose = async () => {
  if (!selectedPeriod.value) return;

  try {
    await coveragePeriodService.closeCoveragePeriod(selectedPeriod.value.id);
    toast.success(t('t-period-closed'));
    await coveragePeriodStore.fetchCoveragePeriods(institutionId.value, 0, itemsPerPage.value);
  } catch (err) {
    toast.error(t('t-error-closing-period'));
    console.error(err);
  } finally {
    closeDialog.value = false;
    selectedPeriod.value = null;
  }
};



// Limpeza ao desmontar
onBeforeUnmount(() => {
  if (alertTimeout) {
    clearTimeout(alertTimeout);
    alertTimeout = null;
  }
});
</script>

<template>
  <Card :title="$t('t-period-list')" title-class="py-5">
    <template #title-action>
      <div>
        <v-btn color="primary" class="mx-1" @click="onCreateEditClick(null)">
          <i class="ph-plus-circle me-1" /> {{ $t('t-add-period') }}
        </v-btn>
        <v-btn color="secondary" class="mx-1">
          <i class="ph-download-simple me-1" /> {{ $t('t-import') }}
        </v-btn>
        <v-btn color="info" class="mx-1" variant="tonal">
          <i class="ph-upload-simple me-1" /> {{ $t('t-export') }}
        </v-btn>
      </div>
    </template>
  </Card>

  <v-row class="mt-5">
    <v-col cols="12" lg="12">
      <v-card-text>
        <v-row>
          <v-col cols="12" lg="12">
            <QuerySearch v-model="searchQuery" :placeholder="$t('t-search-for-period')" />
          </v-col>
        </v-row>
      </v-card-text>
      <DataTableServer v-model="selectedContactPersons"
        :headers="coveragePeriodHeader.map(item => ({ ...item, title: $t(`t-${item.title}`) }))"
        :items="coveragePeriodStore.coverage_periods" :items-per-page="itemsPerPage" :total-items="totalItems"
        :loading="loadingList" :search-query="searchQuery" :search-props="searchProps"
        @load-items="fetchCoveragePeriods" item-value="id" show-select>
        <template #body="{ items }">
          <tr v-for="item in items as CoveragePeriodListingType[]" :key="item.id" height="50">
            <td>
              <v-checkbox :model-value="selectedContactPersons.some(selected => selected.id === item.id)"
                @update:model-value="toggleSelection(item)" hide-details density="compact" />
            </td>
            <td>{{ item.name }}</td>
            <td>{{ item.startDate }}</td>
            <td>{{ item.endDate }}</td>
            <td>
              <ListMenuWithIcon :menuItems="getDynamicOptions(item)" @onSelect="onSelect($event, item)" />
            </td>
          </tr>
        </template>

        <template v-if="!coveragePeriodStore.coverage_periods.length" #body>
          <tr>
            <td :colspan="coveragePeriodHeader.length + 2" class="text-center py-10">
              <v-avatar size="80" color="primary" variant="tonal">
                <i class="ph-magnifying-glass" style="font-size: 30px" />
              </v-avatar>
              <div class="text-subtitle-1 font-weight-bold mt-3">
                {{ $t('t-search-not-found-message') }}
              </div>
            </td>
          </tr>
        </template>
      </DataTableServer>
    </v-col>
  </v-row>

  <!-- Dialogs -->
  <CreateEditCoveragePeriod v-model="dialog" :data="coveragePeriodData" @onSubmit="onSubmit" />
  <ViewCoveragePeriod v-model="viewDialog" :data="coveragePeriodData" />
  <RemoveItemConfirmationDialog v-model="deleteDialog" :loading="deleteLoading" @onConfirm="onConfirmDelete" />
  <PeriodStartConfirmationDialog v-model="startDialog" @onConfirm="onConfirmStart" />
  <PeriodClosedConfirmationDialog v-model="closeDialog" @onConfirm="onConfirmClose" />

  <v-card-actions class="d-flex justify-space-between mt-5">
    <v-btn color="secondary" variant="outlined" class="me-2" @click="$emit('onStepChange', 1)">
      {{ $t('t-back-to-general-info') }} <i class="ph-arrow-left ms-2" />
    </v-btn>
    <v-btn color="success" variant="elevated" @click="$emit('onStepChange', 3)">
      {{ $t('t-proceed') }} <i class="ph-arrow-right ms-2" />
    </v-btn>

  </v-card-actions>
</template>