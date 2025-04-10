<script lang="ts" setup>
import { breadcrumb } from "@/components/baseTables/currency/utils";
import OverView from "@/components/baseTables/currency/overview/index.vue";
</script>
<template>
  <Breadcrumb title="Overview" :items="breadcrumb" />
  <OverView />
</template>
