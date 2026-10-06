import { useDiscountsStore } from '@frontend/stores/discounts-store';

import { anAppWithItsRestApi } from '../an-app-with-its-rest-api';

export const setupSut = () => {
  const { restApi, pinia } = anAppWithItsRestApi();
  return { restApi, discounts: useDiscountsStore(pinia) };
};
