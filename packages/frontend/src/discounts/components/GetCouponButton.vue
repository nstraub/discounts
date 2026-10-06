<script setup lang="ts">
import type { DiscountResponse } from '@app/types/discounts';

import { discountTexts } from '../texts';

defineProps<{ discount: DiscountResponse; namedBy: string }>();
</script>

<template>
  <button
    type="button"
    aria-label="Get a coupon Peruvian spices 20% Mike's Groceries 12 Market Street"
    class="rounded border px-3 py-1"
    data-testid="get-coupon"
  >
    {{ discountTexts.getCoupon }}
  </button>
</template>
