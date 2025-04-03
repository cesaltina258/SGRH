<script lang="ts" setup>
import { breadcrumb } from "@/components/baseTables/institutionType/listView/utils";
import ListView from "@/components/baseTables/institutionType/listView/index.vue";
</script>
<template>
  <Breadcrumb title="institutions-types-list" :items="breadcrumb" />
  <ListView />
</template>
