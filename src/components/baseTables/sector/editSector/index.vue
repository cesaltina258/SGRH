<script lang="ts" setup>
import { ref, watch, computed, onMounted } from "vue";
import QuerySearch from "@/app/common/components/filters/QuerySearch.vue";
import Table from "@/app/common/components/TableSector.vue";
import { listViewHeader } from "@/components/baseTables/sector/listView/utils";
import { agentListingData } from "@/components/baseTables/sector/utils";
import { AgentListingType } from "@/components/baseTables/sector/types";
import Status from "@/app/common/components/Status.vue";
import TableAction from "@/app/common/components/TableActionSector.vue";
import CreateUpdateAgentDialog from "@/components/baseTables/sector/editSector/CreateUpdateAgentDialog.vue";
import { formateDate } from "@/app/common/dateFormate";
import { useRouter, useRoute } from "vue-router";
import RemoveItemConfirmationDialog from "@/components/baseTables/sector/listView/RemoveItemConfirmationDialog.vue";
import { useI18n } from "vue-i18n";
import Swal from 'sweetalert2';


const route = useRoute();
const router = useRouter();
const dialog = ref(false);
const agentData = ref<AgentListingType | null>(null);

const deleteDialog = ref(false);
const deleteId = ref<number | null>(null);
const isSelectAll = ref(false);
const name = ref((route as any).query.name);

const mappedData = agentListingData
  .map((item) => {
    return {
      ...item,
      isCheck: false,
    };
  })
  .toReversed();

const { t } = useI18n();
const translatedHeader = computed(() =>
  listViewHeader.map((item) => ({
    ...item,
    title: t(item.title), // assume que item.title tem a key do i18n, como 't-name'
  }))
);

const filteredData = ref<AgentListingType[]>(mappedData);
const finalData = ref<AgentListingType[]>(filteredData.value);
const query = ref("");
// const name = ref("");


const page = ref(1);
const noOfItems = computed(() => {
  return finalData.value.length;
});
const tableData = ref<AgentListingType[]>([]);
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

  const data = finalData.value.slice(config.value.start, config.value.end);

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

watch(filteredData, (newData: AgentListingType[]) => {
  updateTableData(newData);
});

const updateTableData = (newVal: AgentListingType[]) => {
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

watch(query, (newQuery: string) => {
  filteredData.value = finalData.value.filter((item) => {
    const val = newQuery.toLowerCase();
    if (
      item.name.toLowerCase().includes(val) ||
      item.description.includes(val)
    ) {
      return item;
    }
  });
  updateTableData(filteredData.value);
});

watch(dialog, (newVal: boolean) => {
  if (!newVal) {
    agentData.value = null;
  }
});

watch(deleteDialog, (newVal: boolean) => {
  if (!newVal) {
    deleteId.value = null;
  }
});

const onCreateEditClick = (data: AgentListingType | null) => {
  if (!data) {
    agentData.value = {
      id: -1,
      name: "",
      description: "",
    };
  } else {
    agentData.value = data;
  }

  dialog.value = true;
};

const onSubmit = (data: AgentListingType) => {
  if (data.id === -1) {
    const preparedData = {
      ...data,
      id: finalData.value.length + 1,
      // img: data.img.src ? data.img.src : data.img,
    };

    filteredData.value.unshift(preparedData);
  } else {
    filteredData.value = filteredData.value.map((item) => {
      if (item.id === data.id) {
        return {
          ...item,
          ...data,
        };
      }
      return item;
    });
  }
  finalData.value = filteredData.value;
  updateTableData(filteredData.value);
  dialog.value = false;
};

const onView = () => {
  router.push({ path: "/real-estate-agent/overview" });
};

const onSave = () => {
  // Aqui poderias salvar via API ou apenas atualizar localmente
  console.log("Nome gravado:", name.value);

  Swal.fire({
    icon: 'success',
    title: 'Gravado com sucesso!',
    text: `O nome "${name.value}" foi gravado com sucesso.`,
    confirmButtonColor: '#3085d6',
    confirmButtonText: 'OK',
  });
};

const animateLink = ref(false);

const onAddServiceNature = () => {
  animateLink.value = true;

  setTimeout(() => {
    animateLink.value = false;
    onCreateEditClick(null); // função que já tinhas
  }, 500);
};


const onDelete = (id: number) => {
  deleteId.value = id;
  deleteDialog.value = true;
};

const onConfirmDelete = () => {
  filteredData.value = finalData.value.filter(
    (item) => item.id !== deleteId.value
  );

  finalData.value = filteredData.value;
  deleteDialog.value = false;
  updateTableData(filteredData.value);
};

const onSelectAll = () => {
  isSelectAll.value = !isSelectAll.value;
  tableData.value = tableData.value.map((item) => {
    return {
      ...item,
      isCheck: isSelectAll.value,
    };
  });
};
</script>
<template>
  <v-card>
    <v-card-title class="mt-2 mb-8">
      <v-row>
        <!-- Campo Nome -->
        <v-col cols="12">
          <div class="font-weight-bold text-caption mb-1">
            {{ $t('t-sector-name') }} <i class="ph-asterisk ph-xs text-danger" />
          </div>
          <TextField v-model="name" placeholder="Enter name" />
        </v-col>
        <v-col cols="6">
          <div class="font-weight-bold text-subtitle-1 mb-1">
            {{ $t('t-service-nature') }}
          </div>
        </v-col>
        <!-- Campo de Pesquisa abaixo, alinhado à direita -->
        <v-col cols="12" lg="3" class="ms-auto">
          <QuerySearch v-model="query" :placeholder="$t('t-search-repartition')" />
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <Table v-model="page" :headerItems="translatedHeader" :config="config" :loading="loading" is-pagination
        @on-select-all="onSelectAll">
        <template #body>
          <tr v-for="(item, index) in tableData" :key="'agent-listing-item-' + index" height="50">
            <td>
              <v-checkbox v-model="item.isCheck" hide-details color="primary" />
            </td>
            <td>
              {{ item.name }}
            </td>
            <td style="padding-right: 550px;"></td>
            <td>
              <Status :status="item.status" />
            </td>
            <td>
              <TableAction @onEdit="onCreateEditClick(item)" @onView="onView" @onDelete="onDelete(item.id)" />
            </td>
          </tr>
        </template>
      </Table>

      <div v-if="!filteredData.length" class="text-center pa-7">
        <div class="mb-3">
          <v-avatar color="primary" variant="tonal" size="x-large">
            <i class="ph-magnifying-glass ph-lg"></i>
          </v-avatar>
        </div>
        <div class="text-subtitle-1 font-weight-bold">
          Sorry! No Result Found Ivo
        </div>
        <div class="text-muted mt-1">
          We've searched more than 150+ agent We did not find any agent for your search.
        </div>
      </div>

      <!-- Botões abaixo da tabela -->
      <v-row class="mt-4">
        <!-- Alinhamento com a coluna "nome" (segunda coluna da tabela) -->
        <v-col cols="12">
          <div class="d-flex align-center">
            <!-- Espaço inicial vazio para alinhar com a primeira coluna (checkbox) -->
            <div style="width: 48px;"></div>

            <!-- Link alinhado com "nome" -->
            <div style="flex: 1;">
              <a href="#" class="animated-link text-primary fw-bold text-primary font-weight-bold"
                @click.prevent="onAddServiceNature">
                + {{ $t('t-add-service-nature') }}
              </a>
            </div>

            <!-- Espaço para terceira coluna (padding-right artificial da tabela) -->
            <div style="width: 550px;"></div>

            <!-- Botão alinhado com "ações" -->
            <div style="width: 155px;" class="text-left">
              <v-btn color="primary" @click="onSave">
                {{ $t('t-save') }}
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <CreateUpdateAgentDialog v-if="agentData" v-model="dialog" :data="agentData" @onSubmit="onSubmit" />

  <RemoveItemConfirmationDialog v-if="deleteId" v-model="deleteDialog" @onConfirm="onConfirmDelete" />
</template>
<style scoped>
.animated-link {
  position: relative;
  display: inline-block;
  text-decoration: none;
  color: #4b56d2;
  /* opcional, ou usa text-primary */
}

/* linha base (underline) */
.animated-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 100%;
  height: 2px;
  background-color: currentColor;
  transition: all 0.4s ease;
  transform-origin: center;
}

/* animação ao passar o mouse */
.animated-link:hover::after {
  transform: scaleX(0);
}
</style>
