<script setup lang="ts">
import type { CouponResponse } from '@app/types/discounts';

defineProps<{ coupon: CouponResponse }>();
</script>

<template>
  <section data-testid="issued-coupon">
    <p data-testid="coupon-code">
      7K3QX 9M2PD
    </p>
  </section>
</template>
