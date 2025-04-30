<script lang="ts" setup>
// --- IMPORTS ---
import { ref, watch, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useEmployeeStore } from "@/store/employeeStore";
import QuerySearch from "@/app/common/components/filters/QuerySearch.vue";
import Table from "@/app/common/components/Table.vue";
import TableAction from "@/app/common/components/TableAction.vue";
import { employeeHeader } from "@/components/employee/list/utils";
import type { EmployeeListingType } from "../types";
import RemoveItemConfirmationDialog from "@/app/common/components/RemoveItemConfirmationDialog.vue";

// --- STORES E ROUTER ---
const router = useRouter();
const employeeStore = useEmployeeStore();

// --- REFS ---
const query = ref("");
const confirmationDialog = ref(false);
const deleteId = ref<number | null>(null);
const isAllSelected = ref(false);
const page = ref(1);
const loading = ref(false);
const deleteLoading = ref(false);
const tableData = ref<EmployeeListingType[]>([]);

// --- CONFIG PAGINAÇÃO ---
const itemsPerPage = 10;
const config = ref({
  page: page.value,
  start: 0,
  end: 0,
  noOfItems: 0,
  itemsPerPage: itemsPerPage,
});

// --- COMPUTED PROPERTIES ---
// Dados mapeados com reversão para mostrar os mais recentes primeiro
const mappedData = computed(() => 
  employeeStore.employees.map(item => ({
    ...item,
    isCheck: false
  })).toReversed()
);

// Dados filtrados pela pesquisa
const filteredData = computed(() => {
  if (!query.value) return mappedData.value;
  
  const searchTerm = query.value.toLowerCase();
  return mappedData.value.filter(item => 
    item.firstName?.toLowerCase().includes(searchTerm) ||
    item.lastName?.toLowerCase().includes(searchTerm) ||
    item.email?.toLowerCase().includes(searchTerm) ||
    item.phone?.toLowerCase().includes(searchTerm)
  );
});

// Total de itens para paginação
const noOfItems = computed(() => filteredData.value.length);

// --- WATCHERS ---
// Actualiza paginação quando a página muda
watch(page, (newPage) => {
  config.value.page = newPage;
  getPaginatedData();
});

// Actualiza dados quando a pesquisa muda
watch(query, () => {
  page.value = 1; // Reset para primeira página
  getPaginatedData();
});

// Actualiza contagem total quando os dados filtrados mudam
watch(filteredData, () => {
  config.value.noOfItems = noOfItems.value;
});

// --- MÉTODOS ---
// Obtém dados paginados
const getPaginatedData = () => {
  const start = (page.value - 1) * itemsPerPage;
  const end = Math.min(start + itemsPerPage, noOfItems.value);

  config.value = {
    ...config.value,
    start,
    end,
    noOfItems: noOfItems.value
  };

  loading.value = true;
  tableData.value = [];

  setTimeout(() => {
    tableData.value = filteredData.value.slice(start, end);
    loading.value = false;
  }, 200);
};

// Seleciona/deseleciona todos os itens
const onSelectAll = () => {
  isAllSelected.value = !isAllSelected.value;
  tableData.value = tableData.value.map(item => ({
    ...item,
    isChecked: isAllSelected.value
  }));
};

// Ações CRUD
const onDelete = (id: number) => {
  deleteId.value = id;
  confirmationDialog.value = true;
};

const onConfirmDelete = async () => {
  if (!deleteId.value) return;
  
  deleteLoading.value = true;
  try {
    await employeeStore.deleteEmployee(deleteId.value);
    await employeeStore.fetchEmployees();
    confirmationDialog.value = false;
  } finally {
    deleteLoading.value = false;
  }
};

const onView = (id: number) => {
  router.push({ path: `/employee/overview/${id}` });
};

const onEdit = (id: number) => {
  router.push({ path: `/employee/edit/${id}` });
};

// --- LIFECYCLE HOOKS ---
onMounted(async () => {
  loading.value = true;
  try {
    await employeeStore.fetchEmployees();
    getPaginatedData();
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <Card :title="$t('t-employee-list')" class="mt-7">
    <template #title-action>
      <v-row justify="end" align="center" no-gutters>
        <v-col lg="3">
          <QuerySearch v-model="query" :placeholder="$t('t-search-employee')" />
        </v-col>
        <v-col lg="auto" class="ms-3">
          <v-btn color="secondary" to="/employee/create">
            <i class="ph-plus-circle" /> {{ $t('t-add-employee') }}
          </v-btn>
        </v-col>
      </v-row>
    </template>
    <v-card-text>
      <Table 
        :config="config" 
        v-model:page="page"
        :headerItems="employeeHeader.map(item => ({ ...item, title: $t(`t-${item.title}`) }))"
        :items-per-page="itemsPerPage"
        :loading="loading"
         @on-select-all="onSelectAll"
        is-pagination
      >
        <template #body>
          <tr v-for="(item, index) in tableData" :key="'employee-' + index" height="40">
            <td>
              <v-checkbox v-model="item.isChecked" hide-details color="primary" />
            </td>
            <td class="text-primary cursor-pointer" @click="onView(item.id)">
              #{{ item.employeeNumber }}
            </td>
            <td>{{ item.firstName }} {{ item.lastName }}</td>
            <td>{{ item.phone }}</td>
            <td>{{ item.email }}</td>
            <td>
              <TableAction 
                @onView="onView(item.id)" 
                @onEdit="onEdit(item.id)" 
                @onDelete="onDelete(item.id)" 
              />
            </td>
          </tr>
        </template>
      </Table>
      
      <div v-if="!tableData.length && !loading" class="text-center py-10">
        <v-avatar size="80" color="primary" variant="text">
          <i class="ph-magnifying-glass" style="font-size: 30px" color="primary" />
        </v-avatar>
        <div class="font-weight-bold text-subtitle-1 mb-1">
          {{ $t('t-search-not-found-message') }}
        </div>
      </div>
    </v-card-text>
  </Card>

  <RemoveItemConfirmationDialog 
    v-if="deleteId"
    v-model="confirmationDialog"
    @onConfirm="onConfirmDelete"
    :loading="deleteLoading"
  />
</template>