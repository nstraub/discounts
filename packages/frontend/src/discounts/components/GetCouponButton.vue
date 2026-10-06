<script setup lang="ts">
import type { DiscountResponse } from '@app/types/discounts';

import { discountTexts } from '../texts';

const props = defineProps<{ discount: DiscountResponse; namedBy: string }>();

const ownId = `${props.namedBy}-get-coupon`;
</script>

<template>
  <button
    :id="ownId"
    type="button"
    :aria-labelledby="`${ownId} ${namedBy}`"
    class="rounded border px-3 py-1"
    data-testid="get-coupon"
  >
    {{ discountTexts.getCoupon }}
  </button>
</template>
