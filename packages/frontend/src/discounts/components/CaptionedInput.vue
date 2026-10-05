<script setup lang="ts">
defineProps<{ caption: string; testId: string }>();
</script>

<template>
  <label :data-testid="`${testId}-field`">
    {{ caption }}
    <input :data-testid="testId">
  </label>
</template>
