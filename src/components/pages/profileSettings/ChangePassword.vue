<script lang="ts" setup>
import { ref } from "vue";
import Table from "@/app/common/components/Table.vue";
import {
  productsHeader,
  loginHistory,
} from "@/components/pages/profileSettings/utils";

const isSubmitted = ref(false);
const formData = ref({
  oldPswd: { value: "", isValid: true },
  newPswd: { value: "", isValid: true },
  confirmPswd: { value: "", isValid: true },
});

const onChange = () => {
  isSubmitted.value = true;
};
</script>
<template>
  <Card :title="$t('t-change-password')">
    <v-card-text>
      <v-row>
        <v-col cols="12" lg="4">
          <div class="font-weight-bold mb-1">
            {{ $t('t-old-password') }} <i class="ph-asterisk ph-xs text-danger" />
          </div>
          <TextField v-model="formData.oldPswd" :value="formData.oldPswd.value" :placeholder="$t('t-enter-password')"
            hide-details :showError="isSubmitted" :isSubmitted="isSubmitted" isRequired isPassword />
        </v-col>
        <v-col cols="12" lg="4">
          <div class="font-weight-bold mb-1">
            {{ $t('t-new-password') }}<i class="ph-asterisk ph-xs text-danger" />
          </div>
          <TextField v-model="formData.newPswd" :value="formData.newPswd.value" :placeholder="$t('t-enter-password')"
            hide-details :showError="isSubmitted" :isSubmitted="isSubmitted" isRequired isPassword />
        </v-col>
        <v-col cols="12" lg="4">
          <div class="font-weight-bold mb-1">
            {{ $t('t-confirm-password') }} <i class="ph-asterisk ph-xs text-danger" />
          </div>
          <TextField v-model="formData.confirmPswd" :value="formData.confirmPswd.value"
            :placeholder="$t('t-enter-password')" hide-details :showError="isSubmitted" :isSubmitted="isSubmitted"
            isRequired isPassword />
        </v-col>
      </v-row>
      <div class="d-flex justify-space-between mt-4">
        <span class="text-primary text-decoration-underline font-weight-medium">
        </span>

        <v-btn color="success" @click="onChange"> {{ $t('t-save') }} </v-btn>
      </div>
    </v-card-text>

    <Card elevation="0" :title="$t('t-login-history')">
      <template #title-action>
        <!--<v-btn color="secondary"> All Logout </v-btn>-->
      </template>
      <v-divider />
      <v-card-text>
        <Table :headerItems="productsHeader.map(header => ({
          ...header,
          title: $t('t-' + header.title)
        }))">
          <template #body>
            <tr v-for="(item, index) in loginHistory" :key="'eCommerce-order-item-' + index" height="50">
              <td>
                <i class="ph-device-mobile-camera me-1" /> {{ item.product }}
              </td>
              <td>{{ item.ip_address }}</td>
              <td>{{ item.date }}</td>
              <td>{{ item.location }}</td>
              <td>
                <v-btn color="primary" variant="text" class="px-0">
                  {{ $t('t-logout') }} <i class="ph-sign-out ms-1" />
                </v-btn>
              </td>
            </tr>
          </template>
        </Table>
      </v-card-text>
    </Card>
  </Card>
</template>
