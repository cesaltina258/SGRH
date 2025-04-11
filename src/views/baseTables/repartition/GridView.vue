<script lang="ts" setup>
import { breadcrumb } from "@/components/baseTables/repartition/gridView/utils";
import GridView from "@/components/baseTables/repartition/gridView/index.vue";
</script>
<template>
  <Breadcrumb title="Agent Grid" :items="breadcrumb" />
  <GridView />
</template>
