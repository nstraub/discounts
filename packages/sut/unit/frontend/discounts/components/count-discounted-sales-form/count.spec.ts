import type { VueWrapper } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import type { CountResponse } from '@app/types/discounts';
import CountDiscountedSalesForm from '@frontend/discounts/components/CountDiscountedSalesForm.vue';
import { spicesDiscount, stephaniesProduceDiscount } from '@sut/support/example-discounts';

import { aFormOfferingTheStores } from '../a-form-offering-the-stores';

const theStoreOf = ({ storeName, storeAddress }: typeof spicesDiscount) => ({ storeName, storeAddress });

const setupSut = () => aFormOfferingTheStores(CountDiscountedSalesForm, [theStoreOf(spicesDiscount), theStoreOf(stephaniesProduceDiscount)]);

const setupSutCountingTo = (counted: CountResponse) => {
  const sut = setupSut();
  vi.mocked(sut.discounts.countDiscountedSales).mockImplementation(async () => {
    sut.discounts.counted = counted;
  });
  return sut;
};

const stephaniesProduceCounted = { id: 'produce-id', item: stephaniesProduceDiscount.item, rate: stephaniesProduceDiscount.rate, discountedSales: 3 };

const mikesSpicesCounted = { id: 'spices-id', item: spicesDiscount.item, rate: spicesDiscount.rate, discountedSales: 1 };

const whatTheCountShowsFor = (form: VueWrapper, testId: string) => form.findAll(`[data-testid="${testId}"]`).map((shown) => shown.text());

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
    it('should count the discounted sales of another store when Rodrigo picks another', async () => {
      const { form, discounts } = setupSut();

      await countThroughTheForm(form, "Stephanie's Market, 8 Orchard Lane");

      expect(discounts.countDiscountedSales).to.have.been.calledWith({ storeName: "Stephanie's Market", storeAddress: '8 Orchard Lane' });
    });
    it('should name the item of each discount counted', async () => {
      const { form } = setupSutCountingTo([stephaniesProduceCounted]);

      await countThroughTheForm(form, "Stephanie's Market, 8 Orchard Lane");

      expect(whatTheCountShowsFor(form, 'counted-item'), 'the items counted').to.deep.equal(['Organic produce']);
    });
    it('should name the item of every discount counted when several are', async () => {
      const { form } = setupSutCountingTo([mikesSpicesCounted, stephaniesProduceCounted]);

      await countThroughTheForm(form, "Stephanie's Market, 8 Orchard Lane");

      expect(whatTheCountShowsFor(form, 'counted-item'), 'the items counted').to.deep.equal(['Peruvian spices', 'Organic produce']);
    });
    it('should show the rate of each discount counted', async () => {
      const { form } = setupSutCountingTo([stephaniesProduceCounted]);

      await countThroughTheForm(form, "Stephanie's Market, 8 Orchard Lane");

      expect(whatTheCountShowsFor(form, 'counted-rate'), 'the rates counted').to.deep.equal(['15%']);
    });
    it('should show the rate of every discount counted when several are', async () => {
      const { form } = setupSutCountingTo([mikesSpicesCounted, stephaniesProduceCounted]);

      await countThroughTheForm(form, "Stephanie's Market, 8 Orchard Lane");

      expect(whatTheCountShowsFor(form, 'counted-rate'), 'the rates counted').to.deep.equal(['20%', '15%']);
    });
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
