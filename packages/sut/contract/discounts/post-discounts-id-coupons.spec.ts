import { EventEmitter2 } from '@nestjs/event-emitter';
import { describe, expect, it } from 'vitest';

import { couponResponse } from '@app/types/discounts';
import { longTextInAnyCharacters, spicesDiscount } from '@sut/support/example-discounts';

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
    it('should answer with a body matching the coupon response schema', async () => {
      const { http } = await setupSut();
      const published = await publishTheSpicesDiscount(http);

      const response = await getACouponFor(http, published.id);

      expect(couponResponse.safeParse(response.body).error).to.equal(undefined);
    });
    it('should publish CouponIssued on the application event emitter for the coupon issued', async () => {
      const { app, http } = await setupSut();
      const published = await publishTheSpicesDiscount(http);
      const issued: unknown[] = [];
      app.get(EventEmitter2).on('coupon.issued', (event: { id: string; token: string }) => issued.push({ id: event.id, token: event.token }));

      const response = await getACouponFor(http, published.id);

      expect(issued).to.deep.equal([{ id: published.id, token: response.body.token }]);
    });
  });

  describe('strictness', () => {
    it('should keep the coupon response schema no stricter than the coupon Discount issues', async () => {
      const { http } = await setupSut();
      const published = (await http.post('/discounts').send({ ...spicesDiscount, ...longTextInAnyCharacters })).body;

      const response = await getACouponFor(http, published.id);

      expect(response.body.storeName).to.equal(longTextInAnyCharacters.storeName);
      expect(couponResponse.safeParse(response.body).error).to.equal(undefined);
    });
  });

  describe('A3 handle guessing (no accounts)', () => {
    it('should give the coupon a token of its own, ignoring a token sent in the request', async () => {
      const { http } = await setupSut();
      const published = await publishTheSpicesDiscount(http);

      const response = await http.post(`/discounts/${published.id}/coupons`).send({ token: 'CH0SENBYME' });

      expect(response.body.token).to.not.equal('CH0SENBYME');
      expect(response.body.token).to.match(tenCrockfordCharacters);
    });
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
