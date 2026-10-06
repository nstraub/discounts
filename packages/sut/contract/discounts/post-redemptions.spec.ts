import { EventEmitter2 } from '@nestjs/event-emitter';
import { describe, expect, it } from 'vitest';

import { redemptionRequest, redemptionResponse, requestRejection } from '@app/types/discounts';
import { longTextInAnyCharacters, produceDiscount, spicesDiscount } from '@sut/support/example-discounts';

import { type Http, setupSut } from '../support/app';
import { answersInTurnToBodiesThatAreNotObjects, statusesAnsweringBodiesThatAreNotObjects } from '../support/bodies-that-are-not-objects';
import { bodiesNotMatchingTheErrorSchema } from '../support/error-schema';

type ExampleDiscount = typeof spicesDiscount;

const setupSutWithACouponFor = async (discount: ExampleDiscount = spicesDiscount) => {
  const sut = await setupSut();
  const published: { id: string } = (await sut.http.post('/discounts').send(discount)).body;
  const code: string = (await sut.http.post(`/discounts/${published.id}/coupons`).send({})).body.token;
  return { ...sut, published, code };
};

const redeemWrittenAsJson = (http: Http, body: string) => http.post('/redemptions').set('Content-Type', 'application/json').send(body);

const redeemAtTheStoreOf = (http: Http, code: string, discount: ExampleDiscount = spicesDiscount) =>
  http.post('/redemptions').send({ code, storeName: discount.storeName, storeAddress: discount.storeAddress });

describe('POST /redemptions', () => {
  describe('success', () => {
    it('should answer 201 with the item of the discount the coupon is for', async () => {
      const { http, code } = await setupSutWithACouponFor();

      const response = await redeemAtTheStoreOf(http, code);

      expect(response.status).to.equal(201);
      expect(response.body).to.deep.equal({ item: spicesDiscount.item });
    });
    it('should answer with the item of another discount when the coupon is for that one', async () => {
      const { http, code } = await setupSutWithACouponFor(produceDiscount);

      const response = await redeemAtTheStoreOf(http, code, produceDiscount);

      expect(response.body).to.deep.equal({ item: produceDiscount.item });
    });
    it('should answer with a body matching the redemption response schema', async () => {
      const { http, code } = await setupSutWithACouponFor();

      const response = await redeemAtTheStoreOf(http, code);

      expect(redemptionResponse.safeParse(response.body).error).to.equal(undefined);
    });
    it('should publish CouponRedeemed on the application event emitter for the coupon redeemed', async () => {
      const { app, http, published, code } = await setupSutWithACouponFor();
      const redeemed: unknown[] = [];
      app.get(EventEmitter2).on('coupon.redeemed', (event: { discountId: string; token: string }) => redeemed.push({ discountId: event.discountId, token: event.token }));

      await redeemAtTheStoreOf(http, code);

      expect(redeemed).to.deep.equal([{ discountId: published.id, token: code }]);
    });
    it('should keep the coupon redeemed and its discount\'s other coupons unused', async () => {
      const { client, http, published, code } = await setupSutWithACouponFor();
      const other: string = (await http.post(`/discounts/${published.id}/coupons`).send({})).body.token;

      await redeemAtTheStoreOf(http, code);

      const kept = await client.query('SELECT token, redeemed FROM app.coupons');
      expect(kept.rows, 'each coupon kept, redeemed or unused').to.have.deep.members([{ token: code, redeemed: true }, { token: other, redeemed: false }]);
    });
    it('should redeem a coupon whose code is sent in lower case, in two groups', async () => {
      const { http, code } = await setupSutWithACouponFor();
      const asReadAloud = `${code.slice(0, 5)} ${code.slice(5)}`.toLowerCase();

      const response = await redeemAtTheStoreOf(http, asReadAloud);

      expect(response.status).to.equal(201);
      expect(response.body).to.deep.equal({ item: spicesDiscount.item });
    });
  });

  describe('strictness', () => {
    it('should keep the redemption request schema no stricter than any text for a code and a store\'s name and address', async () => {
      const { http, code } = await setupSutWithACouponFor();
      const atAStoreInAnyText = { storeName: longTextInAnyCharacters.storeName, storeAddress: longTextInAnyCharacters.storeAddress };

      const response = await http.post('/redemptions').send({ code, ...atAStoreInAnyText });

      expect(response.status).to.equal(201);
      expect(redemptionRequest.safeParse({ code: longTextInAnyCharacters.item, ...atAStoreInAnyText }).error).to.equal(undefined);
    });
    it('should keep the redemption response schema no stricter than the item a discount has', async () => {
      const aDiscountInAnyText = { ...spicesDiscount, ...longTextInAnyCharacters };
      const { http, code } = await setupSutWithACouponFor(aDiscountInAnyText);

      const response = await redeemAtTheStoreOf(http, code, aDiscountInAnyText);

      expect(response.body.item).to.equal(longTextInAnyCharacters.item);
      expect(redemptionResponse.safeParse(response.body).error).to.equal(undefined);
    });
  });

  describe('malformed request', () => {
    it('should answer 400 naming the code when it is missing or not text, never a 500', async () => {
      const { http } = await setupSut();

      const missing = await http.post('/redemptions').send({ storeName: spicesDiscount.storeName, storeAddress: spicesDiscount.storeAddress });
      const notText = await redeemAtTheStoreOf(http, 1234567890 as unknown as string);

      expect([missing.status, notText.status]).to.deep.equal([400, 400]);
      expect([requestRejection.parse(missing.body).fields, requestRejection.parse(notText.body).fields]).to.deep.equal([['code'], ['code']]);
    });
    it('should answer 400 for a JSON body that is an array, a string, a number or null', async () => {
      const { http } = await setupSut();

      const statuses = await statusesAnsweringBodiesThatAreNotObjects((body) => redeemWrittenAsJson(http, body));

      expect(statuses, 'the statuses answering an array, a string, a number and null').to.deep.equal([400, 400, 400, 400]);
    });
    it('should answer 400 for a body that is not valid JSON', async () => {
      const { http } = await setupSut();

      const response = await redeemWrittenAsJson(http, '{"code": "7K3QX9M2PD",');

      expect(response.status).to.equal(400);
    });
    it('should answer every error with a body matching the error schema', async () => {
      const { http, code } = await setupSutWithACouponFor();
      await redeemAtTheStoreOf(http, code);
      const errors = [
        await http.post('/redemptions').send({}),
        await redeemAtTheStoreOf(http, 1234567890 as unknown as string),
        ...(await answersInTurnToBodiesThatAreNotObjects((body) => redeemWrittenAsJson(http, body))),
        await redeemWrittenAsJson(http, '{"code": "7K3QX9M2PD",'),
        await redeemAtTheStoreOf(http, code),
      ];

      expect(bodiesNotMatchingTheErrorSchema(errors)).to.deep.equal([]);
    });
  });

  describe('A1 input boundary', () => {
    it.todo('should answer as for a coupon nobody issued when the code is 10 000 characters long, never a 500');
  });

  describe('A3 handle guessing (no accounts)', () => {
    it('should answer with no coupon token, neither the one redeemed nor another', async () => {
      const { http, published, code } = await setupSutWithACouponFor();
      const another: string = (await http.post(`/discounts/${published.id}/coupons`).send({})).body.token;

      const response = await redeemAtTheStoreOf(http, code);

      expect(Object.keys(response.body), 'what the answer carries').to.deep.equal(['item']);
      expect(response.text).to.not.contain(code).and.not.contain(another);
    });
    it.todo('should give the same answer to a malformed code and to a well-formed one nobody issued');
    it.todo('should throttle codes tried from one source far faster than anyone takes coupons at a till');
  });

  describe('A4 concurrency', () => {
    it.todo('should redeem a coupon once when it is used twice at the same moment');
  });

  describe('A5 resource exhaustion', () => {
    it.todo('should answer 503 with a body matching the error schema when the coupon cannot be checked, the coupon staying unused');
  });

  describe('the rate at the till', () => {
    it.todo('should answer with the rate the coupon applies at');
  });
  describe('a coupon already used', () => {
    it('should answer 409 with a body matching the error schema when the coupon has already been used', async () => {
      const { http, code } = await setupSutWithACouponFor();
      await redeemAtTheStoreOf(http, code);

      const response = await redeemAtTheStoreOf(http, code);

      expect(response.status).to.equal(409);
      expect(bodiesNotMatchingTheErrorSchema([response])).to.deep.equal([]);
    });
    it.todo('should keep the coupon used once, its discount and its other coupons as they were');
    it.todo('should publish CouponRedemptionRejected on the application event emitter for the coupon already used');
    it.todo('should refuse a used coupon whose code is sent in lower case, in two groups, the second time');
  });
});
