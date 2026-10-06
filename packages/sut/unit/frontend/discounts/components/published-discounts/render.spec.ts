import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import PublishedDiscounts from '@frontend/discounts/components/PublishedDiscounts.vue';
import { discountTexts } from '@frontend/discounts/texts';
import { publishedProduceDiscount } from '@sut/support/example-discounts';
import { aTestingDiscountsStore } from '@sut/unit/frontend/stores/discounts-store/a-testing-discounts-store';

const spicesDiscount = { id: 'spices-id', item: 'Peruvian spices', rate: '20', storeName: "Mike's Groceries", storeAddress: '12 Market Street' };

const setupSut = ({ discounts = [spicesDiscount] } = {}) =>
  mount(PublishedDiscounts, {
    props: { discounts },
    global: aTestingDiscountsStore().global,
  });

describe('Component PublishedDiscounts', () => {
  describe('showing a published discount', () => {
    it('should show its item', () => {
      const list = setupSut();

      expect(list.get('[data-testid="published-item"]').text()).to.equal('Peruvian spices');
    });
    it('should show its rate as a percentage', () => {
      const list = setupSut();

      expect(list.get('[data-testid="published-rate"]').text()).to.equal('20%');
    });
    it('should show its store name', () => {
      const list = setupSut();

      expect(list.get('[data-testid="published-store-name"]').text()).to.equal("Mike's Groceries");
    });
    it('should show its store address', () => {
      const list = setupSut();

      expect(list.get('[data-testid="published-store-address"]').text()).to.equal('12 Market Street');
    });
    it('should show other pieces for another discount', () => {
      const list = setupSut({
        discounts: [{ id: 'produce-id', item: 'Fresh produce', rate: '10', storeName: 'Corner Grocery', storeAddress: '3 Hill Road' }],
      });

      expect(list.get('[data-testid="published-item"]').text()).to.equal('Fresh produce');
      expect(list.get('[data-testid="published-rate"]').text()).to.equal('10%');
      expect(list.get('[data-testid="published-store-name"]').text()).to.equal('Corner Grocery');
      expect(list.get('[data-testid="published-store-address"]').text()).to.equal('3 Hill Road');
    });
    it('should show the item, store name and store address without their surrounding spaces', () => {
      const list = setupSut({
        discounts: [{ ...spicesDiscount, item: '  Peruvian spices ', storeName: " Mike's Groceries  ", storeAddress: '\t12 Market Street\n' }],
      });

      expect(list.get('[data-testid="published-item"]').element.textContent).to.equal('Peruvian spices');
      expect(list.get('[data-testid="published-store-name"]').element.textContent).to.equal("Mike's Groceries");
      expect(list.get('[data-testid="published-store-address"]').element.textContent).to.equal('12 Market Street');
    });
  });

  describe('none, one and many', () => {
    it('should say in one short line that nothing is published when there is no discount', () => {
      const list = setupSut({ discounts: [] });

      expect(list.get('[data-testid="nothing-published"]').text()).to.equal(discountTexts.nothingPublished);
    });
    it('should not say that nothing is published when a discount is', () => {
      const list = setupSut({ discounts: [spicesDiscount] });

      expect(list.find('[data-testid="nothing-published"]').exists()).to.equal(false);
    });
    it('should show one entry per discount when several are published, two identical discounts included', () => {
      const produceDiscount = { id: 'produce-id', item: 'Fresh produce', rate: '10', storeName: "Mike's Groceries", storeAddress: '12 Market Street' };
      const list = setupSut({ discounts: [spicesDiscount, produceDiscount, { ...produceDiscount, id: 'produce-again-id' }] });

      expect(list.findAll('[data-testid="published-discount"]').map((entry) => entry.get('[data-testid="published-item"]').text())).to.deep.equal([
        'Peruvian spices',
        'Fresh produce',
        'Fresh produce',
      ]);
    });
  });

  describe('A2 injection', () => {
    it('should show an item, store name and store address written as markup as plain text, never as markup', () => {
      const markup = { item: '<b>Peruvian spices</b>', storeName: '<i>Mike</i>', storeAddress: '<script>alert(1)</script>' };
      const list = setupSut({ discounts: [{ ...spicesDiscount, ...markup }] });

      expect(list.get('[data-testid="published-item"]').text()).to.equal(markup.item);
      expect(list.get('[data-testid="published-store-name"]').text()).to.equal(markup.storeName);
      expect(list.get('[data-testid="published-store-address"]').text()).to.equal(markup.storeAddress);
    });
  });

  describe('dependency failure', () => {
    it.todo('should say in one short line that the discounts cannot be shown right now and to try again');
    it.todo('should not say that nothing is published when the discounts cannot be shown');
  });

  describe('accessibility', () => {
    it.todo('should keep every discount readable in full with the text enlarged');
    it.todo('should present each discount to a screen reader as one entry with its item, rate, store name and store address');
  });
  describe('changing a rate', () => {
    it('should offer to change the rate on each entry', () => {
      const list = setupSut({ discounts: [spicesDiscount, publishedProduceDiscount] });

      const [spicesControl, produceControl] = list
        .findAll('[data-testid="published-discount"]')
        .map((entry) => entry.get('[data-testid="change-rate-form"]').attributes('aria-label') ?? '');

      expect(spicesControl).to.contain(spicesDiscount.item);
      expect(produceControl).to.contain(publishedProduceDiscount.item);
    });
  });
});
