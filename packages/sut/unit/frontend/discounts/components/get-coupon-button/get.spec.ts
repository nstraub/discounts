import { describe, expect, it } from 'vitest';

import GetCouponButton from '@frontend/discounts/components/GetCouponButton.vue';
import { publishedSpicesDiscount } from '@sut/support/example-discounts';

import { anEntryControlFor } from '../an-entry-control';

const setupSut = ({ discount = publishedSpicesDiscount } = {}) => anEntryControlFor(GetCouponButton, discount);

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
