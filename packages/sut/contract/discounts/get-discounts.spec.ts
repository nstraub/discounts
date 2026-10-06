import { describe, expect, it } from 'vitest';

import { publishedDiscountsResponse } from '@app/types/discounts';
import { longTextInAnyCharacters, produceDiscount, spicesDiscount, spicesDiscountWithItsHook } from '@sut/support/example-discounts';

import { publishTheSpicesDiscount, setupSut } from '../support/app';

describe('GET /discounts', () => {
  describe('success', () => {
    it('should answer 200 with every published discount as JSON', async () => {
      const { http } = await setupSut();
      const spices = await http.post('/discounts').send(spicesDiscount);
      const produce = await http.post('/discounts').send(produceDiscount);

      const response = await http.get('/discounts');

      expect(response.status).to.equal(200);
      expect(response.body).to.have.deep.members([spices.body, produce.body]);
    });
    it('should answer 200 with an empty list when nothing is published', async () => {
      const { http } = await setupSut();

      const response = await http.get('/discounts');

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal([]);
    });
    it('should answer with a body matching the published-discounts response schema', async () => {
      const { http } = await setupSut();
      await http.post('/discounts').send(spicesDiscount);

      const response = await http.get('/discounts');

      expect(publishedDiscountsResponse.safeParse(response.body).error).to.equal(undefined);
    });
    it('should list both of two identical discounts, each with its own id', async () => {
      const { http } = await setupSut();
      const first = await http.post('/discounts').send(spicesDiscount);
      const second = await http.post('/discounts').send(spicesDiscount);

      const response = await http.get('/discounts');

      expect(response.body).to.have.deep.members([first.body, second.body]);
      expect(first.body.id).to.not.equal(second.body.id);
    });
    it('should list a rate exactly as it was written, such as 12,5', async () => {
      const { http } = await setupSut();
      await http.post('/discounts').send({ ...spicesDiscount, rate: '12,5' });

      const response = await http.get('/discounts');

      expect(response.body.map((discount: { rate: unknown }) => discount.rate)).to.deep.equal(['12,5']);
    });
  });

  describe('strictness', () => {
    it('should keep the published-discounts response schema no stricter than Discount', async () => {
      const { http } = await setupSut();
      await http.post('/discounts').send({ ...spicesDiscount, ...longTextInAnyCharacters });

      const response = await http.get('/discounts');

      expect(publishedDiscountsResponse.safeParse(response.body).error).to.equal(undefined);
    });
  });

  describe('which discounts', () => {
    it.todo('should list a discount on any item, produce or not');
    it.todo('should list the discounts in the order the product promises');
  });

  describe('dependency failure', () => {
    it.todo('should answer 503 with a body matching the error schema when the discounts cannot be read');
  });

  describe('A5 resource exhaustion', () => {
    it.todo('should answer every published discount when a very large number are published, without failing');
  });
  describe('the hook', () => {
    it('should list a discount with its hook', async () => {
      const { http } = await setupSut();
      await http.post('/discounts').send(spicesDiscountWithItsHook);

      const response = await http.get('/discounts');

      expect(response.body.map((discount: { hook: unknown }) => discount.hook)).to.deep.equal([spicesDiscountWithItsHook.hook]);
    });
    it('should list a discount published without a hook with no hook', async () => {
      const { http } = await setupSut();
      await http.post('/discounts').send(spicesDiscount);

      const response = await http.get('/discounts');

      expect(response.body.at(0)).to.not.have.property('hook');
    });
  });
  describe('A3 handle guessing (no accounts)', () => {
    it('should list no coupon token with any discount once coupons have been issued', async () => {
      const { http } = await setupSut();
      const published = await publishTheSpicesDiscount(http);
      const coupon = await http.post(`/discounts/${published.id}/coupons`).send({});

      const response = await http.get('/discounts');

      expect(response.text).to.not.contain(coupon.body.token);
    });
  });
});
