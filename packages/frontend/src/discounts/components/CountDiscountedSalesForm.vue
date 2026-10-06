<script setup lang="ts">
import { ref } from 'vue';

import type { DiscountResponse } from '@app/types/discounts';

import { useDiscountsStore } from '../../stores/discounts-store';
import { discountTexts } from '../texts';

import StorePicker from './StorePicker.vue';

type Store = Pick<DiscountResponse, 'storeName' | 'storeAddress'>;

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
      class="rounded border px-3 py-1"
    >
      {{ discountTexts.countDiscountedSales }}
    </button>
    <ul v-if="discounts.counted">
      <li data-testid="counted-discount">
        <span data-testid="counted-item">Organic produce</span>
      </li>
    </ul>
  </form>
</template>
