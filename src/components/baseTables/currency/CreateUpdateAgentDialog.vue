<script lang="ts" setup>
import { PropType, computed, ref } from "vue";
import { AgentListingType } from "@/components/realEstate/agent/types";
import ImageUploader from "@/app/common/components/ImageUploader.vue";
import MenuSelect from "@/app/common/components/filters/MenuSelect.vue";
import { statusOptions } from "@/components/realEstate/agent/utils";

const emit = defineEmits(["update:modelValue", "onSubmit"]);
const errorMsg = ref("");

const prop = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object as PropType<AgentListingType>,
    required: true,
  },
});

const isCreate = prop.data.id === -1;
const formData = ref(prop.data);

const dialogValue = computed({
  get() {
    return prop.modelValue;
  },
  set(dialog: boolean) {
    emit("update:modelValue", dialog);
  },
});

const name = ref(formData.value.name || "");
const description = ref(formData.value.description || "");
const status = ref(formData.value.status || "");

const onSubmit = () => {
  if (!name.value) {
    errorMsg.value = "Please enter agent name!";
  } else if (!description.value) {
    errorMsg.value = "Please select symbol!";
  }else if (!status.value) {
    errorMsg.value = "Please select status!";
  }

  setTimeout(() => {
    errorMsg.value = "";
  }, 3000);

  if (!name.value || !description.value || !status.value) {
    return;
  }

  errorMsg.value = "";

  const data = {
    ...prop.data,
    name: name.value,
    description: description.value, // opcional
    status: status.value,
  };

  emit("onSubmit", data);
};
</script>
<template>
  <v-dialog v-model="dialogValue" width="500" scrollable>
    <Card :title="isCreate ? $t('t-add-currency') : $t('t-edit-currency')" title-class="py-0" style="overflow: hidden">
      <template #title-action>
        <v-btn icon="ph-x" variant="plain" @click="dialogValue = false" />
      </template>
      <v-divider />

      <v-alert v-if="errorMsg" :text="errorMsg" variant="tonal" color="danger" class="mx-5 mt-3" density="compact" />
      <v-card-text data-simplebar>
        <v-row>
          <v-col cols="12">
            <div class="font-weight-bold text-caption mb-1">
              {{ $t('t-currency-name') }} <i class="ph-asterisk ph-xs text-danger" />
            </div>
            <TextField v-model="name" placeholder="Enter name" />
          </v-col>
          <v-col cols="6">
            <div class="font-weight-bold text-caption mb-1">
              {{ $t('t-symbol') }} <i class="ph-asterisk ph-xs text-danger" />
            </div>
            <TextField v-model="description" placeholder="Enter symbol" />
          </v-col>
          <v-col cols="6">
            <div class="font-weight-bold text-caption mb-1">
              {{ $t('t-status-modal') }} <i class="ph-asterisk ph-xs text-danger" />
            </div>
            <MenuSelect v-model="status" :items="statusOptions" placeholder="Select status" />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <div>
          <v-btn color="danger" class="me-1">
            <i class="ph-x me-1" /> Close
          </v-btn>
          <v-btn color="primary" variant="elevated" @click="onSubmit">
            {{ isCreate ? $t('t-add') : $t('t-update') }}

          </v-btn>
        </div>
      </v-card-actions>
    </Card>
  </v-dialog>
</template>
