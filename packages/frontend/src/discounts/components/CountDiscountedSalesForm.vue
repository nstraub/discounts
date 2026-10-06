<script setup lang="ts">
import type { DiscountResponse } from '@app/types/discounts';

import { discountTexts } from '../texts';

type Store = Pick<DiscountResponse, 'storeName' | 'storeAddress'>;

defineProps<{ stores: Store[] }>();
</script>

<template>
  <form>
    <label>
      {{ discountTexts.store }}
      <select />
    </label>
  </form>
</template>
