<script setup lang="ts">
import { ref } from 'vue';

import { useRestApi } from '../../rest-api-key';
import { greetingTexts } from '../texts';

const emit = defineEmits<{ saved: [] }>();

const restApi = useRestApi();
const newGreeting = ref('');

const saveNewGreeting = async (): Promise<void> => {
  await restApi.put('/greeting', { text: newGreeting.value });
  emit('saved');
};
</script>

<template>
  <form class="mt-4 flex items-end gap-2">
    <label class="flex flex-col">
      {{ greetingTexts.newGreetingLabel }}
      <input
        v-model="newGreeting"
        class="rounded border px-2 py-1"
        data-testid="new-greeting"
      >
    </label>
    <button
      type="button"
      class="rounded border px-3 py-1"
      data-testid="save-greeting"
      @click="saveNewGreeting"
    >
      {{ greetingTexts.save }}
    </button>
  </form>
</template>
