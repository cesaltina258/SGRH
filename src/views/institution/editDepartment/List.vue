<script lang="ts" setup>
import { breadcrumb1 } from "@/components/institution/create/utils";
import List from "@/components/institution/create/editDepartment/listView/index.vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

const { t } = useI18n();
const route = useRoute();
const departmentId = route.params.id;
</script>
<template>
  <Breadcrumb :title="t('edit-department')" :items="breadcrumb1" />
  <List :card-title="t('t-edit-department')" />
</template>
