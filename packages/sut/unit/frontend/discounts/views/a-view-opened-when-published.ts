import { createTestingPinia } from '@pinia/testing';
import { flushPromises, mount } from '@vue/test-utils';
import { vi } from 'vitest';
import { mock } from 'vitest-mock-extended';
import type { Component } from 'vue';

import type { DiscountResponse } from '@app/types/discounts';
import type { RestApi } from '@app/types/rest-api';
import { restApiKey } from '@frontend/rest-api-key';

export const aViewOpenedWhenPublished = async (view: Component, published: DiscountResponse[], restApi = mock<RestApi>()) => {
  restApi.get.mockResolvedValue(published);
  const opened = mount(view, {
    global: { plugins: [createTestingPinia({ createSpy: vi.fn, stubActions: false })], provide: { [restApiKey]: restApi } },
  });
  await flushPromises();
  return opened;
};
