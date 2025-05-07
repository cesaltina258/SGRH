<script lang="ts" setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  modelValue: [Date, String, Array],
  rules: {
    type: Array,
    default: () => [],
  },
  errorMessages: {
    type: [String, Array],
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Selecione a data'
  },
  format: {
    type: String,
    default: 'dd/MM/yyyy'
  }
});

const emit = defineEmits(['update:modelValue', 'update:error']);

const internalError = ref('');
const internalValue = ref<Date | null>(null);

// Converter valor inicial para Date
const parseDate = (value: any): Date | null => {
  if (!value) return null;
  if (value instanceof Date) return value;
  return new Date(value);
};

// Atualizar valor interno quando o prop muda
watch(() => props.modelValue, (newVal) => {
  internalValue.value = parseDate(newVal);
}, { immediate: true });

// Atualizar valor do modelo quando o datepicker muda
const handleUpdate = (value: Date | null) => {
  internalValue.value = value;
  emit('update:modelValue', value);
  validate(value);
};

const validate = (value: any) => {
  internalError.value = '';
  
  if (!props.rules || props.rules.length === 0) return true;

  for (const rule of props.rules) {
    const result = rule(value);
    if (typeof result === 'string') {
      internalError.value = result;
      emit('update:error', result);
      return false;
    }
  }

  emit('update:error', '');
  return true;
};
</script>

<template>
  <div class="validated-datetime-picker">
    <VueDatePicker
      v-model="internalValue"
      :format="format"
      :placeholder="placeholder"
      :class="{ 'error-border': internalError || errorMessages }"
      :enable-time-picker="false"
      auto-apply
      @update:model-value="handleUpdate"
      @blur="validate(internalValue)"
    >
      
    </VueDatePicker>
    
    <div v-if="internalError || errorMessages" class="error-message">
      {{ internalError || errorMessages }}
    </div>
  </div>
</template>

<style scoped>
.validated-datetime-picker {
  position: relative;
  width: 100%;
}

.error-message {
  color: #ff5252;
  font-size: 0.65rem;
  margin-top: 4px;
  margin-left: 15px;
}

.error-border :deep(.dp__input) {
  border-color: #ff5252;
}
</style>