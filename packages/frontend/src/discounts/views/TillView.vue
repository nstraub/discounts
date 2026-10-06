<script setup lang="ts">
import RedeemCouponForm from '../components/RedeemCouponForm.vue';
</script>

<template>
  <RedeemCouponForm :stores="[{ storeName: 'Corner Grocery', storeAddress: '3 Hill Road' }]" />
</template>
