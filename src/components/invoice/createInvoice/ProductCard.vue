<script lang="ts" setup>
import { computed, ref } from "vue";
import { productHeader } from "@/components/invoice/createInvoice/utils";
import NumberSpinner from "@/app/common/components/NumberSpinner.vue";
import Table from "@/app/common/components/Table.vue";

const productDetails = ref([
  {
    id: 1,
    name: "",
    detail: "",
    rate: 0,
    quantity: 0,
  },
]);

const subTotal = computed(() => {
  let count = 0;
  productDetails.value.forEach((item) => {
    count = count + item.quantity * item.rate;
  });
  return count.toFixed(2);
});

const taxCount = computed(() => {
  return ((Number(subTotal.value) * 18) / 100).toFixed(2);
});

const discount = computed(() => {
  const discount = (Number(subTotal.value) * 30) / 100;
  return discount.toFixed(2);
});

const finalTotal = computed(() => {
  const finalTotal =
    Number(subTotal.value) +
    Number(taxCount.value) -
    Number(discount.value) +
    50;

  return finalTotal.toFixed(2);
});

const onAdd = () => {
  productDetails.value.push({
    id: productDetails.value.length + 1,
    name: "",
    detail: "",
    rate: 0,
    quantity: 0,
  });
};

const onDelete = (id: number) => {
  productDetails.value = productDetails.value.filter((item) => item.id !== id);
};
</script>
<template>
  <Table :headerItems="productHeader">
    <template #body>
      <tr
        v-for="(item, index) in productDetails"
        :key="'product-item-' + index"
      >
        <td class="font-weight-bold">{{ item.id }}</td>
        <td class="pt-4">
          <TextField
            v-model="item.name"
            isRequired
            hide-details
            placeholder="Product Name"
            class="mb-2"
          />
          <TextArea
            v-model="item.detail"
            isRequired
            placeholder="Product Details"
          />
        </td>
        <td>
          <TextField
            v-model="item.rate"
            hide-details
            placeholder="0.00"
            type="number"
          />
        </td>
        <td>
          <NumberSpinner
            v-model="item.quantity"
            @onAdd="item.quantity < 100 && item.quantity++"
            @onReduce="item.quantity > 0 && item.quantity--"
          />
        </td>
        <td>
          <div class="d-flex">
            <TextField
              disabled
              :model-value="(item.quantity * item.rate).toFixed(2)"
              type="number"
              placeholder="0.00"
              hide-details
            />
            <v-btn color="danger" class="ms-3" @click="onDelete(item.id)">
              Delete</v-btn
            >
          </div>
        </td>
      </tr>
    </template>
  </Table>
  <v-btn color="light" @click="onAdd"> + Add Item </v-btn>
  <v-divider class="my-4" />
  <v-row justify="end" class="mt-4">
    <v-col cols="12" lg="4">
      <v-row class="d-flex align-center mb-2" no-gutters>
        <v-col cols="6">
          <span class="font-weight-bold me-4"> Sub Total </span>
        </v-col>
        <v-col cols="6">
          <TextField
            :model-value="subTotal"
            placeholder="$0.00"
            disabled
            hide-details
          />
        </v-col>
      </v-row>
      <v-row class="d-flex align-center mb-2" no-gutters>
        <v-col cols="6">
          <span class="font-weight-bold me-4"> Estimated Tax(18%) </span>
        </v-col>
        <v-col cols="6">
          <TextField
            :model-value="taxCount"
            placeholder="$0.00"
            disabled
            hide-details
          />
        </v-col>
      </v-row>
      <v-row class="d-flex align-center mb-2" no-gutters>
        <v-col cols="6">
          <span class="font-weight-bold me-4">
            Discount <span class="text-muted"> (STEEX30) </span>
          </span>
        </v-col>
        <v-col cols="6">
          <TextField
            :model-value="discount"
            placeholder="$0.00"
            disabled
            hide-details
          />
        </v-col>
      </v-row>
      <v-row class="d-flex align-center mb-2" no-gutters>
        <v-col cols="6">
          <span class="font-weight-bold me-4"> Shipping Charge </span>
        </v-col>
        <v-col cols="6">
          <TextField
            :model-value="50"
            placeholder="$0.00"
            disabled
            hide-details
          />
        </v-col>
      </v-row>
      <v-divider class="my-4" />
      <v-row class="d-flex align-center mb-2" no-gutters>
        <v-col cols="6">
          <span class="font-weight-bold me-4"> Total Amount </span>
        </v-col>
        <v-col cols="6">
          <TextField
            :model-value="finalTotal"
            placeholder="$0.00"
            disabled
            hide-details
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
