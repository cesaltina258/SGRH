<script lang="ts" setup>
import { PropType, computed, ref, watch } from "vue";
import type { CoveragePeriodInsertType } from "@/components/institution/types";
import { useI18n } from "vue-i18n";
import { useToast } from 'vue-toastification';

const { t } = useI18n();
const emit = defineEmits(["update:modelValue", "onSubmit"]);

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  // No CreateEditContactDialog.vue
  data: {
    type: Object as PropType<CoveragePeriodInsertType | null>,
    required: false,
    default: () => ({
      id: undefined,
      name: "",
      startDate: "",
      endDate: "",
      company: ""
    })
  },
});

const localLoading = ref(false);
const errorMsg = ref("");

// Form fields
const id = ref("");
const name = ref("");
const startDate = ref("");
const endDate = ref("");

// Watch for data changes
watch(() => props.data, (newData) => {
  if (!newData) return;
  id.value = newData.id || "";
  name.value = newData.name || "";
  startDate.value = newData.startDate || "";
  endDate.value = newData.endDate || "";
}, { immediate: true });


const isCreate = computed(() => !id.value);

const dialogValue = computed({
  get() {
    return props.modelValue;
  },
  set(value: boolean) {
    emit("update:modelValue", value);
  },
});

/**
 * Regras de validação para os campos do formulário
 */
const requiredRules = {
  name: [(v: string) => !!v || t("t-please-enter-period-name")],
  startDate: [(v: string) => !!v || t("t-please-enter-start-date")],
  endDate: [(v: string) => !!v || t("t-please-enter-end-date")],
};

const form = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null);
let alertTimeout: ReturnType<typeof setTimeout> | null = null;
const toast = useToast();

const onSubmit = async () => {
  if (!form.value) return;

  const { valid } = await form.value.validate();

  if (!valid) {
    toast.error(t('t-validation-error'));
    errorMsg.value = t('t-please-correct-errors');
    alertTimeout = setTimeout(() => {
      errorMsg.value = "";
      alertTimeout = null;
    }, 5000);
    return;
  }

  localLoading.value = true;

  const payload: CoveragePeriodInsertType = {
    id: props.data?.id,
    name: name.value,
    startDate: startDate.value,
    endDate: endDate.value,
    company: props.data?.company ?? ""
  };

  emit("onSubmit", payload, {
    onSuccess: () => dialogValue.value = false,
    onFinally: () => localLoading.value = false
  });
};
</script>
<template>
  <v-dialog v-model="dialogValue" width="500" scrollable>
    <v-form ref="form" @submit.prevent="onSubmit">
      <Card :title="isCreate ? $t('t-add-period') : $t('t-edit-period')" title-class="py-0" style="overflow: hidden">
        <template #title-action>
          <v-btn icon="ph-x" variant="plain" @click="dialogValue = false" />
        </template>

        <v-divider />

        <v-card-text class="overflow-y-auto" :style="{ 'max-height': isCreate ? '70vh' : '45vh' }">
          <v-alert v-if="errorMsg" :text="errorMsg" variant="tonal" color="danger" class="mb-4" density="compact" />
          <v-row>
            <v-col cols="12">
              <div class="font-weight-bold text-caption mb-1">
                {{ $t("t-name") }} <i class="ph-asterisk ph-xs text-danger" />
              </div>
              <TextField v-model="name" :placeholder="$t('t-enter-name')" :rules="requiredRules.name" />
            </v-col>
          </v-row>

          <v-row class="mt-n6">
            <v-col cols="12" lg="6">
              <div class="font-weight-bold text-caption mb-1">
                {{ $t("t-start-date") }} <i class="ph-asterisk ph-xs text-danger" />
              </div>
              <TextField v-model="startDate" type="date" :rules="requiredRules.startDate" />
            </v-col>
            <v-col cols="12" lg="6">
              <div class="font-weight-bold text-caption mb-1">
                {{ $t("t-end-date") }} <i class="ph-asterisk ph-xs text-danger" />
              </div>
              <TextField v-model="endDate" type="date" :rules="requiredRules.endDate" />
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider />

        <v-card-actions class="d-flex justify-end">
          <div>
            <v-btn color="danger" class="me-1" @click="dialogValue = false">
              <i class="ph-x me-1" /> {{ $t("t-close") }}
            </v-btn>
            <v-btn color="primary" variant="elevated" @click="onSubmit" :loading="localLoading"
              :disabled="localLoading">
              {{ localLoading ? $t("t-saving") : $t("t-save") }}
            </v-btn>
          </div>
        </v-card-actions>
      </Card>
    </v-form>
  </v-dialog>
</template>