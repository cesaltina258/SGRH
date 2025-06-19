<script lang="ts" setup>
import InvoiceForm from "@/components/invoice/createInvoice/InvoiceForm.vue";
import { ref, reactive, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import { invoiceService, invoiceItemService } from "@/app/http/httpServiceProvider";
import { useInvoiceStore } from "@/store/invoice/invoiceStore";
import { InvoiceInsertType, InvoiceItemInsertType } from "../types";

/**
 * Composables - Instâncias de utilitários globais
 */
const { t } = useI18n(); // Internacionalização
const route = useRoute(); // Rota atual
const router = useRouter(); // Controle de navegação
const toast = useToast(); // Notificações
const invoiceStore = useInvoiceStore(); // Store de faturas

/**
 * Emits - Eventos que este componente emite
 */
const emit = defineEmits<{
  (e: 'invoice-created', id: string): void; // Quando uma nova fatura é criada
}>();

/**
 * Estado do componente
 */
const loading = ref(false); // Estado de carregamento global
const errorMsg = ref(""); // Mensagem de erro
const basicDataValidated = ref(false); // Validação básica
const invoiceItems = ref<InvoiceItemInsertType[]>([]); // Itens da fatura

// Obtém o ID da fatura da rota (se estiver em modo de edição)
const invoiceId = ref<string | null>(
  typeof route.params.id === 'string' ? route.params.id :
    Array.isArray(route.params.id) ? route.params.id[0] : null
);

/**
 * Computed - Valores reativos derivados
 */
const isEditMode = computed(() => !!invoiceId.value); // Determina se está em modo de edição

/**
 * Dados reativos da fatura
 */
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

/**
 * Carrega os dados de uma fatura existente
 * @param id - ID da fatura a ser carregada
 */
const loadInvoiceData = async (id: string) => {
  try {
    loading.value = true;

    // Carrega em paralelo os dados da fatura e seus itens
    const [invoiceResponse, itemsResponse] = await Promise.all([
      invoiceService.getInvoiceById(id),
      invoiceItemService.getInvoiceItemByInvoice(id)
    ]);

    // Atualiza os dados da fatura se existirem
    if (invoiceResponse?.data) {
      Object.assign(invoiceData, invoiceResponse.data);
      // Mapeia os relacionamentos
      invoiceData.company = invoiceResponse.data.employee?.companyId || undefined;
      invoiceData.clinic = invoiceResponse.data.clinic?.id || undefined;
      invoiceData.employee = invoiceResponse.data.employee?.id || undefined;
      invoiceData.currency = invoiceResponse.data.currency?.id || undefined;
      invoiceData.dependent = invoiceResponse.data.dependent?.id || undefined;
    }

    // Processa os itens da fatura
    if (itemsResponse?.content) {
      invoiceItems.value = itemsResponse.content.map(item => ({
        ...item,
        taxRate: item.taxRate?.id?.toString() || '', // Garante string
        companyAllowedHospitalProcedure: item.companyAllowedHospitalProcedure?.id || '',
        invoice: item.invoice?.id || ''
      }));
    }
  } catch (error) {
    toast.error(t('t-error-loading-invoice'));
    console.error('Error loading invoice:', error);
  } finally {
    loading.value = false;
  }
};

/**
 * Trata o sucesso na operação de salvar
 * @param response - Resposta da API
 */
const handleSaveSuccess = (response: any) => {
  // Atualiza o store e busca as faturas mais recentes
  invoiceStore.setDraftInvoice(invoiceData);
  invoiceStore.fetchInvoices();

  // Feedback visual
  toast.success(isEditMode.value
    ? t('t-invoice-updated-success')
    : t('t-invoice-created-success'));

  // Emite evento se for uma nova fatura
  if (!isEditMode.value && response?.data?.id) {
    emit('invoice-created', response.data.id);
  }

  // Redireciona para a lista
  router.push('/invoices/list');
};

/**
 * Trata erros da API
 * @param error - Erro ocorrido
 */
const handleApiError = (error: any) => {
  const message = error?.response?.data?.message || error.message || t('t-error-saving-employee');
  toast.error(message);
  errorMsg.value = message;
  setTimeout(() => errorMsg.value = "", 5000);
};

/**
 * Watchers - Reação a mudanças
 */

// Observa mudanças no ID da rota para carregar os dados corretos
watch(() => route.params.id, async (newId) => {
  const newInvoiceId = typeof newId === 'string' ? newId :
    Array.isArray(newId) ? newId[0] : null;

  if (newInvoiceId) {
    console.log('Loading data for invoice:', newInvoiceId);
    await loadInvoiceData(newInvoiceId);
    invoiceStore.setCurrentInvoiceId(newInvoiceId);
  }
}, { immediate: true });

/**
 * Lifecycle hooks
 */
onMounted(() => {
  // Limpa o ID se estiver em modo de criação
  if (!route.params.id) {
    invoiceStore.setCurrentInvoiceId('');
  }

  // Carrega dados do storage local
  invoiceStore.loadFromStorage();

  // Se houver ID no store, usa ele
  if (invoiceStore.currentInvoiceId) {
    invoiceId.value = invoiceStore.currentInvoiceId;
    basicDataValidated.value = true;
  }
});

/**
 * Computed - ID atual da fatura (considera rota e store)
 */
const currentInvoiceId = computed(() => {
  // Em modo de criação, retorna null
  if (!isEditMode.value) return null;

  // Obtém ID da rota ou do store
  const id = typeof route.params.id === 'string' ? route.params.id :
    Array.isArray(route.params.id) ? route.params.id[0] : null;
  return id || invoiceStore.currentInvoiceId;
});

/**
 * Salva a fatura (dados básicos e/ou itens)
 * @param param - Pode ser os dados da fatura ou seus itens
 */
const saveInvoice = async (param: InvoiceInsertType | InvoiceItemInsertType[]): Promise<void> => {
  try {
    loading.value = true;
    errorMsg.value = "";

    console.log('Operation mode:', isEditMode.value ? 'EDIT' : 'CREATE');
    console.log('Current invoice ID:', currentInvoiceId.value);

    // Se for um array, estamos salvando os itens
    if (Array.isArray(param)) {
      const items = param;

      // 1. Salva os dados básicos da fatura
      const response = isEditMode.value
        ? await invoiceService.updateInvoice(currentInvoiceId.value!, invoiceData)
        : await invoiceService.createInvoice(invoiceData);

      // 2. Se for criação, armazena o novo ID
      if (!isEditMode.value && response.data?.id) {
        console.log('New invoice created with ID:', response.data.id);
        invoiceStore.setCurrentInvoiceId(response.data.id);
      }

      // 3. Salva os itens se houver
      if (items.length > 0) {
        const targetInvoiceId = isEditMode.value
          ? currentInvoiceId.value!
          : response.data?.id;

        if (!targetInvoiceId) {
          throw new Error('Failed to determine invoice ID for items');
        }

        console.log('Saving items for invoice ID:', targetInvoiceId);
        await saveInvoiceItems(targetInvoiceId, items);
      }

      handleSaveSuccess(response);
    } else {
      // Se não for array, salva apenas os dados básicos
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

/**
 * Salva os itens da fatura
 * @param invoiceId - ID da fatura
 * @param items - Itens a serem salvos
 */
const saveInvoiceItems = async (invoiceId: string, items: InvoiceItemInsertType[]) => {
  try {
    loading.value = true;

    // Verifica se há itens para salvar
    if (!items || items.length === 0) {
      console.warn('No items to save');
      return;
    }

    // Em modo de edição, remove todos os itens existentes primeiro
    if (isEditMode.value) {
      const existingItems = await invoiceItemService.getInvoiceItemByInvoice(invoiceId);
      await Promise.all(
        existingItems.content.map(item =>
          invoiceItemService.deleteInvoiceItem(item.id)
        ));
    }

    // Cria todos os novos itens (sem IDs para evitar duplicação)
    const results = await Promise.all(
      items.map(item => {
        const itemToSave = {
          ...item,
          invoice: invoiceId,
          id: undefined // Força criação de novo registro
        };
        return invoiceItemService.createInvoiceItem(itemToSave);
      })
    );

    console.log('Items saved successfully:', results);
    return results;
  } catch (error) {
    console.error("Error saving invoice items:", error);
    throw error;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" xl="9">
        <InvoiceForm v-model="invoiceData" :is-edit-mode="isEditMode" :loading="loading" :initial-items="invoiceItems"
          @save="saveInvoice" @items-ready="(items: InvoiceItemInsertType[]) => saveInvoice(items)" />
      </v-col>
    </v-row>
  </v-container>
</template>