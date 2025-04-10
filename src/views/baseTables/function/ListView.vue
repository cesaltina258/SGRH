<script lang="ts" setup>
import { breadcrumb } from "@/components/baseTables/function/listView/utils";
import ListView from "@/components/baseTables/function/listView/index.vue";
</script>
<template>
  <Breadcrumb title="function-list" :items="breadcrumb" />
  <ListView />
</template>
