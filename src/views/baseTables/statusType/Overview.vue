<script lang="ts" setup>
import { breadcrumb } from "@/components/baseTables/statusType/utils";
import OverView from "@/components/baseTables/statusType/overview/index.vue";
</script>
<template>
  <Breadcrumb title="Overview" :items="breadcrumb" />
  <OverView />
</template>
