<script setup lang="ts">
import { useDiscountsStore } from '../../stores/discounts-store';

import DiscountApplies from './DiscountApplies.vue';

const discounts = useDiscountsStore();
</script>

<template>
  <DiscountApplies
    v-if="discounts.redemption"
    :redemption="discounts.redemption"
  />
</template>
