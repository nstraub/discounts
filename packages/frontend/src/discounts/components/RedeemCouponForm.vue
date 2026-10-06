<script setup lang="ts">
import type { DiscountResponse } from '@app/types/discounts';

import { discountTexts } from '../texts';

defineProps<{ stores: Pick<DiscountResponse, 'storeName' | 'storeAddress'>[] }>();
</script>

<template>
  <form>
    <label class="flex flex-col gap-1">
      {{ discountTexts.yourStore }}
      <select
        required
        class="rounded border border-gray-400 px-2 py-1"
      >
        <option
          v-for="store in stores"
          :key="`${store.storeName}, ${store.storeAddress}`"
        >
          {{ store.storeName }}, {{ store.storeAddress }}
        </option>
      </select>
    </label>
  </form>
</template>
