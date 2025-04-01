<script lang="ts" setup>
import InvoiceSVG from "@/assets/images/invoice.vue";
import MenuSelect from "@/app/common/components/filters/MenuSelect.vue";
import { statusOptions } from "@/components/invoice/createInvoice/utils";
import ProductCard from "@/components/invoice/createInvoice/ProductCard.vue";
import { ref } from "vue";

const regNo = ref("");
const email = ref("");
const website = ref("");
const contact = ref("");
const createDate = ref("");
const date = ref("");
const paymentStatus = ref("");
const amount = ref("");
const buildingName = ref("");
const buildingAddress = ref("");
const buildingPhone = ref("");
const buildingTax = ref("");
const shippingName = ref("");
const shippingAddress = ref("");
const shippingPhone = ref("");
const shippingTax = ref("");
const isSame = ref("");
const cardHolderName = ref("");
const cardNumber = ref("");
const cardAmount = ref("");
</script>
<template>
  <v-card elevation="0" class="position-relative h-100 d-block">
    <div class="invoice-detail-card-image">
      <img
        src="@/assets/images/logo-light.png"
        class="invoice-logo"
        height="28"
      />

      <InvoiceSVG />
    </div>
    <v-card-text>
      <v-row justify="end" class="me-4 mt-4 pt-16 pt-md-0">
        <v-col cols="12" lg="4">
          <TextField
            isRequired
            v-model="regNo"
            placeholder="Legal Registration No"
            hide-details
          />
          <TextField
            isRequired
            isEmail
            v-model="email"
            placeholder="Email Address"
            hide-details
            class="mt-2"
          />
          <TextField
            v-model="website"
            isRequired
            placeholder="Website"
            hide-details
            class="mt-2"
          />
          <TextField
            v-model="contact"
            isRequired
            placeholder="Contact No"
            hide-details
            class="mt-2"
          />
          <TextField
            v-model="createDate"
            isRequired
            placeholder="Create Date"
            hide-details
            class="mt-2"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" lg="3">
          <div class="font-weight-bold">Invoice No</div>
          <TextField disabled :model-value="'#TBS24301915'" />
        </v-col>
        <v-col cols="12" lg="3">
          <div class="font-weight-bold">Date</div>
          <VueDatePicker
            v-model="date"
            :teleport="true"
            :enable-time-picker="false"
          />
        </v-col>
        <v-col cols="12" lg="3">
          <div class="font-weight-bold">Payment Status</div>
          <MenuSelect
            v-model="paymentStatus"
            hide-details
            :items="statusOptions"
          />
        </v-col>
        <v-col cols="12" lg="3">
          <div class="font-weight-bold">Total Amount</div>
          <TextField v-model="amount" placeholder="$0.00" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" lg="6">
          <div class="text-muted text-uppercase font-weight-bold mb-3">
            Building Address
          </div>
          <TextField
            v-model="buildingName"
            isRequired
            placeholder="Full Name"
            hide-details
            class="mb-2"
          />
          <TextArea
            v-model="buildingAddress"
            isRequired
            placeholder="Address"
            hide-details
            class="mb-2"
          />
          <TextField
            v-model="buildingPhone"
            isRequired
            placeholder="(123)456-7890"
            hide-details
            class="mb-2"
          />
          <TextField
            v-model="buildingTax"
            isRequired
            placeholder="Tax Number"
            hide-details
            class="mb-2"
          />
        </v-col>
        <v-col cols="12" lg="6">
          <div class="text-muted text-uppercase font-weight-bold mb-3">
            Shipping Address
          </div>
          <TextField
            v-model="shippingName"
            isRequired
            placeholder="Full Name"
            hide-details
            class="mb-2"
          />
          <TextArea
            v-model="shippingAddress"
            isRequired
            placeholder="Address"
            hide-details
            class="mb-2"
          />
          <TextField
            v-model="shippingPhone"
            isRequired
            placeholder="(123)456-7890"
            hide-details
            class="mb-2"
          />
          <TextField
            v-model="shippingTax"
            isRequired
            placeholder="Tax Number"
            hide-details
            class="mb-2"
          />
        </v-col>
      </v-row>
      <v-checkbox v-model="isSame" color="primary">
        <template #label>
          <span> Will your billing and shopping address same? </span>
        </template>
      </v-checkbox>

      <ProductCard />
      <v-row class="my-4">
        <v-col cols="12" lg="4">
          <div class="text-muted font-weight-bold text-uppercase mb-2">
            Payment Details
          </div>
          <TextField
            v-model="cardHolderName"
            isRequired
            placeholder="Card Holder Name"
            hide-details
            class="mb-2"
          />
          <TextField
            v-model="cardNumber"
            isRequired
            placeholder="xxxx xxxx xxxx xxxx"
            hide-details
            type="number"
            class="mb-2"
          />
          <TextField
            v-model="cardAmount"
            isRequired
            placeholder="$0.00"
            hide-details
            class="mb-2"
            type="number"
          />
        </v-col>
      </v-row>
      <div class="text-muted font-weight-bold text-uppercase mb-2">Notes</div>
      <v-alert color="danger" variant="tonal">
        <template #text>
          All accounts are to be paid within 7 days from receipt of invoice. To
          be paid by cheque or credit card or direct payment online. If account
          is not paid within 7 days the credits details supplied as confirmation
          of work undertaken will be charged the agreed quoted fee noted above.
        </template>
      </v-alert>
      <p class="mt-4 border pa-2">
        <b>Congratulations on your recent purchase!</b> It has been our pleasure
        to serve you, and we hope we see you again soon.
      </p>
      <v-row class="invoice-auth-signature">
        <v-col cols="auto" class="text-center">
          <img src="@/assets/images/invoice-signature.svg" alt="" height="30" />
          <h6 class="mb-0 mt-3">Authorized Sign</h6>
        </v-col>
      </v-row>
      <div class="invoice-detail-card-image-bottom">
        <InvoiceSVG />
      </div>
    </v-card-text>
  </v-card>
</template>
