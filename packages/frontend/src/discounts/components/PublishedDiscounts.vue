<script setup lang="ts">
import type { DiscountResponse } from '@app/types/discounts';

import { discountTexts } from '../texts';

import PublishedDiscount from './PublishedDiscount.vue';

defineProps<{ discounts: DiscountResponse[] }>();
</script>

<template>
  <p
    v-if="discounts.length === 0"
    class="text-slate"
    data-testid="nothing-published"
  >
    {{ discountTexts.nothingPublished }}
  </p>
  <ul class="divide-y divide-ink/15 rounded-lg border border-ink/15 bg-paper empty:hidden">
    <PublishedDiscount
      v-for="discount in discounts"
      :key="discount.id"
      :discount="discount"
    />
  </ul>
</template>
