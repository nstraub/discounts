<script setup lang="ts">
import { computed } from 'vue';

import type { DiscountResponse } from '@app/types/discounts';

import ChangeRateForm from './ChangeRateForm.vue';
import GetCouponButton from './GetCouponButton.vue';
import PublishedDiscountText from './PublishedDiscountText.vue';

const props = defineProps<{ discount: DiscountResponse }>();

const textId = computed(() => `published-discount-${props.discount.id}-text`);
</script>

<template>
  <li
    class="flex flex-col gap-3 p-4"
    data-testid="published-discount"
  >
    <PublishedDiscountText
      :id="textId"
      :discount="discount"
    />
    <div class="flex flex-wrap items-end gap-2">
      <ChangeRateForm
        :discount="discount"
        :named-by="textId"
      />
      <GetCouponButton
        :discount="discount"
        :named-by="textId"
      />
    </div>
  </li>
</template>
