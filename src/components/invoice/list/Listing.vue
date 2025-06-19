<script lang="ts" setup>
import { ref, computed, watch } from "vue"
import { useRouter } from "vue-router"
import { useInvoiceStore } from "@/store/invoice/invoiceStore"
import { invoiceService } from "@/app/http/httpServiceProvider"
import { useToast } from 'vue-toastification'
import { useI18n } from "vue-i18n"

// Components
import QuerySearch from "@/app/common/components/filters/QuerySearch.vue"
import DataTableServer from "@/app/common/components/DataTableServer.vue"
import TableAction from "@/app/common/components/TableAction.vue"
import RemoveItemConfirmationDialog from "@/app/common/components/RemoveItemConfirmationDialog.vue"
import { invoiceHeader } from "@/components/invoice/list/utils"
import Card from "@/app/common/components/Card.vue"
import Status from "@/app/common/components/Status.vue";
import { formateDate } from "@/app/common/dateFormate";
import { InvoiceListingType } from "../types"

const { t } = useI18n()
const toast = useToast()
const router = useRouter()
const invoiceStore = useInvoiceStore()

// Estado do componente
const searchQuery = ref("")
const searchProps = "incomeTaxNumber,issueDate,dueDate,totalAmount,employee,clinic,currency" // Campos de pesquisa,
const deleteDialog = ref(false)
const deleteId = ref<string | null>(null)
const deleteLoading = ref(false)
const itemsPerPage = ref(10)
const selectedInvoices = ref<any[]>([]) // Armazena os funcionários selecionados

// Computed properties
const loading = computed(() => invoiceStore.loading)
const totalItems = computed(() => invoiceStore.pagination.totalElements)

// Observa mudanças nos funcionários selecionados
watch(selectedInvoices, (newSelection) => {
  console.log('Instituicoes selecionadas:', newSelection)
}, { deep: true })

interface FetchParams {
  page: number
  itemsPerPage: number
  sortBy: { key: string, order: 'asc' | 'desc' }[]
  search: string
}

// Busca os funcionários com os parâmetros atuais
const fetchInvoices = async ({ page, itemsPerPage, sortBy, search }: FetchParams) => {
  await invoiceStore.fetchInvoices( 
    page - 1, // Ajuste para API que começa em 0
    itemsPerPage,
    sortBy[0]?.key || 'createdAt',
    sortBy[0]?.order || 'asc',
    search, // query_values
    searchProps // query_props
  )
}

// Navega para a página de visualização
const onView = (id: string) => {
  router.push(`/invoice/view/${id}`)
}

// Abre o diálogo de confirmação para exclusão
const openDeleteDialog = (id: string) => {
  deleteId.value = id
  deleteDialog.value = true
}

// Executa a exclusão do funcionário
const deleteInvoice = async () => {
  if (!deleteId.value) return;

  deleteLoading.value = true;
  try {
    await invoiceService.deleteInvoice(deleteId.value);
    toast.success(t('t-toast-message-deleted'));
    await invoiceStore.fetchInvoices(0, itemsPerPage.value);
  } catch (error) {
    if (error instanceof Error && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(axiosError.response?.data?.message || t('t-toast-message-error'));
    } else {
      toast.error(t('t-toast-message-error'));
    }
  } finally {
    deleteLoading.value = false;
    deleteDialog.value = false;
  }
};


const toggleSelection = (item: InvoiceListingType) => {
  const index = selectedInvoices.value.findIndex(selected => selected.id === item.id);
  if (index === -1) {
    selectedInvoices.value = [...selectedInvoices.value, item];
  } else {
    selectedInvoices.value = selectedInvoices.value.filter(selected => selected.id !== item.id);
  }
};


</script>
<template>
  <Card :title="$t('t-invoice-list')" class="mt-7">
    <template #title-action>
      <v-row justify="end" align="center" no-gutters>
        <v-col cols="12" sm="6" md="4">
          <QuerySearch v-model="searchQuery" :placeholder="$t('t-search-invoice')" />
        </v-col>
        <v-col cols="12" sm="6" md="auto" class="ms-sm-3 mt-sm-0 mt-2">
          <v-btn color="secondary" to="/invoices/create" block>
            <i class="ph-plus-circle" /> {{ $t('t-add-invoice') }}
          </v-btn>
        </v-col>
      </v-row>
    </template>

    <v-card-text>
      <DataTableServer v-model="selectedInvoices"
        :headers="invoiceHeader.map(item => ({ ...item, title: $t(`t-${item.title}`) }))"
        :items="invoiceStore.invoices" :items-per-page="itemsPerPage" :total-items="totalItems"
        :loading="loading" :search-query="searchQuery" @load-items="fetchInvoices" item-value="id"
        show-select>
        <template #body="{ items }: { items: readonly unknown[] }">
          <tr v-for="item in items as InvoiceListingType[]" :key="item.id">
            <td>
              <v-checkbox :model-value="selectedInvoices.some(selected => selected.id === item.id)"
                @update:model-value="toggleSelection(item)" hide-details density="compact" />
            </td>
            <td class="text-primary cursor-pointer" @click="onView(item.id)">
              {{ item.invoiceNumber || 'N/A' }}
            </td>
            <td>{{ item.employee?.firstName || 'N/A' }} {{ item.employee?.lastName || 'N/A' }} </td>
            <td>{{ item.clinic?.name || 'N/A' }}</td>
            <td>{{ item.totalAmount || 'N/A' }}</td>
            <td>{{ formateDate(item.issueDate) || 'N/A' }}</td>
            <td>{{ formateDate(item.dueDate) || 'N/A' }}</td>
            <td>
              <TableAction @onEdit="() => router.push(`/invoices/edit/${item.id}`)" 
                @onDelete="() => openDeleteDialog(item.id)" />
            </td>
          </tr>
        </template>

        <template v-if="invoiceStore.invoices.length === 0" #body>
          <tr>
            <td :colspan="invoiceHeader.length" class="text-center py-10">
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
    </v-card-text>
  </Card>

  <RemoveItemConfirmationDialog v-model="deleteDialog" @onConfirm="deleteInvoice" :loading="deleteLoading" />
</template>