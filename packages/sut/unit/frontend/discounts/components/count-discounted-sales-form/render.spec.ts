import { describe, expect, it } from 'vitest';

import CountDiscountedSalesForm from '@frontend/discounts/components/CountDiscountedSalesForm.vue';
import { discountTexts } from '@frontend/discounts/texts';
import { stephaniesProduceDiscount } from '@sut/support/example-discounts';

import { aFormOfferingTheStores, theStorePickersUnder, theStoresOfferedUnder, whetherEachStorePickerUnderRequiresAStore } from '../a-form-offering-the-stores';

const theStoreOf = ({ storeName, storeAddress }: typeof stephaniesProduceDiscount) => ({ storeName, storeAddress });

const stephaniesMarket = theStoreOf(stephaniesProduceDiscount);

const setupSut = ({ stores = [stephaniesMarket] } = {}) => aFormOfferingTheStores(CountDiscountedSalesForm, stores);

const theStorePickers = () => theStorePickersUnder(discountTexts.store);

describe('Component CountDiscountedSalesForm', () => {
  describe('what the count asks for', () => {
    it('should ask for the store under its caption', () => {
      setupSut();

      expect(theStorePickers(), 'store pickers under the caption').to.have.length(1);
    });
    it('should require a store to be picked before the sales are counted', () => {
      setupSut();

      expect(whetherEachStorePickerUnderRequiresAStore(discountTexts.store), 'the store picker required').to.deep.equal([true]);
    });
    it('should offer each store it is given as its name and address', () => {
      setupSut({ stores: [stephaniesMarket] });

      const offered = theStoresOfferedUnder(discountTexts.store, "Stephanie's Market, 8 Orchard Lane");
      expect(offered, "Stephanie's Market offered by its name and address").to.have.length(1);
    });
    it.todo('should offer to count the discounted sales under its caption');
  });
});
