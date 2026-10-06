<script setup lang="ts">
import { computed } from 'vue';

import type { CouponResponse } from '@app/types/discounts';

import { discountTexts } from '../texts';

const props = defineProps<{ coupon: CouponResponse }>();

const charactersInAGroup = 5;
const code = computed(() => `${props.coupon.token.slice(0, charactersInAGroup)} ${props.coupon.token.slice(charactersInAGroup)}`);
</script>

<template>
  <section
    class="rounded-lg border-2 border-dashed border-ink bg-tag p-5"
    data-testid="issued-coupon"
  >
    <p data-testid="coupon-store">
      {{ discountTexts.yourCouponToUseAt }} {{ coupon.storeName }}
    </p>
    <p
      class="mt-2 text-3xl font-semibold tracking-widest tabular-nums"
      data-testid="coupon-code"
    >
      {{ code }}
    </p>
  </section>
</template>
