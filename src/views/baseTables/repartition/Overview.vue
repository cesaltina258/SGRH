<script lang="ts" setup>
import { breadcrumb } from "@/components/baseTables/repartition/utils";
import OverView from "@/components/baseTables/repartition/overview/index.vue";
</script>
<template>
  <Breadcrumb title="Overview" :items="breadcrumb" />
  <OverView />
</template>
