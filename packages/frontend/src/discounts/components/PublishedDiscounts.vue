<script setup lang="ts">
import type { DiscountResponse } from '@app/types/discounts';

import { discountTexts } from '../texts';

import PublishedDiscount from './PublishedDiscount.vue';

defineProps<{ discounts: DiscountResponse[] }>();
</script>

<template>
  <p
    v-if="discounts.length === 0"
    data-testid="nothing-published"
  >
    {{ discountTexts.nothingPublished }}
  </p>
  <ul>
    <PublishedDiscount
      v-for="discount in discounts"
      :key="discount.id"
      :discount="discount"
    />
  </ul>
</template>
