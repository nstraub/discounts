<script setup lang="ts">
defineProps<{ caption: string; testId: string }>();

const value = defineModel<string>({ required: true });
</script>

<template>
  <div :data-testid="`${testId}-field`">
    <label class="flex flex-col gap-1">
      {{ caption }}
      <input
        v-model="value"
        class="rounded border border-gray-400 px-2 py-1"
        :data-testid="testId"
      >
    </label>
  </div>
</template>
