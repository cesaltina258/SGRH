<script lang="ts" setup>
import { breadcrumb } from "@/components/invoice/createInvoice/utils";
import CreateInvoice from "@/components/invoice/createInvoice/index.vue";
</script>
<template>
  <Breadcrumb title="Create Invoice" :items="breadcrumb" />
  <CreateInvoice />
</template>
