<script setup lang="ts">
import { ref } from 'vue';

import type { DiscountResponse } from '@app/types/discounts';

import { discountTexts } from '../texts';

import CaptionedInput from './CaptionedInput.vue';

type Store = Pick<DiscountResponse, 'storeName' | 'storeAddress'>;

defineProps<{ stores: Store[] }>();

const theNameAndAddressOf = (store: Store) => `${store.storeName}, ${store.storeAddress}`;

const code = ref('');
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
    <CaptionedInput
      v-model="code"
      :caption="discountTexts.couponCode"
      test-id="typed-coupon-code"
    />
    <button
      type="submit"
      class="rounded border px-3 py-1"
    >
      {{ discountTexts.redeem }}
    </button>
  </form>
</template>
