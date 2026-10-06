<script setup lang="ts">
import type { DiscountResponse } from '@app/types/discounts';

import { discountTexts } from '../texts';

type Store = Pick<DiscountResponse, 'storeName' | 'storeAddress'>;

defineProps<{ stores: Store[] }>();

const theNameAndAddressOf = (store: Store) => `${store.storeName}, ${store.storeAddress}`;
</script>

<template>
  <form>
    <label class="flex flex-col gap-1">
      {{ discountTexts.yourStore }}
      <select
        required
        class="rounded border border-gray-400 px-2 py-1"
      >
        <option value="" />
        <option
          v-for="store in stores"
          :key="theNameAndAddressOf(store)"
        >
          {{ theNameAndAddressOf(store) }}
        </option>
      </select>
    </label>
  </form>
</template>
