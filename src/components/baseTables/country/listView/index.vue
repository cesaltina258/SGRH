<script lang="ts" setup>
import { ref, watch, computed, onMounted } from "vue";
import QuerySearch from "@/app/common/components/filters/QuerySearch.vue";
import Table from "@/app/common/components/Table.vue";
import { listViewHeader } from "@/components/baseTables/country/listView/utils";
import { CountryListingType, CountryInsertType } from "@/components/baseTables/country/types";
import Status from "@/app/common/components/Status.vue";
import TableAction from "@/app/common/components/TableAction.vue";
import CreateUpdateCountryModal from "@/components/baseTables/country/CreateUpdateCountryModal.vue";
import ViewCountryModal from "@/components/baseTables/country/ViewCountryModal.vue";
import { formateDate } from "@/app/common/dateFormate";
import { useRouter } from "vue-router";
import RemoveItemConfirmationDialog from "@/app/common/components/RemoveItemConfirmationDialog.vue";
import { useCountryStore } from "@/store/baseTables/countryStore";
import { countryService } from "@/app/http/httpServiceProvider";
import { useToast } from 'vue-toastification';
import { useI18n } from "vue-i18n";


const { t } = useI18n();
//criacao da mensagem toast
const toast = useToast();

const countryStore = useCountryStore();

const router = useRouter();
const dialog = ref(false);
const viewDialog = ref(false);
const countryData = ref<CountryListingType | null>(null);

const deleteDialog = ref(false);
const deleteId = ref<string | null>(null);
const deleteLoading = ref(false);
const isSelectAll = ref(false);

const mappedData = computed(() =>
  countryStore.countries.map((item) => ({
    ...item,
    isCheck: false,
  })).toReversed()
);

const filteredData = ref<CountryListingType[]>([]);
const finalData = ref<CountryListingType[]>([]);

watch(mappedData, (newVal) => {
  filteredData.value = newVal;
  finalData.value = newVal;
}, { immediate: true });

onMounted(() => {
  countryStore.fetchCountries();
  getPaginatedData();
});

const query = ref("");

const page = ref(1);
const noOfItems = computed(() => {
  return finalData.value.length;
});
const tableData = ref<CountryListingType[]>([]);
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



watch(page, (newPage: number) => {
  config.value.page = newPage;
  getPaginatedData();
});

watch(filteredData, (newData: CountryListingType[]) => {
  updateTableData(newData);
});

const updateTableData = (newVal: CountryListingType[]) => {
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
      item.code.includes(val) ||
      item.iso2Code.includes(val) ||
      item.iso3Code.includes(val) ||
      item.phoneCode.includes(val) ||
      item.currency.toLowerCase().includes(val) ||
      item.currencySymbol.toLowerCase().includes(val) ||
      item.currencyCode.toLowerCase().includes(val)
    ) {
      return item;
    }
  });
  updateTableData(filteredData.value);
});

//Criação e edição do utilizador

watch(dialog, (newVal: boolean) => {
  if (!newVal) {
    countryData.value = null;
  }
});

const onCreateEditClick = (data: CountryListingType | null) => {
  if (!data) {
    countryData.value = {
      id: '-1',
      name: "",
      code: "",
      iso2Code: "",
      iso3Code: "",
      phoneCode: "",
      currency: "",
      currencySymbol: "",
      currencyCode: "",
    };
  } else {
    router.push({
      path: "/baseTable/edit-country",
      query: {
        id: data.id,
      },
    });

  }

  dialog.value = true;
};

const onSubmit = async (data: CountryListingType, callbacks?: {
  onSuccess?: () => void,
  onFinally?: () => void
}) => {
  try {
    if (!data.id) {
      await countryService.createCountry(data);
      toast.success(t('t-toast-message-created'));
    } else {
      await countryService.updateCountry(data.id, data);
      toast.success(t('t-toast-message-update'));
    }

    // Recarrega os dados
    await countryStore.fetchCountries();

    // Callback de sucesso (fecha a modal)
    callbacks?.onSuccess?.();
  } catch (error) {
    toast.error(t('t-message-save-error'));

  } finally {
    // Callback para desativar o loading
    callbacks?.onFinally?.();
  }
};


//Consulta do utilizador
watch(viewDialog, (newVal: boolean) => {
  if (!newVal) {
    countryData.value = null;
  }
});

const onViewClick = (data: CountryListingType | null) => {
  if (!data) {
    countryData.value = {
      id: '-1',
      name: "",
      code: "",
      iso2Code: "",
      iso3Code: "",
      phoneCode: "",
      currency: "",
      currencySymbol: "",
      currencyCode: "",

    };
  } else {
    countryData.value = data;

  }

  viewDialog.value = true;
};


//Delete do utilizador
watch(deleteDialog, (newVal: boolean) => {
  if (!newVal) {
    deleteId.value = null;
  }
});
const onDelete = (id: string) => {
  deleteId.value = id;
  deleteDialog.value = true;
};

const onConfirmDelete = async () => {
  deleteLoading.value = true;

  try {
    await countryService.deleteCountry(deleteId.value!);

    filteredData.value = filteredData.value.filter(
      (item) => item.id !== deleteId.value
    );
    finalData.value = [...filteredData.value];
    updateTableData(filteredData.value);

    toast.success(t('t-toast-message-deleted'));
  } catch (error) {
    toast.error(t('t-toast-message-deleted-erros'));
  } finally {
    deleteLoading.value = false;
    deleteDialog.value = false;
  }


};

</script>
<template>
  <v-card>
    <v-card-title class="mt-2">
  <v-row justify="space-between" align="center" no-gutters>
    <!-- Novo texto à esquerda -->
    <v-col lg="auto" class="d-flex align-center">
      <span class="text-body-1 font-weight-bold">{{ $t('t-country-list') }}</span>
    </v-col>

    <!-- Container dos elementos à direita -->
    <v-col lg="8" class="d-flex justify-end">
      <v-row justify="end" align="center" no-gutters>
        <v-col lg="4" class="me-3">
          <QuerySearch v-model="query" :placeholder="$t('t-search-for-country')" />
        </v-col>
        <v-col lg="auto">
          <v-btn color="secondary" @click="onCreateEditClick(null)">
            <i class="ph-plus-circle me-1" /> {{ $t('t-add-country') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</v-card-title>
    <v-card-text class="mt-2">
      <Table v-model="page" :headerItems="listViewHeader.map(item => ({ ...item, title: $t(`t-${item.title}`) }))"
        :config="config" :loading="loading" is-pagination >
        <template #body>
          <tr v-for="(item, index) in tableData" :key="'agent-listing-item-' + index" height="50">
            <td>{{ item.name }}</td>
            <td>{{ item.code }}</td>
            <td>{{ item.iso2Code }}</td>
            <td>{{ item.iso3Code }}</td>
            <td>{{ item.phoneCode }}</td>
            <td>{{ item.currency }}</td>
            <td>{{ item.currencySymbol }}</td>
            <td>{{ item.currencyCode }}</td>
            <!-- <td>
              <Status :status="item.enabled ? 'active' : 'unactive'" />
            </td> -->
            <td>
              <TableAction @onEdit="onCreateEditClick(item)" @onView="onViewClick(item)"
                @onDelete="onDelete(item.id)" />
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
          {{ $t('t-search-not-found-message') }}
        </div>
      </div>
    </v-card-text>
  </v-card>

  <CreateUpdateCountryModal v-if="countryData" v-model="dialog" :data="countryData" @onSubmit="onSubmit" />

  <ViewCountryModal v-if="countryData" v-model="viewDialog" :data="countryData" />

  <RemoveItemConfirmationDialog v-if="deleteId" v-model="deleteDialog" @onConfirm="onConfirmDelete"
    :loading="deleteLoading" />
</template>
