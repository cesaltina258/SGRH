<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import ImageUploader from "@/app/common/components/ImageUploader.vue";
import { propertyTypes } from "@/components/realEstate/grid/utils";
import MenuSelect from "@/app/common/components/filters/MenuSelect.vue";

const emit = defineEmits(["onStepChange"]);

const img = ref([]);
const type = ref("");
const title = ref("");
const nuit = ref("");
const address = ref("");
const phone_number = ref("");
const email = ref("");
const website = ref("");


const router = useRouter();

const onBack = () => {
  router.push({ path: `/institution/list` });
};

</script>

<template>
  <Card :title="$t('t-general-information')" elevation="0" title-class="pb-0">
    <v-card-text class="pt-0">
      <div class="font-weight-bold mb-2 mt-5">
        {{ $t('t-institution-name') }} <i class="ph-asterisk ph-xs text-danger" />
      </div>
      <TextField v-model="title" :placeholder="$t('t-enter-institution-name')" />
      <v-row class="">
        <v-col cols="12" lg="6">
          <div class="font-weight-bold mb-2">
            {{ $t('t-institution-type') }} <i class="ph-asterisk ph-xs text-danger" />
          </div>
          <MenuSelect v-model="type" :items="propertyTypes" />
        </v-col>
        <v-col cols="12" lg="6">
          <div class="font-weight-bold mb-2">
            NUIT <i class="ph-asterisk ph-xs text-danger" />
          </div>
          <TextField v-model="nuit" :placeholder="$t('t-enter-nuit')" hide-details />
        </v-col>
      </v-row>
      <v-row class="mt-n6">
        <v-col cols="12" lg="6">
          <div class="font-weight-bold mb-2">
            {{ $t('t-address') }} <i class="ph-asterisk ph-xs text-danger" />
          </div>
          <TextField v-model="address" :placeholder="$t('t-enter-address')" hide-details />
        </v-col>
        <v-col cols="12" lg="6">
          <div class="font-weight-bold mb-2">
            {{ $t('t-phone-number') }} <i class="ph-asterisk ph-xs text-danger" />
          </div>
          <TextField v-model="phone_number" :placeholder="$t('t-enter-phone-number')" hide-details />
        </v-col>
      </v-row>
      <v-row class="">
        <v-col cols="12" lg="6">
          <div class="font-weight-bold mb-2">
            {{ $t('t-email') }} <i class="ph-asterisk ph-xs text-danger" />
          </div>
          <TextField v-model="email" :placeholder="$t('t-enter-email-address')" hide-details />
        </v-col>
        <v-col cols="12" lg="6">
          <div class="font-weight-bold mb-2">
            {{ $t('t-website') }} <i class="ph-asterisk ph-xs text-danger" />
          </div>
          <TextField v-model="website" :placeholder="$t('t-enter-website')" hide-details />
        </v-col>
      </v-row>
      <!--<v-row class="">
        <v-col cols="12" lg="12">
          <div class="font-weight-bold mb-2">
            {{ $t('t-contract') }} <i class="ph-asterisk ph-xs text-danger" />
          </div>
          <ImageUploader v-model="img" />
        </v-col>
      </v-row>-->
    </v-card-text>

    <v-card-actions class="d-flex justify-space-between mt-3">
      <v-btn color="secondary" variant="outlined" class="me-2" @click="onBack()">
          {{ $t('t-back') }} <i class="ph-arrow-left ms-2" />
        </v-btn>
      <v-btn color="success" variant="elevated" @click="emit('onStepChange', 2)">
        {{ $t('t-save-and-proceed') }} <i class="ph-arrow-right ms-2" />
      </v-btn>
    </v-card-actions>
  </Card>
</template>
