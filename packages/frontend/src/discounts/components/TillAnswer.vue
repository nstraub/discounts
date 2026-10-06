<script setup lang="ts">
import { useTillStore } from '../../stores/till-store';
import { discountTexts } from '../texts';

const till = useTillStore();
</script>

<template>
  <p role="status">
    {{ till.answer.told(discountTexts) }}
  </p>
</template>
