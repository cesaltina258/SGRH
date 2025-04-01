<script lang="ts" setup>
import QuerySearch from "@/app/common/components/filters/QuerySearch.vue";
import { ref, watch, computed, onMounted } from "vue";
import { invoiceHeader, invoicesList } from "@/components/invoice/list/utils";
import Table from "@/app/common/components/Table.vue";
import Status from "@/app/common/components/Status.vue";
import ConfirmationDialog from "@/app/common/components/ConfirmationDialog.vue";
import { useRouter } from "vue-router";
import TableAction from "@/app/common/components/TableAction.vue";

const router = useRouter();

const query = ref("");
const confirmationDialog = ref(false);
const deleteId = ref<number | null>(null);

const mappedData = invoicesList.map((data: any) => {
  return {
    ...data,
    isChecked: false,
  };
});

const filteredData = ref(mappedData);
const finalData = ref(filteredData.value);
const isAllSelected = ref(false);

const page = ref(1);
const noOfItems = computed(() => {
  return finalData.value.length;
});
const tableData = ref<any[]>([]);
const loading = ref(false);

const config = ref({
  page: page.value,
  start: 0,
  end: 0,
  noOfItems: noOfItems.value,
  itemsPerPage: 10,
});

const getPaginatedData = () => {
  const { itemsPerPage, page } = config.value;
  const start = (page - 1) * itemsPerPage;
  let end = start + itemsPerPage;
  end = end <= noOfItems.value ? end : noOfItems.value;

  config.value = {
    ...config.value,
    start,
    end,
  };

  const data = filteredData.value.slice(config.value.start, config.value.end);

  loading.value = true;
  tableData.value = [];

  setTimeout(() => {
    tableData.value = data;
    loading.value = false;
  }, 200);
};

onMounted(() => {
  getPaginatedData();
});

watch(page, (newPage: number) => {
  config.value.page = newPage;
  getPaginatedData();
});

watch(confirmationDialog, (dialog: boolean) => {
  if (!dialog) {
    deleteId.value = null;
  }
});

watch(query, (newQuery: string) => {
  filteredData.value = mappedData.filter((item) => {
    const val = newQuery.toLowerCase();
    if (
      item.customer.toLowerCase().includes(val) ||
      item.email.toLowerCase().includes(val)
    ) {
      return item;
    }
  });
  updateTableData(filteredData.value);
});

const onSelectAll = () => {
  isAllSelected.value = !isAllSelected.value;
  tableData.value = tableData.value.map((item) => {
    return {
      ...item,
      isChecked: isAllSelected.value,
    };
  });
};

const onDelete = (id: number) => {
  deleteId.value = id;
  confirmationDialog.value = true;
};
const onConfirmDelete = () => {
  filteredData.value = filteredData.value.filter((item) => {
    return item.id !== deleteId.value;
  });
  confirmationDialog.value = false;
  updateTableData(filteredData.value);
};

const updateTableData = (newVal: any[]) => {
  loading.value = true;
  const { itemsPerPage } = config.value;

  const start = 1;
  let end = start + itemsPerPage;
  end = end <= newVal.length ? end : newVal.length;
  tableData.value = [];

  setTimeout(() => {
    tableData.value = newVal;
    config.value = {
      ...config.value,
      start,
      end,
      noOfItems: newVal.length,
    };
    loading.value = false;
  }, 200);
};

const onView = () => {
  router.push({ path: "/invoices/overview" });
};

const onEdit = () => {
  router.push({ path: "/invoices/create" });
};
</script>
<template>
  <Card title="Invoices List" class="mt-7">
    <template #title-action>
      <v-row justify="end" align="center" no-gutters>
        <v-col lg="3">
          <QuerySearch
            v-model="query"
            placeholder="Search for invoice, date, client or something..."
          />
        </v-col>
        <v-col lg="auto" class="ms-3">
          <v-btn color="secondary" to="/invoices/create">
            <i class="ph-plus-circle" /> Add Invoice
          </v-btn>
        </v-col>
      </v-row>
    </template>
    <v-card-text>
      <Table
        v-model="page"
        :headerItems="invoiceHeader"
        is-pagination
        :config="config"
        :loading="loading"
        @onSelectAll="onSelectAll"
      >
        <template #body>
          <tr
            v-for="(item, index) in tableData"
            :key="'cart-item-' + index"
            height="40"
          >
            <td>
              <v-checkbox
                v-model="item.isChecked"
                hide-details
                color="primary"
              />
            </td>
            <td class="text-primary curser-pointer" @click="onView">
              #TBS{{ 2430900 + item.id }}
            </td>
            <td>{{ item.customer }}</td>
            <td>{{ item.email }}</td>
            <td>{{ item.createDate }}</td>
            <td>{{ item.dueDate }}</td>
            <td>${{ item.invoice_amount }}</td>
            <td><Status :status="item.status" /></td>
            <td>
              <TableAction
                @onView="onView"
                @onEdit="onEdit"
                @onDelete="onDelete(item.id)"
              />
            </td>
          </tr>
        </template>
      </Table>
      <div v-if="!filteredData.length" class="text-center">
        <v-avatar size="80" color="primary" variant="text">
          <i
            class="ph-magnifying-glass"
            style="font-size: 30px"
            color="primary"
          />
        </v-avatar>
        <div class="font-weight-bold text-subtitle-1 mb-1">
          Sorry! No Result Found
        </div>
        <div class="text-muted">
          We've searched more than 6+ invoice We did not find any invoice for
          you search.
        </div>
      </div>
    </v-card-text>
  </Card>

  <ConfirmationDialog
    v-if="deleteId"
    v-model="confirmationDialog"
    @onConfirm="onConfirmDelete"
  >
    <v-btn
      variant="text"
      class="confirm-close-icon"
      icon="ph-x"
      @click="confirmationDialog = false"
    />

    <v-card-text class="text-center ma-md-5">
      <div class="text-danger">
        <i class="ph ph-trash ph-4x"></i>
      </div>
      <div class="mt-4">
        <h4>Are you sure ?</h4>
        <p class="text-muted mx-4 mb-0 text-subtitle-1">
          Are you sure you want to remove this record ?
        </p>
      </div>
    </v-card-text>
  </ConfirmationDialog>
</template>
