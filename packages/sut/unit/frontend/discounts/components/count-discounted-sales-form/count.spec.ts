import type { VueWrapper } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import CountDiscountedSalesForm from '@frontend/discounts/components/CountDiscountedSalesForm.vue';
import { spicesDiscount, stephaniesProduceDiscount } from '@sut/support/example-discounts';

import { aFormOfferingTheStores } from '../a-form-offering-the-stores';

const theStoreOf = ({ storeName, storeAddress }: typeof spicesDiscount) => ({ storeName, storeAddress });

const setupSut = () => aFormOfferingTheStores(CountDiscountedSalesForm, [theStoreOf(spicesDiscount), theStoreOf(stephaniesProduceDiscount)]);

const countThroughTheForm = async (form: VueWrapper, storeShown: string): Promise<void> => {
  const picker = form.get<HTMLSelectElement>('select');
  picker.element.selectedIndex = [...picker.element.options].findIndex((option) => option.text.trim() === storeShown);
  await picker.trigger('change');
  await form.get('form').trigger('submit');
};

describe('Component CountDiscountedSalesForm', () => {
  describe('counting the sales of the store picked', () => {
    it('should count the discounted sales of the store picked', async () => {
      const { form, discounts } = setupSut();

      await countThroughTheForm(form, "Mike's Groceries, 12 Market Street");

      expect(discounts.countDiscountedSales).to.have.been.calledWith({ storeName: "Mike's Groceries", storeAddress: '12 Market Street' });
    });
    it.todo('should name the item of each discount counted');
    it.todo('should show the rate of each discount counted');
    it.todo('should show the number of discounted sales counted for each discount under its caption');

    describe('state', () => {
      it.todo('should show no count before the sales are counted');
      it.todo('should count once when Rodrigo counts twice before the first count answers');
    });

    describe('empty', () => {
      it.todo('should show a discount with no sales since the last count with none counted');
    });

    describe('dependency failure', () => {
      it.todo('should tell Rodrigo the sales could not be counted and to try again');
    });
  });
});
