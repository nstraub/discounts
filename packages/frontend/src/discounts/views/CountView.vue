<script setup lang="ts">
import { onMounted } from 'vue';

import { useDiscountsStore } from '../../stores/discounts-store';
import CountDiscountedSalesForm from '../components/CountDiscountedSalesForm.vue';

const discounts = useDiscountsStore();

onMounted(discounts.load);
</script>

<template>
  <CountDiscountedSalesForm :stores="discounts.stores" />
</template>
