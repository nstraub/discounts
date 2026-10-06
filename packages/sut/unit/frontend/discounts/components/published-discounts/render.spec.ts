import { queryAllByRole } from '@testing-library/dom';
import { mount } from '@vue/test-utils';
import { describe, expect, it, onTestFinished } from 'vitest';

import type { DiscountResponse } from '@app/types/discounts';
import PublishedDiscounts from '@frontend/discounts/components/PublishedDiscounts.vue';
import { discountTexts } from '@frontend/discounts/texts';
import { publishedProduceDiscount, publishedSpicesDiscount, spicesDiscountWithItsHook } from '@sut/support/example-discounts';
import { aTestingDiscountsStore } from '@sut/unit/frontend/stores/discounts-store/a-testing-discounts-store';

const setupSut = ({ discounts = [publishedSpicesDiscount] }: { discounts?: DiscountResponse[] } = {}) =>
  mount(PublishedDiscounts, {
    props: { discounts },
    global: aTestingDiscountsStore().global,
  });

const setupSutInTheDocument = ({ discounts = [publishedSpicesDiscount] } = {}) => {
  const list = mount(PublishedDiscounts, {
    attachTo: document.body,
    props: { discounts },
    global: aTestingDiscountsStore().global,
  });
  onTestFinished(() => list.unmount());
};

const namingTheWholeOf = ({ item, rate, storeName, storeAddress }: DiscountResponse) => (name: string) =>
  [item, `${rate}%`, storeName, storeAddress].every((shown) => name.includes(shown));

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
      const list = setupSut({ discounts: [publishedProduceDiscount] });

      expect(list.get('[data-testid="published-item"]').text()).to.equal('Fresh produce');
      expect(list.get('[data-testid="published-rate"]').text()).to.equal('10%');
      expect(list.get('[data-testid="published-store-name"]').text()).to.equal('Corner Grocery');
      expect(list.get('[data-testid="published-store-address"]').text()).to.equal('3 Hill Road');
    });
    it('should show the item, store name and store address without their surrounding spaces', () => {
      const list = setupSut({
        discounts: [{ ...publishedSpicesDiscount, item: '  Peruvian spices ', storeName: " Mike's Groceries  ", storeAddress: '\t12 Market Street\n' }],
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
      const list = setupSut({ discounts: [publishedSpicesDiscount] });

      expect(list.find('[data-testid="nothing-published"]').exists()).to.equal(false);
    });
    it('should show one entry per discount when several are published, two identical discounts included', () => {
      const list = setupSut({ discounts: [publishedSpicesDiscount, publishedProduceDiscount, { ...publishedProduceDiscount, id: 'produce-again-id' }] });

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
      const list = setupSut({ discounts: [{ ...publishedSpicesDiscount, ...markup }] });

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
    it('should offer to change the rate on each entry, named by what the entry shows', () => {
      setupSutInTheDocument({ discounts: [publishedSpicesDiscount, publishedProduceDiscount] });

      expect(queryAllByRole(document.body, 'form', { name: namingTheWholeOf(publishedSpicesDiscount) })).to.have.length(1);
      expect(queryAllByRole(document.body, 'form', { name: namingTheWholeOf(publishedProduceDiscount) })).to.have.length(1);
    });
  });
  describe('showing the hook of a discount', () => {
    it('should show its hook', () => {
      const list = setupSut({ discounts: [{ id: 'spices-id', ...spicesDiscountWithItsHook }] });

      expect(list.get('[data-testid="published-hook"]').text()).to.equal(spicesDiscountWithItsHook.hook);
    });
    it('should show only its item, rate, store name and store address when it has no hook, with no empty place for one', () => {
      const list = setupSut({ discounts: [publishedSpicesDiscount] });

      const shown = list.get('[data-testid="published-discount-text"]').findAll('[data-testid]');

      expect(shown.map((element) => element.attributes('data-testid'))).to.deep.equal(['published-item', 'published-rate', 'published-store-name', 'published-store-address']);
    });
    it('should show each hook on its own discount\'s entry, the entry without one showing none', () => {
      const list = setupSut({ discounts: [{ id: 'spices-id', ...spicesDiscountWithItsHook }, publishedProduceDiscount] });

      const [spices, produce] = list.findAll('[data-testid="published-discount"]');

      expect(spices?.get('[data-testid="published-hook"]').text()).to.equal(spicesDiscountWithItsHook.hook);
      expect(produce?.find('[data-testid="published-hook"]').exists(), 'a hook on the entry of a discount without one').to.equal(false);
    });
    it('should show its hook without its surrounding spaces', () => {
      const list = setupSut({ discounts: [{ ...publishedSpicesDiscount, hook: `  ${spicesDiscountWithItsHook.hook}\n` }] });

      expect(list.get('[data-testid="published-hook"]').element.textContent).to.equal(spicesDiscountWithItsHook.hook);
    });
    it.todo('should keep the line breaks its hook is written with');
  });

  describe('A2 injection through the hook', () => {
    it.todo('should show a hook written as markup as plain text, never as markup');
    it.todo('should show a web address in a hook as plain text, never as a link');
  });
});
