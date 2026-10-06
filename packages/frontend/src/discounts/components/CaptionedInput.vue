<script setup lang="ts">
defineProps<{ caption: string; testId: string }>();

const value = defineModel<string>({ required: true });
</script>

<template>
  <label
    class="flex flex-col gap-1"
    :data-testid="`${testId}-field`"
  >
    {{ caption }}
    <input
      v-model="value"
      class="rounded border border-gray-400 px-2 py-1"
      :data-testid="testId"
    >
  </label>
</template>
