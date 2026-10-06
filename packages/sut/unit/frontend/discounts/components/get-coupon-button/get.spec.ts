import { mount } from '@vue/test-utils';
import { describe, expect, it, onTestFinished } from 'vitest';

import GetCouponButton from '@frontend/discounts/components/GetCouponButton.vue';
import { useDiscountsStore } from '@frontend/stores/discounts-store';
import { publishedSpicesDiscount } from '@sut/support/example-discounts';
import { aTestingDiscountsStore } from '@sut/unit/frontend/stores/discounts-store/a-testing-discounts-store';

const setupSut = ({ discount = publishedSpicesDiscount } = {}) => {
  const { pinia, global } = aTestingDiscountsStore();
  const control = mount(GetCouponButton, { attachTo: document.body, props: { discount, namedBy: 'entry-text' }, global });
  onTestFinished(() => control.unmount());
  return { control, discounts: useDiscountsStore(pinia) };
};

describe('Component GetCouponButton', () => {
  describe('getting a coupon for its discount', () => {
    it('should ask for a coupon for its own discount when Sue decides to try it', async () => {
      const { control, discounts } = setupSut();

      await control.get('button').trigger('click');

      expect(discounts.getCoupon).to.have.been.calledWith('spices-id');
    });

    describe('state', () => {
      it.todo('should ask once when Sue decides twice before the first answer');
    });
  });
});
