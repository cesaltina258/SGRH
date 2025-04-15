<script lang="ts" setup>
import { breadcrumb } from "@/components/baseTables/sector/gridView/utils";
import GridView from "@/components/baseTables/sector/gridView/index.vue";
</script>
<template>
  <Breadcrumb title="Agent Grid" :items="breadcrumb" />
  <GridView />
</template>
