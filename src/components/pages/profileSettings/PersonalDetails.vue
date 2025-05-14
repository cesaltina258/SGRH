<script lang="ts" setup>
import MenuSelect from "@/app/common/components/filters/MenuSelect.vue";
import { skillsOptions } from "@/components/pages/profileSettings/utils";
import { ref } from "vue";
import { useAuthStore } from "@/store/authStore";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { watch } from "vue";

const authStore = useAuthStore();
// Para garantir reatividade, usamos storeToRefs
const { user } = storeToRefs(authStore);

const formData = ref({
  fname: "",
  lname: "",
  phone: "",
  email: "",
  dob: "07/19/2000",
  joiningDate: "09/10/2022",
  skills: [],
  city: "",
  country: "",
  zip: "",
  description: "",
});

onMounted(() => {
  if (user.value) {
    formData.value.fname = user.value.firstName || "";
    formData.value.lname = user.value.lastName || "";
    formData.value.phone = user.value.phone || "";
    formData.value.email = user.value.email || "";
    formData.value.dob = user.value.dob || "07/19/2000"; // valor padrão, se necessário
    formData.value.joiningDate = user.value.lastSucessfulLogin  || "09/10/2022";
    formData.value.city = user.value.city || "";
    formData.value.country = user.value.country || "";
    formData.value.zip = user.value.zip || "";
    formData.value.skills = user.value.skills || [];
    formData.value.description = user.value.description || "";
  }
});

watch(user, (newUser) => {
  if (newUser) {
    formData.value = {
      fname: newUser.firstName || "",
      lname: newUser.lastName || "",
      phone: newUser.phone || "",
      email: newUser.email || "",
      dob: newUser.dob || "07/19/2000",
      joiningDate: newUser.lastSucessfulLogin  || "09/10/2022",
      skills: newUser.skills || [],
      city: newUser.city || "",
      country: newUser.country || "",
      zip: newUser.zip || "",
      description: newUser.description || "",
    };
  }
}, { immediate: true }); // executa no início também

const onCancel = () => {
  formData.value = {
    fname: "",
    lname: "",
    phone: "",
    email: "",
    dob: "07/19/2000",
    joiningDate: "09/10/2022",
    skills: [],
    city: "",
    country: "",
    zip: "",
    description: "",
  };
};
</script>
<template>
  <Card :title="$t('t-personal-details')">
    <v-card-text>
      <v-row>
        <v-col cols="12" lg="6">
          <div class="font-weight-bold mb-1">{{$t('t-first-name')}}</div>
          <TextField
            v-model="formData.fname"
            placeholder="Enter your first name"
            hide-details
          />
        </v-col>
        <v-col cols="12" lg="6">
          <div class="font-weight-bold mb-1">{{$t('t-last-name')}}</div>
          <TextField
            v-model="formData.lname"
            placeholder="Enter your Last name"
            hide-details
          />
        </v-col>
        <v-col cols="12" lg="6">
          <div class="font-weight-bold mb-1">{{$t('t-email')}}</div>
          <TextField
            v-model="formData.email"
            placeholder="Enter your Email address"
            hide-details
          />
        </v-col>
        <v-col cols="12" lg="6">
          <div class="font-weight-bold mb-1">{{$t('t-joining-date')}}</div>
          <VueDatePicker
            v-model="formData.joiningDate"
            :teleport="true"
            :enable-time-picker="false"
          />
        </v-col>
      </v-row>
      <v-row>
      </v-row>
    </v-card-text>
    <v-card-actions class="d-flex justify-end">
      <div>
        <v-btn color="primary" variant="elevated"> {{$t('t-update')}} </v-btn>
        <v-btn color="danger" variant="tonal" @click="onCancel"> {{$t('t-cancel')}} </v-btn>
      </div>
    </v-card-actions>
  </Card>
</template>
