<script setup lang="ts">
defineProps<{ caption: string; testId: string; told?: string; required?: boolean }>();

const value = defineModel<string>({ required: true });
</script>

<template>
  <div :data-testid="`${testId}-field`">
    <label class="flex flex-col gap-1 text-sm font-medium">
      {{ caption }}
      <input
        v-model="value"
        class="font-normal"
        :data-testid="testId"
        :required="required"
      >
    </label>
    <p
      v-if="told"
      role="status"
      class="mt-1 text-sm text-alert"
    >
      {{ told }}
    </p>
  </div>
</template>
