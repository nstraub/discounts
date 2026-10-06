import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import IssuedCoupon from '@frontend/discounts/components/IssuedCoupon.vue';
import { couponForTheSpicesDiscount } from '@sut/support/example-discounts';

const setupSut = ({ coupon = couponForTheSpicesDiscount } = {}) => mount(IssuedCoupon, { props: { coupon } });

describe('Component IssuedCoupon', () => {
  describe('showing the coupon Sue got', () => {
    it('should show its code', () => {
      const shown = setupSut();

      expect(shown.get('[data-testid="coupon-code"]').text().replaceAll(' ', '')).to.equal(couponForTheSpicesDiscount.token);
    });
    it.todo('should show its code as two groups of five characters');
    it.todo('should show the store it is for under its caption');
    it.todo('should show the address of its store and the item it is for');
  });
});
