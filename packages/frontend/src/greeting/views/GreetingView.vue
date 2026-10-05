<script setup lang="ts">
import { onMounted, ref } from 'vue';

import type { Greeting } from '@app/types/greeting';

import { useRestApi } from '../../rest-api-key';
import { greetingTexts } from '../texts';

const restApi = useRestApi();
const greeting = ref('');
const newGreeting = ref('');

const showLatestGreeting = async (): Promise<void> => {
  greeting.value = (await restApi.get<Greeting>('/greeting')).text;
};

const saveNewGreeting = async (): Promise<void> => {
  await restApi.put('/greeting', { text: newGreeting.value });
  await showLatestGreeting();
};

onMounted(showLatestGreeting);
</script>

<template>
  <h1 class="text-2xl font-semibold">
    {{ greetingTexts.heading }}
  </h1>
  <p
    class="mt-2"
    data-testid="greeting"
  >
    {{ greeting }}
  </p>
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
