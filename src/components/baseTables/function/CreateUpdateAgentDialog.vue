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
  } else if (!status.value) {
    errorMsg.value = "Please select status!";
  }

  setTimeout(() => {
    errorMsg.value = "";
  }, 3000);

  if (
    !name.value ||
    !status.value
  ) {
    return;
  }

  errorMsg.value = "";

  const data = {
    ...prop.data,
    name: name.value,
    description: description.value,
    status: status.value,
  };

  emit("onSubmit", data);
};
</script>
<template>
  <v-dialog v-model="dialogValue" width="500" scrollable>
    <Card :title="isCreate ? $t('t-add-function') : $t('t-edit-function')" title-class="py-0"
      style="overflow: hidden">
      <template #title-action>
        <v-btn icon="ph-x" variant="plain" @click="dialogValue = false" />
      </template>
      <v-divider />

      <v-alert v-if="errorMsg" :text="errorMsg" variant="tonal" color="danger" class="mx-5 mt-3" density="compact" />
      <v-card-text data-simplebar>
        <div class="font-weight-bold text-caption mb-1">
          {{ $t('t-name') }} <i class="ph-asterisk ph-xs text-danger" />
        </div>
        <TextField v-model="name" placeholder="Enter name" />

        <div class="font-weight-bold text-caption mb-1">
          {{ $t('t-status-modal') }} <i class="ph-asterisk ph-xs text-danger" />
        </div>
        <MenuSelect v-model="status" :items="statusOptions" placeholder="Select status" />

        <div class="font-weight-bold text-caption mb-1 mt-3">
          {{ $t('t-description') }} 
        </div>
        <TextArea v-model="description" placeholder="Enter description" />
      </v-card-text>
      <v-divider />
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
