import { queryAllByRole } from '@testing-library/dom';
import { describe, expect, it } from 'vitest';

import RedeemCouponForm from '@frontend/discounts/components/RedeemCouponForm.vue';
import { discountTexts } from '@frontend/discounts/texts';
import { produceDiscount, spicesDiscount, stephaniesProduceDiscount } from '@sut/support/example-discounts';

import { aFormOfferingTheStores } from '../a-form-offering-the-stores';

const theStoreOf = ({ storeName, storeAddress }: typeof produceDiscount) => ({ storeName, storeAddress });

const theCornerGrocery = theStoreOf(produceDiscount);

const setupSut = ({ stores = [theCornerGrocery] } = {}) => aFormOfferingTheStores(RedeemCouponForm, stores);

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
    it('should offer other stores, each by its name and address, when given others', () => {
      setupSut({ stores: [theStoreOf(stephaniesProduceDiscount), theStoreOf(spicesDiscount)] });

      const offered = ["Stephanie's Market, 8 Orchard Lane", "Mike's Groceries, 12 Market Street"].map(
        (name) => theStorePickers().flatMap((picker) => queryAllByRole(picker, 'option', { name })).length,
      );
      expect(offered, 'times each store is offered').to.deep.equal([1, 1]);
    });
    it('should have no store picked until Stephanie picks one', () => {
      setupSut();

      expect(theStorePickers().map((picker) => picker.value), 'the store picked when the till opens').to.deep.equal(['']);
    });
    it('should ask for the coupon\'s code under its caption', () => {
      setupSut();

      expect(queryAllByRole(document.body, 'textbox', { name: discountTexts.couponCode }), 'code fields under the caption').to.have.length(1);
    });
    it('should offer to redeem the coupon under its caption', () => {
      setupSut();

      expect(queryAllByRole(document.body, 'button', { name: discountTexts.redeem }), 'redeem buttons').to.have.length(1);
    });
  });
});
