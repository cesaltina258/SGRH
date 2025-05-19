<script lang="ts" setup>

import { ref, watch, computed, onMounted } from "vue";
import Filters from "@/components/baseTables/country/editCountry/listView/HistoryFilters.vue";
import { filters, interactions } from "@/components/institution/createInstitution/utils";
import QuerySearch from "@/app/common/components/filters/QuerySearch.vue";
import Table from "@/app/common/components/Table.vue";
import { listViewHeader } from "@/components/baseTables/country/editCountry/listView/utils";
import { CountryListingType, CountryInsertType } from "@/components/baseTables/country/types";
import Status from "@/app/common/components/Status.vue";
import TableAction from "@/app/common/components/TableAction.vue";
import CreateUpdateProvinceModal from "@/components/baseTables/country/editCountry/CreateUpdateProvinceModal.vue";
import ViewProvinceModal from "@/components/baseTables/country/editCountry/ViewProvinceModal.vue";
import { formateDate } from "@/app/common/dateFormate";
import { useRouter } from "vue-router";
import RemoveItemConfirmationDialog from "@/app/common/components/RemoveItemConfirmationDialog.vue";
import { useCountryStore } from "@/store/baseTables/countryStore";
import { countryService } from "@/app/http/httpServiceProvider";
import { useToast } from 'vue-toastification';
import { useI18n } from "vue-i18n";
import { useCountryStoreID } from "@/store/baseTables/countryStore";
import { useProvinceByCountryStoreID } from "@/store/baseTables/countryStore";
import { ProvinceListingType } from "@/components/baseTables/country/editCountry/listView/types";
import { useProvinceStore } from "@/store/baseTables/countryStore";
import { useRoute } from 'vue-router';
import { provinceOptions } from "@/components/baseTables/country/editCountry/listView/utils";
import DataTableServer from "@/app/common/components/DataTableServer.vue";
import { ProvinceOption } from "@/components/baseTables/country/editCountry/listView/types";



const { t } = useI18n();
//criacao da mensagem toast
const toast = useToast();
const countryStore = useCountryStore();
const router = useRouter();
const dialog = ref(false);
const viewDialog = ref(false);
const provinceFormData = ref<ProvinceListingType | null>(null);
const customerFilters = ref<any>(filters);
const provinceByCountryStoreID = useProvinceByCountryStoreID();
const provinceData = computed(() => provinceByCountryStoreID.province_by_country);
const countryStoreID = useCountryStoreID();
const provinceStore = useProvinceStore();
const countryData = ref<CountryListingType | null>(null);
const itemsPerPage = ref(10);
const searchProps = "name,code";
const selectedProvinces = ref<ProvinceListingType[]>([]);
const loading = ref(false);
const loadingList = computed(() => provinceByCountryStoreID.loading);
const totalItems = computed(() => provinceByCountryStoreID.pagination.totalElements);
const route = useRoute();
const countryId = computed(() => Number(route.query.id));
const deleteDialog = ref(false);
const deleteId = ref<number | null>(null);
const deleteLoading = ref(false);
const isSelectAll = ref(false);
const manualUpdateTrigger = ref(false);

const filteredData = ref<ProvinceListingType[]>([]);
const finalData = ref<ProvinceListingType[]>([]);

const query = computed(() => {
  return customerFilters.value.query;
});

const searchQuery = computed({
  get: () => customerFilters.value.query,
  set: (val) => {
    customerFilters.value.query = val;
  },
});

const toggleSelection = (item: ProvinceListingType) => {
  const index = selectedProvinces.value.findIndex(selected => selected.id === item.id);
  if (index >= 0) {
    selectedProvinces.value.splice(index, 1); // remove
  } else {
    selectedProvinces.value.push(item); // adiciona
  }
};

const onBack = () => {
  router.push({ path: `/baseTable/country/list` });
};

const fetchProvinces = async ({ page, itemsPerPage, sortBy, search }: ProvinceOption) => {
  await provinceByCountryStoreID.fetchProvincesByCountryID(
    countryId.value,
    page - 1,
    itemsPerPage,
    sortBy[0]?.key || "name",
    sortBy[0]?.order || "asc",
    search,
    searchProps
  );
};

onMounted(() => {
  fetchProvinces({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: [], search: "" });
});

const formErrors = ref<Record<string, string>>({
  name: '',
  code: '',
  iso2Code: '',
  iso3Code: '',
  phoneCode: '',
  currency: '',
  currencySymbol: '',
  currencyCode: '',
});


const form = ref({
  id: null as number | null,
  name: "",
  code: "",
  iso2Code: "",
  iso3Code: "",
  phoneCode: "",
  currency: "",
  currencySymbol: "",
  currencyCode: ""
});

const validateForm = () => {
  let isValid = true;

  // Limpar erros antigos
  Object.keys(formErrors.value).forEach((key) => {
    formErrors.value[key] = '';
  });

  if (!form.value.name) {
    formErrors.value.name = t('t-please-enter-name');
    isValid = false;
  }
  if (!form.value.code) {
    formErrors.value.code = t('t-please-enter-code');
    isValid = false;
  } else if (form.value.code.length < 2 || form.value.code.length > 10) {
    formErrors.value.code = t('t-code-must-be-between-2-and-10-chars');
    isValid = false;
  } else {
    formErrors.value.code = '';
  }

  if (!form.value.iso2Code) {
    formErrors.value.iso2Code = t('t-please-enter-iso2-code');
    isValid = false;
  } else if (form.value.iso2Code.length !== 2) {
    formErrors.value.iso2Code = t('t-iso2-must-have-2-characters');
    isValid = false;
  }
  if (!form.value.iso3Code) {
    formErrors.value.iso3Code = t('t-please-enter-iso3-code');
    isValid = false;
  } else if (form.value.iso3Code.length !== 3) {
    formErrors.value.iso3Code = t('t-iso3-must-have-3-characters');
    isValid = false;
  }
  if (!form.value.phoneCode) {
    formErrors.value.phoneCode = t('t-please-enter-phone-code');
    isValid = false;
  } else if (!/^\+\d{1,3}$/.test(form.value.phoneCode)) {
    formErrors.value.phoneCode = t('t-invalid-phone-code'); // Traduz isto no teu ficheiro pt.json
    isValid = false;
  }
  if (!form.value.currency) {
    formErrors.value.currency = t('t-please-enter-currency');
    isValid = false;
  }
  if (!form.value.currencySymbol) {
    formErrors.value.currencySymbol = t('t-please-enter-currency-symbol');
    isValid = false;
  } else if (form.value.currencySymbol.length < 1 || form.value.currencySymbol.length > 10) {
    formErrors.value.currencySymbol = t('t-currency-symbol-must-be-between-1-and-10-chars');
    isValid = false;
  } else {
    formErrors.value.currencySymbol = '';
  }

  if (!form.value.currencyCode) {
    formErrors.value.currencyCode = t('t-please-enter-currency-code');
    isValid = false;
  } else if (form.value.currencyCode.length < 2 || form.value.currencyCode.length > 10) {
    formErrors.value.currencyCode = t('t-currency-code-must-be-between-2-and-10-chars');
    isValid = false;
  } else {
    formErrors.value.currencyCode = '';
  }

  return isValid;
};

watch(countryData, (val) => {
  if (val) {
    form.value = {
      id: val.id,
      name: val.name,
      code: val.code,
      iso2Code: val.iso2Code,
      iso3Code: val.iso3Code,
      phoneCode: val.phoneCode,
      currency: val.currency,
      currencySymbol: val.currencySymbol,
      currencyCode: val.currencyCode,
    };
  }
});


watch(provinceData, (val) => {
  if (val) {
    const mapped = val.map((item: ProvinceListingType) => ({
      ...item,
      isCheck: false
    })).toReversed();

    filteredData.value = mapped;
    finalData.value = mapped;
    // updateTableData(mapped);

  }
}, { immediate: true });


onMounted(async () => {
  if (countryId.value) {
    // Buscar os dados do país
    const result = await countryStoreID.fetchCountryByID(countryId.value);
    countryData.value = result;

    // Buscar as províncias
    await provinceByCountryStoreID.fetchProvincesByCountryID(countryId.value);

  }
});


watch(query, (newQuery: string) => {
  filteredData.value = finalData.value.filter((item) => {
    const val = newQuery.toLowerCase();
    if (
      item.name.toLowerCase().includes(val) ||
      item.code.includes(val)
    ) {
      return item;
    }
  });
});

//Criação e edição do utilizador

watch(dialog, (newVal: boolean) => {
  if (!newVal) {
    provinceFormData.value = null;
  }
});

const onCreateEditClick = (data: ProvinceListingType | null) => {
  if (!data) {
    provinceFormData.value = {
      id: -1,
      name: "",
      code: "",
    };
  } else {
    provinceFormData.value = data;

  }

  dialog.value = true;
};

const onSubmit = async (data: CountryListingType, callbacks?: {
  onSuccess?: () => void,
  onFinally?: () => void
}) => {
  try {
    if (!data.id) {
      await countryService.createProvince(data);
      toast.success(t('t-toast-message-created'));
    } else {
      await countryService.updateProvince(data.id, data);
      toast.success(t('t-toast-message-update'));
    }

    // Recarrega os dados
    provinceByCountryStoreID.fetchProvincesByCountryID(countryId.value);

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
    provinceFormData.value = null;
  }
});

const onViewClick = (data: ProvinceListingType | null) => {
  if (!data) {
    provinceFormData.value = {
      id: -1,
      name: "",
      code: "",

    };
  } else {
    provinceFormData.value = data;
  }

  viewDialog.value = true;
};


watch(deleteDialog, (newVal: boolean) => {
  if (!newVal) {
    deleteId.value = null;
  }
});
const onDelete = (id: number) => {
  deleteId.value = id;
  deleteDialog.value = true;
};

const onConfirmDelete = async () => {
  deleteLoading.value = true;

  try {
    await countryService.deleteProvince(deleteId.value!);
    toast.success(t('t-toast-message-deleted'));
    provinceByCountryStoreID.fetchProvincesByCountryID(countryId.value);
  } catch (error) {
    toast.error(t('t-toast-message-deleted-erros'));
  } finally {
    deleteLoading.value = false;
    deleteDialog.value = false;
  }
};

// fora de qualquer função
const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  loading.value = true; // Ativa o loading

  try {
    await countryService.updateCountry(form.value.id!, form.value);
    toast.success(t('t-toast-message-update'));
    await countryStore.fetchCountries();
  } catch (error) {
    toast.error(t('t-message-save-error'));
  } finally {
    loading.value = false; // Desativa o loading
  }
};
</script>
<template>
  <Card title="">
    <v-card-text>
      <v-card>
        <v-card-text class="pt-0">
          <v-row class="">
            <v-col cols="12" lg="6">
              <div class="font-weight-bold mb-2">
                {{ $t('t-country-name') }} <i class="ph-asterisk ph-xs text-danger" />
              </div>
              <TextField v-model="form.name" :placeholder="$t('t-country-name')"
                :error-messages="formErrors.name ? [formErrors.name] : []" hide-details />
              <div v-if="formErrors.name" class="text-red text-extra-small pt-1">
                {{ formErrors.name }}
              </div>
            </v-col>
            <v-col cols="12" lg="6">
              <div class="font-weight-bold mb-2">
                {{ $t('t-country-code') }} <i class="ph-asterisk ph-xs text-danger" />
              </div>
              <TextField v-model="form.code" :placeholder="$t('t-enter-code')"
                :error-messages="formErrors.code ? [formErrors.code] : []" hide-details />
              <div v-if="formErrors.code" class="text-red text-extra-small pt-1">
                {{ formErrors.code }}
              </div>
            </v-col>
          </v-row>
          <v-row class="">
            <v-col cols="12" lg="6">
              <div class="font-weight-bold mb-2">
                {{ $t('t-iso2Code') }} <i class="ph-asterisk ph-xs text-danger" />
              </div>
              <TextField v-model="form.iso2Code" :placeholder="$t('t-enter-iso2-code')"
                :error-messages="formErrors.iso2Code ? [formErrors.iso2Code] : []" hide-details />
              <div v-if="formErrors.iso2Code" class="text-red text-extra-small pt-1">
                {{ formErrors.iso2Code }}
              </div>
            </v-col>
            <v-col cols="12" lg="6">
              <div class="font-weight-bold mb-2">
                {{ $t('t-iso3Code') }} <i class="ph-asterisk ph-xs text-danger" />
              </div>
              <TextField v-model="form.iso3Code" :placeholder="$t('t-enter-iso3-code')"
                :error-messages="formErrors.iso3Code ? [formErrors.iso3Code] : []" hide-details />
              <div v-if="formErrors.iso3Code" class="text-red text-extra-small pt-1">
                {{ formErrors.iso3Code }}
              </div>
            </v-col>
          </v-row>
          <v-row class="">
            <v-col cols="12" lg="6">
              <div class="font-weight-bold mb-2">
                {{ $t('t-phone-code') }} <i class="ph-asterisk ph-xs text-danger" />
              </div>
              <TextField v-model="form.phoneCode" :placeholder="$t('t-enter-phone-code')"
                :error-messages="formErrors.phoneCode ? [formErrors.phoneCode] : []" hide-details />
              <div v-if="formErrors.phoneCode" class="text-red text-extra-small pt-1">
                {{ formErrors.phoneCode }}
              </div>
            </v-col>
            <v-col cols="12" lg="6">
              <div class="font-weight-bold mb-2">
                {{ $t('t-currency') }} <i class="ph-asterisk ph-xs text-danger" />
              </div>
              <TextField v-model="form.currency" :placeholder="$t('t-enter-currency')"
                :error-messages="formErrors.currency ? [formErrors.currency] : []" hide-details />
              <div v-if="formErrors.currency" class="text-red text-extra-small pt-1">
                {{ formErrors.currency }}
              </div>
            </v-col>
          </v-row>
          <v-row class="">
            <v-col cols="12" lg="6">
              <div class="font-weight-bold mb-2">
                {{ $t('t-currency-symbol') }} <i class="ph-asterisk ph-xs text-danger" />
              </div>
              <TextField v-model="form.currencySymbol" :placeholder="$t('t-enter-currency-symbol')"
                :error-messages="formErrors.currencySymbol ? [formErrors.currencySymbol] : []" hide-details />
              <div v-if="formErrors.currencySymbol" class="text-red text-extra-small pt-1">
                {{ formErrors.currencySymbol }}
              </div>
            </v-col>
            <v-col cols="12" lg="6">
              <div class="font-weight-bold mb-2">
                {{ $t('t-currency-code') }} <i class="ph-asterisk ph-xs text-danger" />
              </div>
              <TextField v-model="form.currencyCode" :placeholder="$t('t-enter-currency-code')"
                :error-messages="formErrors.currencyCode ? [formErrors.currencyCode] : []" hide-details />
              <div v-if="formErrors.currencyCode" class="text-red text-extra-small pt-1">
                {{ formErrors.currencyCode }}
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-card-text>
    <v-card-text>
      <Card :title="$t('t-province-list')" title-class="pt-0">
        <template #title-action>
          <div>
            <v-btn color="primary" class="mx-1" @click.prevent="onCreateEditClick(null)">
              <i class="ph-plus-circle me-1" /> {{ $t('t-add-province') }}
            </v-btn>
          </div>
        </template>
      </Card>
      <v-row class="mt-5">
        <v-col cols="12" lg="12">
          <Filters v-model="customerFilters" />
          <v-card class="mt-5">
            <v-card-text>
              <DataTableServer :headers="listViewHeader.map(item => ({ ...item, title: $t(`t-${item.title}`) }))"
                :items="provinceByCountryStoreID.province_by_country" :items-per-page="itemsPerPage"
                :total-items="totalItems" :loading="loadingList" :search-query="searchQuery" :search-props="searchProps"
                item-value="id" @load-items="fetchProvinces">
                <template #body="{ items }">
                  <tr v-for="item in items" :key="item.id">
                    <td>
                      <v-checkbox :model-value="selectedProvinces.some(selected => selected.id === item.id)"
                        @update:model-value="toggleSelection(item)" hide-details density="compact" />
                    </td>
                    <td style="padding-right: 200px;">{{ item.name }}</td>
                    <td style="padding-right: 200px;">{{ item.code }}</td>
                    <td>
                      <TableAction @onView="onViewClick(item)" @onEdit="onCreateEditClick(item)"
                        @onDelete="onDelete(item.id)" />
                    </td>
                  </tr>
                </template>
              </DataTableServer>
              <div v-if="!filteredData.length" class="text-center">
                <v-avatar size="80" color="primary" variant="text">
                  <i class="ph-magnifying-glass" style="font-size: 30px" color="primary" />
                </v-avatar>
                <div class="font-weight-bold text-subtitle-1 mb-1">
                  {{ $t('t-search-not-found-message') }}
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-card-actions class="d-flex justify-space-between">
        <v-btn color="secondary" variant="outlined" class="me-2" @click="onBack()">
          {{ $t('t-back') }} <i class="ph-arrow-left ms-2" />
        </v-btn>
        <v-btn color="success" variant="elevated" :loading="loading" :disabled="!form.name || !form.code"
          @click="handleSubmit">
          {{ $t('t-save') }} <i class="ph-floppy-disk ms-2" />
        </v-btn>
      </v-card-actions>
    </v-card-text>
  </Card>

  <CreateUpdateProvinceModal v-if="provinceFormData" :country="countryId" v-model="dialog" :data="provinceFormData"
    @onSubmit="onSubmit" />

  <ViewProvinceModal v-if="provinceFormData" v-model="viewDialog" :data="provinceFormData" />

  <RemoveItemConfirmationDialog v-if="deleteId" v-model="deleteDialog" @onConfirm="onConfirmDelete"
    :loading="deleteLoading" />
</template>
