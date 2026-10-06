<script setup lang="ts">
import type { DiscountResponse } from '@app/types/discounts';

import { discountTexts } from '../texts';

defineProps<{ discount: DiscountResponse; namedBy: string }>();
</script>

<template>
  <button
    type="button"
    class="rounded border px-3 py-1"
    data-testid="get-coupon"
  >
    {{ discountTexts.getCoupon }}
  </button>
</template>
