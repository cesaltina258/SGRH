<script lang="ts" setup>
import { breadcrumb } from "@/components/institution/createInstitution/utils";
import CreateInstitution from "@/components/institution/createInstitution/index.vue";
</script>
<template>
  <Breadcrumb title="add-institution" :items="breadcrumb" />
  <CreateInstitution />
</template>
