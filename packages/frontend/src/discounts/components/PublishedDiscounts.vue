<script setup lang="ts">
import type { DiscountResponse } from '@app/types/discounts';

defineProps<{ discounts: DiscountResponse[] }>();
</script>

<template>
  <ul>
    <li data-testid="published-discount">
      <span data-testid="published-item">Peruvian spices</span>
    </li>
  </ul>
</template>
