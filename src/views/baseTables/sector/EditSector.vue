<script lang="ts" setup>
import { breadcrumb } from "@/components/baseTables/sector/editSector/utils";
import EditSector from "@/components/baseTables/sector/editSector/index.vue";
</script>
<template>
  <Breadcrumb title="edit-sector-list" :items="breadcrumb" />
  <EditSector />
</template>
