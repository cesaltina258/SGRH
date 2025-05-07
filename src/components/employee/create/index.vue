<script lang="ts" setup>
import { ref } from "vue";
import ButtonNav from "@/components/employee/create/ButtonNav.vue";
import Step1 from "@/components/employee/create/TabGeneralInfo.vue";
import Step2 from "@/components/employee/create/TabHealthPlan.vue";
import { useRoute } from 'vue-router';
const step = ref(1);

const onStepChange = (value: number) => {
  step.value = value;
};

const route = useRoute();
const employeeId = ref(route.params.id);

</script>
<template>
  <Card title="">
    <v-card-text>
      <ButtonNav v-model="step" class="mb-2" />
      <Step1 v-if="step === 1" @onStepChange="onStepChange" />
      <Step2 v-if="step === 2" @onStepChange="onStepChange" />
    </v-card-text>
  </Card>
</template>
