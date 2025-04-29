<script lang="ts" setup>
import { ref } from "vue";
import { genderOptions, maritalStatusOptions, bloodGroupOptions } from "@/components/employee/create/utils";
import { nationalityOptions } from "@/components/employee/create/utils";
import MenuSelect from "@/app/common/components/filters/MenuSelect.vue";
import { borderedCard } from "@/components/ui/cards/utils";
import BorderedCard from "@/components/ui/cards/BorderedCard.vue";
import { id } from "@/assets/images/flags/utils";

const emit = defineEmits(["onStepChange"]);


const employeeNumber = ref("");
const firstName = ref("");
const middleName = ref("");
const lastName = ref("");
const gender = ref("");
const maritalStatus = ref("");
const birthDate = ref(new Date());
const bloodGroup = ref("");
const placeOfBirth = ref("");
const nationality = ref("");
const incomeTaxNumber = ref("");
const socialSecurityNumber = ref("");
const address = ref("");
const cityId = ref("");
const province = ref("");
const countryId = ref("");
const postalCode = ref("");
const email = ref("");
const phone = ref("");
const mobile = ref("");
const emergencyContactName = ref("");
const emergencyContactPhone = ref("");
const idCardNumber = ref("");
const idCardIssuer = ref("");
const idCardExpiryDate = ref(new Date());
const idCardIssuanceDate = ref(new Date());
const passportNumber = ref("");
const passportIssuer = ref("");
const passportIssuanceDate = ref(new Date());
const passportExpiryDate = ref(new Date());

</script>

<template>
  <Card :title="$t('t-general-information')" elevation="0" title-class="pb-0">
    <v-card-text class="pt-0">
      <div class="font-weight-bold mb-2 mt-5">
        {{ $t('t-employeeNumber') }} <i class="ph-asterisk ph-xs text-danger" />
      </div>
      <TextField v-model="employeeNumber" :placeholder="$t('t-enter-employee-number')" />
      <v-row class="mt-n3">
        <v-col cols="12" lg="4">
          <div class="font-weight-bold mb-2 ">
            {{ $t('t-firstname') }} <i class="ph-asterisk ph-xs text-danger" />
          </div>
          <TextField v-model="firstName" :placeholder="$t('t-enter-firstname')" />
        </v-col>
        <v-col cols="12" lg="4">
          <div class="font-weight-bold mb-2 ">
            {{ $t('t-middle-name') }} <i class="ph-asterisk ph-xs text-danger" />
          </div>
          <TextField v-model="middleName" :placeholder="$t('t-enter-middle-name')" />
        </v-col>
        <v-col cols="12" lg="4">
          <div class="font-weight-bold mb-2">
            {{ $t('t-lastname') }} <i class="ph-asterisk ph-xs text-danger" />
          </div>
          <TextField v-model="lastName" :placeholder="$t('t-enter-lastname')" />
        </v-col>
      </v-row>
      <v-row class="mt-n6">
        <v-col cols="12" lg="4">
          <div class="font-weight-bold mb-2">
            {{ $t('t-gender') }} <i class="ph-asterisk ph-xs text-danger" />
          </div>
          <MenuSelect v-model="gender" :items="genderOptions" />
        </v-col>
        <v-col cols="12" lg="4">
          <div class="font-weight-bold mb-2">
            {{ $t('t-marital-status') }} <i class="ph-asterisk ph-xs text-danger" />
          </div>
          <MenuSelect v-model="maritalStatus" :items="maritalStatusOptions" />
        </v-col>
        <v-col cols="12" lg="4">
          <div class="font-weight-bold mb-2">
            {{ $t('t-blood-group') }} <i class="ph-asterisk ph-xs text-danger" />
          </div>
          <MenuSelect v-model="bloodGroup" :items="bloodGroupOptions" />
        </v-col>
      </v-row>
      <v-row class="">
        <v-col cols="12" lg="4">
          <div class="font-weight-bold mb-2">
            {{ $t('t-birth-date') }} <i class="ph-asterisk ph-xs text-danger" />
          </div>
          <VueDatePicker
            v-model="birthDate"
            :teleport="true"
            placeholder="Select date"
            :enable-time-picker="false"
            format="dd/MM/yyyy"
          />
        </v-col>
        <v-col cols="12" lg="4">
          <div class="font-weight-bold mb-2">
            {{ $t('t-place-of-birth') }} <i class="ph-asterisk ph-xs text-danger" />
          </div>
          <TextField v-model="placeOfBirth" :placeholder="$t('t-enter-place-of-birth')" hide-details />
        </v-col>
        <v-col cols="12" lg="4">
          <div class="font-weight-bold mb-2">
            {{ $t('t-nacionality') }} <i class="ph-asterisk ph-xs text-danger" />
          </div>
          <MenuSelect v-model="nationality" :items="nationalityOptions" />
        </v-col>
      </v-row>
      <v-row class="mt-n3">
        <v-col cols="12" lg="4">
          <div class="font-weight-bold mb-2">
            {{ $t('t-nuit') }} <i class="ph-asterisk ph-xs text-danger" />
          </div>
          <TextField v-model="incomeTaxNumber" :placeholder="$t('t-enter-nuit')" hide-details />
        </v-col>
        <v-col cols="12" lg="4">
          <div class="font-weight-bold mb-2">
            {{ $t('t-social-security-number') }} <i class="ph-asterisk ph-xs text-danger" />
          </div>
          <TextField v-model="socialSecurityNumber" :placeholder="$t('t-enter-social-security-number')" hide-details />
        </v-col>
        <v-col cols="12" lg="4">
          <div class="font-weight-bold mb-2">
            {{ $t('t-address') }} <i class="ph-asterisk ph-xs text-danger" />
          </div>
          <TextField v-model="address" :placeholder="$t('t-enter-address')" hide-details />
        </v-col>
      </v-row>
      <v-row class="">
        <v-col cols="12" lg="4">
          <div class="font-weight-bold mb-2">
            {{ $t('t-country') }} <i class="ph-asterisk ph-xs text-danger" />
          </div>
          <MenuSelect v-model="countryId" :items="propertyTypes" />
        </v-col>
        <v-col cols="12" lg="4">
          <div class="font-weight-bold mb-2">
            {{ $t('t-province') }} <i class="ph-asterisk ph-xs text-danger" />
          </div>
          <MenuSelect v-model="province" :items="propertyTypes" />
        </v-col>
        <v-col cols="12" lg="4">
          <div class="font-weight-bold mb-2">
            {{ $t('t-city') }} <i class="ph-asterisk ph-xs text-danger" />
          </div>
          <MenuSelect v-model="cityId" :items="propertyTypes" />
        </v-col>
      </v-row>
      <v-row class="">
        <v-col cols="12" lg="4">
          <div class="font-weight-bold mb-2">
            {{ $t('t-postal-code') }} <i class="ph-asterisk ph-xs text-danger" />
          </div>
          <TextField v-model="postalCode" :placeholder="$t('t-enter-postal-code')" hide-details />
        </v-col>
        <v-col cols="12" lg="4">
          <div class="font-weight-bold mb-2">
            {{ $t('t-email') }} <i class="ph-asterisk ph-xs text-danger" />
          </div>
          <TextField v-model="email" :placeholder="$t('t-enter-email')" hide-details />
        </v-col>
        <v-col cols="12" lg="4">
          <div class="font-weight-bold mb-2">
            {{ $t('t-phone') }} <i class="ph-asterisk ph-xs text-danger" />
          </div>
          <MazPhoneNumberInput v-model="phone" default-country-code="MZ" size="sm" :placeholder="$t('t-enter-phone-number')"
            :showCodeOnList="false" :no-example="true" class="custom-phone-input" />
        </v-col>
      </v-row>
      <v-row class="">
        <v-col cols="12" lg="4">
          <div class="font-weight-bold mb-2">
            {{ $t('t-mobile') }} <i class="ph-asterisk ph-xs text-danger" />
          </div>
          <MazPhoneNumberInput v-model="mobile" default-country-code="MZ" size="sm" :placeholder="$t('t-enter-phone-number')"
            :showCodeOnList="false" :no-example="true" class="custom-phone-input" />
        </v-col>
        <v-col cols="12" lg="4">
          <div class="font-weight-bold mb-2">
            {{ $t('t-emergency-contact-name') }} <i class="ph-asterisk ph-xs text-danger" />
          </div>
          <TextField v-model="emergencyContactName" :placeholder="$t('t-enter-phone-number')" hide-details />
        </v-col>
        <v-col cols="12" lg="4">
          <div class="font-weight-bold mb-2">
            {{ $t('t-emergency-contact-phone') }} <i class="ph-asterisk ph-xs text-danger" />
          </div>
          <MazPhoneNumberInput v-model="emergencyContactPhone" default-country-code="MZ" size="sm" :placeholder="$t('t-enter-phone-number')"
            :showCodeOnList="false" :no-example="true" class="custom-phone-input" />
        </v-col>
      </v-row>
      <v-row class="">
        <v-col cols="12" lg="4">
          <div class="font-weight-bold mb-2">
            {{ $t('t-id-card-number') }} <i class="ph-asterisk ph-xs text-danger" />
          </div>
          <TextField v-model="idCardNumber" :placeholder="$t('t-enter-phone-number')" hide-details />
        </v-col>
        <v-col cols="12" lg="4">
          <div class="font-weight-bold mb-2">
            {{ $t('t-id-card-issuer') }} <i class="ph-asterisk ph-xs text-danger" />
          </div>
          <TextField v-model="idCardIssuer" :placeholder="$t('t-enter-id-card-issuer')" hide-details />
        </v-col>
        <v-col cols="12" lg="4">
          <div class="font-weight-bold mb-2">
            {{ $t('t-id-card-expiry-date') }} <i class="ph-asterisk ph-xs text-danger" />
          </div>
          <VueDatePicker
            v-model="idCardExpiryDate"
            :teleport="true"
            :placeholder="$t('t-enter-id-card-expiry-date')"
            :enable-time-picker="false"
            format="dd/MM/yyyy"
          />
        </v-col>
      </v-row>
      <v-row class="">
        <v-col cols="12" lg="4">
          <div class="font-weight-bold mb-2">
            {{ $t('t-id-card-issuance-date') }} <i class="ph-asterisk ph-xs text-danger" />
          </div>
          <VueDatePicker
            v-model="idCardIssuanceDate"
            :teleport="true"
            :placeholder="$t('t-enter-id-card-issuance-date')"
            :enable-time-picker="false"
            format="dd/MM/yyyy"
          />
        </v-col>
        <v-col cols="12" lg="4">
          <div class="font-weight-bold mb-2">
            {{ $t('t-passport-number') }} <i class="ph-asterisk ph-xs text-danger" />
          </div>
          <TextField v-model="passportNumber" :placeholder="$t('t-enter-passport-number')" hide-details />
        </v-col>
        <v-col cols="12" lg="4">
          <div class="font-weight-bold mb-2">
            {{ $t('t-passport-issuer') }} <i class="ph-asterisk ph-xs text-danger" />
          </div>
          <TextField v-model="passportIssuer" :placeholder="$t('t-enter-passport-issuer')" hide-details />
        </v-col>
      </v-row>
      <v-row class="">
        <v-col cols="12" lg="6">
          <div class="font-weight-bold mb-2">
            {{ $t('t-passport-issuance-date') }} <i class="ph-asterisk ph-xs text-danger" />
          </div>
          <VueDatePicker
            v-model="passportIssuanceDate"
            :teleport="true"
            :placeholder="$t('t-passport-issuance-date')"
            :enable-time-picker="false"
            format="dd/MM/yyyy"
          />
        </v-col>
        <v-col cols="12" lg="6">
          <div class="font-weight-bold mb-2">
            {{ $t('t-id-passport-expiry-date') }} <i class="ph-asterisk ph-xs text-danger" />
          </div>
          <VueDatePicker
            v-model="passportExpiryDate"
            :teleport="true"
            :placeholder="$t('t-enter-id-passport-expiry-date')"
            :enable-time-picker="false"
            format="dd/MM/yyyy"
          />
        </v-col>
      </v-row>
    </v-card-text>


    <v-card-actions class="d-flex justify-end mt-3">
      <v-btn color="success" variant="elevated" @click="emit('onStepChange', 2)">
        {{ $t('t-save-and-proceed') }} <i class="ph-arrow-right ms-2" />
      </v-btn>
    </v-card-actions>
  </Card>
</template>

<style scoped>
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
</style>