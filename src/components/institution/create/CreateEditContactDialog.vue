<script lang="ts" setup>
import { PropType, computed, ref, watch } from "vue";
import { ContactPersonInsertType } from "@/components/institution/types";
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
    type: Object as PropType<ContactPersonInsertType | null>,
    required: false,
    default: () => ({
      id: undefined,
      fullname: "",
      phone: "",
      email: "",
      company: ""
    })
  },
});

const localLoading = ref(false);
const errorMsg = ref("");

// Form fields
const id = ref("");
const fullname = ref("");
const phone = ref("");
const email = ref("");

// Watch for data changes
watch(() => props.data, (newData) => {
  if (!newData) return;
  id.value = newData.id || "";
  fullname.value = newData.fullname || "";
  phone.value = newData.phone || "";
  email.value = newData.email || "";
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
  fullname: [
    (v: string) => !!v || t('t-please-enter-fullname'),
  ],
  phone: [
    (v: string) => !!v || t('t-please-enter-phone-number'),
    (v: string) => /^[0-9+() -]*$/.test(v) || t('t-invalid-phone-numebr'),
  ],
  email: [
    (v: string) => !!v || t('t-please-enter-email-address'),
    (v: string) => /.+@.+\..+/.test(v) || t('t-invalid-email'),
  ],
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

  const payload: ContactPersonInsertType = {
    id: id.value || undefined,
    fullname: fullname.value,
    phone: phone.value,
    email: email.value,
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
    <Card :title="isCreate ? $t('t-add-contact-person') : $t('t-edit-contact-person')" title-class="py-0"
      style="overflow: hidden">
      <template #title-action>
        <v-btn icon="ph-x" variant="plain" @click="dialogValue = false" />
      </template>
      <v-divider />

      <v-alert v-if="errorMsg" :text="errorMsg" variant="tonal" color="danger" class="mx-5 mt-3" density="compact" />
      <v-card-text class="overflow-y-auto" :style="{
        'max-height': isCreate ? '70vh' : '45vh'
      }">
        <v-row class="">
          <v-col cols="12" lg="12">
            <div class="font-weight-bold text-caption mb-1">
              {{ $t('t-fullname') }} <i class="ph-asterisk ph-xs text-danger" />
            </div>
            <TextField v-model="fullname" :placeholder="$t('t-enter-fullname')" :rules="requiredRules.fullname" />
          </v-col>
        </v-row>
        <v-row class="mt-n6">
          <v-col cols="12" lg="6">
            <div class="font-weight-bold text-caption mb-1">
              {{ $t('t-phone') }} <i class="ph-asterisk ph-xs text-danger" />
            </div>
            <TextField v-model="phone" :placeholder="$t('t-enter-phone')" :rules="requiredRules.phone" />
          </v-col>
          <v-col cols="12" lg="6">
            <div class="font-weight-bold text-caption mb-1">
              {{ $t('t-email') }} <i class="ph-asterisk ph-xs text-danger" />
            </div>
            <TextField v-model="email" !isEmail :placeholder="$t('t-enter-email-form')" :rules="requiredRules.email" />
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
  </v-form>
  </v-dialog>
</template>
