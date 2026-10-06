import { getByRole, queryAllByRole } from '@testing-library/dom';
import { mount } from '@vue/test-utils';
import { describe, expect, it, onTestFinished } from 'vitest';

import GetCouponButton from '@frontend/discounts/components/GetCouponButton.vue';
import { discountTexts } from '@frontend/discounts/texts';
import { publishedSpicesDiscount } from '@sut/support/example-discounts';
import { aTestingDiscountsStore } from '@sut/unit/frontend/stores/discounts-store/a-testing-discounts-store';

const setupSut = () => {
  const control = mount(GetCouponButton, {
    attachTo: document.body,
    props: { discount: publishedSpicesDiscount, namedBy: 'entry-text' },
    global: aTestingDiscountsStore().global,
  });
  onTestFinished(() => control.unmount());
};

const setupSutNamedBy = (namedBy: string, name: string) => {
  const naming = document.createElement('p');
  naming.id = namedBy;
  naming.textContent = name;
  document.body.append(naming);
  const control = mount(GetCouponButton, {
    attachTo: document.body,
    props: { discount: publishedSpicesDiscount, namedBy },
    global: aTestingDiscountsStore().global,
  });
  onTestFinished(() => {
    control.unmount();
    naming.remove();
  });
};

describe('Component GetCouponButton', () => {
  describe('what the control offers', () => {
    it('should offer to get a coupon under its caption', () => {
      setupSut();

      expect(getByRole(document.body, 'button').textContent?.trim()).to.equal(discountTexts.getCoupon);
    });
    it('should name the discount it gets a coupon for in its label, for a person and a screen reader alike', () => {
      const name = 'Peruvian spices 20% Mike\'s Groceries 12 Market Street';
      setupSutNamedBy('spices-text', name);

      expect(queryAllByRole(document.body, 'button', { name: `${discountTexts.getCoupon} ${name}` }), 'buttons named by the caption and the discount').to.have.length(1);
    });
  });
});
