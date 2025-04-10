<script lang="ts" setup>
import { breadcrumb } from "@/components/baseTables/function/utils";
import OverView from "@/components/baseTables/function/overview/index.vue";
</script>
<template>
  <Breadcrumb title="Overview" :items="breadcrumb" />
  <OverView />
</template>
