import { mock } from 'vitest-mock-extended';
import { describe, expect, it } from 'vitest';

import { DiscountDetails } from '@backend/discounts/application/domain/discount-details';
import { DiscountFactory } from '@backend/discounts/application/domain/discount-factory';
import type { DomainEventPublisher } from '@backend/discounts/application/domain/domain-event-publisher';

const spicesDiscount = { item: 'Peruvian spices', rate: 20, storeName: "Mike's Groceries", storeAddress: '12 Market Street' };

const setupSut = () => {
  const events = mock<DomainEventPublisher>();
  return { events, factory: new DiscountFactory(events) };
};

describe('class Discount', () => {
  describe('publishing a discount', () => {
    describe('the discount published', () => {
      it('should hold the item, rate, store name and store address it was published with', () => {
        const { factory } = setupSut();
        const discount = factory.create(new DiscountDetails(spicesDiscount));

        discount.publish();

        expect(discount.toJSON()).to.deep.include(spicesDiscount);
      });
      it.todo('should raise DiscountPublished carrying the item, rate, store name and store address');
      it.todo('should give each published discount an identity of its own, two identical discounts included');
    });

    describe('type', () => {
      it.todo('should keep an item, store name and store address written with accents, apostrophes and emoji exactly as written');
    });

    describe('empty', () => {
      it.todo('should refuse an item made only of blank space, its rejection naming the item as missing');
      it.todo('should refuse a store name made only of blank space, its rejection naming the store name as missing');
      it.todo('should refuse a store address made only of blank space, its rejection naming the store address as missing');
    });

    describe('boundary', () => {
      it.todo('should refuse an item longer than allowed');
      it.todo('should refuse a store name longer than allowed');
      it.todo('should refuse a store address longer than allowed');
    });
  });
});
