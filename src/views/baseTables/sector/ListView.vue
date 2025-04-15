<script lang="ts" setup>
import { breadcrumb } from "@/components/baseTables/sector/listView/utils";
import ListView from "@/components/baseTables/sector/listView/index.vue";
</script>
<template>
  <Breadcrumb title="sector-list" :items="breadcrumb" />
  <ListView />
</template>
