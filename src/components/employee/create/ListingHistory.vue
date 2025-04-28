<script lang="ts" setup>
import { ref, computed, onMounted, watch } from "vue";
import Table from "@/app/common/components/Table.vue";
import { ContactType } from "@/components/employee/create/types";
import Status from "@/app/common/components/Status.vue";
import { formateDate } from "@/app/common/dateFormate";

const emit = defineEmits(["onView", "onEdit", "onDelete"]);
const prop = defineProps({
  interactions: {
    type: Object,
    default: () => {},
  },
});

const interactions = computed(() => {
  return prop.interactions;
});

const page = ref(1);
const noOfItems = computed(() => {
  return interactions.value.length;
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
  tableData.value = interactions.value.slice(config.value.start, config.value.end);
};

onMounted(() => {
  getPaginatedData();
});

watch(page, (newPage: number) => {
  config.value.page = newPage;
  getPaginatedData();
});

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

watch(interactions, (newVal: any) => {
  updateTableData(newVal);
});

const onSelect = (option: string, data: ContactType) => {
  switch (option) {
    case "view":
      emit("onView", data);
      break;
    case "edit":
      emit("onEdit", data);
      break;
    case "delete":
      emit("onDelete", data);
      break;
    default:
      break;
  }
};
</script>
<template>
  <v-card>
    <v-card-text>
      <Table v-model="page" :headerItems="historyHeader.map(item => ({ ...item, title: $t(`t-${item.title}`) }))" is-pagination :config="config" :loading="loading">
        <template #body>
          <tr
            v-for="(item, index) in tableData"
            :key="'institution-history-' + index"
            height="50"
          >
            <td>
              <div class="d-flex align-center">
                <div class="d-flex align-center">
                  <div class="font-weight-bold">{{ item.name }}</div>
                </div>
              </div>
            </td>
            <td>{{ item.email }}</td>
            <td>{{ formateDate(item.create_date) }}</td>
            <td class=""><Status :status="item.status" /></td>

            <td>
              <ListMenuWithIcon
                :menuItems="contactOptions.map(item => ({ ...item, title: $t(`t-${item.title}`) }))"
                @onSelect="onSelect($event, item)"
              />
            </td>
          </tr>
        </template>
      </Table>

      <div v-if="!interactions.length" class="text-center">
        <v-avatar size="80" color="primary" variant="text">
          <i
            class="ph-magnifying-glass"
            style="font-size: 30px"
            color="primary"
          />
        </v-avatar>
        <div class="font-weight-bold text-subtitle-1 mb-1">
          {{ $t('t-search-not-found-message') }}
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>
