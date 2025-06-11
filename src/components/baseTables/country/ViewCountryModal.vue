<script lang="ts" setup>
import { PropType, computed, ref } from "vue";
import { CountryInsertType } from "@/components/baseTables/country/types";
import MenuSelect from "@/app/common/components/filters/MenuSelect.vue";
import { statusOptions } from "@/components/realEstate/agent/utils";
import { colors } from "@/components/ui/utils";
import { useI18n } from "vue-i18n";

const localLoading = ref(false);
const emit = defineEmits(["update:modelValue", "onSubmit"]);

const prop = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object as PropType<CountryInsertType>,
    required: true,
  },
});

const isCreate = computed(() => prop.data.id === "-1");
const formData = ref(prop.data);

const dialogValue = computed({
  get() {
    return prop.modelValue;
  },
  set(dialog: boolean) {
    emit("update:modelValue", dialog);
  },
});

const id = ref(formData.value.id || "");
const name = ref(formData.value.name || "");
const code = ref(formData.value.code || "");
const iso2Code = ref(formData.value.iso2Code || "");
const iso3Code = ref(formData.value.iso3Code || "");
const phoneCode = ref(formData.value.phoneCode || "");
const currency = ref(formData.value.currency || "");
const currencySymbol = ref(formData.value.currencySymbol || "");
const currencyCode = ref(formData.value.currencyCode || "");

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

// Função de validação geral
const validateForm = () => {
  let isValid = true;

  // Limpa os erros antigos
  Object.keys(formErrors.value).forEach(key => {
    formErrors.value[key] = '';
  });

  if (!name.value) {
    formErrors.value.name = t('t-please-enter-name');
    isValid = false;
  }
  if (!code.value) {
    formErrors.value.code = t('t-please-enter-code');
    isValid = false;
  } else if (code.value.length < 2 || code.value.length > 10) {
    formErrors.value.code = t('t-code-must-be-between-2-and-10-chars');
    isValid = false;
  } else {
    formErrors.value.code = '';
  }

  if (!iso2Code.value) {
    formErrors.value.iso2Code = t('t-please-enter-iso2-code');
    isValid = false;
  } else if (iso2Code.value.length !== 2) {
    formErrors.value.iso2Code = t('t-iso2-must-have-2-characters');
    isValid = false;
  }

  if (!iso3Code.value) {
    formErrors.value.iso3Code = t('t-please-enter-iso3-code');
    isValid = false;
  } else if (iso3Code.value.length !== 3) {
    formErrors.value.iso3Code = t('t-iso3-must-have-3-characters');
    isValid = false;
  }

  if (!phoneCode.value) {
    formErrors.value.phoneCode = t('t-please-enter-phone-code');
    isValid = false;
  } else if (!/^\+\d{1,3}$/.test(phoneCode.value)) {
    formErrors.value.phoneCode = t('t-invalid-phone-code'); // Traduz isto no teu ficheiro pt.json
    isValid = false;
  }

  if (!currency.value) {
    formErrors.value.currency = t('t-please-enter-currency');
    isValid = false;
  }

  if (!currencySymbol.value) {
    formErrors.value.currencySymbol = t('t-please-enter-currency-symbol');
    isValid = false;
  } else if (currencySymbol.value.length < 1 || currencySymbol.value.length > 10) {
    formErrors.value.currencySymbol = t('t-currency-symbol-must-be-between-1-and-10-chars');
    isValid = false;
  } else {
    formErrors.value.currencySymbol = '';
  }

  if (!currencyCode.value) {
    formErrors.value.currencyCode = t('t-please-enter-currency-code');
    isValid = false;
  } else if (currencyCode.value.length < 2 || currencyCode.value.length > 10) {
    formErrors.value.currencyCode = t('t-currency-code-must-be-between-2-and-10-chars');
    isValid = false;
  } else {
    formErrors.value.currencyCode = '';
  }

  return isValid;
};


const onSubmit = () => {
  if (!validateForm()) {
    return;
  }

  localLoading.value = true;

  const data = {
    ...(!isCreate.value && { id: id.value }),
    name: name.value,
    code: code.value,
    iso2Code: iso2Code.value,
    iso3Code: iso3Code.value,
    phoneCode: phoneCode.value,
    currency: currency.value,
    currencySymbol: currencySymbol.value,
    currencyCode: currencyCode.value,
  };

  emit('onSubmit', data, {
    onSuccess: () => {
      dialogValue.value = false; // Fecha modal
    },
    onFinally: () => {
      localLoading.value = false; // Desativa loading
    }
  });
};

</script>
<template>
  <v-dialog v-model="dialogValue" width="500" scrollable>
    <Card :title="$t('t-view-country')" title-class="py-0" style="overflow: hidden">
      <template #title-action>
        <v-btn icon="ph-x" variant="plain" @click="dialogValue = false" />
      </template>
      <v-divider />

      <!-- <v-alert v-if="errorMsg" :text="errorMsg" variant="tonal" color="danger" class="mx-5 mt-3" density="compact" /> -->
      <v-card-text class="overflow-y-auto" :style="{
        'max-height': isCreate ? '70vh' : '45vh'
      }">
        <v-row>
          <v-col cols="12" lg="6">
            <div class="font-weight-bold text-caption mb-1">
              {{ $t('t-name') }} <i class="ph-asterisk ph-xs text-danger" />
            </div>
            <TextField v-model="name" :placeholder="$t('t-enter-name')"
              :error-messages="formErrors.name ? [formErrors.name] : []" hide-details disabled/>
            <div v-if="formErrors.name" class="text-red text-extra-small pt-1">
              {{ formErrors.name }}
            </div>
          </v-col>
          <v-col cols="12" lg="6">
            <div class="font-weight-bold text-caption mb-1">
              {{ $t('t-country-code') }} <i class="ph-asterisk ph-xs text-danger" />
            </div>
            <TextField v-model="code" :placeholder="$t('t-enter-code')"
              :error-messages="formErrors.code ? [formErrors.code] : []" hide-details disabled/>
            <div v-if="formErrors.code" class="text-red text-extra-small pt-1">
              {{ formErrors.code }}
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" lg="6">
            <div class="font-weight-bold text-caption mb-1">
              {{ $t('t-iso2Code') }} <i class="ph-asterisk ph-xs text-danger" />
            </div>
            <TextField v-model="iso2Code" :placeholder="$t('t-enter-iso2-code')"
              :error-messages="formErrors.iso2Code ? [formErrors.iso2Code] : []" hide-details disabled/>
            <div v-if="formErrors.iso2Code" class="text-red text-extra-small pt-1">
              {{ formErrors.iso2Code }}
            </div>
          </v-col>
          <v-col cols="12" lg="6">
            <div class="font-weight-bold text-caption mb-1">
              {{ $t('t-iso3Code') }} <i class="ph-asterisk ph-xs text-danger" />
            </div>
            <TextField v-model="iso3Code" :placeholder="$t('t-enter-iso3-code')"
              :error-messages="formErrors.iso3Code ? [formErrors.iso3Code] : []" hide-details disabled/>
            <div v-if="formErrors.iso3Code" class="text-red text-extra-small pt-1">
              {{ formErrors.iso3Code }}
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" lg="6">
            <div class="font-weight-bold text-caption mb-1">
              {{ $t('t-phone-code') }} <i class="ph-asterisk ph-xs text-danger" />
            </div>
            <TextField v-model="phoneCode" :placeholder="$t('t-enter-phone-code')"
              :error-messages="formErrors.phoneCode ? [formErrors.phoneCode] : []" hide-details disabled/>
            <div v-if="formErrors.phoneCode" class="text-red text-extra-small pt-1">
              {{ formErrors.phoneCode }}
            </div>
          </v-col>
          <v-col cols="12" lg="6">
            <div class="font-weight-bold text-caption mb-1">
              {{ $t('t-currency') }} <i class="ph-asterisk ph-xs text-danger" />
            </div>
            <TextField v-model="currency" :placeholder="$t('t-enter-currency')"
              :error-messages="formErrors.currency ? [formErrors.currency] : []" hide-details disabled/>
            <div v-if="formErrors.currency" class="text-red text-extra-small pt-1">
              {{ formErrors.currency }}
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" lg="6">
            <div class="font-weight-bold text-caption mb-1">
              {{ $t('t-currency-symbol') }} <i class="ph-asterisk ph-xs text-danger" />
            </div>
            <TextField v-model="currencySymbol" :placeholder="$t('t-enter-currency-symbol')"
              :error-messages="formErrors.currencySymbol ? [formErrors.currencySymbol] : []" hide-details disabled/>
            <div v-if="formErrors.currencySymbol" class="text-red text-extra-small pt-1">
              {{ formErrors.currencySymbol }}
            </div>
          </v-col>
          <v-col cols="12" lg="6">
            <div class="font-weight-bold text-caption mb-1">
              {{ $t('t-currency-code') }} <i class="ph-asterisk ph-xs text-danger" />
            </div>
            <TextField v-model="currencyCode" :placeholder="$t('t-enter-currency-code')"
              :error-messages="formErrors.currencyCode ? [formErrors.currencyCode] : []" hide-details disabled/>
            <div v-if="formErrors.currencyCode" class="text-red text-extra-small pt-1">
              {{ formErrors.currencyCode }}
            </div>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider />
      <v-card-actions class="d-flex justify-end">
        <div>
          <v-btn color="danger" class="me-1" @click="dialogValue = false">
            <i class="ph-x me-1" /> {{ $t('t-close') }}
          </v-btn>
        </div>
      </v-card-actions>
    </Card>
  </v-dialog>
</template>

<style>
.text-extra-small {
  font-size: 0.70rem;
}
</style>
