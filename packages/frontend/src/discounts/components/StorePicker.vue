<script setup lang="ts">
import type { DiscountResponse } from '@app/types/discounts';

import { discountTexts } from '../texts';

type Store = Pick<DiscountResponse, 'storeName' | 'storeAddress'>;

defineProps<{ stores: Store[] }>();

const picked = defineModel<Store>();

const theNameAndAddressOf = (store: Store) => `${store.storeName}, ${store.storeAddress}`;
</script>

<template>
  <label class="flex flex-col gap-1">
    {{ discountTexts.yourStore }}
    <select
      v-model="picked"
      required
      class="rounded border border-gray-400 px-2 py-1"
    >
      <option :value="undefined" />
      <option
        v-for="store in stores"
        :key="theNameAndAddressOf(store)"
        :value="store"
      >
        {{ theNameAndAddressOf(store) }}
      </option>
    </select>
  </label>
</template>
