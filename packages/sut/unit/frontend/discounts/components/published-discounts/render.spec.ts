import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import PublishedDiscounts from '@frontend/discounts/components/PublishedDiscounts.vue';
import { discountTexts } from '@frontend/discounts/texts';

const spicesDiscount = { id: 'spices-id', item: 'Peruvian spices', rate: 20, storeName: "Mike's Groceries", storeAddress: '12 Market Street' };

const setupSut = ({ discounts = [spicesDiscount] } = {}) => mount(PublishedDiscounts, { props: { discounts } });

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
        discounts: [{ id: 'produce-id', item: 'Fresh produce', rate: 10, storeName: 'Corner Grocery', storeAddress: '3 Hill Road' }],
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

  describe('empty', () => {
    it('should say in one short line that nothing is published when there is no discount', () => {
      const list = setupSut({ discounts: [] });

      expect(list.get('[data-testid="nothing-published"]').text()).to.equal(discountTexts.nothingPublished);
    });
    it('should not say that nothing is published when a discount is', () => {
      const list = setupSut({ discounts: [spicesDiscount] });

      expect(list.find('[data-testid="nothing-published"]').exists()).to.equal(false);
    });
    it('should show one entry per discount when several are published, two identical discounts included', () => {
      const produceDiscount = { id: 'produce-id', item: 'Fresh produce', rate: 10, storeName: "Mike's Groceries", storeAddress: '12 Market Street' };
      const list = setupSut({ discounts: [spicesDiscount, produceDiscount, { ...produceDiscount, id: 'produce-again-id' }] });

      expect(list.findAll('[data-testid="published-discount"]').map((entry) => entry.get('[data-testid="published-item"]').text())).to.deep.equal([
        'Peruvian spices',
        'Fresh produce',
        'Fresh produce',
      ]);
    });
  });

  describe('A2 injection', () => {
    it.todo('should show an item, store name and store address written as markup as plain text, never as markup');
  });
});
