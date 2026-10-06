<script setup lang="ts">
import { computed } from 'vue';

import type { CouponResponse } from '@app/types/discounts';

const props = defineProps<{ coupon: CouponResponse }>();

const charactersInAGroup = 5;
const code = computed(() => `${props.coupon.token.slice(0, charactersInAGroup)} ${props.coupon.token.slice(charactersInAGroup)}`);
</script>

<template>
  <section data-testid="issued-coupon">
    <p data-testid="coupon-code">
      {{ code }}
    </p>
  </section>
</template>
