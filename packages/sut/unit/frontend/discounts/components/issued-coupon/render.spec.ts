import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import IssuedCoupon from '@frontend/discounts/components/IssuedCoupon.vue';
import { couponForTheProduceDiscount, couponForTheSpicesDiscount } from '@sut/support/example-discounts';

const setupSut = ({ coupon = couponForTheSpicesDiscount } = {}) => mount(IssuedCoupon, { props: { coupon } });

describe('Component IssuedCoupon', () => {
  describe('showing the coupon Sue got', () => {
    it('should show its code', () => {
      const shown = setupSut();

      expect(shown.get('[data-testid="coupon-code"]').text().replaceAll(' ', '')).to.equal(couponForTheSpicesDiscount.token);
    });
    it('should show its code as two groups of five characters', () => {
      const shown = setupSut();

      expect(shown.get('[data-testid="coupon-code"]').text()).to.equal('7K3QX 9M2PD');
    });
    it('should show the code of another coupon in its two groups', () => {
      const shown = setupSut({ coupon: couponForTheProduceDiscount });

      expect(shown.get('[data-testid="coupon-code"]').text()).to.equal('R4WZ0 BH8NE');
    });
    it.todo('should show the store it is for under its caption');
    it.todo('should show the address of its store and the item it is for');
  });
});
