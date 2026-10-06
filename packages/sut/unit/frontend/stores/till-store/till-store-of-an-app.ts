import { useTillStore } from '@frontend/stores/till-store';

import { anAppWithItsRestApi } from '../an-app-with-its-rest-api';

export const setupSut = () => {
  const { restApi, pinia } = anAppWithItsRestApi();
  return { restApi, till: useTillStore(pinia) };
};
