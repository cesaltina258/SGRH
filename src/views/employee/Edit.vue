<script lang="ts" setup>
import { breadcrumb } from "@/components/employee/edit/utils";
import Edit from "@/components/employee/edit/index.vue";
</script>
<template>
  <Breadcrumb title="edit-employee" :items="breadcrumb" />
  <Edit />
</template>
