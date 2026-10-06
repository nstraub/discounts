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
  </form>
</template>
