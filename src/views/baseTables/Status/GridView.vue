<script lang="ts" setup>
import { breadcrumb } from "@/components/baseTables/Status/gridView/utils";
import GridView from "@/components/baseTables/Status/gridView/index.vue";
</script>
<template>
  <Breadcrumb title="Agent Grid" :items="breadcrumb" />
  <GridView />
</template>
