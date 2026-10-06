<script setup lang="ts">
import { computed } from 'vue';

import type { DiscountResponse } from '@app/types/discounts';

import ChangeRateForm from './ChangeRateForm.vue';
import GetCouponButton from './GetCouponButton.vue';

const props = defineProps<{ discount: DiscountResponse }>();

const textId = computed(() => `published-discount-${props.discount.id}-text`);
</script>

<template>
  <li
    class="flex gap-2"
    data-testid="published-discount"
  >
    <div
      :id="textId"
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
      :named-by="textId"
    />
    <GetCouponButton
      :discount="discount"
      :named-by="textId"
    />
  </li>
</template>
