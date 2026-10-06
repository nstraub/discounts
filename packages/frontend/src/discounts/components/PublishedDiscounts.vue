<script setup lang="ts">
import type { DiscountResponse } from '@app/types/discounts';

import { discountTexts } from '../texts';

import ChangeRateForm from './ChangeRateForm.vue';

defineProps<{ discounts: DiscountResponse[] }>();

const textIdOf = (discount: DiscountResponse): string => `published-discount-${discount.id}-text`;
</script>

<template>
  <p
    v-if="discounts.length === 0"
    data-testid="nothing-published"
  >
    {{ discountTexts.nothingPublished }}
  </p>
  <ul>
    <li
      v-for="discount in discounts"
      :key="discount.id"
      class="flex gap-2"
      data-testid="published-discount"
    >
      <div
        :id="textIdOf(discount)"
        class="flex gap-2"
        data-testid="published-discount-text"
      >
        <span data-testid="published-item">{{ discount.item.trim() }}</span>
        <span data-testid="published-rate">{{ discount.rate }}%</span>
        <span data-testid="published-store-name">{{ discount.storeName.trim() }}</span>
        <span data-testid="published-store-address">{{ discount.storeAddress.trim() }}</span>
        <span
          v-if="discount.hook"
          data-testid="published-hook"
        >{{ discount.hook.trim() }}</span>
      </div>
      <ChangeRateForm
        :discount="discount"
        :named-by="textIdOf(discount)"
      />
    </li>
  </ul>
</template>
