import { describe, expect, it } from 'vitest';

import { spicesDiscount } from '@sut/support/example-discounts';

import { type Http, publishTheSpicesDiscount, setupSut } from '../support/app';

const getACouponFor = (http: Http, id: string) => http.post(`/discounts/${id}/coupons`).send({});

const tenCrockfordCharacters = /^[0-9A-HJKMNP-TV-Z]{10}$/;

describe('POST /discounts/:id/coupons', () => {
  describe('success', () => {
    it('should answer 201 with the coupon\'s token and its store\'s name', async () => {
      const { http } = await setupSut();
      const published = await publishTheSpicesDiscount(http);

      const response = await getACouponFor(http, published.id);

      expect(response.status).to.equal(201);
      expect(response.body.token).to.match(tenCrockfordCharacters);
      expect(response.body.storeName).to.equal(spicesDiscount.storeName);
    });
    it.todo('should answer with a body matching the coupon response schema');
    it.todo('should publish CouponIssued on the application event emitter for the coupon issued');
  });

  describe('strictness', () => {
    it.todo('should keep the coupon response schema no stricter than the coupon Discount issues');
  });

  describe('A3 handle guessing (no accounts)', () => {
    it.todo('should give the coupon a token of its own, ignoring a token sent in the request');
    it.todo('should answer with the coupon issued only, never another coupon\'s token');
    it.todo('should answer 404 for an id no discount has, issuing no coupon');
  });

  describe('A4 concurrency', () => {
    it.todo('should issue one coupon when the same request arrives twice');
    it.todo('should issue two coupons, each with a token of its own, for two requests');
  });

  describe('A5 resource exhaustion', () => {
    it.todo('should answer 503 with a body matching the error schema when the coupon cannot be kept, issuing none');
    it.todo('should throttle coupons asked from one source far faster than anyone decides to try a discount');
  });
});
