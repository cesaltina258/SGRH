<script lang="ts" setup>
import MenuSelect from "@/app/common/components/filters/MenuSelect.vue";
import { skillsOptions } from "@/components/pages/profileSettings/utils";
import { ref } from "vue";

const formData = ref({
  fname: "Richard",
  lname: "Marshall",
  phone: "617 219 6245",
  email: "richardmarshall@steex.com",
  dob: "06/24/2023",
  joiningDate: "10/30/2023",
  skills: ["javascript", "php"],
  city: "Phoenix",
  country: "USA",
  zip: "00012",
  description:
    "A Web Developer creates and designs different websites for clients. They are responsible for their aesthetic as well as their function. Professionals in this field may also need to be able to ensure sites are compatible with multiple types of media. Web Developers need to have a firm understanding of programming and graphical design. Having a strong resume that emphasizes these attributes makes it significantly easier to get hired as a Web Developer. As a web designer, my objective is to make a positive impact on clients, co-workers, and the Internet using my skills and experience to design compelling and attractive websites. Solving code problems. Editing & Design with designing team in the company to build perfect web designs.",
});

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
          <div class="font-weight-bold mb-1">{{$t('t-phone-number')}}</div>
          <TextField
            v-model="formData.phone"
            placeholder="Enter your Phone number"
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
          <div class="font-weight-bold mb-1">{{$t('t-date-of-birth')}}</div>
          <VueDatePicker
            v-model="formData.dob"
            :teleport="true"
            :enable-time-picker="false"
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
        <v-col cols="12" lg="6">
          <div class="font-weight-bold mb-1">{{$t('t-country')}}</div>
          <TextField
            v-model="formData.country"
            placeholder="Enter your Country"
            hide-details
          />
        </v-col>
        <v-col cols="12" lg="6">
          <div class="font-weight-bold mb-1">{{$t('t-province')}}</div>
          <TextField
            v-model="formData.city"
            placeholder="Enter your City"
            hide-details
          />
        </v-col>
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
