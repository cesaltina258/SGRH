<script lang="ts" setup>
import { PropType, computed, ref } from "vue";
import { HospitalProcedureTypeInsert } from "@/components/baseTables/hospitalProcedureType/types";
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
    type: Object as PropType<HospitalProcedureTypeInsert>,
    required: true,
  },
  error: {
    type: String,
    default: "",
  }
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
const description = ref(formData.value.description || "");
const errorMessage = computed(() => prop.error);

const formErrors = ref<Record<string, string>>({
  name: '',
  description: '',
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
    formErrors.value.name = t('t-please-enter-leave-reason');
    isValid = false;
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
    description: description.value,
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
    <Card :title="isCreate ? $t('t-add-leave-reason') : $t('t-edit-leave-reason')" title-class="py-0"
      style="overflow: hidden">
      <template #title-action>
        <v-btn icon="ph-x" variant="plain" @click="dialogValue = false" />
      </template>
      <v-divider />

      <!-- <v-alert v-if="errorMsg" :text="errorMsg" variant="tonal" color="danger" class="mx-5 mt-3" density="compact" /> -->
      <v-card-text class="overflow-y-auto" :style="{
        'max-height': isCreate ? '70vh' : '45vh'
      }">
        <v-alert v-if="errorMessage" :text="errorMessage" type="error" class="mb-4" variant="tonal" color="danger"
          density="compact" />

        <v-row>
          <v-col cols="12" lg="12">
            <div class="font-weight-bold text-caption mb-1">
              {{ $t('t-reason') }} <i class="ph-asterisk ph-xs text-danger" />
            </div>
            <TextField v-model="name" :placeholder="$t('t-enter-reason')"
              :error-messages="formErrors.name ? [formErrors.name] : []" hide-details />
            <div v-if="formErrors.name" class="text-red text-extra-small pt-1">
              {{ formErrors.name }}
            </div>
          </v-col>
          <v-col cols="12" lg="12">
            <div class="font-weight-bold text-caption mb-1">
              {{ $t('t-description') }}
            </div>
            <TextArea v-model="description" :placeholder="$t('t-enter-description')"
              :error-messages="formErrors.description ? [formErrors.description] : []" hide-details />
            <div v-if="formErrors.description" class="text-red text-extra-small pt-1">
              {{ formErrors.description }}
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
          <v-btn color="primary" variant="elevated" @click="onSubmit" :loading="localLoading" :disabled="localLoading">
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
