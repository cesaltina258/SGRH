<script lang="ts" setup>
import { breadcrumb } from "@/components/baseTables/function/gridView/utils";
import GridView from "@/components/baseTables/function/gridView/index.vue";
</script>
<template>
  <Breadcrumb title="Agent Grid" :items="breadcrumb" />
  <GridView />
</template>
