import { describe, expect, it } from 'vitest';

import { DiscountPublished } from '@backend/discounts/application/domain/discount-published';
import { spicesDiscount, spicesDiscountWithItsHook } from '@sut/support/example-discounts';

import { lastEventOf, setupSut } from './publishing-a-discount';


describe('class Discount', () => {
  describe('publishing a discount', () => {
    describe('the discount published', () => {
      it('should raise DiscountPublished carrying the item, rate, store name and store address', () => {
        const { events, discountWith } = setupSut();
        const discount = discountWith(spicesDiscount);

        discount.publish();

        expect(lastEventOf(events)).to.be.instanceOf(DiscountPublished);
        expect(lastEventOf(events).discount).to.deep.include(spicesDiscount);
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
      it('should raise DiscountPublished carrying its hook', () => {
        const { events, discountWith } = setupSut();
        const discount = discountWith(spicesDiscountWithItsHook);

        discount.publish();

        expect(lastEventOf(events).discount.hook).to.equal(spicesDiscountWithItsHook.hook);
      });
      it('should raise DiscountPublished carrying no hook when it has none', () => {
        const { events, discountWith } = setupSut();
        const discount = discountWith(spicesDiscount);

        discount.publish();

        expect(lastEventOf(events).discount).to.not.have.property('hook');
      });
    });

    describe('empty', () => {
      it.todo('should count a hook that is empty or made only of blank space as no hook');
    });

    describe('boundary', () => {
      it.todo('should refuse a hook longer than allowed');
    });
  });
});
