import { createPinia } from 'pinia';
import { mock } from 'vitest-mock-extended';
import { createApp } from 'vue';

import type { RestApi } from '@app/types/rest-api';
import { restApiKey } from '@frontend/rest-api-key';
import { useDiscountsStore } from '@frontend/stores/discounts-store';

export const setupSut = () => {
  const restApi = mock<RestApi>();
  const pinia = createPinia();
  createApp({}).provide(restApiKey, restApi).use(pinia);
  return { restApi, discounts: useDiscountsStore(pinia) };
};
