<script lang="ts" setup>
import { breadcrumb } from "@/components/baseTables/editCountry/listView/utils";
import ListView from "@/components/baseTables/editCountry/listView/index.vue";
</script>
<template>
  <Breadcrumb title="edit-country" :items="breadcrumb" />
  <ListView />
</template>
