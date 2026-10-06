import { describe, expect, it } from 'vitest';

import { DiscountPublicationRejected } from '@backend/discounts/application/domain/discount-publication-rejected';
import { DiscountPublished } from '@backend/discounts/application/domain/discount-published';

import { lastEventOf, lastRejectionOf, setupSut } from './publishing-a-discount';

describe('class Discount', () => {
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
        const { events, discountAt } = setupSut();
        const discount = discountAt('150');

        discount.publish();

        expect(lastRejectionOf(events)).to.be.instanceOf(DiscountPublicationRejected);
        expect(lastRejectionOf(events)).to.include({ rate: '150', reason: 'not valid' });
      });
      it('should not raise DiscountPublished when its rate is refused', () => {
        const { events, discountAt } = setupSut();
        const discount = discountAt('150');

        discount.publish();

        expect(events.publish).to.not.have.been.calledWith(expect.any(DiscountPublished));
      });
    });

    describe('boundary', () => {
      it('should accept a rate of 20, a whole number above 0 and at most 100', () => {
        const { events, discountAt } = setupSut();
        const discount = discountAt('20');

        discount.publish();

        expect(lastEventOf(events)).to.be.instanceOf(DiscountPublished);
      });
      it('should accept a rate of 12.5, with one decimal place', () => {
        const { events, discountAt } = setupSut();
        const discount = discountAt('12.5');

        discount.publish();

        expect(lastEventOf(events)).to.be.instanceOf(DiscountPublished);
      });
      it('should accept a rate of 100, the highest a rate may be', () => {
        const { events, discountAt } = setupSut();
        const discount = discountAt('100');

        discount.publish();

        expect(lastEventOf(events)).to.be.instanceOf(DiscountPublished);
      });
      it('should accept a rate of 0.1, the lowest a rate may be', () => {
        const { events, discountAt } = setupSut();
        const discount = discountAt('0.1');

        discount.publish();

        expect(lastEventOf(events)).to.be.instanceOf(DiscountPublished);
      });
      it('should refuse a rate of 0, its rejection naming the rate as not valid', () => {
        const { events, discountAt } = setupSut();
        const discount = discountAt('0');

        discount.publish();

        expect(lastRejectionOf(events)).to.include({ rate: '0', reason: 'not valid' });
      });
      it('should refuse a negative rate such as -10, its rejection naming the rate as not valid', () => {
        const { events, discountAt } = setupSut();
        const discount = discountAt('-10');

        discount.publish();

        expect(lastRejectionOf(events)).to.include({ rate: '-10', reason: 'not valid' });
      });
      it('should refuse a rate of 100.1, just above 100, its rejection naming the rate as not valid', () => {
        const { events, discountAt } = setupSut();
        const discount = discountAt('100.1');

        discount.publish();

        expect(lastRejectionOf(events)).to.include({ rate: '100.1', reason: 'not valid' });
      });
      it('should refuse a rate of 150, its rejection naming the rate as not valid', () => {
        const { events, discountAt } = setupSut();
        const discount = discountAt('150');

        discount.publish();

        expect(lastRejectionOf(events)).to.include({ rate: '150', reason: 'not valid' });
      });
      it('should refuse a rate of 12.25, with two decimal places, its rejection naming the rate as not valid', () => {
        const { events, discountAt } = setupSut();
        const discount = discountAt('12.25');

        discount.publish();

        expect(lastRejectionOf(events)).to.include({ rate: '12.25', reason: 'not valid' });
      });
    });

    describe('type', () => {
      it('should refuse a rate that is not a number, such as a fifth, its rejection naming the rate as not valid', () => {
        const { events, discountAt } = setupSut();
        const discount = discountAt('a fifth');

        discount.publish();

        expect(lastRejectionOf(events)).to.include({ rate: 'a fifth', reason: 'not valid' });
      });
      it.todo('should refuse a rate of 12,25, two decimal places after a decimal comma, its rejection naming the rate as not valid');
      it.todo('should refuse a rate of 0,0, zero written with a decimal comma, its rejection naming the rate as not valid');
    });
  });
});
