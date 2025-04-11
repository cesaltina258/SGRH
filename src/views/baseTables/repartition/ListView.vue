<script lang="ts" setup>
import { breadcrumb } from "@/components/baseTables/repartition/listView/utils";
import ListView from "@/components/baseTables/repartition/listView/index.vue";
</script>
<template>
  <Breadcrumb title="repartition-list" :items="breadcrumb" />
  <ListView />
</template>
