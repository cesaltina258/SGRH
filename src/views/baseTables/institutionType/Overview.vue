<script lang="ts" setup>
import { breadcrumb } from "@/components/baseTables/institutionType/utils";
import OverView from "@/components/baseTables/institutionType/overview/index.vue";
</script>
<template>
  <Breadcrumb title="Overview" :items="breadcrumb" />
  <OverView />
</template>
