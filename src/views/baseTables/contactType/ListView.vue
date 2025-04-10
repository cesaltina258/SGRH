<script lang="ts" setup>
import { breadcrumb } from "@/components/baseTables/contactType/listView/utils";
import ListView from "@/components/baseTables/contactType/listView/index.vue";
</script>
<template>
  <Breadcrumb title="contact-type-list" :items="breadcrumb" />
  <ListView />
</template>
