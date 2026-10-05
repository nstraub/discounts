<script setup lang="ts">
import type { DiscountResponse } from '@app/types/discounts';

defineProps<{ discounts: DiscountResponse[] }>();
</script>

<template>
  <ul>
    <li
      v-for="discount in discounts"
      :key="discount.id"
      data-testid="published-discount"
    >
      <span data-testid="published-item">{{ discount.item }}</span>
      <span data-testid="published-rate">{{ discount.rate }}%</span>
      <span data-testid="published-store-name">{{ discount.storeName }}</span>
      <span data-testid="published-store-address">{{ discount.storeAddress }}</span>
    </li>
  </ul>
</template>
