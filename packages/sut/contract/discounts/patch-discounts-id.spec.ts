import { describe, expect, it } from 'vitest';

import { spicesDiscount } from '@sut/support/example-discounts';

import { setupSut } from '../support/app';

describe('PATCH /discounts/:id', () => {
  describe('success', () => {
    it('should answer 204 with no body when the rate is changed', async () => {
      const { http } = await setupSut();
      const published = await http.post('/discounts').send(spicesDiscount);

      const response = await http.patch(`/discounts/${published.body.id}`).send({ rate: '25' });

      expect(response.status).to.equal(204);
      expect(response.text).to.equal('');
    });
    it('should list the discount once, at its new rate, after the change', async () => {
      const { http } = await setupSut();
      const published = await http.post('/discounts').send(spicesDiscount);

      await http.patch(`/discounts/${published.body.id}`).send({ rate: '25' });

      const listed = await http.get('/discounts');
      expect(listed.body, 'the discounts listed after the change').to.deep.equal([{ ...published.body, rate: '25' }]);
    });
    it.todo('should publish DiscountRateChanged on the application event emitter for the discount changed');
  });

  describe('malformed request', () => {
    it.todo('should answer 400 naming the rate when it is missing or not text, never a 500');
    it.todo('should answer 400 for a JSON body that is an array, a string, a number or null');
    it.todo('should answer 400 for a body that is not valid JSON');
    it.todo('should answer every error with a body matching the error schema');
  });

  describe('strictness', () => {
    it.todo('should keep the change request schema no stricter than Discount');
  });

  describe('empty', () => {
    it.todo('should answer 400 naming the rate when it is only blank space, the discount keeping its rate');
  });

  describe('type', () => {
    it.todo('should answer 400 naming the rate when it is not a number, the discount keeping its rate');
  });

  describe('A3 handle guessing (no accounts)', () => {
    it.todo('should answer 404 for an id no discount has, changing no discount');
    it.todo('should throttle changes from one source far faster than any store owner changes a rate');
  });

  describe('A4 concurrency', () => {
    it.todo('should hold one of two changes to one discount arriving at the same moment, whole');
    it.todo('should apply a change sent from a page loaded before an earlier change, the last change holding');
  });

  describe('A5 resource exhaustion', () => {
    it.todo('should answer 503 with a body matching the error schema when the change cannot be kept, the rate unchanged');
  });

  describe('A6 business-logic abuse', () => {
    it.todo('should change only the rate, leaving the item, store name and store address the request carries unused');
  });
});
