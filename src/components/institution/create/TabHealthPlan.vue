<script lang="ts" setup>
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
import CreateEditHealthPlanDialog from "@/components/institution/create/CreateEditHealthPlanDialog.vue";
import ViewHealthPlanDialog from "@/components/institution/create/ViewHealthPlanDialog.vue";
import RemoveItemConfirmationDialog from "@/app/common/components/RemoveItemConfirmationDialog.vue";
import TableAction from "@/app/common/components/TableAction.vue";
// Stores e Services
import { usehealthPlanStore } from "@/store/institution/healthPlanStore";
import { healthPlanService } from "@/app/http/httpServiceProvider";
// Importa o store CoveragePeriod
import { useCoveragePeriodStore } from "@/store/institution/periodStore";


// Types
import type {
  HealthPlanInsertType, HealthPlanListingType
} from "@/components/institution/types";

// Utils
import { listViewHeader } from "@/components/institution/create/utils";
import { contactOptions as Options } from "@/components/institution/create/utils";

// const resposta = await healthPlanService.getHealthPlans();
// console.log("resposta ==>", resposta);
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const toast = useToast();
const healthPlanStore = usehealthPlanStore();
const formErrorMsg = ref(""); // Mensagem de erro do formulário

console.log("healthPlanStore.health_plan ==>", healthPlanStore);
// props
const props = defineProps({
  institutionId: {
    type: String as PropType<string | null>,
    default: null
  }
});



// Modifique a lógica para usar o prop institutionId
const institutionId = ref(props.institutionId);
console.log("institutionId ===> ", institutionId)

// constants
const dialog = ref(false);
const viewDialog = ref(false);
const deleteDialog = ref(false);
const deleteLoading = ref(false);
const healthPlanData = ref<HealthPlanListingType | null>(null);
const deleteId = ref<string | null>(null);
const errorMsg = ref("");
const searchQuery = ref("");
const searchProps = "fullname,email,phone"; // Propriedades de busca
const itemsPerPage = ref(10);
const selectedHealthPlans = ref<HealthPlanListingType[]>([]);
const customerDetail = ref<any>(null); // Adicionado para resolver o erro
const coveragePeriodStore = useCoveragePeriodStore();

onMounted(async () => {
  await coveragePeriodStore.fetchCoveragePeriods();
  console.log("Coverage Periods carregados:", coveragePeriodStore.coverage_periods);
});


interface FetchParams {
  page: number;
  itemsPerPage: number;
  sortBy: Array<{ key: string; order: 'asc' | 'desc' }>;
  search: string;
}

let alertTimeout: ReturnType<typeof setTimeout> | null = null;

// Computed properties
const loadingList = computed(() => healthPlanStore.loading);
const totalItems = computed(() => healthPlanStore.pagination.totalElements);
/**
 * Busca pessoas de contato com paginação e filtros
 */
const fetchHealthPlanforList = async ({ page, itemsPerPage, sortBy, search }: FetchParams) => {
  if (!institutionId.value) return;

  await healthPlanStore.fetchHealthPlanforListing(
    institutionId.value,
    page - 1, // Ajuste para API que começa em 0
    itemsPerPage,
    sortBy[0]?.key || 'createdAt',
    sortBy[0]?.order || 'asc',
    search,
    searchProps
  );
};


console.log("healthPlanStore.health_plan ==>", healthPlanStore.health_plan);

/**
 * Alterna seleção de pessoas de contato
 */



const toggleSelection = (item: HealthPlanListingType) => {
  const index = selectedHealthPlans.value.findIndex(selected => selected.id === item.id);
  if (index === -1) {
    selectedHealthPlans.value = [...selectedHealthPlans.value, item];
  } else {
    selectedHealthPlans.value = selectedHealthPlans.value.filter(selected => selected.id !== item.id);
  }
};

/**
 * Prepara dados para criação/edição
 */
watch(dialog, (newVal: boolean) => {
  if (!newVal) {
    healthPlanData.value = null;
  }
});
const onCreateEditClick = (data: HealthPlanInsertType | null) => {
  const company = institutionId.value || "";
  console.log("company ===>", company)
  healthPlanData.value = {

    id: "",
    childrenMaxAge: 0,
    maxNumberOfDependents: 0,
    healthPlanLimit: "",
    salaryComponent: "",
    fixedAmount: 0,
    companyContributionPercentage: 0,
    coveragePeriod: "", // sem pré-seleção
    company: company
  };

  dialog.value = true;
};

const handleApiError = (error: any) => {
  console.error("🔥 ERRO COMPLETO:", JSON.stringify(error, null, 2));
  console.error("🔥 RESPONSE:", error?.response);

  if (alertTimeout) {
    clearTimeout(alertTimeout);
    alertTimeout = null;
  }

  const message =
    error?.response?.data?.error?.detail ||
    error?.response?.data?.error?.errors?.detail ||
    error?.response?.data?.error?.detail ||
    error?.message ||
    t("t-message-save-error");

  formErrorMsg.value = message;

  console.log("formErrorMsg.value ==>", formErrorMsg.value);

  alertTimeout = setTimeout(() => {
    formErrorMsg.value = "";
    alertTimeout = null;
  }, 5000);
};


/**
 * Submete dados do formulário
 */
const onSubmit = async (
  data: HealthPlanInsertType,
  callbacks?: {
    onSuccess?: () => void,
    onFinally?: () => void
  }
) => {
  formErrorMsg.value = "";

  try {
    if (!data.id) {
      await healthPlanService.createHealthPlan(data);
      toast.success(t('t-toast-message-created'));
    } else {
      await healthPlanService.updateHealthPlan(data.id, data);
      toast.success(t('t-toast-message-update'));
    }

    await healthPlanStore.fetchHealthPlanforListing(
      institutionId.value,
      0,
      itemsPerPage.value
    );
    callbacks?.onSuccess?.();
  } catch (error: any) {
    handleApiError(error);
    toast.error(t('t-message-save-error'));
  } finally {
    callbacks?.onFinally?.();
  }
};


const extractApiErrorMessage = (error: any): string => {
  return (
    error?.response?.data?.error?.errors?.startDate?.[0] ||
    error?.response?.data?.error?.errors?.endDate?.[0] ||
    error?.response?.data?.error?.detail ||
    error?.message ||
    t("t-message-save-error")
  );
};

/**
 * Prepara dados para visualização
 */
watch(viewDialog, (newVal: boolean) => {
  if (!newVal) {
    healthPlanData.value = null;
  }
});
// const onViewClick = (data: HealthPlanInsertType) => {
//   healthPlanData.value = { ...data };
//   viewDialog.value = true;
// };

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
    await healthPlanService.deleteHealthPlan(deleteId.value);
    selectedHealthPlans.value = selectedHealthPlans.value.filter(
      user => user.id !== deleteId.value
    );
    await healthPlanStore.fetchHealthPlanforListing(
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

const getDynamicOptions = () => {
  return Options
    .filter(option => ['edit', 'view', 'delete'].includes(option.value))
    .map(option => ({
      ...option,
      title: t(`t-${option.title}`)
    }));
};

const onSelect = (option: string, data: HealthPlanListingType) => {
  switch (option) {
    case "view":
      healthPlanData.value = { ...data };
      viewDialog.value = true;
      break;
    case "edit":
      healthPlanData.value = { ...data };
      dialog.value = true;
      break;
    case "delete":
      deleteId.value = data.id;   
      deleteDialog.value = true;
      break;
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
  <Card :title="$t('t-health-plan-list')" title-class="py-5">
    <template #title-action>
      <div>
        <v-btn color="primary" class="mx-1" @click="onCreateEditClick(null)">
          <i class="ph-plus-circle me-1" /> {{ $t('t-add-health-plan') }}
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
            <QuerySearch v-model="searchQuery" :placeholder="$t('t-search-for-health-plan')" />
          </v-col>
        </v-row>
      </v-card-text>
      <DataTableServer v-model="selectedHealthPlans"
        :headers="listViewHeader.map(item => ({ ...item, title: $t(`t-${item.title}`) }))"
        :items="healthPlanStore.health_plan" :items-per-page="itemsPerPage" :total-items="totalItems"
        :loading="loadingList" :search-query="searchQuery" :search-props="searchProps"
        @load-items="fetchHealthPlanforList" item-value="id" show-select>
        <template #body="{ items }">
          <tr v-for="item in items as HealthPlanListingType[]" :key="item.id" height="50">
            <td>
              <v-checkbox :model-value="selectedHealthPlans.some(selected => selected.id === item.id)"
                @update:model-value="toggleSelection(item)" hide-details density="compact" />
            </td>
            <td>{{ item.healthPlanLimit }}</td>
            <td>{{ item.childrenMaxAge }}</td>
            <td>{{ item.maxNumberOfDependents }}</td>
            <td>{{ item.fixedAmount }}</td>
            <td>{{ item.salaryComponent }}</td>
            <td>{{ item.companyContributionPercentage }}</td>
            <td>
              <ListMenuWithIcon :menuItems="getDynamicOptions()" @onSelect="onSelect($event, item)" />
            </td>

            <!-- <td>
              <StatusPeriod :status_period="item.status" />
            </td> -->
            <!-- <td>
              <ListMenuWithIcon :menuItems="getDynamicOptions(item)" @onSelect="onSelect($event, item)" />
            </td> -->
          </tr>
        </template>

        <template v-if="!healthPlanStore.health_plan.length" #body>
          <tr>
            <td :colspan="listViewHeader.length + 2" class="text-center py-10">
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
  <CreateEditHealthPlanDialog v-model="dialog" :data="healthPlanData" @onSubmit="onSubmit" :error="formErrorMsg"
    :institutionId="institutionId" />
  <ViewHealthPlanDialog v-model="viewDialog" :data="healthPlanData" />
  <RemoveItemConfirmationDialog v-model="deleteDialog" :loading="deleteLoading" @onConfirm="onConfirmDelete" />

  <v-card-actions class="d-flex justify-space-between mt-5">
    <v-btn color="secondary" variant="outlined" class="me-2" @click="$emit('onStepChange', 1)">
      {{ $t('t-back-to-general-info') }} <i class="ph-arrow-left ms-2" />
    </v-btn>
    <v-btn color="success" variant="elevated" @click="$emit('onStepChange', 3)">
      {{ $t('t-proceed') }} <i class="ph-arrow-right ms-2" />
    </v-btn>

  </v-card-actions>
</template>