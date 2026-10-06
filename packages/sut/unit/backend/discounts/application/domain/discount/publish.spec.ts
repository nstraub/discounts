import { mock, type MockProxy } from 'vitest-mock-extended';
import { describe, expect, it } from 'vitest';

import { DiscountDetails } from '@backend/discounts/application/domain/discount-details';
import { DiscountPublicationRejected } from '@backend/discounts/application/domain/discount-publication-rejected';
import { DiscountPublished } from '@backend/discounts/application/domain/discount-published';
import { DiscountFactory } from '@backend/discounts/application/domain/discount-factory';
import type { DomainEventPublisher } from '@backend/discounts/application/domain/domain-event-publisher';
import { spicesDiscount, spicesDiscountWithItsHook } from '@sut/support/example-discounts';

const setupSut = () => {
  const events = mock<DomainEventPublisher>();
  const factory = new DiscountFactory(events);
  return { events, discountWith: (details: ConstructorParameters<typeof DiscountDetails>[0]) => factory.create(new DiscountDetails(details)) };
};

const lastEventOf = (events: MockProxy<DomainEventPublisher>) => {
  const [published] = events.publish.mock.lastCall ?? [];
  return published as DiscountPublished;
};

const lastRejectionOf = (events: MockProxy<DomainEventPublisher>) => {
  const [rejected] = events.publish.mock.lastCall ?? [];
  return rejected as DiscountPublicationRejected;
};

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
  describe('publishing a discount at a rate written another way', () => {
    describe('type', () => {
      it.todo('should accept a rate written with a decimal comma as the rate it names');
      it.todo('should accept a rate written with or without a percent sign as the rate it names');
      it.todo('should accept a rate written with spaces around it as the rate it names');
      it.todo('should accept a rate written with a trailing zero as the rate it names');
      it.todo('should refuse a rate written as 1e2, 0x14 or Infinity, its rejection naming the rate as not valid');
    });
  });
  describe('publishing a discount at a rate its rules refuse', () => {
    describe('the rejection', () => {
      it('should raise DiscountPublicationRejected carrying the rate and that it is not valid', () => {
        const { events, discountWith } = setupSut();
        const discount = discountWith({ ...spicesDiscount, rate: '150' });

        discount.publish();

        expect(lastRejectionOf(events)).to.be.instanceOf(DiscountPublicationRejected);
        expect(lastRejectionOf(events)).to.include({ rate: '150', reason: 'not valid' });
      });
      it('should not raise DiscountPublished when its rate is refused', () => {
        const { events, discountWith } = setupSut();
        const discount = discountWith({ ...spicesDiscount, rate: '150' });

        discount.publish();

        expect(events.publish).to.not.have.been.calledWith(expect.any(DiscountPublished));
      });
    });

    describe('boundary', () => {
      it.todo('should accept a rate of 20, a whole number above 0 and at most 100');
      it.todo('should accept a rate of 12.5, with one decimal place');
      it.todo('should accept a rate of 100, the highest a rate may be');
      it.todo('should accept a rate of 0.1, the lowest a rate may be');
      it.todo('should refuse a rate of 0, its rejection naming the rate as not valid');
      it.todo('should refuse a negative rate such as -10, its rejection naming the rate as not valid');
      it.todo('should refuse a rate of 100.1, just above 100, its rejection naming the rate as not valid');
      it.todo('should refuse a rate of 150, its rejection naming the rate as not valid');
      it.todo('should refuse a rate of 12.25, with two decimal places, its rejection naming the rate as not valid');
    });

    describe('type', () => {
      it.todo('should refuse a rate that is not a number, such as a fifth, its rejection naming the rate as not valid');
      it.todo('should refuse a rate of 12,25, two decimal places after a decimal comma, its rejection naming the rate as not valid');
      it.todo('should refuse a rate of 0,0, zero written with a decimal comma, its rejection naming the rate as not valid');
    });
  });
});
