<script lang="ts" setup>
import { computed } from "vue";
import QuerySearch from "@/app/common/components/filters/QuerySearch.vue";
import MenuSelect from "@/app/common/components/filters/MenuSelect.vue";
import { statusOptions } from "@/components/institution/create/utils";

const emit = defineEmits(["update:modelValue"]);

const prop = defineProps({
  modelValue: {
    type: Object,
    default: () => {},
  },
});

const query = computed({
  get() {
    return prop.modelValue.query || "";
  },
  set(updatedQuery: string) {
    emit("update:modelValue", {
      ...prop.modelValue,
      query: updatedQuery,
    });
  },
});

const status = computed({
  get() {
    return prop.modelValue.status || "";
  },
  set(updatedStatus: string) {
    emit("update:modelValue", {
      ...prop.modelValue,
      status: updatedStatus,
    });
  },
});

const date = computed({
  get() {
    return prop.modelValue.date || "";
  },
  set(updatedDate: string) {
    emit("update:modelValue", {
      ...prop.modelValue,
      date: updatedDate,
    });
  },
});
</script>
<template>
  <v-card>
    <v-card-text>
      <v-row>
        <v-col cols="12" lg="6">
          <QuerySearch
            v-model="query"
            :placeholder="$t('t-search-for-interaction')"
          />
        </v-col>
        <v-col cols="12" sm="12" lg="lg">
          <VueDatePicker
            v-model="date"
            :teleport="true"
            :placeholder="$t('t-select-date')"
            :month-change-on-scroll="false"
            :enable-time-picker="false"
          />
        </v-col>
        <v-col cols="12" lg="2">
          <v-btn variant="tonal" class="" color="primary" block>
            <i class="ph-funnel me-1" />
            <span class="font-weight-bold"> {{$t('t-filter')}}</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
