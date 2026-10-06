import { EventEmitter2 } from '@nestjs/event-emitter';
import { describe, expect, it } from 'vitest';

import { countRequest, countResponse } from '@app/types/discounts';
import { longTextInAnyCharacters, spicesDiscount, theStoreOf } from '@sut/support/example-discounts';

import { type Http, setupSut } from '../support/app';
import { answersInTurnToBodiesThatAreNotObjects, statusesAnsweringBodiesThatAreNotObjects } from '../support/bodies-that-are-not-objects';
import { countTheStoreOf } from '../support/counts';
import { bodiesNotMatchingTheErrorSchema, theFieldsNamedBy } from '../support/error-schema';
import { redeemAtTheStoreOf } from '../support/redemptions';

type ExampleDiscount = typeof spicesDiscount;

const aDiscountInAnyText = { ...spicesDiscount, ...longTextInAnyCharacters };

const jsonCutShort = '{"storeName": "Spice Bazaar",';

const aStoreNotInText = { storeName: 1234567890, storeAddress: 1234567890 };

const useACouponFor = async (http: Http, published: { id: string }, discount: ExampleDiscount) => {
  const code: string = (await http.post(`/discounts/${published.id}/coupons`).send({})).body.token;
  await http.post('/redemptions').send({ code, ...theStoreOf(discount) });
  return code;
};

const setupSutWithACouponUsedFor = async (discount: ExampleDiscount = spicesDiscount) => {
  const sut = await setupSut();
  const published: { id: string } = (await sut.http.post('/discounts').send(discount)).body;
  const code = await useACouponFor(sut.http, published, discount);
  return { ...sut, published, code };
};

const setupSutCountingJsonText = async () => {
  const sut = await setupSut();
  const countWrittenAsJson = (body: string) => sut.http.post('/stores/counts').set('Content-Type', 'application/json').send(body);
  return { ...sut, countWrittenAsJson };
};

describe('POST /stores/counts', () => {
  describe('success', () => {
    it('should answer 201 with the discount\'s id, item and rate and the number of its coupons redeemed since the last count', async () => {
      const { http, published } = await setupSutWithACouponUsedFor();

      const response = await countTheStoreOf(http);

      expect(response.status).to.equal(201);
      expect(response.body).to.deep.equal([{ id: published.id, item: spicesDiscount.item, rate: spicesDiscount.rate, discountedSales: 1 }]);
    });
    it('should answer with a body matching the count response schema', async () => {
      const { http } = await setupSutWithACouponUsedFor();

      const response = await countTheStoreOf(http);

      expect(countResponse.safeParse(response.body).error).to.equal(undefined);
    });
    it('should publish DiscountedSalesCounted on the application event emitter for the discount counted', async () => {
      const { app, http, published } = await setupSutWithACouponUsedFor();
      const counted: unknown[] = [];
      app.get(EventEmitter2).on('discount.sales-counted', (event: { discountId: string; discountedSales: number }) =>
        counted.push({ discountId: event.discountId, discountedSales: event.discountedSales }),
      );

      await countTheStoreOf(http);

      expect(counted).to.deep.equal([{ discountId: published.id, discountedSales: 1 }]);
    });
    it('should answer a count made after another with only the coupons redeemed since that one', async () => {
      const { http, published } = await setupSutWithACouponUsedFor();
      await countTheStoreOf(http);
      await useACouponFor(http, published, spicesDiscount);
      await useACouponFor(http, published, spicesDiscount);

      const response = await countTheStoreOf(http);

      expect(response.body, 'the discounted sales since the first count').to.deep.equal([
        { id: published.id, item: spicesDiscount.item, rate: spicesDiscount.rate, discountedSales: 2 },
      ]);
    });
  });

  describe('strictness', () => {
    it('should keep the count request schema no stricter than any text for a store\'s name and address', async () => {
      const { http } = await setupSutWithACouponUsedFor(aDiscountInAnyText);

      const response = await countTheStoreOf(http, aDiscountInAnyText);

      expect(response.status).to.equal(201);
      expect(countRequest.safeParse(theStoreOf(aDiscountInAnyText)).error).to.equal(undefined);
    });
    it('should keep the count response schema no stricter than a discount\'s id, item and rate and a number of sales', async () => {
      const { http } = await setupSutWithACouponUsedFor(aDiscountInAnyText);

      const response = await countTheStoreOf(http, aDiscountInAnyText);

      expect(response.body[0].item).to.equal(longTextInAnyCharacters.item);
      expect(countResponse.safeParse(response.body).error).to.equal(undefined);
    });
  });

  describe('malformed request', () => {
    it('should answer 400 naming the store\'s name and address when they are missing or not text, never a 500', async () => {
      const { http } = await setupSut();

      const missing = await http.post('/stores/counts').send({});
      const notText = await http.post('/stores/counts').send(aStoreNotInText);

      expect([missing.status, notText.status]).to.deep.equal([400, 400]);
      expect(theFieldsNamedBy(missing, notText)).to.deep.equal([['storeName', 'storeAddress'], ['storeName', 'storeAddress']]);
    });
    it('should answer 400 for a JSON body that is an array, a string, a number or null', async () => {
      const { countWrittenAsJson } = await setupSutCountingJsonText();

      const statuses = await statusesAnsweringBodiesThatAreNotObjects(countWrittenAsJson);

      expect(statuses, 'the statuses answering an array, a string, a number and null').to.deep.equal([400, 400, 400, 400]);
    });
    it('should answer 400 for a body that is not valid JSON', async () => {
      const { countWrittenAsJson } = await setupSutCountingJsonText();

      const response = await countWrittenAsJson(jsonCutShort);

      expect(response.status).to.equal(400);
    });
    it('should answer every error with a body matching the error schema', async () => {
      const { http, countWrittenAsJson } = await setupSutCountingJsonText();
      const errors = [
        await http.post('/stores/counts').send({}),
        await http.post('/stores/counts').send(aStoreNotInText),
        ...(await answersInTurnToBodiesThatAreNotObjects(countWrittenAsJson)),
        await countWrittenAsJson(jsonCutShort),
      ];

      expect(bodiesNotMatchingTheErrorSchema(errors)).to.deep.equal([]);
    });
  });

  describe('not found', () => {
    it.todo('should answer 404 for a store no published discount names, counting nothing');
  });

  describe('A1 input boundary', () => {
    it.todo('should answer as for a store nobody published at when its name is 10 000 characters long, never a 500');
  });

  describe('A3 handle guessing (no accounts)', () => {
    it('should answer with no coupon token of the coupons counted', async () => {
      const { http, code } = await setupSutWithACouponUsedFor();

      const response = await countTheStoreOf(http);

      expect(Object.keys(response.body[0]), 'what each entry carries').to.deep.equal(['id', 'item', 'rate', 'discountedSales']);
      expect(response.text).to.not.contain(code);
    });
  });

  describe('A5 resource exhaustion', () => {
    it.todo('should answer 503 with a body matching the error schema when the store\'s discounts cannot be counted, restarting nothing');
  });
  describe('a coupon used twice', () => {
    it('should count once a coupon whose second use was refused', async () => {
      const { http, published, code } = await setupSutWithACouponUsedFor();
      await redeemAtTheStoreOf(http, code);

      const response = await countTheStoreOf(http);

      expect(response.body, 'the discounted sales of the coupon used twice').to.deep.equal([
        { id: published.id, item: spicesDiscount.item, rate: spicesDiscount.rate, discountedSales: 1 },
      ]);
    });
  });
  describe('a coupon refused at another store\'s till', () => {
    it.todo('should count a coupon refused at another store\'s till with neither store');
  });
});
