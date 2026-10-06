<script setup lang="ts">
import type { CountResponse } from '@app/types/discounts';

defineProps<{ counted: CountResponse }>();
</script>

<template>
  <ul>
    <li
      v-for="discount in counted"
      :key="discount.id"
      data-testid="counted-discount"
    >
      <span data-testid="counted-item">{{ discount.item }}</span>
    </li>
  </ul>
</template>
