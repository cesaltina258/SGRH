<script lang="ts" setup>
import { breadcrumb } from "@/components/baseTables/statusType/gridView/utils";
import GridView from "@/components/baseTables/statusType/gridView/index.vue";
</script>
<template>
  <Breadcrumb title="Agent Grid" :items="breadcrumb" />
  <GridView />
</template>
