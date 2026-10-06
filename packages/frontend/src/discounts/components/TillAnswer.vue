<script setup lang="ts">
import { useDiscountsStore } from '../../stores/discounts-store';
import { discountTexts } from '../texts';

import DiscountApplies from './DiscountApplies.vue';

const discounts = useDiscountsStore();
</script>

<template>
  <p
    v-if="discounts.couponAlreadyUsed"
    role="status"
  >
    {{ discountTexts.couponAlreadyUsed }}
  </p>
  <DiscountApplies
    v-else-if="discounts.redemption"
    :redemption="discounts.redemption"
  />
</template>
