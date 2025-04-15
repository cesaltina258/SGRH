<script lang="ts" setup>
import { breadcrumb } from "@/components/baseTables/sector/utils";
import OverView from "@/components/baseTables/sector/overview/index.vue";
</script>
<template>
  <Breadcrumb title="Overview" :items="breadcrumb" />
  <OverView />
</template>
