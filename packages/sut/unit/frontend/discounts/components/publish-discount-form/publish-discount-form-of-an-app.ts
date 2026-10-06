import { mount } from '@vue/test-utils';
import { onTestFinished } from 'vitest';

import PublishDiscountForm from '@frontend/discounts/components/PublishDiscountForm.vue';
import { useDiscountsStore } from '@frontend/stores/discounts-store';
import { aTestingDiscountsStore } from '@sut/unit/frontend/stores/discounts-store/a-testing-discounts-store';

export const setupSut = () => {
  const { pinia, global } = aTestingDiscountsStore();
  const form = mount(PublishDiscountForm, { attachTo: document.body, global });
  onTestFinished(() => form.unmount());
  return { form, discounts: useDiscountsStore(pinia) };
};
