<script lang="ts" setup>
import { ref, computed, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { EmployeeUpdateType } from "@/components/employee/types";
import { useInstitutionStore } from '@/store/institution/institutionStore';
import { useDepartmentStore } from '@/store/institution/departmentStore';
import { usePositionStore } from '@/store/institution/positionStore';
import { InstitutionListingType } from "@/components/institution/types";
import MenuSelect from "@/app/common/components/filters/MenuSelect.vue";
import { useToast } from 'vue-toastification';

const institutionStore = useInstitutionStore();
const departmentStore = useDepartmentStore();
const positionStore = usePositionStore();

// ==============================================
// VALIDATION RULES
// ==============================================
const requiredRules = {
  institution: [
    (v: string) => !!v || t('t-please-select-institution'),
  ],
  department: [
    (v: string) => !!v || t('t-please-select-department'),
  ],
  position: [
    (v: string) => !!v || t('t-please-select-position'),
  ],
  salary: [
    (v: number) => !!v || t('t-please-enter-salary'),
    (v: number) => v > 0 || t('t-please-enter-a-valid-salary'),
  ],
}

const form2 = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null);


const emit = defineEmits(["onStepChange", "save"]);
const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const employeeData = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  }
});

const { t } = useI18n();
const errorMsg = ref("")
let alertTimeout: ReturnType<typeof setTimeout> | null = null


const saveData = async () => {
  if (!form2.value) return;

  const { valid } = await form2.value.validate();
  if (!valid) {
    errorMsg.value = t('t-please-correct-errors');
    alertTimeout = setTimeout(() => {
      errorMsg.value = "";
      alertTimeout = null;
    }, 5000);
    return;
  }
  emit('save');
};


// Computed properties
const institutions = computed(() => {
  return institutionStore.institutions.map((institution: InstitutionListingType) => ({
    value: institution.id,
    label: institution.name
  }));
});

const departments = computed(() => {
  return departmentStore.departments.map(department => ({
    value: department.id,
    label: department.name
  }));
});

const positions = computed(() => {
  return positionStore.positions.map(position => ({
    value: position.id,
    label: position.name
  }));
});

// Lifecycle hooks
onMounted(async () => {
  try {
    await institutionStore.fetchInstitutions();
  } catch (error) {
    handleError("Falha ao carregar instituições", error);
  }
});

// Watchers
watch(() => employeeData.value.company, (newInstitutionId) => {
  if (newInstitutionId) {
    departmentStore.fetchDepartments(newInstitutionId);
    employeeData.value.department = null;
    employeeData.value.position = null;
  } else {
    departmentStore.departments = [];
    positionStore.positions = [];
  }
});

watch(() => employeeData.value.department, (newDepartmentId) => {
  if (newDepartmentId) {
    positionStore.fetchPositions(newDepartmentId);
    employeeData.value.position = null;
  } else {
    positionStore.positions = [];
  }
});

// Methods
const loadMoreDepartments = () => {
  if (employeeData.value.company &&
    departmentStore.pagination.currentPage < departmentStore.pagination.totalPages - 1) {
    departmentStore.fetchDepartments(
      employeeData.value.company,
      departmentStore.pagination.currentPage + 1
    );
  }
};

const loadMorePositions = () => {
  if (employeeData.value.department &&
    positionStore.pagination.currentPage < positionStore.pagination.totalPages - 1) {
    positionStore.fetchPositions(
      employeeData.value.department,
      positionStore.pagination.currentPage + 1
    );
  }
};

const handleError = (message: string, error: any) => {
  console.error(message, error);
  errorMsg.value = message;
  alertTimeout = setTimeout(() => {
    errorMsg.value = "";
    alertTimeout = null;
  }, 5000);
};


</script>

<template>
  <v-form ref="form2" @submit.prevent="saveData">
    <Card :title="$t('t-institution-and-classification')" elevation="0" title-class="pb-0">
      <transition name="fade">
        <v-alert v-if="errorMsg" :text="errorMsg" type="error" class="mb-4 mx-5 mt-3" variant="tonal" color="danger"
          density="compact" @click="errorMsg = ''" style="cursor: pointer;" />
      </transition>

      <v-card-text class="pt-0 mt-6">
        <v-row>
          <v-col cols="12" lg="6">
            <div class="font-weight-bold mb-2">
              {{ $t('t-institution') }} <i class="ph-asterisk ph-xs text-danger" />
            </div>
            <MenuSelect v-model="employeeData.company" :items="institutions" :loading="institutionStore.loading"
              :placeholder="t('t-select-institution')" clearable :rules="requiredRules.institution"/>
          </v-col>
          <v-col cols="12" lg="6">
            <div class="font-weight-bold mb-2">
              {{ $t('t-department') }} <i class="ph-asterisk ph-xs text-danger" />
            </div>
            <MenuSelect v-model="employeeData.department" :items="departments" :loading="departmentStore.loading"
              :placeholder="t('t-select-department')" :disabled="!employeeData.company" :rules="requiredRules.department"
              @scroll-end="loadMoreDepartments" clearable />
          </v-col>
        </v-row>
        <v-row class="mt-n6">
          <v-col cols="12" lg="6">
            <div class="font-weight-bold mb-2">
              {{ $t('t-position') }} <i class="ph-asterisk ph-xs text-danger" />
            </div>
            <MenuSelect v-model="employeeData.position" :items="positions" :loading="positionStore.loading" :rules="requiredRules.position"
              :placeholder="t('t-select-position')" :disabled="!employeeData.department" @scroll-end="loadMorePositions"
              clearable />
          </v-col>
          <v-col cols="12" lg="6">
            <div class="font-weight-bold mb-2">
              {{ $t('t-base-salary') }} <i class="ph-asterisk ph-xs text-danger" />
            </div>
            <TextField v-model="employeeData.salary" isRequired :placeholder="t('t-enter-the-employee-base-salary')" :rules="requiredRules.salary"
               class="mb-2" />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="d-flex justify-space-between mt-5">
        <v-btn color="secondary" variant="outlined" class="me-2" @click="emit('onStepChange', 1)" :disabled="loading">
          {{ $t('t-back-to-general-info') }} <i class="ph-arrow-left ms-2" />
        </v-btn>

        <v-btn color="success" variant="elevated" @click="saveData" :loading="loading">
          {{ $t('t-save') }}
        </v-btn>
      </v-card-actions>
    </Card>

  </v-form>

</template>

<style scoped>
:deep(.dp__input) {
  height: 2.63rem;
}

/* Container principal */
.custom-phone-input {
  background-color: #fff;
  border: 1px solid #DDE1EF;
  border-radius: 3px;
  padding: 0;
  color: #ABABAB !important;
}

/* Acessando elementos internos com :deep() (Vue 3) */
:deep(.m-input.--has-label .m-input-input) {
  padding-left: 0 !important;
  padding-right: 0 !important;
  padding-top: 0.8rem !important;
}

:deep(.m-input.--sm .m-input-input),
:deep(.m-input.--sm .m-input-label) {
  font-size: 0.8rem !important;
  color: #ABABAB !important;

}

/* Se precisar ajustar o placeholder */
:deep(.m-input-input::placeholder) {
  font-size: 0.75rem !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Opcional: barra de progresso */
.v-alert {
  position: relative;
  overflow: hidden;
}

.v-alert::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(0, 0, 0, 0.1);
  transform: scaleX(0);
  transform-origin: left;
  animation: progressBar 5s linear forwards;
}

@keyframes progressBar {
  to {
    transform: scaleX(1);
  }
}
</style>