<script setup lang="ts">
import type { Store } from '@app/types/discounts';

defineProps<{ caption: string; stores: Store[] }>();

const picked = defineModel<Store>();

const theNameAndAddressOf = (store: Store) => `${store.storeName}, ${store.storeAddress}`;
</script>

<template>
  <label class="flex flex-col gap-1 text-sm font-medium">
    {{ caption }}
    <select
      v-model="picked"
      required
      class="font-normal"
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
