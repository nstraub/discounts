<script setup lang="ts">
import PublishDiscountForm from '../components/PublishDiscountForm.vue';
import PublishedDiscounts from '../components/PublishedDiscounts.vue';

const published = [{ id: 'spices-id', item: 'Peruvian spices', rate: 20, storeName: "Mike's Groceries", storeAddress: '12 Market Street' }];
</script>

<template>
  <PublishedDiscounts :discounts="published" />
  <PublishDiscountForm />
</template>
