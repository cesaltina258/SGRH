<script lang="ts" setup>
import { PropType, computed, ref } from "vue";
import { ProvinceInsertType } from "@/components/baseTables/country/types";
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
    type: Object as PropType<ProvinceInsertType>,
    required: true,
  },
  country: {
    type: Number,
    required: true,
  }
});

const isCreate = computed(() => prop.data.id === "-1");
const formData = ref({
  ...prop.data,
  country: prop.country // associa o ID ao formulário
});

console.log("formData", formData.value);

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
    country: prop.country,
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
    <Card :title="$t('t-view-province')" title-class="py-0" style="overflow: hidden">
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
            <TextField v-model="name" :placeholder="$t('t-enter-name')" disabled/>
          </v-col>
          <v-col cols="12" lg="6">
            <div class="font-weight-bold text-caption mb-1">
              {{ $t('t-province-code') }}
            </div>
            <TextField v-model="code" :placeholder="$t('t-enter-code')" disabled/>
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
