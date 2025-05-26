<script lang="ts" setup>
import { ref, computed, watch } from "vue"
import { useRouter } from "vue-router"
import { useInstitutionStore } from "@/store/institution/institutionStore"
import { employeeService } from "@/app/http/httpServiceProvider"
import { useToast } from 'vue-toastification'
import { useI18n } from "vue-i18n"

// Components
import QuerySearch from "@/app/common/components/filters/QuerySearch.vue"
import DataTableServer from "@/app/common/components/DataTableServer.vue"
import TableAction from "@/app/common/components/TableAction.vue"
import RemoveItemConfirmationDialog from "@/app/common/components/RemoveItemConfirmationDialog.vue"
import { institutionHeader } from "@/components/institution/list/utils"
import Card from "@/app/common/components/Card.vue"
import Status from "@/app/common/components/Status.vue";
import { formateDate } from "@/app/common/dateFormate"; 

const { t } = useI18n()
const toast = useToast()
const router = useRouter()
const institutionStore = useInstitutionStore()

// Estado do componente
const searchQuery = ref("")
const searchProps = "name,description,address,phone,email,website,incomeTaxNumber" // Campos de pesquisa
const deleteDialog = ref(false)
const deleteId = ref<number | null>(null)
const deleteLoading = ref(false)
const itemsPerPage = ref(10)
const selectedInstitutions = ref<any[]>([]) /// Armazena os funcionários selecionados

// Computed properties
const loading = computed(() => institutionStore.loading)
const totalItems = computed(() => institutionStore.pagination.totalElements)

// Observa mudanças nos funcionários selecionados
watch(selectedInstitutions, (newSelection) => {
  console.log('Instituicoes selecionadas:', newSelection)
}, { deep: true })

// Busca os funcionários com os parâmetros atuais
const fetchInstitutionsforListing = async ({ page, itemsPerPage, sortBy, search }) => {
  await institutionStore.fetchInstitutionsforListing(
    page - 1, // Ajuste para API que começa em 0
    itemsPerPage,
    sortBy[0]?.key || 'createdAt',
    sortBy[0]?.order || 'asc',
    searchProps, // query_props
    search // query_values
  )
}

// Navega para a página de visualização
const onView = (id: string) => {
  router.push(`/institution/view/${id}`)
}

// Abre o diálogo de confirmação para exclusão
const openDeleteDialog = (id: number) => {
  deleteId.value = id
  deleteDialog.value = true
}

// Executa a exclusão do funcionário
const deleteEmployee = async () => {
  if (!deleteId.value) return

  deleteLoading.value = true
  try {
    await employeeService.deleteEmployee(deleteId.value)
    toast.success(t('t-toast-message-deleted'))
    await institutionStore.fetchInstitutionsforListing(0, itemsPerPage.value)
  } catch (error) {
    toast.error(t('t-toast-message-deleted-error'))
  } finally {
    deleteLoading.value = false
    deleteDialog.value = false
  }
}

const toggleSelection = (item) => {
  const index = selectedInstitutions.value.findIndex(selected => selected.id === item.id);
  if (index === -1) {
    selectedInstitutions.value = [...selectedInstitutions.value, item];
  } else {
    selectedInstitutions.value = selectedInstitutions.value.filter(selected => selected.id !== item.id);
  }
};


</script>

<template>
  <Card :title="$t('t-institution-list')" class="mt-7">
    <template #title-action>
      <v-row justify="end" align="center" no-gutters>
        <v-col cols="12" sm="6" md="4">
          <QuerySearch v-model="searchQuery" :placeholder="$t('t-search-institution')" />
        </v-col>
        <v-col cols="12" sm="6" md="auto" class="ms-sm-3 mt-sm-0 mt-2">
          <v-btn color="secondary" to="/institution/create" block>
            <i class="ph-plus-circle" /> {{ $t('t-add-institution') }}
          </v-btn>
        </v-col>
      </v-row>
    </template>

    <v-card-text>
      <DataTableServer v-model="selectedInstitutions"
        :headers="institutionHeader.map(item => ({ ...item, title: $t(`t-${item.title}`) }))"
        :items="institutionStore.institutions" :items-per-page="itemsPerPage" :total-items="totalItems" :loading="loading"
        :search-query="searchQuery" @load-items="fetchInstitutionsforListing" item-value="id" show-select>
        <template #body="{ items }">
          <tr v-for="item in items" :key="item.id" height="50">
            <td>
              <v-checkbox :model-value="selectedInstitutions.some(selected => selected.id === item.id)"
                @update:model-value="toggleSelection(item)" hide-details density="compact" />
            </td>
            <td class="text-primary cursor-pointer" @click="onView(item.id)">
              {{ item.name || 'N/A' }}
            </td>
            <td>{{ item.institutionType?.name || 'N/A' }} </td>
            <td>{{ item.email || 'N/A' }}</td>
            <td>{{ item.phone || 'N/A' }}</td>
            <td>{{ formateDate(item.createdAt) || 'N/A' }}</td>
            <td><Status :status="item.enabled ? 'active' : 'unactive'" /></td>
            <td>
              <TableAction @onEdit="() => router.push(`/institution/edit/${item.id}`)"
                @onDelete="() => openDeleteDialog(item.id)" />
            </td>
          </tr>
        </template>

        <template v-if="institutionStore.institutions.length === 0" #body>
          <tr>
            <td :colspan="institutionHeader.length" class="text-center py-10">
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

  <RemoveItemConfirmationDialog v-model="deleteDialog" @onConfirm="deleteEmployee" :loading="deleteLoading" />
</template>