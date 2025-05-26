<script lang="ts" setup>
/**
 * Institution Create/Edit Component - Main Container
 * 
 * Gerencia o fluxo de criação/edição de funcionários com duas abas:
 * 1. Informações Gerais
 * 2. Estrutura Organizacional
 * 3. Plano de Saúde
 * 4. Pessoas de Contacto
 */
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';

// Components
import ButtonNav from "@/components/institution/create/ButtonNav.vue";
import Step1 from "@/components/institution/create/TabGeneralInfo.vue";
import Step4 from "@/components/institution/create/TabContacts.vue";
import Step2 from "@/components/institution/create/TabHealthPlan.vue";
import Step3 from "@/components/institution/create/TabInteractionHistory.vue";


//Stores
import { useInstitutionStore } from '@/store/institution/institutionStore';

// Services & Types
import { InstitutionInsertType } from "../types";
import { institutionService } from "@/app/http/httpServiceProvider";

// Inicialização de stores
const institutionStore = useInstitutionStore();

// Composables
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const toast = useToast();

// Refs
const step = ref(1); // Controla a aba atual (1 ou 2)
const institutionId = ref(route.params.id); // ID do employee (null se for criação)
const loading = ref(false); // Estado de loading global
const errorMsg = ref(""); // Mensagem de erro global
let alertTimeout: ReturnType<typeof setTimeout> | null = null; // Timeout para mensagens de erro

const basicDataValidated = ref(false);

// Dados reativos do formulário
const institutionData = reactive<InstitutionInsertType>({
  // Dados da primeira tab
  name: '',
  address: '',
  phone:'',
  email: '',
  website: null,
  description: null,
  incomeTaxNumber:'',
  institutionType: null,
  
  // Dados da segunda tab
  maxNumberOfDependents: 0,
  childrenMaxAge: 0,
  healthPlanLimit: '',
  fixedAmount: null,
  salaryComponent: null,
  companyContributionPercentage: null

});

/**
 * Trata erros da API de forma consistente
 * @param error - Objeto de erro da API
 */
 const handleApiError = (error: any) => {
  // Limpa timeout anterior se existir
  if (alertTimeout) {
    clearTimeout(alertTimeout);
    alertTimeout = null;
  }

  // Mensagem de erro padrão
  let message = t('t-error-saving-employee');

  // Tratamento específico para erros da API
  if (error?.response?.data) {
    if (error.response.data.error) {
      // Erros de validação
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

  // Exibe erro no toast e no alert
  toast.error(message);
  errorMsg.value = message;

  // Configura timeout para limpar a mensagem
  alertTimeout = setTimeout(() => {
    errorMsg.value = "";
    alertTimeout = null;
  }, 5000);
};

/**
 * Carrega dados do employee quando em modo de edição
 */
onMounted(async () => {
  if (institutionId.value) {
    try {
      loading.value = true;
      const response = await institutionService.getInstitutionById(institutionId.value);

      // Atribui os dados básicos
      Object.assign(institutionData, response.data);

      // Atribui IDs para relacionamentos
      institutionData.institutionType = response.data.institutionType?.id || null;

    } catch (error) {
      toast.error(t('t-error-loading-institution'));
      console.error('Error loading institution:', error);
    } finally {
      loading.value = false;
    }
  }
});

/**
 * Muda entre as abas do formulário
 * @param value - Número da aba (1 ou 2)
 */
const onStepChange = (value: number) => {
    // Permite sempre voltar para tabs anteriores
    if (value < step.value) {
    step.value = value;
    return;
  }
  
  // No modo de edição ou quando dados básicos já foram validados, permite navegar livremente
  if (institutionId.value || basicDataValidated.value) {
    step.value = value;
    return;
  }
  
  // No modo criação, só permite avançar para a próxima tab sequencialmente
  if (value === step.value + 1) {
    step.value = value;
  }
};


/**
 * Salva os dados do employee
 * @param isFinalStep - Indica se é o passo final (salvar e sair)
 */
 const saveInstitution = async (isFinalStep: boolean = false) => {
  try {
    loading.value = true;
    errorMsg.value = "";

    let response;
    if (institutionId.value) {
      // Modo edição
      response = await institutionService.updateInstitution(institutionId.value, institutionData);
      
    } else {

      // Modo criação
      response = await institutionService.createInstitution(institutionData);
      
      if (response?.data?.id) {
        institutionId.value = response.data.id;
        basicDataValidated.value = true;
      } else {
        throw new Error(response?.error?.message || t('t-error-creating-employee'));
      }
    }

    // Feedback de sucesso
    toast.success(institutionId.value
      ? t('t-institution-updated-success')
      : t('t-institution-created-success'));

    // Redirecionamento ou próxima etapa
    if (isFinalStep) {
      await institutionStore.fetchInstitutions();
      router.push('/institution/list');
    } else {
      step.value++;
    }
  } catch (error) {
    console.error('Error saving institution:', error);
    handleApiError(error);
  } finally {
    loading.value = false;
  }
};

// Limpeza ao desmontar o componente
onBeforeUnmount(() => {
  if (alertTimeout) {
    clearTimeout(alertTimeout);
    alertTimeout = null;
  }
});


</script>
<template>
  <Card title="">
    <v-card-text>
      <ButtonNav v-model="step" class="mb-2" :institution-id="institutionId"
      :basic-data-validated="basicDataValidated" />
      <Step1 v-if="step === 1" @onStepChange="onStepChange" v-model="institutionData" @save="saveInstitution(false)" :loading="loading"  />
      <Step2 v-if="step === 2" @onStepChange="onStepChange" v-model="institutionData" @save="saveInstitution(false)" :loading="loading"/>
      <Step3 v-if="step === 3" @onStepChange="onStepChange" />
      <Step4 v-if="step === 4" @onStepChange="onStepChange"/>
    </v-card-text>
  </Card>
</template> 
