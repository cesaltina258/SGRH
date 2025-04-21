<script lang="ts" setup>
import { PropType, computed, ref } from "vue";
import { AgentListingType } from "@/components/baseTables/Status/types";
import ImageUploader from "@/app/common/components/ImageUploader.vue";
import MenuSelect from "@/app/common/components/filters/MenuSelect.vue";
import { statusSelectOptions } from "@/components/realEstate/agent/utils";
import { statusOption } from "@/components/realEstate/agent/utils";
import { agentListingData } from "@/components/realEstate/agent/utils";
import Status from "@/components/baseTables/Status/utils/Status.vue";

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
const status_type = ref(formData.value.status_type || "");
const color = ref(formData.value.color || "");
const select_status = ref(formData.value.select_status || "");


const onSubmit = () => {
  if (!name.value) {
    errorMsg.value = "Please enter agent name!";
  } else if (!status.value) {
    errorMsg.value = "Please select status!";
  } else if (!status_type.value) {
    errorMsg.value = "Please select status_type!";
  } else if (!color.value) {
    errorMsg.value = "Please select color!";
  }

  setTimeout(() => {
    errorMsg.value = "";
  }, 3000);

  if (
    !name.value ||
    !status.value || !select_status.value || !status_type.value 
  ) {
    return;
  }

  errorMsg.value = "";

  const data = {
    ...prop.data,
    name: name.value,
    description: description.value,
    status: status.value,
    status_type: status_type.value,
    color: color.value,
    select_status: select_status.value,
  };


  emit("onSubmit", data);
};

const agentListingDataFormatted = computed(() =>
  agentListingData.map((item) => ({
    label: item.name,
  }))
);


const corSelecionada = computed(() => {
  const selected = statusSelectOptions.find((opt) => opt.value === status.value)
  return selected ? selected.value : ''
})

</script>
<template>
  <v-dialog v-model="dialogValue" width="600" scrollable>
    <Card :title="isCreate ? $t('t-add-status') : $t('t-edit-status')" title-class="py-0" style="overflow: hidden">
      <template #title-action>
        <v-btn icon="ph-x" variant="plain" @click="dialogValue = false" />
      </template>
      <v-divider />

      <v-alert v-if="errorMsg" :text="errorMsg" variant="tonal" color="danger" class="mx-5 mt-3" density="compact" />

      <v-card-text data-simplebar>
        <v-row>
          <v-col cols="8">
            <div class="font-weight-bold text-caption mb-1">
              {{ $t('t-name') }} <i class="ph-asterisk ph-xs text-danger" />
            </div>
            <TextField v-model="name" placeholder="Enter name" />
          </v-col>
          <v-col cols="4">
            <div class="font-weight-bold text-caption mb-1">
              {{ $t('t-status-modal') }} <i class="ph-asterisk ph-xs text-danger" />
            </div>
            <MenuSelect v-model="select_status" :items="statusOption" placeholder="Enter status" />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="4">
            <div class="font-weight-bold text-caption mb-1">
              {{ $t('t-status-types') }} <i class="ph-asterisk ph-xs text-danger" />
            </div>
            <MenuSelect v-model="status_type" :items="agentListingDataFormatted" placeholder="Select status" />

          </v-col>
          <v-col cols="4">
            <div class="font-weight-bold text-caption mb-1">
              {{ $t('t-color') }} <i class="ph-asterisk ph-xs text-danger" />
            </div>
            <MenuSelect v-model="status" :items="statusSelectOptions" placeholder="Select status" />
          </v-col>
          <v-col cols="2">
            <!-- Aparência da cor do status selecionado -->
            <div class="form-group mb-15 mb-md-25 d-flex align-items-center mt-3">
              <div class="mt-5">
                <Status :status="status" />
              </div>
            </div>
          </v-col>
        </v-row>
        <div class="font-weight-bold text-caption mb-1">
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
