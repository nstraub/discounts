import { mock } from 'vitest-mock-extended';
import { describe, expect, it, vi } from 'vitest';

import { DiscountDetails } from '@backend/discounts/application/domain/discount-details';
import { DiscountPublished } from '@backend/discounts/application/domain/discount-published';
import { DiscountFactory } from '@backend/discounts/application/domain/discount-factory';
import type { DomainEventPublisher } from '@backend/discounts/application/domain/domain-event-publisher';

vi.unmock('uuid');

const spicesDiscount = { item: 'Peruvian spices', rate: 20, storeName: "Mike's Groceries", storeAddress: '12 Market Street' };

const setupSut = () => {
  const events = mock<DomainEventPublisher>();
  const factory = new DiscountFactory(events);
  return { events, discountWith: (details: typeof spicesDiscount) => factory.create(new DiscountDetails(details)) };
};

describe('class Discount', () => {
  describe('publishing a discount', () => {
    describe('the discount published', () => {
      it('should hold the item, rate, store name and store address it was published with', () => {
        const { discountWith } = setupSut();
        const discount = discountWith(spicesDiscount);

        discount.publish();

        expect(discount.toJSON()).to.deep.include(spicesDiscount);
      });
      it('should raise DiscountPublished carrying the item, rate, store name and store address', () => {
        const { events, discountWith } = setupSut();
        const discount = discountWith(spicesDiscount);

        discount.publish();

        const [published] = events.publish.mock.lastCall ?? [];
        expect(published).to.be.instanceOf(DiscountPublished);
        expect((published as DiscountPublished).discount).to.deep.include(spicesDiscount);
      });
      it('should give each published discount an identity of its own, two identical discounts included', () => {
        const { discountWith } = setupSut();
        const first = discountWith(spicesDiscount);
        const second = discountWith(spicesDiscount);

        first.publish();
        second.publish();

        expect(first.toJSON().id).to.not.equal(second.toJSON().id);
      });
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
