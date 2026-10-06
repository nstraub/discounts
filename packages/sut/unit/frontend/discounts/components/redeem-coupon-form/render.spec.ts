import { queryAllByRole } from '@testing-library/dom';
import { mount } from '@vue/test-utils';
import { describe, expect, it, onTestFinished } from 'vitest';

import RedeemCouponForm from '@frontend/discounts/components/RedeemCouponForm.vue';
import { discountTexts } from '@frontend/discounts/texts';
import { produceDiscount } from '@sut/support/example-discounts';
import { aTestingDiscountsStore } from '@sut/unit/frontend/stores/discounts-store/a-testing-discounts-store';

const theCornerGrocery = { storeName: produceDiscount.storeName, storeAddress: produceDiscount.storeAddress };

const setupSut = ({ stores = [theCornerGrocery] } = {}) => {
  const form = mount(RedeemCouponForm, { attachTo: document.body, props: { stores }, global: aTestingDiscountsStore().global });
  onTestFinished(() => form.unmount());
  return form;
};

const theStorePickers = () => queryAllByRole<HTMLSelectElement>(document.body, 'combobox', { name: discountTexts.yourStore });

describe('Component RedeemCouponForm', () => {
  describe('what the till asks for', () => {
    it('should ask for the store under its caption', () => {
      setupSut();

      expect(theStorePickers(), 'store pickers under the caption').to.have.length(1);
    });
    it('should require a store to be picked before the coupon is redeemed', () => {
      setupSut();

      expect(theStorePickers().map((picker) => picker.required), 'the store picker required').to.deep.equal([true]);
    });
    it('should offer each store it is given as its name and address', () => {
      setupSut({ stores: [theCornerGrocery] });

      const offered = theStorePickers().flatMap((picker) => queryAllByRole(picker, 'option', { name: 'Corner Grocery, 3 Hill Road' }));
      expect(offered, 'the Corner Grocery offered by its name and address').to.have.length(1);
    });
    it.todo('should ask for the coupon\'s code under its caption');
    it.todo('should offer to redeem the coupon under its caption');
  });
});
