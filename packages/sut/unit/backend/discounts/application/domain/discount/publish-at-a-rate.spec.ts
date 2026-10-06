import { describe, expect, it } from 'vitest';

import { DiscountPublicationRejected } from '@backend/discounts/application/domain/discount-publication-rejected';
import { DiscountPublished } from '@backend/discounts/application/domain/discount-published';
import { RateNotValidException } from '@backend/discounts/application/domain/rate-not-valid-exception';

import { lastEventOf, lastRejectionOf, setupSut } from './publishing-a-discount';

describe('class Discount', () => {
  describe('publishing a discount at a rate written another way', () => {
    describe('type', () => {
      it('should accept a rate written with a decimal comma as the rate it names', async () => {
        const { events, keep, discountAt } = setupSut();
        const discount = discountAt('12,5');

        await discount.publish(keep);

        expect(lastEventOf(events)).to.be.instanceOf(DiscountPublished);
        expect(lastEventOf(events).discount.rate).to.equal('12,5');
      });
      it.todo('should accept a rate written with or without a percent sign as the rate it names');
      it.todo('should accept a rate written with spaces around it as the rate it names');
      it.todo('should accept a rate written with a trailing zero as the rate it names');
      it('should refuse a rate written as 1e2, 0x14 or Infinity, its rejection naming the rate as not valid', async () => {
        const { events, keep, discountAt } = setupSut();
        const computersNotations = ['1e2', '0x14', 'Infinity'];

        for (const rate of computersNotations) {
          await expect(discountAt(rate).publish(keep)).rejects.to.be.instanceOf(RateNotValidException);
        }

        expect(events.publish.mock.calls.map(([event]) => event)).to.deep.equal(
          computersNotations.map((rate) => new DiscountPublicationRejected(rate, 'not valid')),
        );
      });
      it('should refuse a rate written in a way not yet accepted', async () => {
        const { events, keep, discountAt } = setupSut();
        const waysNotYetAccepted = [' 20 ', '\t20\n', '+20', '05', '.5', '20.', '12.50'];

        const refusals: unknown[] = [];

        for (const rate of waysNotYetAccepted) {
          await discountAt(rate).publish(keep).catch((refusal: unknown) => refusals.push(refusal));
        }

        expect(events.publish.mock.calls.map(([event]) => event)).to.deep.equal(
          waysNotYetAccepted.map((rate) => new DiscountPublicationRejected(rate, 'not valid')),
        );
        expect(refusals).to.deep.equal(waysNotYetAccepted.map(() => new RateNotValidException()));
      });
    });
  });
  describe('publishing a discount at a rate its rules refuse', () => {
    describe('the rejection', () => {
      const aRateItsRulesRefuse = '150';

      it('should raise DiscountPublicationRejected carrying the rate and that it is not valid', async () => {
        const { events, keep, discountAt } = setupSut();

        await expect(discountAt(aRateItsRulesRefuse).publish(keep)).rejects.to.be.instanceOf(RateNotValidException);

        expect(lastRejectionOf(events)).to.deep.equal(new DiscountPublicationRejected(aRateItsRulesRefuse, 'not valid'));
      });
      it('should not raise DiscountPublished when its rate is refused', async () => {
        const { events, keep, discountAt } = setupSut();

        await expect(discountAt(aRateItsRulesRefuse).publish(keep)).rejects.to.be.instanceOf(RateNotValidException);

        expect(events.publish).to.not.have.been.calledWith(expect.any(DiscountPublished));
      });
    });

    describe('boundary', () => {
      it('should accept a rate of 20, a whole number above 0 and at most 100', async () => {
        const { events, keep, discountAt } = setupSut();
        const discount = discountAt('20');

        await discount.publish(keep);

        expect(lastEventOf(events)).to.be.instanceOf(DiscountPublished);
      });
      it('should accept a rate of 12.5, with one decimal place', async () => {
        const { events, keep, discountAt } = setupSut();
        const discount = discountAt('12.5');

        await discount.publish(keep);

        expect(lastEventOf(events)).to.be.instanceOf(DiscountPublished);
      });
      it('should accept a rate of 100, the highest a rate may be', async () => {
        const { events, keep, discountAt } = setupSut();
        const discount = discountAt('100');

        await discount.publish(keep);

        expect(lastEventOf(events)).to.be.instanceOf(DiscountPublished);
      });
      it('should accept a rate of 100.0, the highest a rate may be written with one decimal place', async () => {
        const { events, keep, discountAt } = setupSut();
        const discount = discountAt('100.0');

        await discount.publish(keep);

        expect(lastEventOf(events)).to.be.instanceOf(DiscountPublished);
      });
      it('should accept a rate of 0.1, the lowest a rate may be', async () => {
        const { events, keep, discountAt } = setupSut();
        const discount = discountAt('0.1');

        await discount.publish(keep);

        expect(lastEventOf(events)).to.be.instanceOf(DiscountPublished);
      });
      it('should refuse a rate of 0, its rejection naming the rate as not valid', async () => {
        const { events, keep, discountAt } = setupSut();

        await expect(discountAt('0').publish(keep)).rejects.to.be.instanceOf(RateNotValidException);

        expect(lastRejectionOf(events)).to.include({ rate: '0', reason: 'not valid' });
      });
      it('should refuse a negative rate such as -10, its rejection naming the rate as not valid', async () => {
        const { events, keep, discountAt } = setupSut();

        await expect(discountAt('-10').publish(keep)).rejects.to.be.instanceOf(RateNotValidException);

        expect(lastRejectionOf(events)).to.include({ rate: '-10', reason: 'not valid' });
      });
      it('should refuse a rate of 100.1, just above 100, its rejection naming the rate as not valid', async () => {
        const { events, keep, discountAt } = setupSut();

        await expect(discountAt('100.1').publish(keep)).rejects.to.be.instanceOf(RateNotValidException);

        expect(lastRejectionOf(events)).to.include({ rate: '100.1', reason: 'not valid' });
      });
      it('should refuse a rate of 150, its rejection naming the rate as not valid', async () => {
        const { events, keep, discountAt } = setupSut();

        await expect(discountAt('150').publish(keep)).rejects.to.be.instanceOf(RateNotValidException);

        expect(lastRejectionOf(events)).to.include({ rate: '150', reason: 'not valid' });
      });
      it('should refuse a rate of 12.25, with two decimal places, its rejection naming the rate as not valid', async () => {
        const { events, keep, discountAt } = setupSut();

        await expect(discountAt('12.25').publish(keep)).rejects.to.be.instanceOf(RateNotValidException);

        expect(lastRejectionOf(events)).to.include({ rate: '12.25', reason: 'not valid' });
      });
    });

    describe('type', () => {
      it('should refuse a rate that is not a number, such as a fifth, its rejection naming the rate as not valid', async () => {
        const { events, keep, discountAt } = setupSut();

        await expect(discountAt('a fifth').publish(keep)).rejects.to.be.instanceOf(RateNotValidException);

        expect(lastRejectionOf(events)).to.include({ rate: 'a fifth', reason: 'not valid' });
      });
      it('should refuse a rate of 12,25, two decimal places after a decimal comma, its rejection naming the rate as not valid', async () => {
        const { events, keep, discountAt } = setupSut();

        await expect(discountAt('12,25').publish(keep)).rejects.to.be.instanceOf(RateNotValidException);

        expect(lastRejectionOf(events)).to.include({ rate: '12,25', reason: 'not valid' });
      });
      it('should refuse a rate of 0,0, zero written with a decimal comma, its rejection naming the rate as not valid', async () => {
        const { events, keep, discountAt } = setupSut();

        await expect(discountAt('0,0').publish(keep)).rejects.to.be.instanceOf(RateNotValidException);

        expect(lastRejectionOf(events)).to.include({ rate: '0,0', reason: 'not valid' });
      });
    });
  });
});
