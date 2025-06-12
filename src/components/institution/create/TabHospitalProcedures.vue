<script lang="ts" setup>
/**
 * TabHospitalProcedures - Componente para gestão de procedimentos hospitalares de instituições
 *
 * Funcionalidades:
 * - Listagem de procedimentos hospitalares
 * - Criação/Edição de procedimentos hospitalares
 * - Visualização de detalhes
 * - Exclusão de procedimentos hospitalares
 */

import { ref, watch, computed, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useI18n } from "vue-i18n";
import { v4 as uuidv4 } from "uuid";

// Components
import DataTableServer from "@/app/common/components/DataTableServer.vue";
import Status from "@/app/common/components/Status.vue";
import ListMenuWithIcon from "@/app/common/components/ListMenuWithIcon.vue";
import QuerySearch from "@/app/common/components/filters/QuerySearch.vue";
import CreateEditHospitalProcedureDialog from "@/components/institution/create/CreateEditHospitalProcedureDialog.vue";
import ViewHospitalProcedureDialog from "@/components/institution/create/ViewHospitalProcedureDialog.vue";
import RemoveItemConfirmationDialog from "@/app/common/components/RemoveItemConfirmationDialog.vue";
import TableAction from "@/app/common/components/TableAction.vue";
// Stores e Services
import { useHospitalProcedureStore } from "@/store/institution/hospitalProcedureStore";
import { hospitalProcedureService } from "@/app/http/httpServiceProvider";
import type { ApiErrorResponse } from "@/app/common/types/errorType";
// Types
import type {
  HospitalProcedureInsertType,
  HospitalProcedureListingType
} from "@/components/institution/types";

// Utils
import { hospitalProcedureHeader } from "@/components/institution/create/utils";
import { limitTypeDefinitionOptions } from "@/components/institution/create/utils";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const toast = useToast();
const hospitalProcedureStore = useHospitalProcedureStore();

// Estado do componente
const institutionId = ref<string | null>(
  typeof route.params.id === 'string' ? route.params.id :
    Array.isArray(route.params.id) ? route.params.id[0] : null
);

const dialog = ref(false);
const viewDialog = ref(false);
const deleteDialog = ref(false);
const deleteLoading = ref(false);
const hospitalProcedureData = ref<HospitalProcedureInsertType | HospitalProcedureListingType| null>(null);
const hospitalProcedureDataView = ref<HospitalProcedureListingType | null>(null);
const deleteId = ref<string | null>(null);
const errorMsg = ref("");
const searchQuery = ref("");
const searchProps = "fixedAmount,percentage,limitTypeDefinition,hospitalProcedureType"; // Propriedades de busca
const itemsPerPage = ref(10);
const selectedHospitalProcedures = ref<HospitalProcedureListingType[]>([]);
const customerDetail = ref<any>(null); // Adicionado para resolver o erro

let alertTimeout: ReturnType<typeof setTimeout> | null = null;

// Computed properties
const loadingList = computed(() => hospitalProcedureStore.loading);
const totalItems = computed(() => hospitalProcedureStore.pagination.totalElements);

interface FetchParams {
  page: number;
  itemsPerPage: number;
  sortBy: Array<{ key: string; order: 'asc' | 'desc' }>;
  search: string;
}

/**
 * Busca procedimentos hospitalares com paginação e filtros
 */
const fetchHospitalProcedures = async ({ page, itemsPerPage, sortBy, search }: FetchParams) => {
  if (!institutionId.value) return;

  await hospitalProcedureStore.fetchHospitalProcedures(
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
 * Alterna seleção de procedimentos hospitalares
 */
const toggleSelection = (item: HospitalProcedureListingType) => {
  const index = selectedHospitalProcedures.value.findIndex(selected => selected.id === item.id);
  if (index === -1) {
    selectedHospitalProcedures.value = [...selectedHospitalProcedures.value, item];
  } else {
    selectedHospitalProcedures.value = selectedHospitalProcedures.value.filter(selected => selected.id !== item.id);
  }
};

/**
 * Prepara dados para criação/edição
 */
const getLimitTypeLabel = (value: string) => {
  const option = limitTypeDefinitionOptions.find(opt => opt.value === value);
  return option ? option.label : value;
};

watch(dialog, (newVal: boolean) => {
  if (!newVal) {
    hospitalProcedureData.value = null;
  }
});
const onCreateEditClick = (data: HospitalProcedureInsertType | HospitalProcedureListingType | null) => {
  const company = institutionId.value || "";

  hospitalProcedureData.value = data
    ? {
      ...data,
      company: company // sobrescreve com o institutionId atual
    }
    : {
      id: undefined,
      fixedAmount: 0,
      percentage: 0,
      limitTypeDefinition: "",
      hospitalProcedureType: "",
      company: company
    };

  dialog.value = true;
};


/**
 * Submete dados do formulário
 */
interface ServiceResponse<T> {
  status: 'success' | 'error';
  data?: T;
  error?: ApiErrorResponse;
}

const onSubmit = async (
  data: HospitalProcedureInsertType,
  callbacks?: {
    onSuccess?: () => void,
    onFinally?: () => void
  }
) => {
  try {
    let response: ServiceResponse<HospitalProcedureListingType>;

    if (!data.id) {
      response = await hospitalProcedureService.createHospitalProcedure(data);
    } else {
      response = await hospitalProcedureService.updateHospitalProcedure(data.id, data);
    }

    // Verifica se a resposta contém erro
    if (response.status === 'error') {
      toast.error(response.error?.message || t('t-message-save-error'));
      return;
    }

    // Só mostra sucesso se realmente foi bem-sucedido
    toast.success(data.id ? t('t-toast-message-update') : t('t-toast-message-created'));

    await hospitalProcedureStore.fetchHospitalProcedures(
      institutionId.value,
      0,
      itemsPerPage.value
    );
    callbacks?.onSuccess?.();

  } catch (error: any) {
    console.error("Erro ao gravar procedimento hospitalar:", error);
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
    hospitalProcedureData.value = null;
  }
});
const onViewClick = (data: HospitalProcedureListingType) => {
  hospitalProcedureDataView.value = { ...data };
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
    await hospitalProcedureService.deleteHospitalProcedure(deleteId.value);
    selectedHospitalProcedures.value = selectedHospitalProcedures.value.filter(
      user => user.id !== deleteId.value
    );
    await hospitalProcedureStore.fetchHospitalProcedures(
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
// Limpeza ao desmontar
onBeforeUnmount(() => {
  if (alertTimeout) {
    clearTimeout(alertTimeout);
    alertTimeout = null;
  }
});
</script>

<template>
  <Card :title="$t('t-hospital-procedure-list')" title-class="py-5">
    <template #title-action>
      <div>
        <v-btn color="primary" class="mx-1" @click="onCreateEditClick(null)">
          <i class="ph-plus-circle me-1" /> {{ $t('t-add-hospital-procedure') }}
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
      <!--<v-card-text>
        <v-row>
          <v-col cols="12" lg="12">
            <QuerySearch v-model="searchQuery" :placeholder="$t('t-search-for-hospital-procedure')" />
          </v-col>
        </v-row>
      </v-card-text>-->
      <DataTableServer v-model="selectedHospitalProcedures"
        :headers="hospitalProcedureHeader.map(item => ({ ...item, title: $t(`t-${item.title}`) }))"
        :items="hospitalProcedureStore.hospital_procedure" :items-per-page="itemsPerPage" :total-items="totalItems"
        :loading="loadingList" :search-query="searchQuery" :search-props="searchProps"
        @load-items="fetchHospitalProcedures" item-value="id" show-select>
        <template #body="{ items }">
          <tr v-for="item in items as HospitalProcedureListingType[]" :key="item.id" height="50">
            <td>
              <v-checkbox :model-value="selectedHospitalProcedures.some(selected => selected.id === item.id)"
                @update:model-value="toggleSelection(item)" hide-details density="compact" />
            </td>
            <td>{{ item.hospitalProcedureType.name }}</td>
            <td>{{ getLimitTypeLabel(item.limitTypeDefinition) }}</td>
            <td>{{ item.fixedAmount }}</td>
            <td>{{ item.percentage }}%</td>
            <td>
              <TableAction @onEdit="onCreateEditClick(item)" @onView="onViewClick(item)"
                @onDelete="onDelete(item.id)" />
            </td>
          </tr>
        </template>

        <template v-if="hospitalProcedureStore.hospital_procedure.length === 0" #body>
          <tr>
            <td :colspan="hospitalProcedureHeader.length" class="text-center py-10">
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
  <CreateEditHospitalProcedureDialog v-model="dialog" :data="hospitalProcedureData" @onSubmit="onSubmit" />
  <ViewHospitalProcedureDialog v-model="viewDialog" :data="hospitalProcedureDataView" />
  <RemoveItemConfirmationDialog v-model="deleteDialog" :loading="deleteLoading" @onConfirm="onConfirmDelete" />
 
  <v-card-actions class="d-flex justify-space-between mt-5">
    <v-btn color="secondary" variant="outlined" class="me-2" @click="$emit('onStepChange', 5)">
      {{ $t('t-back-to-clinics') }} <i class="ph-arrow-left ms-2" />
    </v-btn>

  </v-card-actions>
</template>