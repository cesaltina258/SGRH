<script lang="ts" setup>
/**
 * TabGeneralInfo - Componente para informações gerais do instituicao
 * 
 */
import { ref, computed, watch, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useToast } from 'vue-toastification';

// Components
import ImageUploader from "@/app/common/components/ImageUploader.vue";
import MenuSelect from "@/app/common/components/filters/MenuSelect.vue";

// Stores imports
import { useInstitutionStore } from '@/store/institution/institutionStore';


// Types
import { InstitutionInsertType } from "@/components/institution/types";

//Options Enums
import {
  healthPlanLimitOptions,
  salaryComponentOptions
} from "@/components/institution/create/utils";

// Configuração inicial
const { t } = useI18n();
const toast = useToast();
const router = useRouter();

// Emits e Props
const emit = defineEmits(['onStepChange', 'save']);
const props = defineProps({
  modelValue: {
    type: Object as () => InstitutionInsertType,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  enabled: {
    type: Boolean,
    default: false
  }
});

// Stores
const institutionStore = useInstitutionStore();

// Referências do formulário
const form1 = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null);

// Dados computados do employee
const institutionData = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  }
});


// Estado da UI
const errorMsg = ref("");
let alertTimeout: ReturnType<typeof setTimeout> | null = null;

// Referência reativa separada para healthPlanLimit
const healthPlanLimit = computed({
  get: () => institutionData.value.healthPlanLimit,
  set: (value) => {
    institutionData.value.healthPlanLimit = value;
    // Força a revalidação após a atualização
    nextTick(() => {
      form1.value?.validate();
    });
  }
});

// Watch para revalidar quando healthPlanLimit muda
watch(healthPlanLimit, () => {
  // Limpa qualquer valor nos campos condicionais quando o tipo muda
  if (institutionData.value.healthPlanLimit !== 'FIXED_AMOUNT') {
    institutionData.value.fixedAmount = null;
  }
  if (institutionData.value.healthPlanLimit !== 'ANUAL_SALARY') {
    institutionData.value.salaryComponent = null;
    institutionData.value.companyContributionPercentage = null;
  }

  // Força revalidação após mudança
  nextTick(() => {
    form1.value?.validate();
  });
});

/**
 * Regras de validação para os campos do formulário
 */
const requiredRules = {
  maxNumberOfDependents: [
    (v: number) => !!v || t('t-please-enter-max-dependents'),
    (v: number) => (v && v >= 0) || t('t-min-zero-dependents')
  ],
  childrenMaxAge: [
    (v: number) => !!v || t('t-please-enter-max-age'),
    (v: number) => (v && v >= 0) || t('t-min-zero-age')
  ],
  healthPlanLimit: [
    (v: string) => !!v || t('t-please-select-plan-limit')
  ],
  // Regras condicionais como funções que verificam o contexto
  fixedAmount: [
    (v: number | null) =>
      institutionData.value.healthPlanLimit !== 'FIXED_AMOUNT' ||
      !!v ||
      t('t-please-enter-fixed-amount')
  ],
  salaryComponent: [
    (v: string | null) =>
      institutionData.value.healthPlanLimit !== 'ANUAL_SALARY' ||
      !!v ||
      t('t-please-select-salary-component')
  ],
  companyContributionPercentage: [
    (v: number | null) =>
      institutionData.value.healthPlanLimit !== 'ANUAL_SALARY' ||
      !!v ||
      t('t-please-enter-company-contribution-percentage')
  ]
};

/**
 * Volta para a lista de employees
 */
const onBack = () => {
  router.push({ path: `/institution/list` });
};

/**
 * Valida e envia o formulário
 */
const submitHealthPlan = async () => {
  if (!form1.value) return;

  const { valid } = await form1.value.validate();
  if (!valid) {
    toast.error(t('t-validation-error'));
    errorMsg.value = t('t-please-correct-errors');
    alertTimeout = setTimeout(() => {
      errorMsg.value = "";
      alertTimeout = null;
    }, 5000);
    return;
  }

  // Emite o evento de save (que vai marcar basicDataValidated como true)
  emit('save', false);

};



</script>
<template>
  <v-form ref="form1" @submit.prevent="submitHealthPlan">
    <Card :title="$t('t-health-plan')" elevation="0" title-class="pb-0">
      <transition name="fade">
        <v-alert v-if="errorMsg" :text="errorMsg" type="error" class="mb-4 mx-5 mt-3" variant="tonal" color="danger"
          density="compact" @click="errorMsg = ''" style="cursor: pointer;" />
      </transition>
      <v-card-text class="pt-0 mt-3">
        <v-row class="mt-3">
          <v-col cols="12" lg="6">
            <div class="font-weight-bold mb-2">
              {{ $t('t-maximum-number-of-dependents') }}<i class="ph-asterisk ph-xs text-danger" />
            </div>
            <TextField v-model.number="institutionData.maxNumberOfDependents" 
              :placeholder="t('t-enter-maximum-number-of-dependents')" :rules="requiredRules.maxNumberOfDependents"
              type="number" class="mb-2" />
          </v-col>
          <v-col cols="12" lg="6">
            <div class="font-weight-bold mb-2">
              {{ $t('t-maximum-age-of-dependents') }} <i class="ph-asterisk ph-xs text-danger" />
            </div>
            <TextField v-model.number="institutionData.childrenMaxAge" 
              :placeholder="t('t-enter-maximum-age-of-dependents')" type="number" :rules="requiredRules.childrenMaxAge"
              class="mb-2" />
          </v-col>
        </v-row>
        <v-row class="mt-n6">
          <v-col cols="12" lg="6">
            <div class="font-weight-bold mb-2">
              {{ $t('t-health-plan-limit') }}<i class="ph-asterisk ph-xs text-danger" />
            </div>
            <MenuSelect v-model="institutionData.healthPlanLimit" :items="healthPlanLimitOptions"
              :rules="requiredRules.healthPlanLimit" />
          </v-col>
          <v-col cols="12" lg="6">
            <div class="font-weight-bold mb-2">
              {{ $t('t-fixed-amount') }} <i v-if="institutionData.healthPlanLimit === 'FIXED_AMOUNT'"
                class="ph-asterisk ph-xs text-danger" />
            </div>
            <TextField v-model.number="institutionData.fixedAmount" type="number" :placeholder="t('t-enter-fixed-amount')"
              :rules="requiredRules.fixedAmount" class="mb-2" />
          </v-col>
        </v-row>
        <v-row class="mt-n5">
          <v-col cols="12" lg="6">
            <div class="font-weight-bold mb-2">
              {{ $t('t-salary-component') }} <i v-if="institutionData.healthPlanLimit === 'ANUAL_SALARY'"
                class="ph-asterisk ph-xs text-danger" />
            </div>
            <MenuSelect v-model="institutionData.salaryComponent" :items="salaryComponentOptions"
              :rules="requiredRules.salaryComponent" />
          </v-col>
          <v-col cols="12" lg="6">
            <div class="font-weight-bold mb-2">
              {{ $t('t-company-contribuition-percentage') }}
            </div>
            <TextField v-model="institutionData.companyContributionPercentage"
              :placeholder="t('t-enter-company-contribuition-percentage')" type="number" class="mb-2" :rules="requiredRules.companyContributionPercentage" />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="d-flex justify-space-between mt-5">
        <v-btn color="primary" variant="text" @click="emit('onStepChange', 1)">
          <i class="ph-arrow-left me-2" /> {{ $t('t-back-to-general-info') }}
        </v-btn>
        <v-btn color="success" variant="elevated" @click="submitHealthPlan">
          {{ $t('t-save-and-proceed') }} <i class="ph-arrow-right ms-2" />
        </v-btn>
      </v-card-actions>
    </Card>
  </v-form>
</template>
