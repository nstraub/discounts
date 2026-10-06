<script setup lang="ts">
import { onMounted } from 'vue';

import { useDiscountsStore } from '../../stores/discounts-store';
import RedeemCouponForm from '../components/RedeemCouponForm.vue';

const discounts = useDiscountsStore();

onMounted(discounts.load);
</script>

<template>
  <RedeemCouponForm :stores="discounts.stores" />
</template>
