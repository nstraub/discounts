<script setup lang="ts">
import CountDiscountedSalesForm from '../components/CountDiscountedSalesForm.vue';
</script>

<template>
  <CountDiscountedSalesForm :stores="[{ storeName: 'Mike\'s Groceries', storeAddress: '12 Market Street' }]" />
</template>
