<script setup lang="ts">
import type { CountResponse } from '@app/types/discounts';

import { discountTexts } from '../texts';

defineProps<{ counted: CountResponse }>();
</script>

<template>
  <ul class="divide-y divide-ink/15 border-t border-ink/15">
    <li
      v-for="discount in counted"
      :key="discount.id"
      class="flex flex-wrap items-baseline gap-x-3 py-3"
      data-testid="counted-discount"
    >
      <span
        class="font-semibold"
        data-testid="counted-item"
      >{{ discount.item }}</span>
      <span
        class="rounded bg-tag px-2 text-sm font-semibold tabular-nums"
        data-testid="counted-rate"
      >{{ discount.rate }}%</span>
      <span class="ml-auto text-sm text-slate">{{ discountTexts.discountedSales }}</span>
      <span
        class="text-lg font-semibold tabular-nums"
        data-testid="counted-sales"
      >{{ discount.discountedSales }}</span>
    </li>
  </ul>
</template>
