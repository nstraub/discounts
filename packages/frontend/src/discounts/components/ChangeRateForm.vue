<script setup lang="ts">
import { ref } from 'vue';

import type { DiscountResponse } from '@app/types/discounts';

import { discountTexts } from '../texts';

import CaptionedInput from './CaptionedInput.vue';

defineProps<{ discount: DiscountResponse }>();

const newRate = ref('');
</script>

<template>
  <form @submit.prevent>
    <CaptionedInput
      v-model="newRate"
      :caption="discountTexts.newRate"
      test-id="new-rate"
    />
    <button
      type="submit"
      class="rounded border px-3 py-1"
      data-testid="change-rate"
    >
      {{ discountTexts.changeRate }}
    </button>
  </form>
</template>
