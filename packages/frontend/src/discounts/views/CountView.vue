<script setup lang="ts">
import { onMounted } from 'vue';

import { useDiscountsStore } from '../../stores/discounts-store';
import CountDiscountedSalesForm from '../components/CountDiscountedSalesForm.vue';

const discounts = useDiscountsStore();

onMounted(discounts.load);
</script>

<template>
  <CountDiscountedSalesForm
    class="grid gap-4 rounded-lg border border-ink/15 bg-paper p-5"
    :stores="discounts.stores"
  />
</template>
