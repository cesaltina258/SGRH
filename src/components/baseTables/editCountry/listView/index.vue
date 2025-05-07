<script lang="ts" setup>
import { ref, watch, computed, onMounted } from "vue";
import QuerySearch from "@/app/common/components/filters/QuerySearch.vue";
import Table from "@/app/common/components/Table.vue";
import { listViewHeader } from "@/components/baseTables/editCountry/listView/utils";
import { CountryListingType, CountryInsertType } from "@/components/baseTables/country/types";
import Status from "@/app/common/components/Status.vue";
import TableAction from "@/app/common/components/TableAction.vue";
import CreateUpdateProvinceModal from "@/components/baseTables/editCountry/CreateUpdateProvinceModal.vue";
import ViewProvinceModal from "@/components/baseTables/editCountry/ViewProvinceModal.vue";
import { formateDate } from "@/app/common/dateFormate";
import { useRouter } from "vue-router";
import RemoveItemConfirmationDialog from "@/app/common/components/RemoveItemConfirmationDialog.vue";
import { useCountryStore } from "@/store/baseTables/countryStore";
import { countryService } from "@/app/http/httpServiceProvider";
import { useToast } from 'vue-toastification';
import { useI18n } from "vue-i18n";
import { useCountryStoreID } from "@/store/baseTables/countryStoreID";
import { useProvinceByCountryStoreID } from "@/store/baseTables/provinceStoreByCountryID";
import { ProvinceListingType } from "@/components/baseTables/editCountry/listView/types";
import { provinceService } from "@/app/http/httpServiceProvider";
import { useProvinceStore } from "@/store/baseTables/provinceStore";


// EditCountry.vue (ou ListView.vue no teu caso)
import { useRoute } from 'vue-router';

const provinceByCountryStoreID = useProvinceByCountryStoreID();
const provinceData = computed(() => provinceByCountryStoreID.country_by_province);



const countryStoreID = useCountryStoreID();
const provinceStore = useProvinceStore();
const countryData = ref<CountryListingType | null>(null);

const route = useRoute();
const countryId = computed(() => Number(route.query.id));

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


const { t } = useI18n();
//criacao da mensagem toast
const toast = useToast();

const countryStore = useCountryStore();

const router = useRouter();
const dialog = ref(false);
const viewDialog = ref(false);
const provinceFormData = ref<ProvinceListingType | null>(null);

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


const deleteDialog = ref(false);
const deleteId = ref<number | null>(null);
const deleteLoading = ref(false);
const isSelectAll = ref(false);
const manualUpdateTrigger = ref(false);

const filteredData = ref<ProvinceListingType[]>([]);
const finalData = ref<ProvinceListingType[]>([]);

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
    await provinceByCountryStoreID.fetchProvinceByCountryID(countryId.value);

    // Paginar dados após carregamento
    getPaginatedData();
  }
});


const query = ref("");

const page = ref(1);
const noOfItems = computed(() => {
  return finalData.value.length;
});
const tableData = ref<ProvinceListingType[]>([]);
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

watch(filteredData, (newData: ProvinceListingType[]) => {
  updateTableData(newData);
});

const updateTableData = (newVal: ProvinceListingType[]) => {
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
      item.code.includes(val)
    ) {
      return item;
    }
  });
  updateTableData(filteredData.value);
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
      await provinceService.createProvince(data);
      toast.success(t('t-toast-message-created'));
    } else {
      await provinceService.updateProvince(data.id, data);
      toast.success(t('t-toast-message-update'));
    }

    // Recarrega os dados
    provinceByCountryStoreID.fetchProvinceByCountryID(countryId.value);

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
    await provinceService.deleteProvince(deleteId.value!);

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

// fora de qualquer função
const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  try {
    loading.value = true;
    await countryService.updateCountry(form.value.id!, form.value);
    toast.success(t('t-toast-message-update'));
    await countryStore.fetchCountries();
    getPaginatedData();
  } catch (error) {
    toast.error(t('t-message-save-error'));
  } finally {
    loading.value = false;
  }
};


</script>

<template>
  <Card elevation="0" title-class="pb-0" class="px-4 pt-4">
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
        <v-col cols="6" class="pt-10 pb-10">
          <div class="font-weight-bold text-subtitle-1 mb-1">
            {{ $t('t-province-list') }}
          </div>
        </v-col>
        <v-col cols="12" lg="3" class="ms-auto pt-10 pb-10">
          <QuerySearch v-model="query" :placeholder="$t('t-search-for-province')" />
        </v-col>
      </v-row>
    </v-card-text>
    <v-row>
    </v-row>
    <v-card-text class="mt-2">
      <Table v-model="page" :headerItems="listViewHeader.map(item => ({ ...item, title: $t(`t-${item.title}`) }))"
        :config="config" :loading="loading" is-pagination @on-select-all="onSelectAll" class="ma-n2">
        <template #body>
          <tr v-for="(item, index) in tableData" :key="'agent-listing-item-' + index" height="50">
            <td>
              <v-checkbox v-model="item.isCheck" hide-details color="primary" />
            </td>
            <td style="padding-right: 290px;">{{ item.name }}</td>
            <td style="padding-right: 290px;">{{ item.code }}</td>

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
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-col cols="12">
        <div class="d-flex align-center">
          <!-- Espaço inicial vazio para alinhar com a primeira coluna (checkbox) -->
          <div style="width: 48px;"></div>

          <!-- Link alinhado com "nome" -->
          <div style="flex: 1;">
            <a href="#" class="animated-link text-primary fw-bold text-primary font-weight-bold"
              @click.prevent="onCreateEditClick(null)">
              + {{ $t('t-add-province') }}
            </a>
          </div>

          <!-- Espaço para terceira coluna (padding-right artificial da tabela) -->
          <div style="width: 550px;"></div>

          <!-- Botão alinhado com "ações" -->
          <div style="width: 155px;" class="text-left">
            <v-btn color="primary" variant="elevated" :loading="loading" :disabled="!form.name || !form.code"
              @click="handleSubmit">
              {{ $t('t-save') }}
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-card-actions>
  </Card>
  <CreateUpdateProvinceModal v-if="provinceFormData" :country="countryId" v-model="dialog" :data="provinceFormData"
    @onSubmit="onSubmit" />

  <ViewProvinceModal v-if="provinceFormData" v-model="viewDialog" :data="provinceFormData" />

  <RemoveItemConfirmationDialog v-if="deleteId" v-model="deleteDialog" @onConfirm="onConfirmDelete"
    :loading="deleteLoading" />
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

.text-extra-small {
  font-size: 0.70rem;
}
</style>
