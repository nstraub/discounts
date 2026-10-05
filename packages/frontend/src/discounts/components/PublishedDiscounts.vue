<script setup lang="ts">
import type { DiscountResponse } from '@app/types/discounts';

defineProps<{ discounts: DiscountResponse[] }>();
</script>

<template>
  <ul>
    <li data-testid="published-discount">
      <span data-testid="published-item">Peruvian spices</span>
      <span data-testid="published-rate">20%</span>
      <span data-testid="published-store-name">Mike's Groceries</span>
      <span data-testid="published-store-address">12 Market Street</span>
    </li>
  </ul>
</template>
