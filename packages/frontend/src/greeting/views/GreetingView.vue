<script setup lang="ts">
import { onMounted, ref } from 'vue';

import type { Greeting } from '@app/types/greeting';

import { useRestApi } from '../../rest-api-key';
import NewGreetingForm from '../components/NewGreetingForm.vue';
import { greetingTexts } from '../texts';

const restApi = useRestApi();
const greeting = ref('');

const showLatestGreeting = async (): Promise<void> => {
  greeting.value = (await restApi.get<Greeting>('/greeting')).text;
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
  <NewGreetingForm @saved="showLatestGreeting" />
</template>
