<script lang="ts" setup>
import InvoiceSVG from "@/assets/images/invoice.vue";
import MenuSelect from "@/app/common/components/filters/MenuSelect.vue";
import ProductCard from "@/components/invoice/createInvoice/ProductCard.vue";
import { ref, computed, onMounted, watch, reactive } from "vue";
import { InvoiceInsertType, InvoiceItemInsertType } from "@/components/invoice/types";
import { useClinicStore } from "@/store/clinicStore";
import { useInstitutionStore } from "@/store/institution/institutionStore";
import { useEmployeeStore } from "@/store/employee/employeeStore";
import { useCurrencyStore } from "@/store/baseTables/currencyStore";
import { useDependentEmployeeStore } from "@/store/employee/dependentStore";
import ValidatedDatePicker from "@/app/common/components/ValidatedDatePicker.vue";
import { useI18n } from "vue-i18n";
import { useToast } from 'vue-toastification';
import { useRouter } from "vue-router";
import { useInvoiceStore } from "@/store/invoice/invoiceStore";

// Composables
const { t } = useI18n();
const toast = useToast();
const router = useRouter();
const invoiceStore = useInvoiceStore();

// Props
const props = defineProps({
  modelValue: {
    type: Object as () => InvoiceInsertType,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  isEditMode: {
    type: Boolean,
    default: false
  },
  initialItems: {
    type: Array as () => InvoiceItemInsertType[],
    default: () => []
  }
});

// Emits
// Em InvoiceForm.vue, modifique a seção defineEmits para:
const emit = defineEmits<{
  (e: 'save', invoiceData: InvoiceInsertType): void;
  (e: 'save-with-items', payload: { invoiceData: InvoiceInsertType, items: InvoiceItemInsertType[] }): void;
  (e: 'update:modelValue', value: InvoiceInsertType): void;
  (e: 'items-ready', items: InvoiceItemInsertType[]): void; // Adicione esta linha
}>();

// Stores
const clinicStore = useClinicStore();
const institutionStore = useInstitutionStore();
const employeeStore = useEmployeeStore();
const currencyStore = useCurrencyStore();
const dependentStore = useDependentEmployeeStore();

// Refs
const form = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null);
const errorMsg = ref("");
let alertTimeout: ReturnType<typeof setTimeout> | null = null;

// Computed
const invoiceData = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  }
});

const invoiceItemData = reactive<InvoiceItemInsertType>({
  unitPrice: 0,
  quantity: 0,
  taxRate: '',
  description: '',
  companyAllowedHospitalProcedure: '',
  invoice: invoiceStore.currentInvoiceId
});

const institutions = computed(() => {
  return institutionStore.institutions.map((item) => ({
    value: item.id,
    label: item.name,
  }));
});

const clinics = computed(() => {
  return clinicStore.clinics_list.map((clinic) => ({
    value: clinic.id,
    label: clinic.name
  }));
});

const employees = computed(() => {
  return employeeStore.employeesForDropdown.map((item) => ({
    value: item.id,
    label: `${item.firstName} ${item.lastName}`,
  }));
});

const currencies = computed(() => {
  return currencyStore.currenciesForDropdown.map((item) => ({
    value: item.id,
    label: item.name,
  }));
});

const dependents = computed(() => {
  return dependentStore.dependentsForDropdown.map((item) => ({
    value: item.id,
    label: `${item.firstName} ${item.lastName}`,
  }));
});

// Validation rules
const requiredRules = {
  institution: [(v: string) => !!v || t('t-institution-required')],
  clinic: [(v: string) => !!v || t('t-clinic-required')],
  employee: [(v: string) => !!v || t('t-employee-required')],
  issueDate: [(v: Date) => !!v || t('t-issue-date-required')],
  dueDate: [(v: Date) => !!v || t('t-due-date-required')],
  currency: [(v: string) => !!v || t('t-currency-required')],
  invoiceNumber: [(v: string) => !!v || t('t-invoice-number-required')],
  dependent: [(v: string) => invoiceData.value.isEmployeeInvoice ? true : !!v || t('t-dependent-required')],
  authorizedBy: [(v: string) => !!v || t('t-authorized-by-required')]
};

// Watchers
watch(() => invoiceData.value.company, async (newInstitutionId) => {
  if (newInstitutionId) {
    try {
      await employeeStore.fetchEmployeesForDropdown(newInstitutionId);

      if (invoiceData.value.employee) {
        const currentEmployee = employeeStore.employeesForDropdown.find(
          c => c.id === invoiceData.value.employee
        );
        if (!currentEmployee) {
          invoiceData.value.employee = undefined;
        }
      }
    } catch (error) {
      handleLoadError("employees", error);
    }
  } else {
    employeeStore.clearEmployeesForDropdown();
    invoiceData.value.employee = undefined;
  }
});

watch(() => invoiceData.value.employee, async (newEmployeeId) => {
  if (newEmployeeId) {
    try {
      await dependentStore.fetchDependentsEmployeeForDropdown(newEmployeeId);

      if (invoiceData.value.dependent) {
        const currentDependent = dependentStore.dependentsForDropdown.find(
          c => c.id === invoiceData.value.dependent
        );
        if (!currentDependent) {
          invoiceData.value.dependent = undefined;
        }
      }
    } catch (error) {
      handleLoadError("dependents", error);
    }
  } else {
    dependentStore.clearDependentForDropdown();
    invoiceData.value.dependent = undefined;
  }
});

// Methods
const handleLoadError = (resource: string, error: any) => {
  console.error(`Failed to load ${resource}:`, error);
  errorMsg.value = t(`t-failed-to-load-${resource}`);

  if (alertTimeout) clearTimeout(alertTimeout);
  alertTimeout = setTimeout(() => {
    errorMsg.value = "";
    alertTimeout = null;
  }, 5000);
};

// No InvoiceForm.vue, modifique a função submitInvoice
const productCardRef = ref<{ emitItemsReady: () => boolean }>();

const submitInvoice = async () => {
  if (!form.value) return;

  const { valid } = await form.value.validate();

  if (!valid) {
    toast.error(t('t-validation-error'));
    errorMsg.value = t('t-please-correct-errors');
    return;
  }

  try {
    if (invoiceData.value.isEmployeeInvoice) {
      invoiceData.value.dependent = undefined;
    } else if (!invoiceData.value.dependent) {
      toast.error(t('t-dependent-required'));
      return;
    }

    // Emite apenas os dados básicos primeiro
    emit('save', { ...invoiceData.value });
    
    // Se houver itens, emite-os separadamente
    if (productCardRef.value) {
      productCardRef.value.emitItemsReady();
    }

  } catch (error) {
    console.error("Erro ao submeter fatura:", error);
    toast.error(t('t-message-save-error'));
  }
};

// Modifique para apenas preparar os itens sem emitir salvamento
const handleItemsReady = (items: InvoiceItemInsertType[]) => {
  // Calcula o totalAmount baseado nos valores do backend quando em edição
  if (props.isEditMode) {
    const totalAmount = props.initialItems.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
    invoiceData.value.totalAmount = totalAmount;
  }
  
  emit('items-ready', items);
};


const onBack = () => {
  institutionStore.clearDraft();
  router.push('/invoices/list');
};

// Lifecycle hooks
onMounted(async () => {
  try {
    await Promise.all([
      institutionStore.fetchInstitutions(),
      currencyStore.fetchCurrenciesForDropdown(),
      clinicStore.fetchClinicsForDropdown()
    ]);
  } catch (error) {
    handleLoadError("institutions", error);
  }
});



</script>

<template>
  <v-form ref="form">
    <v-card elevation="0" class="position-relative h-100 d-block">
      <div class="invoice-detail-card-image">
        <InvoiceSVG />
      </div>
      <v-card-text>
        <v-row justify="end" class="mt-4 pt-16 pt-md-0">
          <v-col cols="12" lg="4">
            <div class="font-weight-bold">{{ $t('t-institution') }} <i class="ph-asterisk ph-xs text-danger" /></div>
            <MenuSelect v-model="invoiceData.company" :items="institutions" :loading="institutionStore.loading"
              :rules="requiredRules.institution" :placeholder="$t('t-institution')" />

            <div class="font-weight-bold mt-n1">{{ $t('t-clinic') }} <i class="ph-asterisk ph-xs text-danger" /></div>
            <MenuSelect v-model="invoiceData.clinic" :items="clinics" :loading="clinicStore.loading"
              :rules="requiredRules.clinic" :placeholder="$t('t-clinic')" :disabled="!clinics.length" />

            <div class="font-weight-bold">{{ $t('t-employee-or-dependent') }}</div>
            <v-checkbox v-model="invoiceData.isEmployeeInvoice" density="compact" color="primary">
              <template #label>
                <span>{{ $t('t-is-employee-invoice') }}</span>
              </template>
            </v-checkbox>
          </v-col>
        </v-row>

        <v-row class="mt-n6">
          <v-col cols="12" lg="4">
            <div class="font-weight-bold">{{ $t('t-invoice-number') }} <i class="ph-asterisk ph-xs text-danger" /></div>
            <TextField v-model="invoiceData.invoiceNumber" :placeholder="$t('t-enter-invoice-number')"
              :rules="requiredRules.invoiceNumber" />
          </v-col>

          <v-col cols="12" lg="">
            <div class="font-weight-bold">{{ $t('t-employee') }} <i class="ph-asterisk ph-xs text-danger" /></div>
            <MenuSelect v-model="invoiceData.employee" :items="employees" :loading="employeeStore.loading"
              :rules="requiredRules.employee" :placeholder="$t('t-select-employee')"
              :disabled="!invoiceData.company || !employees.length" />
          </v-col>

          <v-col cols="12" lg="4" v-if="!invoiceData.isEmployeeInvoice">
            <div class="font-weight-bold">{{ $t('t-dependent') }} <i class="ph-asterisk ph-xs text-danger" /></div>
            <MenuSelect v-model="invoiceData.dependent" :items="dependents" :loading="dependentStore.loading"
              :rules="requiredRules.dependent" :placeholder="$t('t-select-dependent')"
              :disabled="!invoiceData.employee || !dependents.length" />
          </v-col>
        </v-row>

        <v-row class="mt-n6">
          <v-col cols="12" lg="4">
            <div class="font-weight-bold">{{ $t('t-issue-date') }} <i class="ph-asterisk ph-xs text-danger" /></div>
            <ValidatedDatePicker v-model="invoiceData.issueDate" :teleport="true" :enable-time-picker="false"
              :rules="requiredRules.issueDate" :placeholder="$t('t-select-issue-date')" />
          </v-col>

          <v-col cols="12" lg="4">
            <div class="font-weight-bold">{{ $t('t-currency') }} <i class="ph-asterisk ph-xs text-danger" /></div>
            <MenuSelect v-model="invoiceData.currency" :items="currencies" :rules="requiredRules.currency"
              :placeholder="$t('t-select-currency')" />
          </v-col>

          <v-col cols="12" lg="4">
            <div class="font-weight-bold">{{ $t('t-due-date') }} <i class="ph-asterisk ph-xs text-danger" /></div>
            <ValidatedDatePicker v-model="invoiceData.dueDate" :teleport="true" :enable-time-picker="false"
              :rules="requiredRules.dueDate" :placeholder="$t('t-select-due-date')" />
          </v-col>
        </v-row>

        <v-row class="mt-n6 mb-2">
          <v-col cols="12" lg="6">
            <div class="font-weight-bold">{{ $t('t-invoice-reference') }}</div>
            <TextField v-model="invoiceData.invoiceReferenceNumber" :placeholder="$t('t-enter-invoice-reference')" />
          </v-col>

          <v-col cols="12" lg="6">
            <div class="font-weight-bold">{{ $t('t-authorized-by') }} <i class="ph-asterisk ph-xs text-danger" /></div>
            <TextField v-model="invoiceData.authorizedBy" :placeholder="$t('t-enter-authorized-by')"
              :rules="requiredRules.authorizedBy" />
          </v-col>
        </v-row>

        <div class="mb-12">
          <ProductCard ref="productCardRef" v-model="invoiceItemData" :institution-id="invoiceData.company || ''"
            :initial-items="initialItems" @items-ready="handleItemsReady" />
        </div>
      </v-card-text>

      <v-card-actions class="d-flex justify-space-between mt-5">
        <v-btn color="secondary" variant="outlined" class="me-4" @click="onBack">
          {{ $t('t-back-to-list') }} <i class="ph-arrow-left ms-2" />
        </v-btn>
        <v-btn color="success" variant="elevated" @click="submitInvoice">
          <i class="ph-printer me-1" /> {{ $t('t-save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>