import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import PublishedDiscounts from '@frontend/discounts/components/PublishedDiscounts.vue';

const spicesDiscount = { id: 'spices-id', item: 'Peruvian spices', rate: 20, storeName: "Mike's Groceries", storeAddress: '12 Market Street' };

describe('Component PublishedDiscounts', () => {
  describe('showing a published discount', () => {
    it('should show its item', () => {
      const list = mount(PublishedDiscounts, { props: { discounts: [spicesDiscount] } });

      expect(list.get('[data-testid="published-item"]').text()).to.equal('Peruvian spices');
    });
    it('should show its rate as a percentage', () => {
      const list = mount(PublishedDiscounts, { props: { discounts: [spicesDiscount] } });

      expect(list.get('[data-testid="published-rate"]').text()).to.equal('20%');
    });
    it.todo('should show its store name');
    it.todo('should show its store address');
    it.todo('should show the item, store name and store address without their surrounding spaces');
  });

  describe('empty', () => {
    it.todo('should say in one short line that nothing is published when there is no discount');
    it.todo('should show one entry per discount when several are published, two identical discounts included');
  });

  describe('A2 injection', () => {
    it.todo('should show an item, store name and store address written as markup as plain text, never as markup');
  });
});
