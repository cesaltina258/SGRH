<script lang="ts" setup>
const emit = defineEmits(["onStepChange"]);

import { ref, watch, computed } from "vue";
import Filters from "@/components/institution/create/ContactFilters.vue";
import { filters, customers } from "@/components/institution/create/utils";
import { ContactType } from "@/components/institution/create/types";
import CreateEditContactDialog from "@/components/institution/create/CreateEditContactDialog.vue";
import { v4 as uuidv4 } from "uuid";
import { formateDate } from "@/app/common/dateFormate";

const customerFilters = ref<any>(filters);
const selectedCustomer = ref<ContactType>(customers[0]);
const dialog = ref(false);
const customerDetail = ref<ContactType | null>(null);
const filteredData = ref(customers);
const finalData = ref(filteredData.value);

watch(dialog, (newVal: boolean) => {
  if (!newVal) {
    customerDetail.value = null;
  }
});

const query = computed(() => {
  return customerFilters.value.query;
});

watch(query, (newVal: string) => {
  filteredData.value = finalData.value.filter((customer) => {
    const val = newVal.toLowerCase();
    if (customer.name.toLowerCase().includes(val)) {
      return customer;
    }
  });
});

const date = computed(() => {
  return customerFilters.value.date;
});

watch(date, (newDate) => {
  if (!newDate) {
    filteredData.value = finalData.value;
  } else {
    filteredData.value = finalData.value.filter((data) => {
      return formateDate(data.create_date) === formateDate(newDate);
    });
  }
});

const status = computed(() => {
  return customerFilters.value.status;
});

watch(status, (newStatus: string) => {
  if (!!newStatus) {
    filteredData.value = finalData.value.filter(
      (data) => data.status === newStatus
    );
  } else {
    filteredData.value = finalData.value;
  }
});

const onView = (data: ContactType) => {
  selectedCustomer.value = data;
};

const onCreate = () => {
  customerDetail.value = {
    id: -1,
    name: "",
    email: "",
    phone: "",
    create_date: new Date().toString(),
    status: "",
  };
  dialog.value = true;
};

const onEdit = (data: ContactType) => {
  customerDetail.value = data;
  dialog.value = true;
};

const onConfirm = (customer: ContactType) => {
  if (customer.id === -1) {
    filteredData.value.unshift({
      ...customer,
      id: uuidv4(),
      create_date: formateDate(customer.create_date),
    });
  } else {
    filteredData.value = filteredData.value.map((data) => {
      if (data.id === customer.id) {
        return {
          ...data,
          ...customer,
          create_date: formateDate(customer.create_date),
        };
      }
      return data;
    });
  }

  dialog.value = false;
};

</script>
<template>
  <Card :title="$t('t-contact-person-list')" title-class="py-5">
    <template #title-action>
      <div>
        <v-btn color="primary" class="mx-1" @click="onCreate">
          <i class="ph-plus-circle me-1" /> {{ $t('t-add-contact-person') }}
        </v-btn>
        <v-btn color="secondary" class="mx-1">
          <i class="ph-download-simple me-1" /> {{$t('t-import')}}
        </v-btn>
        <v-btn color="info" class="mx-1" variant="tonal">
          <i class="ph-upload-simple me-1" /> {{$t('t-export')}}
        </v-btn>
      </div>
    </template>
  </Card>
  <v-row class="mt-5">
    <v-col cols="12" lg="12">
      <Filters v-model="customerFilters" />

    </v-col>
  </v-row>

  <CreateEditContactDialog v-if="customerDetail" v-model="dialog" :customerDetail="customerDetail"
    @onConfirm="onConfirm" />
    
  <v-card-actions class="d-flex justify-space-between mt-5">
    <v-btn color="primary" variant="text" @click="emit('onStepChange', 1)">
      <i class="ph-arrow-left me-2" /> {{ $t('t-back-to-general-info') }}
    </v-btn>
    <v-btn color="success" variant="elevated" @click="emit('onStepChange', 3)">
      {{ $t('t-save-and-proceed') }} <i class="ph-arrow-right ms-2" />
    </v-btn>
  </v-card-actions>
</template>
