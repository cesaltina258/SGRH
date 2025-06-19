<script lang="ts" setup>
import InvoiceForm from "@/components/invoice/createInvoice/InvoiceForm.vue";
import { ref, reactive, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import { invoiceService } from "@/app/http/httpServiceProvider";
import { useInvoiceStore } from "@/store/invoice/invoiceStore";
import { InvoiceInsertType } from "../types";

// Composables
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const toast = useToast();
const invoiceStore = useInvoiceStore();

// Emits
const emit = defineEmits(['invoice-created']);

// State
const loading = ref(false);
const errorMsg = ref("");
const basicDataValidated = ref(false);
const invoiceId = ref<string | null>(null);

// Computed
const isEditMode = computed(() => !!invoiceId.value);

// Reactive data
const invoiceData = reactive<InvoiceInsertType>({
  invoiceNumber: '',
  clinic: undefined,
  currency: undefined,
  employee: undefined,
  issueDate: new Date(),
  dueDate: new Date(),
  totalAmount: 0,
  isEmployeeInvoice: false,
  dependent: undefined,
  company: '',
  authorizedBy: '',
  invoiceReferenceNumber: ''
});

// Methods
const loadInvoiceData = async (id: string) => {
  try {
    loading.value = true;
    const response = await invoiceService.getInvoiceById(id);

    if (response?.data) {
      Object.assign(invoiceData, response.data);
      invoiceData.company = response.data.employee?.companyId || undefined;
      invoiceData.clinic = response.data.clinic?.id || undefined;
      invoiceData.employee = response.data.employee?.id || undefined;
      invoiceData.currency = response.data.currency?.id || undefined;
    }
  } catch (error) {
    toast.error(t('t-error-loading-invoice'));
    console.error('Error loading invoice:', error);
  } finally {
    loading.value = false;
  }
};

const handleSaveSuccess = (response: any) => {
  invoiceStore.setDraftInvoice(invoiceData);
  invoiceStore.fetchInvoices();

  toast.success(isEditMode.value
    ? t('t-invoice-updated-success')
    : t('t-invoice-created-success'));

  if (!isEditMode.value && response?.data?.id) {
    emit('invoice-created', response.data.id);
  }

  router.push('/invoices/list');
};

const handleApiError = (error: any) => {
  const message = error?.response?.data?.message || error.message || t('t-error-saving-employee');
  toast.error(message);
  errorMsg.value = message;
  setTimeout(() => errorMsg.value = "", 5000);
};

const saveInvoice = async () => {
  try {
    loading.value = true;
    errorMsg.value = "";

    const response = isEditMode.value
      ? await invoiceService.updateInvoice(invoiceId.value!, invoiceData)
      : await invoiceService.createInvoice(invoiceData);

    handleSaveSuccess(response);
  } catch (error) {
    handleApiError(error);
  } finally {
    loading.value = false;
  }
};

// Watchers
watch(() => route.params.id, async (newId) => {
  invoiceId.value = typeof newId === 'string' ? newId : Array.isArray(newId) ? newId[0] : null;
  if (invoiceId.value) {
    await loadInvoiceData(invoiceId.value);
  }
}, { immediate: true });

// Lifecycle hooks
onMounted(() => {
  invoiceStore.loadFromStorage();
  if (invoiceStore.currentInvoiceId) {
    invoiceId.value = invoiceStore.currentInvoiceId;
    basicDataValidated.value = true;
  }
});
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" xl="9">
        <InvoiceForm v-model="invoiceData" :is-edit-mode="isEditMode" :loading="loading" @save="saveInvoice" />
      </v-col>
    </v-row>
  </v-container>
</template>