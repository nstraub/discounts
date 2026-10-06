<script setup lang="ts">
import type { DiscountResponse } from '@app/types/discounts';

import { discountTexts } from '../texts';

import StorePicker from './StorePicker.vue';

type Store = Pick<DiscountResponse, 'storeName' | 'storeAddress'>;

defineProps<{ stores: Store[] }>();
</script>

<template>
  <form>
    <StorePicker
      :caption="discountTexts.store"
      :stores="stores"
    />
    <button
      type="submit"
      class="rounded border px-3 py-1"
    >
      {{ discountTexts.countDiscountedSales }}
    </button>
  </form>
</template>
