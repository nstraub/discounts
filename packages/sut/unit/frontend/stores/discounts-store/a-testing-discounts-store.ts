import { createTestingPinia } from '@pinia/testing';
import { vi } from 'vitest';
import { mock } from 'vitest-mock-extended';

import type { RestApi } from '@app/types/rest-api';
import { restApiKey } from '@frontend/rest-api-key';

export const aTestingDiscountsStore = () => {
  const pinia = createTestingPinia({ createSpy: vi.fn });
  return { pinia, global: { plugins: [pinia], provide: { [restApiKey]: mock<RestApi>() } } };
};
