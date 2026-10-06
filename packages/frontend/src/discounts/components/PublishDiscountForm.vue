<script setup lang="ts">
import { ref } from 'vue';

import { useDiscountsStore } from '../../stores/discounts-store';
import { discountTexts } from '../texts';
import { discountToPublish, nothingTyped } from '../typed-discount';

import TypedDiscountFields from './TypedDiscountFields.vue';

const discounts = useDiscountsStore();
const discount = ref(nothingTyped());

const publish = async (): Promise<void> => {
  await discounts.publish(discountToPublish(discount.value));
  discount.value = nothingTyped();
};
</script>

<template>
  <form @submit.prevent="publish">
    <TypedDiscountFields
      v-model="discount"
      :missing="discounts.missing"
    />
    <button
      type="submit"
      class="rounded border px-3 py-1"
      data-testid="publish-discount"
    >
      {{ discountTexts.publish }}
    </button>
    <p
      v-if="discounts.rateNotValid"
      role="status"
    >
      {{ discountTexts.rateNotValid }}
    </p>
  </form>
</template>
