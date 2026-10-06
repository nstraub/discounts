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
  <p
    v-else-if="till.couponNotForThisStore"
    role="status"
  >
    {{ discountTexts.couponNotForYourStore }}
  </p>
  <DiscountApplies
    v-else-if="till.redemption"
    :redemption="till.redemption"
  />
</template>
