<script lang="ts" setup>
import { PropType, computed, ref } from "vue";
import { CountryInsertType } from "@/components/baseTables/country/types";
import MenuSelect from "@/app/common/components/filters/MenuSelect.vue";
import { statusOptions } from "@/components/realEstate/agent/utils";
import { colors } from "@/components/ui/utils";
import { useI18n } from "vue-i18n";

const localLoading = ref(false);
const emit = defineEmits(["update:modelValue", "onSubmit"]);
const errorMsg = ref("");

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

const isCreate = computed(() => prop.data.id === -1);
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

const { t } = useI18n();

// Função de validação geral
const validateForm = () => {
  if (!name.value) {
    errorMsg.value = t('t-please-enter-name');
    return false;
  }
  if (!code.value) {
    errorMsg.value = t('t-please-enter-code');
    return false;
  }
  if (!iso2Code.value) {
    errorMsg.value = t('t-please-enter-iso2-code');
    return false;
  }
  if (iso2Code.value.length !== 2) {
    errorMsg.value = t('t-iso2-must-have-2-characters');
    return false;
  }
  if (!iso3Code.value) {
    errorMsg.value = t('t-please-enter-iso3-code');
    return false;
  }
  if (iso3Code.value.length !== 3) {
    errorMsg.value = t('t-iso3-must-have-3-characters');
    return false;
  }
  if (!phoneCode.value) {
    errorMsg.value = t('t-please-enter-phone-code');
    return false;
  }
  if (!currency.value) {
    errorMsg.value = t('t-please-enter-currency');
    return false;
  }
  if (!currencySymbol.value) {
    errorMsg.value = t('t-please-enter-currency-symbol');
    return false;
  }
  if (!currencyCode.value) {
    errorMsg.value = t('t-please-enter-currency-code');
    return false;
  }

  return true;
};


const onSubmit = () => {
  if (!validateForm()) {
    setTimeout(() => errorMsg.value = "", 3000);
    return;
  }

  errorMsg.value = "";
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
    <Card :title="isCreate ? $t('t-add-country') : $t('t-edit-country')" title-class="py-0" style="overflow: hidden">
      <template #title-action>
        <v-btn icon="ph-x" variant="plain" @click="dialogValue = false" />
      </template>
      <v-divider />

      <v-alert v-if="errorMsg" :text="errorMsg" variant="tonal" color="danger" class="mx-5 mt-3" density="compact" />
      <v-card-text class="overflow-y-auto" :style="{
        'max-height': isCreate ? '70vh' : '45vh'
      }">
        <v-row>
          <v-col cols="12" lg="6">
            <div class="font-weight-bold text-caption mb-1">
              {{ $t('t-name') }}
            </div>
            <TextField v-model="name" :placeholder="$t('t-enter-name')" />
          </v-col>
          <v-col cols="12" lg="6">
            <div class="font-weight-bold text-caption mb-1">
              {{ $t('t-country-code') }}
            </div>
            <TextField v-model="code" :placeholder="$t('t-enter-code')" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" lg="6">
            <div class="font-weight-bold text-caption mb-1">
              {{ $t('t-iso2Code') }}
            </div>
            <TextField v-model="iso2Code" :placeholder="$t('t-enter-iso2-code')" />
          </v-col>
          <v-col cols="12" lg="6">
            <div class="font-weight-bold text-caption mb-1">
              {{ $t('t-iso3Code') }}
            </div>
            <TextField v-model="iso3Code" :placeholder="$t('t-enter-iso3-code')" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" lg="6">
            <div class="font-weight-bold text-caption mb-1">
              {{ $t('t-phone-code') }}
            </div>
            <TextField v-model="phoneCode" :placeholder="$t('t-enter-phone-code')" />
          </v-col>
          <v-col cols="12" lg="6">
            <div class="font-weight-bold text-caption mb-1">
              {{ $t('t-currency') }}
            </div>
            <TextField v-model="currency" :placeholder="$t('t-enter-currency')" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" lg="6">
            <div class="font-weight-bold text-caption mb-1">
              {{ $t('t-currency-symbol') }}
            </div>
            <TextField v-model="currencySymbol" :placeholder="$t('t-enter-currency-symbol')" />
          </v-col>
          <v-col cols="12" lg="6">
            <div class="font-weight-bold text-caption mb-1">
              {{ $t('t-currency-code') }}
            </div>
            <TextField v-model="currencyCode" :placeholder="$t('t-enter-currency-code')" />
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider />
      <v-card-actions class="d-flex justify-end">
        <div>
          <v-btn color="danger" class="me-1" @click="dialogValue = false">
            <i class="ph-x me-1" /> {{ $t('t-close') }}
          </v-btn>
          <v-btn color="primary" variant="elevated" @click="onSubmit" :loading="localLoading" :disabled="localLoading">
            {{ localLoading ? $t('t-saving') : $t('t-save') }}
          </v-btn>
        </div>
      </v-card-actions>
    </Card>
  </v-dialog>
</template>
