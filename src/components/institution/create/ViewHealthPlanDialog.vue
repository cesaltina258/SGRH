<script lang="ts" setup>
import { PropType, computed, ref, watch, nextTick, onMounted } from "vue";
import { HealthPlanInsertType } from "@/components/institution/types";
import { useI18n } from "vue-i18n";
import { useToast } from 'vue-toastification';
import MenuSelect from "@/app/common/components/filters/MenuSelect.vue";
import { useCoveragePeriodStore } from "@/store/institution/periodStore";
const company = ref<string | number | null>("");


// Importa as opções do select
import {
  healthPlanLimitOptions,
  salaryComponentOptions
} from "@/components/institution/create/utils";

const { t } = useI18n();
const emit = defineEmits(["update:modelValue", "onSubmit"]);

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object as PropType<HealthPlanInsertType | null>,
    required: false,
    default: () => ({
      id: undefined,
      childrenMaxAge: 0,
      maxNumberOfDependents: 0,
      healthPlanLimit: "",
      salaryComponent: "",
      fixedAmount: null,
      companyContributionPercentage: null,
      coveragePeriod: "",
      company: ""
    }),
  },
  institutionId: {
    type: String as PropType<string | null>,
    default: null,
  },
  error: {
    type: String,
    default: ""
  },
});


const localLoading = ref(false);
const errorMsg = ref("");

const id = ref("");
const childrenMaxAge = ref(0);
const maxNumberOfDependents = ref(0);
const healthPlanLimit = ref("");
const salaryComponent = ref("");
const fixedAmount = ref<number | null>(null);
const companyContributionPercentage = ref<number | null>(null);
const coveragePeriod = ref("");
const errorMessage = computed(() => props.error);


const coveragePeriodStore = useCoveragePeriodStore();
console.log("coveragePeriodStore ===>", coveragePeriodStore)

const coveragePeriodOptions = computed(() => {
  return coveragePeriodStore.coverage_periods.map((period: {id: string, name: string})  => ({
    name: period.name,
    value: period.id,
  }));
});

watch(() => props.data, (newData) => {
  if (!newData) return;
  id.value = newData.id || "";
  childrenMaxAge.value = newData.childrenMaxAge || 0;
  maxNumberOfDependents.value = newData.maxNumberOfDependents || 0;
  healthPlanLimit.value = newData.healthPlanLimit || "";
  salaryComponent.value = newData.salaryComponent || "";
  fixedAmount.value = newData.fixedAmount ?? null;
  companyContributionPercentage.value = newData.companyContributionPercentage ?? null;
  coveragePeriod.value = newData.coveragePeriod || "";
}, { immediate: true });

watch(() => props.data, (newData) => {
  if (!newData) {
    company.value = props.institutionId ?? "";
    return;
  }
  company.value = newData.company ?? props.institutionId ?? "";
  // ...outros campos
}, { immediate: true });


onMounted(() => {
  coveragePeriodStore.fetchCoveragePeriods().then(() => {
    console.log("Todos os coverage periods carregados:", coveragePeriodStore.coverage_periods);
  });
});

const isCreate = computed(() => !id.value);

const dialogValue = computed({
  get() {
    return props.modelValue;
  },
  set(value: boolean) {
    emit("update:modelValue", value);
    if (value) {
      coveragePeriodStore.fetchCoveragePeriods();
    }
  },
});

// 🟢 Regras de validação incluindo coveragePeriod
const requiredRules = {
  coveragePeriod: [
    (v: number | null) => !!v || t('t-please-select-coverage-period')
  ],
  childrenMaxAge: [
    (v: number) => !!v || t('t-please-enter-max-age'),
    (v: number) => (v >= 0) || t('t-min-zero-age')
  ],
  maxNumberOfDependents: [
    (v: number) => !!v || t('t-please-enter-max-dependents'),
    (v: number) => (v >= 0) || t('t-min-zero-dependents')
  ],
  healthPlanLimit: [
    (v: string) => !!v || t('t-please-select-plan-limit')
  ],
  fixedAmount: [
    (v: number | null) =>
      healthPlanLimit.value !== 'FIXED_AMOUNT' || !!v || t('t-please-enter-fixed-amount')
  ],
  salaryComponent: [
    (v: string | null) =>
      healthPlanLimit.value !== 'ANUAL_SALARY' || !!v || t('t-please-select-salary-component')
  ],
  companyContributionPercentage: [
    (v: number | null) =>
      healthPlanLimit.value !== 'ANUAL_SALARY' || !!v || t('t-please-enter-company-contribution-percentage')
  ]
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

  const payload: HealthPlanInsertType = {
    id: id.value || undefined,
    childrenMaxAge: childrenMaxAge.value,
    maxNumberOfDependents: maxNumberOfDependents.value,
    healthPlanLimit: healthPlanLimit.value,
    salaryComponent: salaryComponent.value,
    fixedAmount: fixedAmount.value ?? 0,
    companyContributionPercentage: companyContributionPercentage.value ?? 0,
    coveragePeriod: typeof coveragePeriod.value === 'object' ? (coveragePeriod as any).value.id : coveragePeriod.value,
    company: company.value ?? 0
  };

  console.log("🚀 Dados a enviar:", JSON.stringify(payload, null, 2));

  emit("onSubmit", payload, {
    onSuccess: () => dialogValue.value = false,
    onFinally: () => localLoading.value = false
  });
};
</script>

<template>
  <v-dialog v-model="dialogValue" width="600" scrollable>
    <v-form ref="form" @submit.prevent="onSubmit">
      <Card :title="isCreate ? $t('t-add-health-plan') : $t('t-edit-health-plan')" title-class="py-0">
        <template #title-action>
          <v-btn icon="ph-x" variant="plain" @click="dialogValue = false" />
        </template>
        <v-divider />

        <v-card-text class="overflow-y-auto" style="max-height: 70vh;">
          <v-alert v-if="errorMessage" :text="errorMessage" variant="tonal" color="danger" class="mb-4"
            density="compact" type="error" />
          <v-alert v-if="errorMsg" :text="errorMsg" variant="tonal" color="danger" class="mb-4" density="compact"
            type="error" />

          <!-- 1ª linha -->
          <v-row>
            <v-col cols="12" lg="6">
              <div class="font-weight-bold text-caption mb-1">
                {{ $t('t-children-max-age') }} <i class="ph-asterisk ph-xs text-danger" />
              </div>
              <TextField v-model="childrenMaxAge" type="number" :rules="requiredRules.childrenMaxAge"
                :placeholder="$t('t-enter-children-max-age')" disabled/>
            </v-col>

            <v-col cols="12" lg="6">
              <div class="font-weight-bold text-caption mb-1">
                {{ $t('t-max-number-of-dependents') }} <i class="ph-asterisk ph-xs text-danger" />
              </div>
              <TextField v-model="maxNumberOfDependents" type="number" :rules="requiredRules.maxNumberOfDependents"
                :placeholder="$t('t-enter-max-number-of-dependents')" disabled/>
            </v-col>
          </v-row>

          <!-- 2ª linha -->
          <v-row class="mt-n6">
            <v-col cols="12" lg="6">
              <div class="font-weight-bold text-caption mb-1">
                {{ $t('t-health-plan-limit') }} <i class="ph-asterisk ph-xs text-danger" />
              </div>
              <MenuSelect v-model="healthPlanLimit" :items="healthPlanLimitOptions"
                :rules="requiredRules.healthPlanLimit" :placeholder="$t('t-select-health-plan-limit')" disabled/>
            </v-col>

            <v-col cols="12" lg="6">
              <div class="font-weight-bold text-caption mb-1">
                {{ $t('t-fixed-amount') }}
                <i v-if="healthPlanLimit === 'FIXED_AMOUNT'" class="ph-asterisk ph-xs text-danger"  />
              </div>
              <TextField v-model="fixedAmount" type="number" :rules="requiredRules.fixedAmount"
                :placeholder="$t('t-enter-fixed-amount')" disabled/>
            </v-col>
          </v-row>

          <!-- 3ª linha -->
          <v-row class="mt-n6">
            <v-col cols="12" lg="6">
              <div class="font-weight-bold text-caption mb-1">
                {{ $t('t-salary-component') }}
                <i v-if="healthPlanLimit === 'ANUAL_SALARY'" class="ph-asterisk ph-xs text-danger" />
              </div>
              <MenuSelect v-model="salaryComponent" :items="salaryComponentOptions"
                :rules="requiredRules.salaryComponent" :placeholder="$t('t-select-salary-component')" disabled/>
            </v-col>

            <v-col cols="12" lg="6">
              <div class="font-weight-bold text-caption mb-1">
                {{ $t('t-company-contribution-percentage') }}
                <i v-if="healthPlanLimit === 'ANUAL_SALARY'" class="ph-asterisk ph-xs text-danger" />
              </div>
              <TextField v-model="companyContributionPercentage" type="number"
                :rules="requiredRules.companyContributionPercentage"
                :placeholder="$t('t-enter-company-contribution-percentage')" disabled/>
            </v-col>
          </v-row>

          <!-- 4ª linha -->
          <v-row class="mt-n6">
            <v-col cols="12" lg="12">
              <div class="font-weight-bold text-caption mb-1">
                {{ $t('t-period') }}
              </div>
              <MenuSelect v-model="coveragePeriod" :items="coveragePeriodOptions" item-title="name" item-value="value"
                :placeholder="$t('t-select-coverage-period')" disabled/>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider />

        <v-card-actions class="d-flex justify-end">
          <v-btn color="danger" class="me-1" @click="dialogValue = false">
            <i class="ph-x me-1" /> {{ $t('t-close') }}
          </v-btn>
        </v-card-actions>
      </Card>
    </v-form>
  </v-dialog>
</template>
