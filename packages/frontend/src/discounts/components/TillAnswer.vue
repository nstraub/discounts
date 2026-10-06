<script setup lang="ts">
import { useTillStore } from '../../stores/till-store';

const till = useTillStore();
</script>

<template>
  <p role="status">
    {{ till.told }}
  </p>
</template>
