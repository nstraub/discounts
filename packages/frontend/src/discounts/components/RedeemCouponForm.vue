<script setup lang="ts">
import type { DiscountResponse } from '@app/types/discounts';

import { discountTexts } from '../texts';

defineProps<{ stores: Pick<DiscountResponse, 'storeName' | 'storeAddress'>[] }>();
</script>

<template>
  <form>
    <label class="flex flex-col gap-1">
      {{ discountTexts.yourStore }}
      <select class="rounded border border-gray-400 px-2 py-1" />
    </label>
  </form>
</template>
