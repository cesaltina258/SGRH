<script lang="ts" setup>
// ==============================================
// IMPORTS
// ==============================================
import { ref, computed, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useEmployeeStore } from "@/store/employeeStore";
import { useCountryStore } from "@/store/baseTables/countryStore";
import { useProvinceStore } from "@/store/baseTables/provinceStore";
import { employeeService } from "@/app/http/httpServiceProvider";
import { genderOptions, maritalStatusOptions, bloodGroupOptions, nationalityOptions } from "@/components/employee/edit/utils";
import type { EmployeeUpdateType } from "../types";
import ValidatedDatePicker from "@/app/common/components/ValidatedDatePicker.vue";
import MenuSelect from "@/app/common/components/filters/MenuSelect.vue";
import { useToast } from 'vue-toastification';
import { useI18n } from "vue-i18n";
import { CountryListingType } from "@/components/baseTables/country/types";
import { ProvinceListingType } from "@/components/baseTables/province/types";

// ==============================================
// ROUTER & ROUTE
// ==============================================
const { t } = useI18n();
const toast = useToast();
const router = useRouter();
const route = useRoute();
const employeeId = route.params.id;

// ==============================================
// STORES
// ==============================================
const employeeStore = useEmployeeStore();
const countryStore = useCountryStore();
const provinceStore = useProvinceStore();

// ==============================================
// FORM STATE
// ==============================================
const form = ref();
const employeeData = ref<EmployeeUpdateType>({
  // Inicialize com valores padrão
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
  incomeTaxNumber: '',
  socialSecurityNumber: null,
  address: '',
  country: '',
  province: '',
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
  passportExpiryDate: new Date().toISOString().split('T')[0]
  // ... outros campos
});

// ==============================================
// UI STATE
// ==============================================
const loading = ref(false);
const errorMsg = ref("");

// ==============================================
// VALIDATION RULES
// ==============================================
const requiredRules = {
  employeeNumber: [
    (v: string) => !!v || t('t-please-enter-employee-number'),
  ],
  firstName: [
    (v: string) => !!v || t('t-please-enter-employee-firstname'),
  ],
  lastName: [
    (v: string) => !!v || t('t-please-enter-lastname'),
  ],
  idCardNumber: [
    (v: string) => !!v || t('t-please-enter-id-card-number'),
    (v: string) => (v && v.length <= 30) || t('t-maximum-30-characters'),
  ],
  gender: [
    (v: string) => !!v || t('t-please-select-gender'),
  ],
  maritalStatus: [
    (v: string) => !!v || t('t-please-select-marital-status'),
  ],
  birthDate: [
    (v: Date | string) => !!v || t('t-please-enter-birth-date'),
    (v: Date | string) => {
      if (!v) return true;
      const date = new Date(v);
      const minDate = new Date();
      minDate.setFullYear(minDate.getFullYear() - 120);
      return date >= minDate || t('t-invalid-birth-date');
    }
  ],
  idCardIssuer: [
    (v: string) => !!v || t('t-please-enter-id-card-issuer'),
    (v: string) => (v && v.length <= 50) || t('t-maximum-50-characters'),
  ],
  idCardExpiryDate: [
    (v: Date | string) => !!v || t('t-please-enter-id-card-expiry-date'),
    (v: Date | string) => {
      if (!v) return true;
      const date = new Date(v);
      const minDate = new Date();
      return date >= minDate || t('t-invalid-id-card-expiry-date');
    }
  ],
  idCardIssuanceDate: [
    (v: Date | string) => !!v || t('t-please-enter-id-card-issuance-date'),
    (v: Date | string) => {
      if (!v) return true;
      const date = new Date(v);
      const minDate = new Date();
      return date <= minDate || t('t-invalid-id-card-issuance-date');
    }
  ],
  // Adicione outras regras conforme necessário
}


// Adicione esta variável para controlar se é a primeira carga
const isInitialLoad = ref(true);

watch(
  () => employeeData.value.country,
  async (newCountryId, oldCountryId) => {
    console.log('País alterado para:', newCountryId);

    // Só executa se não for a primeira carga E se o país realmente mudou
    if (!isInitialLoad.value && newCountryId !== oldCountryId) {
      if (newCountryId) {
        try {
          await provinceStore.fetchProvincesbyCountry(newCountryId);
          console.log('Províncias carregadas:', provinceStore.provincesbyCountry);
          employeeData.value.province = null; // Só reseta se o usuário mudar o país
        } catch (error) {
          console.error('Erro ao carregar províncias:', error);
          showError("Falha ao carregar províncias");
        }
      }
    }

    // Marca que a primeira carga já ocorreu
    if (isInitialLoad.value) {
      isInitialLoad.value = false;
    }
  }
);

// ==============================================
// COMPUTED PROPERTIES
// ==============================================
const countries = computed(() => {
  return countryStore.countries.map((country: CountryListingType) => ({
    value: country.id,
    label: country.name,
    meta: {
      code: country.iso2Code,
      phoneCode: country.phoneCode
    }
  }));
});

const provinces = computed(() => {
  if (!Array.isArray(provinceStore.provincesbyCountry)) return [];
  return provinceStore.provincesbyCountry.map((province: ProvinceListingType) => ({
    value: province.id,
    label: province.name,
    meta: {
      code: province.code,
      country: province.country
    }
  }));
});
// ==============================================
// LIFECYCLE HOOKS
// ==============================================
onMounted(async () => {
  try {
    await Promise.all([
      countryStore.fetchCountries(),
      loadEmployeeData()
    ]);
  } catch (error) {
    showError("Falha ao carregar dados iniciais");
  }
});

// ==============================================
// METHODS
// ==============================================
// Modifique o loadEmployeeData para carregar as províncias iniciais
const loadEmployeeData = async () => {
  loading.value = true;
  try {
    const response = await employeeService.getEmployeeById(employeeId);

    if (response.status === 'success') {
      employeeData.value = processEmployeeData(response.data);

      // Carrega as províncias do país salvo (se existir)
      if (employeeData.value.country) {
        await provinceStore.fetchProvincesbyCountry(employeeData.value.country);
      }
    }
  } catch (error) {
    showError("Falha ao carregar dados do colaborador");
  } finally {
    loading.value = false;
  }
};


const processEmployeeData = (data: any): EmployeeUpdateType => {
  return {
    ...data,
    country: data.country?.id,
    province: data.province?.id
    // ... outras datas
  };
};

const updateEmployee = async () => {
  if (!form.value) return;

  const { valid } = await form.value.validate();
  if (!valid) {
    showError('Por favor, corrija os erros destacados');
    return;
  }

  loading.value = true;
  try {
    const payload = preparePayload();
    const response = await employeeService.updateEmployee(employeeId, payload);

    if (response.status === 'success') {
      await employeeStore.fetchEmployees();
      toast.success(t('t-toast-message-created'));
      router.push('/employee/list');
    } else {
      handleApiError(response.error);
    }
  } catch (error) {
    toast.error(t('t-message-save-error'));
    handleApiError(error);
  } finally {
    loading.value = false;
  }
};

const preparePayload = () => {
  return {
    ...employeeData.value,
    birthDate: formatDateForAPI(employeeData.value.birthDate),
    // ... outras datas
  };
};

const formatDateForAPI = (dateString: string) => dateString ? new Date(dateString).toISOString() : null;

const showError = (message: string) => {
  errorMsg.value = message;
  setTimeout(() => errorMsg.value = "", 5000);
};

const handleApiError = (error: any) => {
  const message = error?.response?.data?.message || 'Erro ao atualizar colaborador';
  showError(message);
};

const onBack = () => router.push('/employee/list');


</script>
<template>
  <v-form ref="form" @submit.prevent="updateEmployee">
    <!-- Personal Information Section -->
    <Card :title="$t('t-general-information')" elevation="0" title-class="pb-0">
      <!-- Alert de erro geral -->
      <transition name="fade">
        <v-alert v-if="errorMsg" :text="errorMsg" type="error" class="mb-4 mx-5 mt-3" variant="tonal" color="danger"
          density="compact" @click="errorMsg = ''" style="cursor: pointer;" />
      </transition>

      <v-card-text class="pt-0">
        <div class="font-weight-bold mb-2 mt-5">
          {{ $t('t-employeeNumber') }} <i class="ph-asterisk ph-xs text-danger" />
        </div>
        <TextField v-model="employeeData.employeeNumber" :placeholder="$t('t-enter-employee-number')" disabled
          :rules="requiredRules.employeeNumber" />
        <v-row class="mt-n3">
          <v-col cols="12" lg="4">
            <div class="font-weight-bold mb-2 ">
              {{ $t('t-firstname') }} <i class="ph-asterisk ph-xs text-danger" />
            </div>
            <TextField v-model="employeeData.firstName" :placeholder="$t('t-enter-employee-number')" disabled
              :rules="requiredRules.firstName" />
          </v-col>
          <v-col cols="12" lg="4">
            <div class="font-weight-bold mb-2 ">
              {{ $t('t-middle-name') }}
            </div>
            <TextField v-model="employeeData.middleName" :placeholder="$t('t-enter-middle-name')" disabled />
          </v-col>
          <v-col cols="12" lg="4">
            <div class="font-weight-bold mb-2">
              {{ $t('t-lastname') }} <i class="ph-asterisk ph-xs text-danger" />
            </div>
            <TextField v-model="employeeData.lastName" :placeholder="$t('t-enter-lastname')" disabled
              :rules="requiredRules.lastName" />
          </v-col>
        </v-row>
        <v-row class="mt-n6">
          <v-col cols="12" lg="4">
            <div class="font-weight-bold mb-2">
              {{ $t('t-gender') }} <i class="ph-asterisk ph-xs text-danger" />
            </div>
            <MenuSelect v-model="employeeData.gender" :key="employeeData.gender" :items="genderOptions"
              :rules="requiredRules.gender" disabled />
          </v-col>
          <v-col cols="12" lg="4">
            <div class="font-weight-bold mb-2">
              {{ $t('t-marital-status') }}
            </div>
            <MenuSelect v-model="employeeData.maritalStatus" :items="maritalStatusOptions" disabled />
          </v-col>
          <v-col cols="12" lg="4">
            <div class="font-weight-bold mb-2">
              {{ $t('t-blood-group') }}
            </div>
            <MenuSelect v-model="employeeData.bloodGroup" :items="bloodGroupOptions" disabled />
          </v-col>
        </v-row>
        <v-row class="mt-n3">
          <v-col cols="12" lg="4">
            <div class="font-weight-bold mb-2">
              {{ $t('t-birth-date') }} <i class="ph-asterisk ph-xs text-danger" />
            </div>
            <ValidatedDatePicker v-model="employeeData.birthDate" placeholder="Select date"
              :rules="requiredRules.birthDate" disabled format="dd/MM/yyyy" />
          </v-col>
          <v-col cols="12" lg="4">
            <div class="font-weight-bold mb-2">
              {{ $t('t-place-of-birth') }}
            </div>
            <TextField v-model="employeeData.placeOfBirth" :placeholder="$t('t-enter-place-of-birth')" hide-details
              disabled />
          </v-col>
          <v-col cols="12" lg="4">
            <div class="font-weight-bold mb-2">
              {{ $t('t-nacionality') }}
            </div>
            <MenuSelect v-model="employeeData.nationality" :items="nationalityOptions" disabled />
          </v-col>
        </v-row>
        <v-row class="mt-n3">
          <v-col cols="12" lg="4">
            <div class="font-weight-bold mb-2">
              {{ $t('t-nuit') }}
            </div>
            <TextField v-model="employeeData.incomeTaxNumber" :placeholder="$t('t-enter-nuit')" hide-details disabled />
          </v-col>
          <v-col cols="12" lg="4">
            <div class="font-weight-bold mb-2">
              {{ $t('t-social-security-number') }}
            </div>
            <TextField v-model="employeeData.socialSecurityNumber" :placeholder="$t('t-enter-social-security-number')"
              hide-details disabled />
          </v-col>
          <v-col cols="12" lg="4">
            <div class="font-weight-bold mb-2">
              {{ $t('t-address') }}
            </div>
            <TextField v-model="employeeData.address" :placeholder="$t('t-enter-address')" hide-details disabled />
          </v-col>
        </v-row>
        <v-row class="">
          <v-col cols="12" lg="6">
            <div class="font-weight-bold mb-2">
              {{ $t('t-country') }}
            </div>
            <MenuSelect v-model="employeeData.country" :items="countries" :loading="countryStore.loading" disabled />
          </v-col>
          <v-col cols="12" lg="6">
            <div class="font-weight-bold mb-2">
              {{ $t('t-province') }}
            </div>
            <MenuSelect v-model="employeeData.province" :items="provinces" :loading="provinceStore.loading"
              :disabled="!employeeData.country || !Array.isArray(provinceStore.provincesbyCountry)" />
          </v-col>
        </v-row>
        <v-row class="mt-n6">
          <v-col cols="12" lg="4">
            <div class="font-weight-bold mb-2">
              {{ $t('t-postal-code') }}
            </div>
            <TextField v-model="employeeData.postalCode" :placeholder="$t('t-enter-postal-code')" hide-details />
          </v-col>
          <v-col cols="12" lg="4">
            <div class="font-weight-bold mb-2">
              {{ $t('t-email') }}
            </div>
            <TextField v-model="employeeData.email" :placeholder="$t('t-enter-email')" hide-details
              :rules="requiredRules.email" />
          </v-col>
          <v-col cols="12" lg="4">
            <div class="font-weight-bold mb-2">
              {{ $t('t-phone') }}
            </div>
            <MazPhoneNumberInput v-model="employeeData.phone" size="sm" fetchCountry
              :placeholder="$t('t-enter-phone-number')" class="custom-phone-input" />
          </v-col>
        </v-row>
        <v-row class="">
          <v-col cols="12" lg="4">
            <div class="font-weight-bold mb-2">
              {{ $t('t-mobile') }}
            </div>
            <MazPhoneNumberInput v-model="employeeData.mobile" size="sm" :placeholder="$t('t-enter-phone-number')"
              fetchCountry class="custom-phone-input" />
          </v-col>
          <v-col cols="12" lg="4">
            <div class="font-weight-bold mb-2">
              {{ $t('t-emergency-contact-name') }}
            </div>
            <TextField v-model="employeeData.emergencyContactName" :placeholder="$t('t-enter-phone-number')"
              hide-details />
          </v-col>
          <v-col cols="12" lg="4">
            <div class="font-weight-bold mb-2">
              {{ $t('t-emergency-contact-phone') }}
            </div>
            <MazPhoneNumberInput v-model="employeeData.emergencyContactPhone" size="sm"
              :placeholder="$t('t-enter-phone-number')" fetchCountry class="custom-phone-input" />
          </v-col>
        </v-row>
        <v-row class="">
          <v-col cols="12" lg="4">
            <div class="font-weight-bold mb-2">
              {{ $t('t-id-card-number') }} <i class="ph-asterisk ph-xs text-danger" />
            </div>
            <TextField v-model="employeeData.idCardNumber" :placeholder="$t('t-id-card-number')"
              :rules="requiredRules.idCardNumber" />
          </v-col>
          <v-col cols="12" lg="4">
            <div class="font-weight-bold mb-2">
              {{ $t('t-id-card-issuer') }} <i class="ph-asterisk ph-xs text-danger" />
            </div>
            <TextField v-model="employeeData.idCardIssuer" :placeholder="$t('t-enter-id-card-issuer')"
              :rules="requiredRules.idCardIssuer" />
          </v-col>
          <v-col cols="12" lg="4">
            <div class="font-weight-bold mb-2">
              {{ $t('t-id-card-expiry-date') }} <i class="ph-asterisk ph-xs text-danger" />
            </div>
            <ValidatedDatePicker v-model="employeeData.idCardExpiryDate" :teleport="true"
              :rules="requiredRules.idCardExpiryDate" :placeholder="$t('t-enter-id-card-expiry-date')"
              format="dd/MM/yyyy" />
          </v-col>
        </v-row>
        <v-row class="mt-n6">
          <v-col cols="12" lg="4">
            <div class="font-weight-bold mb-2">
              {{ $t('t-id-card-issuance-date') }} <i class="ph-asterisk ph-xs text-danger" />
            </div>
            <ValidatedDatePicker v-model="employeeData.idCardIssuanceDate" :teleport="true"
              :rules="requiredRules.idCardIssuanceDate" :placeholder="$t('t-enter-id-card-issuance-date')"
              format="dd/MM/yyyy" />
          </v-col>
          <v-col cols="12" lg="4">
            <div class="font-weight-bold mb-2">
              {{ $t('t-passport-number') }}
            </div>
            <TextField v-model="employeeData.passportNumber" :placeholder="$t('t-enter-passport-number')"
              hide-details />
          </v-col>
          <v-col cols="12" lg="4">
            <div class="font-weight-bold mb-2">
              {{ $t('t-passport-issuer') }}
            </div>
            <TextField v-model="employeeData.passportIssuer" :placeholder="$t('t-enter-passport-issuer')"
              hide-details />
          </v-col>
        </v-row>
        <v-row class="">
          <v-col cols="12" lg="6">
            <div class="font-weight-bold mb-2">
              {{ $t('t-passport-issuance-date') }}
            </div>
            <VueDatePicker v-model="employeeData.passportIssuanceDate" :teleport="true"
              :placeholder="$t('t-passport-issuance-date')" :enable-time-picker="false" format="dd/MM/yyyy" />
          </v-col>
          <v-col cols="12" lg="6">
            <div class="font-weight-bold mb-2">
              {{ $t('t-id-passport-expiry-date') }}
            </div>
            <VueDatePicker v-model="employeeData.passportExpiryDate" :teleport="true"
              :placeholder="$t('t-enter-id-passport-expiry-date')" :enable-time-picker="false" format="dd/MM/yyyy" />
          </v-col>
        </v-row>
      </v-card-text>

      <!--<v-card-actions class="d-flex justify-end mt-3">
      <v-btn color="success" variant="elevated" @click="emit('onStepChange', 2)">
        {{ $t('t-save-and-proceed') }} <i class="ph-arrow-right ms-2" />
      </v-btn>
    </v-card-actions>-->
      <v-card-actions class="d-flex justify-space-between mt-3">
        <v-btn color="secondary" variant="outlined" class="me-2" @click="onBack()">
          {{ $t('t-back') }} <i class="ph-arrow-left ms-2" />
        </v-btn>
        <v-btn color="success" variant="elevated" :loading="loading" type="submit">
          {{ $t('t-save') }} <i class="ph-floppy-disk ms-2" />
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