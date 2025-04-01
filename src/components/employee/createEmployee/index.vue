<script lang="ts" setup>
import { ref } from "vue";
import ButtonNav from "@/components/institution/createInstitution/ButtonNav.vue";
import Step1 from "@/components/institution/createInstitution/TabGeneralInfo.vue";
import Step2 from "@/components/institution/createInstitution/TabContacts.vue";
import Step3 from "@/components/institution/createInstitution/TabHealthPlan.vue";
import Step4 from "@/components/institution/createInstitution/TabInteractionHistory.vue";
const step = ref(1);

const onStepChange = (value: number) => {
  step.value = value;
};
</script>
<template>
  <Card title="">
    <v-card-text>
      <ButtonNav v-model="step" class="mb-2" />
      <Step1 v-if="step === 1" @onStepChange="onStepChange" />
      <Step2 v-if="step === 2" @onStepChange="onStepChange" />
      <Step3 v-if="step === 3" @onStepChange="onStepChange" />
      <Step4 v-if="step === 4" @onStepChange="onStepChange"/>
    </v-card-text>
  </Card>
</template>
