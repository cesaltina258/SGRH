<script lang="ts" setup>
import { breadcrumb } from "@/components/baseTables/institutionType/gridView/utils";
import GridView from "@/components/baseTables/institutionType/gridView/index.vue";
</script>
<template>
  <Breadcrumb title="Agent Grid" :items="breadcrumb" />
  <GridView />
</template>
