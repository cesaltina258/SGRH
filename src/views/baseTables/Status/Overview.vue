<script lang="ts" setup>
import { breadcrumb } from "@/components/baseTables/Status/utils";
import OverView from "@/components/baseTables/Status/overview/index.vue";
</script>
<template>
  <Breadcrumb title="Overview" :items="breadcrumb" />
  <OverView />
</template>
