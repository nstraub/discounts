<script setup lang="ts">
import { ref } from 'vue';

import type { Store } from '@app/types/discounts';

import { useDiscountsStore } from '../../stores/discounts-store';
import { discountTexts } from '../texts';

import CountedDiscounts from './CountedDiscounts.vue';
import StorePicker from './StorePicker.vue';

defineProps<{ stores: Store[] }>();

const discounts = useDiscountsStore();
const picked = ref<Store>();

const theStoreTheRequiredPickerHolds = (): Store => picked.value!;

const count = async (): Promise<void> => {
  await discounts.countDiscountedSales(theStoreTheRequiredPickerHolds());
};
</script>

<template>
  <form @submit.prevent="count">
    <StorePicker
      v-model="picked"
      :caption="discountTexts.store"
      :stores="stores"
    />
    <button
      type="submit"
      class="justify-self-start bg-shopfront text-paper hover:bg-ink"
    >
      {{ discountTexts.countDiscountedSales }}
    </button>
    <CountedDiscounts
      v-if="discounts.counted"
      :counted="discounts.counted"
    />
  </form>
</template>
