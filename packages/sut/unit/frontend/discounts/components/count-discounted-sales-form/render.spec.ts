import { queryAllByRole } from '@testing-library/dom';
import { describe, expect, it } from 'vitest';

import CountDiscountedSalesForm from '@frontend/discounts/components/CountDiscountedSalesForm.vue';
import { discountTexts } from '@frontend/discounts/texts';

import { aFormOfferingTheStores } from '../a-form-offering-the-stores';

const setupSut = () => aFormOfferingTheStores(CountDiscountedSalesForm, []);

const theStorePickers = () => queryAllByRole<HTMLSelectElement>(document.body, 'combobox', { name: discountTexts.store });

describe('Component CountDiscountedSalesForm', () => {
  describe('what the count asks for', () => {
    it('should ask for the store under its caption', () => {
      setupSut();

      expect(queryAllByRole(document.body, 'combobox', { name: discountTexts.store }), 'store pickers under the caption').to.have.length(1);
    });
    it('should require a store to be picked before the sales are counted', () => {
      setupSut();

      expect(theStorePickers().map((picker) => picker.required), 'the store picker required').to.deep.equal([true]);
    });
    it.todo('should offer each store it is given as its name and address');
    it.todo('should offer to count the discounted sales under its caption');
  });
});
