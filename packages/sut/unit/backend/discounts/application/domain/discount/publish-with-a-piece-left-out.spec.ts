import { describe, expect, it } from 'vitest';

import { DiscountPublicationRejected } from '@backend/discounts/application/domain/discount-publication-rejected';
import { DiscountPublished } from '@backend/discounts/application/domain/discount-published';
import { PiecesMissingException } from '@backend/discounts/application/domain/pieces-missing-exception';
import { spicesDiscount } from '@sut/support/example-discounts';

import { lastRejectionOf, setupSut } from './publishing-a-discount';

const refusedWith = async (details: Parameters<ReturnType<typeof setupSut>['discountWith']>[0]) => {
  const { events, keep, discountWith } = setupSut();
  await expect(discountWith(details).publish(keep)).rejects.to.be.instanceOf(PiecesMissingException);
  return events;
};

describe('class Discount', () => {
  describe('publishing a discount with a piece left out', () => {
    describe('the rejection', () => {
      it('should raise DiscountPublicationRejected naming each piece left out as missing', async () => {
        const { events, keep, discountWith } = setupSut();
        const everyPieceLeftOut = discountWith({ item: '', rate: '', storeName: '', storeAddress: '' });

        await expect(everyPieceLeftOut.publish(keep)).rejects.to.be.instanceOf(PiecesMissingException);

        expect(lastRejectionOf(events)).to.deep.equal(
          new DiscountPublicationRejected('', 'missing', ['item', 'rate', 'storeName', 'storeAddress']),
        );
      });
      it('should not raise DiscountPublished when a piece is left out', async () => {
        const { events, keep, discountWith } = setupSut();
        const storeNameLeftOut = discountWith({ ...spicesDiscount, storeName: '' });

        await expect(storeNameLeftOut.publish(keep)).rejects.to.be.instanceOf(PiecesMissingException);

        expect(events.publish).to.not.have.been.calledWith(expect.any(DiscountPublished));
      });
    });

    describe('empty', () => {
      it('should refuse an item that is empty text, its rejection naming the item as missing', async () => {
        const events = await refusedWith({ ...spicesDiscount, item: '' });

        expect(lastRejectionOf(events)).to.deep.include({ reason: 'missing', pieces: ['item'] });
      });
      it('should refuse a store name that is empty text, its rejection naming the store name as missing', async () => {
        const events = await refusedWith({ ...spicesDiscount, storeName: '' });

        expect(lastRejectionOf(events)).to.deep.include({ reason: 'missing', pieces: ['storeName'] });
      });
      it('should refuse a store address that is empty text, its rejection naming the store address as missing', async () => {
        const events = await refusedWith({ ...spicesDiscount, storeAddress: '' });

        expect(lastRejectionOf(events)).to.deep.include({ reason: 'missing', pieces: ['storeAddress'] });
      });
      it('should refuse a rate that is empty text or only blank space, its rejection naming the rate as missing, not as not valid', async () => {
        const ratesLeftOut = ['', '   '];
        const rejections: unknown[] = [];

        for (const rate of ratesLeftOut) {
          const events = await refusedWith({ ...spicesDiscount, rate });
          rejections.push(lastRejectionOf(events));
        }

        expect(rejections).to.deep.equal(ratesLeftOut.map((rate) => new DiscountPublicationRejected(rate, 'missing', ['rate'])));
      });
    });

    describe('combination', () => {
      it.todo('should name at once an item and a store address both made only of blank space as missing');
    });
  });
});
