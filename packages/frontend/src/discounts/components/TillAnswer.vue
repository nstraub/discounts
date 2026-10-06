<script setup lang="ts">
import { useDiscountsStore } from '../../stores/discounts-store';
import { discountTexts } from '../texts';

import DiscountApplies from './DiscountApplies.vue';

const discounts = useDiscountsStore();
</script>

<template>
  <DiscountApplies
    v-if="discounts.redemption"
    :redemption="discounts.redemption"
  />
  <p
    v-if="discounts.couponAlreadyUsed"
    role="status"
  >
    {{ discountTexts.couponAlreadyUsed }}
  </p>
</template>
