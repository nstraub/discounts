<script setup lang="ts">
import { discountTexts } from '../texts';
</script>

<template>
  <form @submit.prevent>
    <label data-testid="discount-item-field">
      {{ discountTexts.item }}
      <input data-testid="discount-item">
    </label>
    <input data-testid="discount-rate">
    <input data-testid="discount-store-name">
    <input data-testid="discount-store-address">
    <button
      type="submit"
      class="rounded border px-3 py-1"
      data-testid="publish-discount"
    />
  </form>
</template>
