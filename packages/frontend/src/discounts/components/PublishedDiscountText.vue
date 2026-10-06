<script setup lang="ts">
import type { DiscountResponse } from '@app/types/discounts';

defineProps<{ discount: DiscountResponse }>();
</script>

<template>
  <div
    class="flex flex-wrap items-baseline gap-x-3 gap-y-1"
    data-testid="published-discount-text"
  >
    <span
      class="text-lg font-semibold"
      data-testid="published-item"
    >{{ discount.item.trim() }}</span>
    <span
      class="rounded bg-tag px-2 text-sm font-semibold tabular-nums"
      data-testid="published-rate"
    >{{ discount.rate }}%</span>
    <span
      class="basis-full text-sm text-slate sm:basis-auto"
      data-testid="published-store-name"
    >{{ discount.storeName.trim() }}</span>
    <span
      class="text-sm text-slate"
      data-testid="published-store-address"
    >{{ discount.storeAddress.trim() }}</span>
    <span
      v-if="discount.hook"
      class="basis-full italic"
      data-testid="published-hook"
    >{{ discount.hook.trim() }}</span>
  </div>
</template>
