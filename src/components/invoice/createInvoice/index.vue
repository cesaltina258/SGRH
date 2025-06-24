<script lang="ts" setup>
// =============================================
// IMPORTS
// =============================================
// Vue e Vue Utilities
import { ref, reactive, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';

// Services e Stores
import { invoiceService, invoiceItemService } from "@/app/http/httpServiceProvider";
import { useInvoiceStore } from "@/store/invoice/invoiceStore";

// Tipos e Componentes
import { InvoiceInsertType, InvoiceItemInsertType } from "../types";
import InvoiceForm from "@/components/invoice/createInvoice/InvoiceForm.vue";

// =============================================
// COMPOSABLES & UTILITIES
// =============================================
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const toast = useToast();
const invoiceStore = useInvoiceStore();

// =============================================
// COMPONENT EMITS
// =============================================
const emit = defineEmits<{
  (e: 'invoice-created', id: string): void;
}>();

// =============================================
// REACTIVE STATE
// =============================================
const loading = ref(false);
const errorMsg = ref("");
const basicDataValidated = ref(false);
const invoiceItems = ref<InvoiceItemInsertType[]>([]);

// Parse do ID da fatura da rota
const invoiceId = ref<string | null>(
  typeof route.params.id === 'string' ? route.params.id :
  Array.isArray(route.params.id) ? route.params.id[0] : null
);

// Dados principais da fatura
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

// =============================================
// COMPUTED PROPERTIES
// =============================================
const isEditMode = computed(() => !!invoiceId.value);

const currentInvoiceId = computed(() => {
  if (!isEditMode.value) return null;
  
  const id = typeof route.params.id === 'string' ? route.params.id :
    Array.isArray(route.params.id) ? route.params.id[0] : null;
  
  return id || invoiceStore.currentInvoiceId;
});

// =============================================
// CORE METHODS
// =============================================
/**
 * Carrega dados de uma fatura existente
 */
const loadInvoiceData = async (id: string) => {
  try {
    loading.value = true;
    errorMsg.value = "";

    const [invoiceResponse, itemsResponse] = await Promise.all([
      invoiceService.getInvoiceById(id),
      invoiceItemService.getInvoiceItemByInvoice(id)
    ]);

    if (invoiceResponse?.data) {
      Object.assign(invoiceData, {
        ...invoiceResponse.data,
        company: invoiceResponse.data.employee?.companyId,
        clinic: invoiceResponse.data.clinic?.id,
        employee: invoiceResponse.data.employee?.id,
        currency: invoiceResponse.data.currency?.id,
        dependent: invoiceResponse.data.dependent?.id
      });
    }

    if (itemsResponse?.content) {
      invoiceItems.value = itemsResponse.content.map(item => ({
        ...item,
        taxRate: item.taxRate?.id || '',
        companyAllowedHospitalProcedure: item.companyAllowedHospitalProcedure?.id || '',
        invoice: item.invoice?.id || ''
      }));
    }
  } catch (error) {
    console.error('Error loading invoice:', error);
    toast.error(t('t-error-loading-invoice'));
  } finally {
    loading.value = false;
  }
};

/**
 * Handler para sucesso na operação
 */
const handleSaveSuccess  = (response: any) => {
  invoiceStore.setDraftInvoice(invoiceData);
  invoiceStore.fetchInvoices();

  toast.success(isEditMode.value
    ? t('t-invoice-updated-success')
    : t('t-invoice-created-success'));

  if (!isEditMode.value && response?.data?.id) {
    emit('invoice-created', response.data.id);
  }

  router.push(`/invoices/edit/${response.data.id}`);
};

/**
 * Handler para erros da API
 */
const handleApiError = (error: unknown) => {
  const message = error instanceof Error 
    ? error.message 
    : t('t-error-saving-employee');
  
  errorMsg.value = message;
  toast.error(message);
  
  setTimeout(() => errorMsg.value = "", 5000);
};

// =============================================
// SAVE OPERATIONS
// =============================================
/**
 * Processa operações CRUD para itens da fatura
 */
const processInvoiceItems = async (invoiceId: string, items: InvoiceItemInsertType[]) => {
  if (!items?.length) {
    console.warn('No items to process');
    return [];
  }

  try {
    const existingItemsResponse = await invoiceItemService.getInvoiceItemByInvoice(invoiceId);
    const existingItems = existingItemsResponse.content || [];
    const existingIds = existingItems.map(item => item.id);
    const newIds = items.filter(item => item.id).map(item => item.id);

    // Classificação dos itens
    const itemsToCreate = items.filter(item => !item.id || !existingIds.includes(item.id));
    const itemsToUpdate = items.filter(item => item.id && existingIds.includes(item.id));
    const itemsToDelete = existingItems.filter(item => !newIds.includes(item.id));

    // Execução em paralelo
    return await Promise.all([
      ...itemsToCreate.map(item => 
        invoiceItemService.createInvoiceItem({ ...item, invoice: invoiceId })
      ),
      ...itemsToUpdate.map(item => 
        invoiceItemService.updateInvoiceItem(item.id!, { ...item, invoice: invoiceId })
      ),
      ...itemsToDelete.map(item => 
        invoiceItemService.deleteInvoiceItem(item.id)
      )
    ]);
  } catch (error) {
    console.error("Error processing invoice items:", error);
    throw error;
  }
};

/**
 * Salva a fatura (dados básicos e/ou itens)
 */
const saveInvoice = async (param: InvoiceInsertType | InvoiceItemInsertType[]): Promise<void> => {
  try {
    loading.value = true;
    errorMsg.value = "";

    if (Array.isArray(param)) {
      const totalAmount = param.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
      invoiceData.totalAmount = totalAmount;

      if (isEditMode.value) {
        await invoiceService.updateInvoice(currentInvoiceId.value!, invoiceData);
        await processInvoiceItems(currentInvoiceId.value!, param);
        handleSaveSuccess({ data: { id: currentInvoiceId.value! } });
      } else {
        const invoiceResponse = await invoiceService.createInvoice(invoiceData);
        const newInvoiceId = invoiceResponse.data?.id;
        
        if (!newInvoiceId) throw new Error('Invoice ID not available');
        
        await processInvoiceItems(newInvoiceId, param);
        handleSaveSuccess(invoiceResponse);
      }
    } else {
      const response = isEditMode.value
        ? await invoiceService.updateInvoice(currentInvoiceId.value!, param)
        : await invoiceService.createInvoice(param);
      
      handleSaveSuccess(response);
    }
  } catch (error) {
    handleApiError(error);
  } finally {
    loading.value = false;
  }
};

// =============================================
// LIFECYCLE & WATCHERS
// =============================================
watch(() => route.params.id, async (newId) => { 
  const parsedId = typeof newId === 'string' ? newId :
    Array.isArray(newId) ? newId[0] : null;

  if (parsedId) {
    await loadInvoiceData(parsedId);
    invoiceStore.setCurrentInvoiceId(parsedId); 
  }
}, { immediate: true });

onMounted(() => {
  if (!route.params.id) {
    invoiceStore.setCurrentInvoiceId('');
  }

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
        <InvoiceForm 
          v-model="invoiceData" 
          :is-edit-mode="isEditMode" 
          :loading="loading" 
          :initial-items="invoiceItems"
          @save="saveInvoice" 
          @items-ready="(items: InvoiceItemInsertType[]) => saveInvoice(items)" 
        />
      </v-col>
    </v-row>
  </v-container>
</template>