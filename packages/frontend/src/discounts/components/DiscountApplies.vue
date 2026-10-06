<script setup lang="ts">
import type { RedemptionResponse } from '@app/types/discounts';

import { discountTexts } from '../texts';

defineProps<{ redemption: RedemptionResponse }>();
</script>

<template>
  <p role="status">
    {{ discountTexts.theDiscountAppliesTo }} {{ redemption.item }}
  </p>
</template>
