<script lang="ts" setup>
import { type PropType, computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const prop = defineProps({
  status_period: {
    type: String,
    default: "INACTIVE",
  },
  variant: {
    type: String as PropType<"tonal" | "elevated">,
    default: "tonal",
  },
});

// Mapeia o estado à cor e label traduzida
const chipConfig = computed(() => {
  switch (prop.status_period) {
    case "INACTIVE":
      return { color: "warning", label: t("t-inactive") };
    case "RUNNING":
      return { color: "success", label: t("t-running") };
    case "CLOSED":
      return { color: "danger", label: t("t-closed-periods") };
    default:
      return { color: "default", label: prop.status_period };
  }
});
</script>

<template>
  <v-chip
    :color="chipConfig.color"
    label
    :variant="variant"
    elevation="0"
    density="compact"
  >
    <span class="status-chip">
      {{ chipConfig.label }}
    </span>
  </v-chip>
</template>
