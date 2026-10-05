<script setup lang="ts">
defineProps<{ caption: string; testId: string }>();

const value = defineModel<string>({ required: true });
</script>

<template>
  <label :data-testid="`${testId}-field`">
    {{ caption }}
    <input
      v-model="value"
      :data-testid="testId"
    >
  </label>
</template>
