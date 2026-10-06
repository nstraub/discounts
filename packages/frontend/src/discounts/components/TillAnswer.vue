<script setup lang="ts">
import { useTillStore } from '../../stores/till-store';
import { discountTexts } from '../texts';

import DiscountApplies from './DiscountApplies.vue';

const till = useTillStore();
</script>

<template>
  <p
    v-if="till.couponAlreadyUsed"
    role="status"
  >
    {{ discountTexts.couponAlreadyUsed }}
  </p>
  <DiscountApplies
    v-else-if="till.redemption"
    :redemption="till.redemption"
  />
</template>
