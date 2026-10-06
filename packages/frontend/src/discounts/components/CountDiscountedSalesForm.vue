<script setup lang="ts">
import type { DiscountResponse } from '@app/types/discounts';

import { useDiscountsStore } from '../../stores/discounts-store';
import { discountTexts } from '../texts';

import StorePicker from './StorePicker.vue';

type Store = Pick<DiscountResponse, 'storeName' | 'storeAddress'>;

defineProps<{ stores: Store[] }>();

const discounts = useDiscountsStore();

const count = async (): Promise<void> => {
  await discounts.countDiscountedSales({ storeName: "Mike's Groceries", storeAddress: '12 Market Street' });
};
</script>

<template>
  <form @submit.prevent="count">
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
