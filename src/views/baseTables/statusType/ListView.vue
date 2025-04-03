<script lang="ts" setup>
import { breadcrumb } from "@/components/baseTables/statusType/listView/utils";
import ListView from "@/components/baseTables/statusType/listView/index.vue";
</script>
<template>
  <Breadcrumb title="status-types-list" :items="breadcrumb" />
  <ListView />
</template>
