<script setup lang="ts">
import { onMounted } from 'vue';

import { useDiscountsStore } from '../../stores/discounts-store';
import IssuedCoupon from '../components/IssuedCoupon.vue';
import PublishDiscountForm from '../components/PublishDiscountForm.vue';
import PublishedDiscounts from '../components/PublishedDiscounts.vue';

const discounts = useDiscountsStore();

onMounted(discounts.load);
</script>

<template>
  <PublishedDiscounts :discounts="discounts.published" />
  <IssuedCoupon
    v-if="discounts.coupon"
    :coupon="discounts.coupon"
  />
  <PublishDiscountForm />
</template>
