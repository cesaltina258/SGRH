<script lang="ts" setup>
import { breadcrumb } from "@/components/employee/create/utils";
import Create from "@/components/employee/create/index.vue";
</script>
<template>
  <Breadcrumb title="add-employee" :items="breadcrumb" />
  <Create />
</template>
