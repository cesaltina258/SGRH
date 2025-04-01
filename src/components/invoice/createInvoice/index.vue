<script lang="ts" setup>
import InvoiceForm from "@/components/invoice/createInvoice/InvoiceForm.vue";
</script>
<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" xl="9">
        <InvoiceForm />
        <v-row class="pb-14 mt-2 d-flex">
          <v-col class="text-right">
            <v-btn class="me-2" color="success">
              <i class="ph-printer me-1" />
              Save
            </v-btn>
            <v-btn class="me-2" color="primary">
              <i class="ph-download-simple me-1" />
              Download Invoice
            </v-btn>
            <v-btn color="danger">
              <i class="ph-paper-plane-tilt me-1" />
              Send Invoice
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
