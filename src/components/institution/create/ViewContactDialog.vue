<script lang="ts" setup>
import { PropType, computed } from "vue";
import { ContactPersonInsertType } from "@/components/institution/types";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
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

const dialogValue = computed({
  get() {
    return props.modelValue;
  },
  set(value: boolean) {
    emit("update:modelValue", value);
  },
});
</script>

<template>
  <v-dialog v-model="dialogValue" width="500" scrollable>
    <Card :title="$t('t-view-contact-person')" title-class="py-0" style="overflow: hidden">
      <template #title-action>
        <v-btn icon="ph-x" variant="plain" @click="dialogValue = false" />
      </template>

      <v-divider />

      <v-card-text class="overflow-y-auto" style="max-height: 50vh">
        <v-row>
          <v-col cols="12">
            <div class="font-weight-bold text-caption mb-1">{{ $t('t-fullname') }}</div>
            <div>{{ props.data?.fullname || '-' }}</div>
          </v-col>
        </v-row>

        <v-row class="mt-3">
          <v-col cols="12" lg="6">
            <div class="font-weight-bold text-caption mb-1">{{ $t('t-phone') }}</div>
            <div>{{ props.data?.phone || '-' }}</div>
          </v-col>
          <v-col cols="12" lg="6">
            <div class="font-weight-bold text-caption mb-1">{{ $t('t-email') }}</div>
            <div>{{ props.data?.email || '-' }}</div>
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
