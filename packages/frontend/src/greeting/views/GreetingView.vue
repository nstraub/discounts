<script setup lang="ts">
import { onMounted, ref } from 'vue';

import type { Greeting } from '@app/types/greeting';

import { useRestApi } from '../../rest-api-key';
import { greetingTexts } from '../texts';

const restApi = useRestApi();
const greeting = ref('');

onMounted(async () => {
  greeting.value = (await restApi.get<Greeting>('/greeting')).text;
});
</script>

<template>
  <h1 class="text-2xl font-semibold">
    {{ greetingTexts.heading }}
  </h1>
  <p data-testid="greeting">
    {{ greeting }}
  </p>
</template>
