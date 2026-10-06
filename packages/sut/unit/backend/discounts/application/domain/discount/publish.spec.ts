import { mock } from 'vitest-mock-extended';
import { describe, expect, it } from 'vitest';

import { DiscountDetails } from '@backend/discounts/application/domain/discount-details';
import { DiscountPublished } from '@backend/discounts/application/domain/discount-published';
import { DiscountFactory } from '@backend/discounts/application/domain/discount-factory';
import type { DomainEventPublisher } from '@backend/discounts/application/domain/domain-event-publisher';
import { spicesDiscount } from '@sut/support/example-discounts';

const setupSut = () => {
  const events = mock<DomainEventPublisher>();
  const factory = new DiscountFactory(events);
  return { events, discountWith: (details: typeof spicesDiscount) => factory.create(new DiscountDetails(details)) };
};

describe('class Discount', () => {
  describe('publishing a discount', () => {
    describe('the discount published', () => {
      it('should raise DiscountPublished carrying the item, rate, store name and store address', () => {
        const { events, discountWith } = setupSut();
        const discount = discountWith(spicesDiscount);

        discount.publish();

        const [published] = events.publish.mock.lastCall ?? [];
        expect(published).to.be.instanceOf(DiscountPublished);
        expect((published as DiscountPublished).discount).to.deep.include(spicesDiscount);
      });
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
  describe('publishing a discount with a hook', () => {
    describe('the discount published', () => {
      it.todo('should raise DiscountPublished carrying its hook');
      it.todo('should raise DiscountPublished carrying no hook when it has none');
    });

    describe('empty', () => {
      it.todo('should count a hook that is empty or made only of blank space as no hook');
    });

    describe('boundary', () => {
      it.todo('should refuse a hook longer than allowed');
    });
  });
});
