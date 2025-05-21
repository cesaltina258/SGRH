<script lang="ts" setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from 'vue-router';
import ButtonNav from "@/components/employee/create/ButtonNav.vue";
import Step1 from "@/components/employee/create/TabGeneralInfo.vue";
import Step2 from "@/components/employee/create/TabInstitution&Classification.vue";
import { useToast } from 'vue-toastification';
import { employeeService } from "@/app/http/httpServiceProvider";
import { useEmployeeStore } from '@/store/employeeStore';
import { useI18n } from 'vue-i18n';
import { useProvinceStore } from '@/store/baseTables/provinceStore';
import { useInstitutionStore } from '@/store/institution/institutionStore';
import { useDepartmentStore } from '@/store/institution/departmentStore';
import { usePositionStore } from '@/store/institution/positionStore';
import { EmployeeInsertType, EmployeeUpdateType } from "../types";


const provinceStore = useProvinceStore();
const institutionStore = useInstitutionStore();
const departmentStore = useDepartmentStore();
const positionStore = usePositionStore();


const props = defineProps({
  cardTitle: {
    type: String,
    default: ''
  }
});

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const toast = useToast();
const employeeStore = useEmployeeStore();

const step = ref(1);
const employeeId = ref(route.params.id);
const loading = ref(false);
const errorMsg = ref("");
let alertTimeout: ReturnType<typeof setTimeout> | null = null;

const employeeData = reactive<EmployeeInsertType>({
  // Dados da primeira tab
  employeeNumber: '',
  firstName: '',
  middleName: '',
  lastName: '',
  gender: '',
  maritalStatus: null,
  birthDate: new Date().toISOString().split('T')[0],
  bloodGroup: '',
  placeOfBirth: '',
  nationality: '',
  incomeTaxNumber: null,
  socialSecurityNumber: null,
  address: '',
  country: null,
  province: null,
  postalCode: '',
  email: '',
  phone: '',
  mobile: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  idCardNumber: null,
  idCardIssuer: '',
  idCardExpiryDate: new Date().toISOString().split('T')[0],
  idCardIssuanceDate: new Date().toISOString().split('T')[0],
  passportNumber: null,
  passportIssuer: '',
  passportIssuanceDate: new Date().toISOString().split('T')[0],
  passportExpiryDate: new Date().toISOString().split('T')[0],
  enabled: true,
  // Dados da segunda tab
  salary: null,
  company: null,
  department: null,
  position: null
});

const handleApiError = (error: any) => {
  // Limpa o timeout anterior
  if (alertTimeout) {
    clearTimeout(alertTimeout);
    alertTimeout = null;
  }

  // Determina a mensagem de erro padrão
  let message = t('t-error-saving-employee');

  if (error?.response?.data) {
    if (error.response.data.error) {
      // Erros de validação - sem timeout
      errorMsg.value = error.response.data.message;
      alertTimeout = setTimeout(() => {
        errorMsg.value = "";
        alertTimeout = null;
      }, 5000);
    }
    message = error.response.data.message || message;
  }
  // Erros gerais
  else if (error.message) {
    message = error.message;
  }

  // Mostra erro geral no toast e no alert (com timeout)
  // console.log("message:------------------------", message)
  toast.error(message);
  errorMsg.value = message;

  // Configura o timeout para limpar a mensagem após 5 segundos
  alertTimeout = setTimeout(() => {
    errorMsg.value = "";
    alertTimeout = null;
  }, 5000);
};

onMounted(async () => {
  if (employeeId.value) {
    try {
      loading.value = true;
      const response = await employeeService.getEmployeeById(employeeId.value);

      // Atribui os dados básicos
      Object.assign(employeeData, response.data);

      // Atribui apenas os IDs para country e province
      employeeData.country = response.data.country?.id || null;
      employeeData.province = response.data.province?.id || null;
      employeeData.company = response.data.company?.id  || null;
      employeeData.department = response.data.department?.id  || null;
      employeeData.position = response.data.position?.id  || null;

       //Carrega os departamentos e posições com base no company/department
       if (employeeData.company) {
        await departmentStore.fetchDepartments(employeeData.company);
      }

      if (employeeData.department) {
        await positionStore.fetchPositions(employeeData.department);
      }

      //console.log('employeeData.province-----index---------', employeeData.province);

    } catch (error) {
      toast.error(t('t-error-loading-employee'));
      console.error('Error loading employee:', error);
    } finally {
      loading.value = false;
    }
  }
});

const onStepChange = (value: number) => {
  step.value = value;
};

const saveEmployee = async (isFinalStep: boolean = false) => {
  try {
    loading.value = true;
    errorMsg.value = "";

    let response;
    if (employeeId.value) {
      // Atualização
      response = await employeeService.updateEmployee(employeeId.value, employeeData);
    } else {
      // Criação
      response = await employeeService.createEmployee(employeeData);
      console.error('Response:', response);

      // Verifica se temos um ID válido
      if (response?.data?.id) {
        employeeId.value = response.data.id;
      }
      else {
        throw new Error(response?.error?.message || t('t-error-creating-employee'));
      }

    }

    // Se chegou aqui, a operação foi bem-sucedida
    toast.success(employeeId.value
      ? t('t-employee-updated-success')
      : t('t-employee-created-success'));

    if (isFinalStep) {
      await employeeStore.fetchEmployees();
      router.push('/employee/list');
    } else {
      step.value++;
    }
  } catch (error) {
    console.error('Error saving employee--------------------------------:', error);
    handleApiError(error);
  } finally {
    loading.value = false;
  }
};

onBeforeUnmount(() => {
  if (alertTimeout) {
    clearTimeout(alertTimeout);
    alertTimeout = null;
  }
});


</script>

<template>
  <Card>
    <v-card-text>
      <ButtonNav v-model="step" class="mb-2" />

      <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4"></v-progress-linear>

      <transition name="fade">
        <v-alert v-if="errorMsg" :text="errorMsg" type="error" class="mb-4 mx-5 mt-3" variant="tonal" color="danger"
          density="compact" @click="errorMsg = ''" style="cursor: pointer; white-space: pre-line;" />
      </transition>

      <Step1 v-if="step === 1" @onStepChange="onStepChange" v-model="employeeData" @save="saveEmployee(false)"
        :loading="loading" />

      <Step2 v-if="step === 2" @onStepChange="onStepChange" v-model="employeeData" @save="saveEmployee(true)"
        :loading="loading" />
    </v-card-text>
  </Card>
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