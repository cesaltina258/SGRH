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


const validationAlertMessage = ref('');

let validationAlertTimeout: ReturnType<typeof setTimeout> | null = null;

const formErrors = ref<Record<string, string>>({
  name: '',
  description: '',
});

const { t } = useI18n();


const validateForm = () => {
  let isValid = true;
  const messages: string[] = [];


  Object.keys(formErrors.value).forEach(key => {
    formErrors.value[key] = '';
  });

  if (validationAlertTimeout) {
    clearTimeout(validationAlertTimeout);
    validationAlertTimeout = null;
  }
  validationAlertMessage.value = '';


  if (!name.value.trim()) {
    formErrors.value.name = t('t-please-enter-name-institution-type');
    messages.push(t('t-please-enter-name-institution-type'));
    isValid = false;
  }

  if (messages.length > 0) {
    validationAlertMessage.value = messages.join('<br/>');

    validationAlertTimeout = setTimeout(() => {
      validationAlertMessage.value = '';
      validationAlertTimeout = null;
    }, 5000);
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
      dialogValue.value = false;
      if (validationAlertTimeout) {
        clearTimeout(validationAlertTimeout);
        validationAlertTimeout = null;
      }
      validationAlertMessage.value = '';
    },
    onFinally: () => {
      localLoading.value = false;
    }
  });
};

</script>

<template>
  <v-dialog v-model="dialogValue" width="500" scrollable>
    <Card :title="isCreate ? $t('t-add-institution-type') : $t('t-edit-institution-type')" title-class="py-0"
      style="overflow: hidden">
      <template #title-action>
        <v-btn icon="ph-x" variant="plain" @click="dialogValue = false" />
      </template>
      <v-divider />

      <v-card-text class="overflow-y-auto" :style="{
        'max-height': isCreate ? '70vh' : '45vh'
      }">
        <v-alert v-if="errorMessage" :text="errorMessage" type="error" class="mb-4" variant="tonal" color="danger"
          density="compact" />

        <v-alert v-if="validationAlertMessage" :text="validationAlertMessage" type="error" class="mb-4" variant="tonal"
          color="danger" density="compact" />

        <v-row>
          <v-col cols="12" lg="12">
            <div class="font-weight-bold text-caption mb-1">
              {{ $t('t-name') }} <i class="ph-asterisk ph-xs text-danger" />
            </div>
            <TextField v-model="name" :placeholder="$t('t-enter-name')" hide-details />
          </v-col>
          <v-col cols="12" lg="12">
            <div class="font-weight-bold text-caption mb-1">
              {{ $t('t-description') }}
            </div>
            <TextArea v-model="description" :placeholder="$t('t-enter-description')" hide-details />
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