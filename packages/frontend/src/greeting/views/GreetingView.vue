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
  <p data-testid="greeting">
    {{ greeting }}
  </p>
  <form>
    <label>
      {{ greetingTexts.newGreetingLabel }}
      <input
        v-model="newGreeting"
        data-testid="new-greeting"
      >
    </label>
    <button
      type="button"
      data-testid="save-greeting"
      @click="saveNewGreeting"
    >
      {{ greetingTexts.save }}
    </button>
  </form>
</template>
