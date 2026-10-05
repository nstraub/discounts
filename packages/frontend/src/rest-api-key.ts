import { inject, type InjectionKey } from 'vue';

import type { RestApi } from '@app/types/rest-api';

export const restApiKey: InjectionKey<RestApi> = Symbol('RestApi');

export const useRestApi = (): RestApi => {
  const restApi = inject(restApiKey);
  if (!restApi) {
    throw new Error('No RestApi was provided; main.ts provides the one the app uses');
  }
  return restApi;
};
