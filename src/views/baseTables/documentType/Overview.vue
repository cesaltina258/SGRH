<script lang="ts" setup>
import { breadcrumb } from "@/components/baseTables/documentType/utils";
import OverView from "@/components/baseTables/documentType/overview/index.vue";
</script>
<template>
  <Breadcrumb title="Overview" :items="breadcrumb" />
  <OverView />
</template>
