<script lang="ts" setup>
import { ref } from "vue";
const emit = defineEmits(["onStepChange"]);

const img = ref([]);
const company_participation = ref("");
const title = ref("");
const nuit = ref("");
const address = ref("");
const phone_number = ref("");
const email = ref("");
const website = ref("");

</script>
<template>
  <Card :title="$t('t-health-plan')" elevation="0" title-class="pb-0">
    <v-card-text class="pt-0 mt-3">
      <v-row class="">
        <v-col cols="12" lg="6">
          <div class="font-weight-bold mb-2">
            {{ $t('t-company-participation') }} <i class="ph-asterisk ph-xs text-danger" />
          </div>
          <TextField v-model="company_participation" isRequired placeholder="xxx" hide-details type="number"
            class="mb-2" />
        </v-col>
        <v-col cols="12" lg="6">
          <div class="font-weight-bold mb-2">
            {{ $t('t-employee-participation') }} <i class="ph-asterisk ph-xs text-danger" />
          </div>
          <TextField v-model="company_participation" isRequired placeholder="xxx" hide-details type="number"
            class="mb-2" />
        </v-col>
      </v-row>
      <v-row class="">
        <v-col cols="12" lg="6">
          <div class="font-weight-bold mb-2">
            {{ $t('t-global-limit-on-net-medical-care-salary') }} <i class="ph-asterisk ph-xs text-danger" />
          </div>
          <TextField v-model="company_participation" isRequired placeholder="xxx" hide-details type="number"
            class="mb-2" />
        </v-col>
        <v-col cols="12" lg="6">
          <div class="font-weight-bold mb-2">
            {{ $t('t-maximum-number-of-dependents') }} <i class="ph-asterisk ph-xs text-danger" />
          </div>
          <TextField v-model="company_participation" isRequired placeholder="xxx" hide-details type="number"
            class="mb-2" />
        </v-col>
      </v-row>
      <v-row class="">
        <v-col cols="12" lg="6">
          <div class="font-weight-bold mb-2">
            {{ $t('t-maximum-age-of-dependents') }} <i class="ph-asterisk ph-xs text-danger" />
          </div>
          <TextField v-model="company_participation" isRequired placeholder="xxx" hide-details type="number"
            class="mb-2" />
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions class="d-flex justify-space-between mt-5">
      <v-btn color="primary" variant="text" @click="emit('onStepChange', 2)">
        <i class="ph-arrow-left me-2" /> {{ $t('t-back-to-contact-persons') }}
      </v-btn>
      <v-btn color="success" variant="elevated" @click="emit('onStepChange', 4)">
        {{ $t('t-save-and-proceed') }} <i class="ph-arrow-right ms-2" />
      </v-btn>
    </v-card-actions>
  </Card>
</template>
