import { mount } from '@vue/test-utils';
import { onTestFinished } from 'vitest';
import type { Component } from 'vue';

import type { DiscountResponse } from '@app/types/discounts';
import { useDiscountsStore } from '@frontend/stores/discounts-store';
import { aTestingDiscountsStore } from '@sut/unit/frontend/stores/discounts-store/a-testing-discounts-store';

export const anEntryControlFor = (control: Component, discount: DiscountResponse) => {
  const { pinia, global } = aTestingDiscountsStore();
  const mounted = mount(control, { attachTo: document.body, props: { discount, namedBy: 'entry-text' }, global });
  onTestFinished(() => mounted.unmount());
  return { control: mounted, discounts: useDiscountsStore(pinia) };
};
