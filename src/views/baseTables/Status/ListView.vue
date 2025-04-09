<script lang="ts" setup>
import { breadcrumb } from "@/components/baseTables/Status/listView/utils";
import ListView from "@/components/baseTables/Status/listView/index.vue";
</script>
<template>
  <Breadcrumb title="status-list" :items="breadcrumb" />
  <ListView />
</template>
