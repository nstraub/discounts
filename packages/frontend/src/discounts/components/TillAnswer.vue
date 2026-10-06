<script setup lang="ts">
import { useTillStore } from '../../stores/till-store';
import { discountTexts } from '../texts';

const till = useTillStore();
</script>

<template>
  <p
    role="status"
    class="min-h-6 font-medium"
  >
    {{ till.answer.told(discountTexts) }}
  </p>
</template>
