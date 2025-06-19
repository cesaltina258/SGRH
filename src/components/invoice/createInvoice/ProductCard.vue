<script lang="ts" setup>
import { ref, computed, onMounted, watch } from "vue";
import { productHeader } from "@/components/invoice/createInvoice/utils";
import MenuSelect from "@/app/common/components/filters/MenuSelect.vue";
import Table from "@/app/common/components/Table.vue";
import { InvoiceItemInsertType } from "@/components/invoice/types";
import { useI18n } from "vue-i18n";
import { TaxRateTypeListing } from "@/components/baseTables/TaxRate/types";
import { useTaxRateStore } from "@/store/baseTables/taxRateServiceStore";
import { useHospitalProcedureStore } from "@/store/institution/hospitalProcedureStore";
import { useToast } from 'vue-toastification';
import type { HospitalProcedureListingType } from '@/components/institution/types';

interface InvoiceItem extends Omit<InvoiceItemInsertType, 'taxRate'> {
  id: string;
  taxRate: string;
}


// Composables
const { t } = useI18n();
const toast = useToast();

// Props
const props = defineProps({
  modelValue: {
    type: Object as () => InvoiceItemInsertType,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  institutionId: {
    type: String,
    required: true
  },
  initialItems: {
    type: Array as () => InvoiceItemInsertType[],
    default: () => []
  }
});

// Emits
const emit = defineEmits<{
  (e: 'update:modelValue', value: InvoiceItemInsertType): void;
  (e: 'items-ready', items: InvoiceItemInsertType[]): void;
}>();

// Stores
const taxRateStore = useTaxRateStore();
const hospitalProcedureStore = useHospitalProcedureStore();

// State
const form = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null);
const errorMsg = ref("");
const alertTimeout = ref<ReturnType<typeof setTimeout> | null>(null);
const invoiceItems = ref<InvoiceItemInsertType[]>([]);

// Validation rules
const requiredRules = {
  unitPrice: [(v: number) => v > 0 || t('t-unit-price-required')],
  quantity: [(v: number) => v > 0 || t('t-quantity-required')],
  taxRate: [(v: number) => !!v || t('t-tax-rate-required')],
  companyAllowedHospitalProcedure: [(v: string) => !!v || t('t-procedure-required')]
};

// Computed
const taxRates = computed(() => {
  return taxRateStore.tax_rates_for_dropdown.map((item) => ({
    value: item.id,
    label: item.rate + '%',
    rate: item.rate ? item.rate / 100 : 0
  }));
});

const companyAllowedHospitalProcedures = computed(() => {
  return hospitalProcedureStore.hospital_procedure_for_dropdown.map((item) => ({
    value: item.id,
    label: item.hospitalProcedureType.name,
  }));
});


const lineTotals = computed(() => {
  return invoiceItems.value.map(item => {
    const taxRate = taxRates.value.find(t => t.value === item.taxRate);
    const rate = taxRate?.rate || 0;
    const subtotal = item.quantity * item.unitPrice;
    const taxAmount = subtotal * rate;
    const total = subtotal + taxAmount;
    
    return {
      subtotal,
      taxAmount,
      total
    };
  });
});

// Atualize os cálculos gerais para usar lineTotals
const subTotal = computed(() => {
  return lineTotals.value.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2);
});

const taxAmount = computed(() => {
  return lineTotals.value.reduce((sum, item) => sum + item.taxAmount, 0).toFixed(2);
});

const finalTotal = computed(() => {
  return lineTotals.value.reduce((sum, item) => sum + item.total, 0).toFixed(2);
});

// Methods
const loadProcedures = async () => {
  try {
    if (!props.institutionId || props.institutionId === '') {
      console.warn('Institution ID not available yet');
      return;
    }

    await Promise.all([
      taxRateStore.fetchTaxRatesForDropdown(),
      hospitalProcedureStore.fetchHospitalProceduresForDropdown(props.institutionId)
    ]);
  } catch (error) {
    handleError('t-error-loading-procedures', error);
  }
};

const handleError = (messageKey: string, error: any) => {
  console.error(messageKey, error);
  errorMsg.value = t(messageKey);

  if (alertTimeout.value) clearTimeout(alertTimeout.value);
  alertTimeout.value = setTimeout(() => {
    errorMsg.value = "";
    alertTimeout.value = null;
  }, 5000);
};

const addItem = () => {
  invoiceItems.value.push({
    id: Date.now().toString(),
    companyAllowedHospitalProcedure: "",
    description: "",
    taxRate: '',
    quantity: 1,
    unitPrice: 0,
    invoice: props.modelValue.invoice
  });
};

const removeItem = (id: string | undefined) => {
  invoiceItems.value = invoiceItems.value.filter(item => item.id !== id);
};


const prepareItemsForSubmission = (): InvoiceItemInsertType[] => {
  return invoiceItems.value.map((item, index) => {
    const lineTotal = lineTotals.value[index];
    
    return {
      ...item,
      id: undefined,
      originalId: undefined,
      taxRate: item.taxRate || '',
      companyAllowedHospitalProcedure: item.companyAllowedHospitalProcedure || '',
      description: item.description || '',
      unitPrice: item.unitPrice || 0,
      quantity: item.quantity || 0,
      invoice: item.invoice || '',
      totalAmount: lineTotal.total // Inclui o valor com taxa
    };
  });
};


const emitItemsReady = (): boolean => {
  // Valida os itens antes de emitir
  for (const item of invoiceItems.value) {
    if (!item.companyAllowedHospitalProcedure || item.quantity <= 0 || item.unitPrice <= 0) {
      toast.error(t('t-fill-all-item-fields'));
      return false;
    }
  }

  const items = prepareItemsForSubmission();
  emit('items-ready', items);
  return true;
};

// Exponha o método via defineExpose
defineExpose({
  emitItemsReady
});

// Watchers

watch(() => props.institutionId, (newId) => {
  if (newId) {
    loadProcedures();
  }
}, { immediate: true });

// Lifecycle
onMounted(() => {
  loadProcedures();

  if (props.initialItems && props.initialItems.length > 0) {
    invoiceItems.value = props.initialItems.map(item => ({
      ...item,
      id: item.id || Date.now().toString(),
    }));
 console.log('props.initialItems', invoiceItems)
  } else {
    addItem(); // Só adiciona um item vazio se não houver itens iniciais
  }
});

watch(() => props.initialItems, (newItems) => {
  if (newItems && newItems.length > 0) {
    invoiceItems.value = newItems.map(item => ({
      ...item,
      // Mantenha o ID original apenas para referência, mas não para envio
      originalId: item.id, // Adicione este campo para referência
      id: item.id || Date.now().toString(), // ID local para controle UI
      // Garanta que todos os campos obrigatórios estão presentes
      taxRate: item.taxRate?.toString() || '',
      companyAllowedHospitalProcedure: item.companyAllowedHospitalProcedure || ''
    }));
  }
}, { immediate: true });
</script>

<template>
  <v-form ref="form">
    <Table :headerItems="productHeader.map(item => ({ ...item, title: $t(`t-${item.title}`) }))">
      <template #body>
        <tr v-for="(item, index) in invoiceItems" :key="'product-item-' + item.id">
          <td class="font-weight-bold">{{ index + 1 }}</td>
          <td class="pt-4" >
            <MenuSelect v-model="item.companyAllowedHospitalProcedure" :items="companyAllowedHospitalProcedures"
              :rules="requiredRules.companyAllowedHospitalProcedure" :placeholder="$t('t-select-procedure')"
              item-value="value" />
            <TextArea v-model="item.description" :placeholder="$t('t-description')" class="" />
          </td>
          <td>
            <TextField v-model.number="item.unitPrice" :rules="requiredRules.unitPrice"
              :placeholder="$t('t-unit-price')" type="number" min="0" step="0.01" />
          </td>
          <td>
            <TextField v-model.number="item.quantity" :placeholder="$t('t-quantity')" type="number" min="0"
              :rules="requiredRules.quantity" />
          </td>
          <td>
            <MenuSelect v-model="item.taxRate" :items="taxRates" :rules="requiredRules.taxRate"
              :placeholder="$t('t-select-tax-rate')" item-value="value" />
          </td>
          <td>
            <div class="d-flex align-center">
              <TextField disabled :model-value="(item.quantity * item.unitPrice).toFixed(2)" class="me-2" />
              <v-btn icon variant="text" color="error" size="small" @click="removeItem(item.id)">
                <i class="ph-trash"></i>
              </v-btn>
            </div>
          </td>
        </tr>
      </template>
    </Table>

    <v-btn color="light" @click="addItem" class="mt-2">
      <i class="ph-plus me-2"></i> {{ $t("t-add-invoice-item") }}
    </v-btn>

    <v-divider class="my-4" />

    <v-row justify="end" class="mt-4">
      <v-col cols="12" lg="4">
        <v-row class="d-flex align-center mb-2" no-gutters>
          <v-col cols="6">
            <span class="font-weight-bold me-4">{{ $t('t-sub-total') }}</span>
          </v-col>
          <v-col cols="6">
            <TextField :model-value="subTotal" disabled />
          </v-col>
        </v-row>

        <v-row class="d-flex align-center mb-2" no-gutters>
          <v-col cols="6">
            <span class="font-weight-bold me-4">{{ $t('t-tax-amount') }}</span>
          </v-col>
          <v-col cols="6">
            <TextField :model-value="taxAmount" disabled />
          </v-col>
        </v-row>

        <v-divider class="my-4" />

        <v-row class="d-flex align-center mb-2" no-gutters>
          <v-col cols="6">
            <span class="font-weight-bold me-4">{{ $t('t-total-amount') }}</span>
          </v-col>
          <v-col cols="6">
            <TextField :model-value="finalTotal" disabled />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-form>
</template>