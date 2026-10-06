import { describe, expect, it } from 'vitest';

import { BadRequestException } from '@app/types/rest-api-refusals';
import { NothingToldOfThePublish, PiecesMissing, RateNotValid } from '@frontend/discounts/publish-answers';
import { spicesDiscount, spicesDiscountWithItsHook } from '@sut/support/example-discounts';

import { setupSut } from './discounts-store-of-an-app';

const aRefusalListingAsMissing = (pieces: string[]) => new BadRequestException('POST /discounts answered 400', pieces, pieces);

const aRefusalOfTheRate = new BadRequestException('POST /discounts answered 400', [], ['rate']);

const setupSutRefusing = (refusal: Error) => {
  const sut = setupSut();
  sut.restApi.post.mockRejectedValue(refusal);
  return sut;
};

const spicesDiscountWithoutItsRate = { item: spicesDiscount.item, storeName: spicesDiscount.storeName, storeAddress: spicesDiscount.storeAddress };

describe('Store discounts', () => {
  describe('publishing a discount', () => {
    it('should hand the item, rate, store name and store address over to be published', async () => {
      const { restApi, discounts } = setupSut();

      await discounts.publish(spicesDiscount);

      expect(restApi.post).to.have.been.calledWith('/discounts', spicesDiscount);
    });
    it('should hand other pieces over when given others', async () => {
      const { restApi, discounts } = setupSut();
      const produceDiscount = { item: 'Fresh produce', rate: '10', storeName: 'Corner Grocery', storeAddress: '3 Hill Road' };

      await discounts.publish(produceDiscount);

      expect(restApi.post).to.have.been.calledWith('/discounts', produceDiscount);
    });
    it.todo('should hold the discount just published without loading the page again');
  });
  describe('publishing a discount with a hook', () => {
    it('should hand the hook over to be published with the rest', async () => {
      const { restApi, discounts } = setupSut();

      await discounts.publish(spicesDiscountWithItsHook);

      expect(restApi.post).to.have.been.calledWith('/discounts', spicesDiscountWithItsHook);
    });
  });
  describe('publishing a discount at a rate that is not valid', () => {
    it('should hold that the rate is not valid when the publish is refused for it', async () => {
      const { discounts } = setupSutRefusing(aRefusalOfTheRate);

      await discounts.publish({ ...spicesDiscount, rate: '150' });

      expect(discounts.publishAnswer, 'the answer the store holds').to.be.instanceOf(RateNotValid);
    });
    it('should no longer hold the rate as not valid once the next discount is published', async () => {
      const { restApi, discounts } = setupSut();
      restApi.post.mockRejectedValueOnce(aRefusalOfTheRate).mockResolvedValueOnce(undefined);
      await discounts.publish({ ...spicesDiscount, rate: '150' });

      await discounts.publish(spicesDiscount);

      expect(discounts.publishAnswer, 'the answer the store holds').not.to.be.instanceOf(RateNotValid);
    });
    it('should not hold the rate as not valid when the refusal names other fields and none as missing', async () => {
      const { discounts } = setupSutRefusing(new BadRequestException('POST /discounts answered 400', [], ['storeName']));

      await discounts.publish(spicesDiscount);

      expect(discounts.publishAnswer, 'the answer the store holds').not.to.be.instanceOf(RateNotValid);
    });
  });
  describe('publishing a discount with a piece left out', () => {
    it('should hold which pieces are missing as the refusal lists them', async () => {
      const { discounts } = setupSutRefusing(aRefusalListingAsMissing(['item', 'storeAddress']));

      await discounts.publish({ rate: '20', storeName: spicesDiscount.storeName });

      expect(discounts.publishAnswer, 'the answer the store holds').to.deep.equal(new PiecesMissing(['item', 'storeAddress']));
    });
    it('should hold other pieces as missing when the refusal lists others', async () => {
      const { discounts } = setupSutRefusing(aRefusalListingAsMissing(['rate']));

      await discounts.publish(spicesDiscountWithoutItsRate);

      expect(discounts.publishAnswer, 'the answer the store holds').to.deep.equal(new PiecesMissing(['rate']));
    });
    it('should not hold the rate as not valid when the refusal lists it as missing', async () => {
      const { discounts } = setupSutRefusing(aRefusalListingAsMissing(['rate']));

      await discounts.publish(spicesDiscountWithoutItsRate);

      expect(discounts.publishAnswer, 'the answer the store holds').not.to.be.instanceOf(RateNotValid);
    });
    it('should not hold the rate as not valid when only other pieces are missing', async () => {
      const { discounts } = setupSutRefusing(aRefusalListingAsMissing(['item']));

      await discounts.publish({ rate: spicesDiscount.rate, storeName: spicesDiscount.storeName, storeAddress: spicesDiscount.storeAddress });

      expect(discounts.publishAnswer, 'the answer the store holds').not.to.be.instanceOf(RateNotValid);
    });
    it('should no longer hold any piece as missing once the next discount is published', async () => {
      const { restApi, discounts } = setupSut();
      restApi.post.mockRejectedValueOnce(aRefusalListingAsMissing(['rate'])).mockResolvedValueOnce(undefined);
      await discounts.publish(spicesDiscountWithoutItsRate);

      await discounts.publish(spicesDiscount);

      expect(discounts.publishAnswer, 'the answer the store holds').to.be.instanceOf(NothingToldOfThePublish);
    });
  });
  describe('publishing a discount refused for another reason', () => {
    it('should pass on a refusal that is not a bad request', async () => {
      const failure = new Error('POST /discounts answered 500');
      const { discounts } = setupSutRefusing(failure);

      await expect(discounts.publish(spicesDiscount)).rejects.to.equal(failure);
    });
  });
});
