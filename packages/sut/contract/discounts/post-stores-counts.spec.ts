import { EventEmitter2 } from '@nestjs/event-emitter';
import { describe, expect, it } from 'vitest';

import { countResponse, requestRejection } from '@app/types/discounts';
import { spicesDiscount } from '@sut/support/example-discounts';

import { type Http, setupSut } from '../support/app';

type ExampleDiscount = typeof spicesDiscount;

const useACouponFor = async (http: Http, published: { id: string }, discount: ExampleDiscount) => {
  const code: string = (await http.post(`/discounts/${published.id}/coupons`).send({})).body.token;
  await http.post('/redemptions').send({ code, storeName: discount.storeName, storeAddress: discount.storeAddress });
};

const setupSutWithACouponUsedFor = async (discount: ExampleDiscount = spicesDiscount) => {
  const sut = await setupSut();
  const published: { id: string } = (await sut.http.post('/discounts').send(discount)).body;
  await useACouponFor(sut.http, published, discount);
  return { ...sut, published };
};

const countTheStoreOf = (http: Http, discount: ExampleDiscount = spicesDiscount) =>
  http.post('/stores/counts').send({ storeName: discount.storeName, storeAddress: discount.storeAddress });

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
    it.todo('should keep the count request schema no stricter than any text for a store\'s name and address');
    it.todo('should keep the count response schema no stricter than a discount\'s id, item and rate and a number of sales');
  });

  describe('malformed request', () => {
    it('should answer 400 naming the store\'s name and address when they are missing or not text, never a 500', async () => {
      const { http } = await setupSut();

      const missing = await http.post('/stores/counts').send({});
      const notText = await http.post('/stores/counts').send({ storeName: 1234567890, storeAddress: 1234567890 });

      expect([missing.status, notText.status]).to.deep.equal([400, 400]);
      expect([requestRejection.parse(missing.body).fields, requestRejection.parse(notText.body).fields]).to.deep.equal([
        ['storeName', 'storeAddress'],
        ['storeName', 'storeAddress'],
      ]);
    });
    it.todo('should answer 400 for a JSON body that is an array, a string, a number or null');
    it.todo('should answer 400 for a body that is not valid JSON');
    it.todo('should answer every error with a body matching the error schema');
  });

  describe('not found', () => {
    it.todo('should answer 404 for a store no published discount names, counting nothing');
  });

  describe('A1 input boundary', () => {
    it.todo('should answer as for a store nobody published at when its name is 10 000 characters long, never a 500');
  });

  describe('A3 handle guessing (no accounts)', () => {
    it.todo('should answer with no coupon token of the coupons counted');
  });

  describe('A4 concurrency', () => {
    it.todo('should count each redeemed coupon once between two counts of a store arriving at the same moment');
    it.todo('should count a coupon redeemed during a count once, in that count or the next');
  });

  describe('a coupon taken at another store\'s till', () => {
    it.todo('should count a coupon redeemed at another store\'s till with the store of its discount');
  });

  describe('A5 resource exhaustion', () => {
    it.todo('should answer 503 with a body matching the error schema when the store\'s discounts cannot be counted, restarting nothing');
  });
});
