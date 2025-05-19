<script lang="ts" setup>
import { PropType, computed, ref } from "vue";
import { ProvinceInsertType } from "@/components/baseTables/country/editCountry/listView/types";
import { useI18n } from "vue-i18n";

const localLoading = ref(false);
const emit = defineEmits(["update:modelValue", "onSubmit"]);

const prop = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object as PropType<ProvinceInsertType>,
    required: true,
  },
  country: {
    type: Number,
    required: true,
  }
});

const isCreate = computed(() => prop.data.id === -1);

const formData = ref({
  ...prop.data,
  country: prop.country,
});

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

const { t } = useI18n();

// Novo sistema de erros por campo
const formErrors = ref<Record<string, string>>({
  name: '',
  code: ''
});

const validateForm = () => {
  let isValid = true;

  // Limpa erros antigos
  Object.keys(formErrors.value).forEach(key => {
    formErrors.value[key] = '';
  });

  if (!name.value) {
    formErrors.value.name = t('t-please-enter-province-name');
    isValid = false;
  }

  if (!code.value) {
  formErrors.value.code = t('t-please-enter-province-code');
  isValid = false;
} else if (code.value.length < 2 || code.value.length > 10) {
  formErrors.value.code = t('t-province-code-must-be-between-2-and-10-chars');
  isValid = false;
} else {
  formErrors.value.code = '';
}


  return isValid;
};

const onSubmit = () => {
  if (!validateForm()) return;

  localLoading.value = true;

  const data = {
    ...(!isCreate.value && { id: id.value }),
    name: name.value,
    code: code.value,
    country: prop.country,
  };

  emit('onSubmit', data, {
    onSuccess: () => {
      dialogValue.value = false;
    },
    onFinally: () => {
      localLoading.value = false;
    }
  });
};
</script>

<template>
  <v-dialog v-model="dialogValue" width="500" scrollable>
    <Card :title="isCreate ? $t('t-add-province') : $t('t-edit-province')" title-class="py-0" style="overflow: hidden">
      <template #title-action>
        <v-btn icon="ph-x" variant="plain" @click="dialogValue = false" />
      </template>

      <v-divider />

      <v-card-text class="overflow-y-auto" :style="{ 'max-height': isCreate ? '70vh' : '45vh' }">
        <v-row>
          <v-col cols="12" lg="6">
            <div class="font-weight-bold text-caption mb-1">
              {{ $t('t-name') }} <i class="ph-asterisk ph-xs text-danger" />
            </div>
            <TextField
              v-model="name"
              :placeholder="$t('t-enter-name')"
              :error-messages="formErrors.name ? [formErrors.name] : []"
              hide-details
            />
            <div v-if="formErrors.name" class="text-red text-extra-small pt-1">
              {{ formErrors.name }}
            </div>
          </v-col>

          <v-col cols="12" lg="6">
            <div class="font-weight-bold text-caption mb-1">
              {{ $t('t-province-code') }} <i class="ph-asterisk ph-xs text-danger" />
            </div>
            <TextField
              v-model="code"
              :placeholder="$t('t-enter-code')"
              :error-messages="formErrors.code ? [formErrors.code] : []"
              hide-details
            />
            <div v-if="formErrors.code" class="text-red text-extra-small pt-1">
              {{ formErrors.code }}
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
          <v-btn
            color="primary"
            variant="elevated"
            @click="onSubmit"
            :loading="localLoading"
            :disabled="localLoading"
          >
            {{ localLoading ? $t('t-saving') : $t('t-save') }}
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