import { EventEmitter2 } from '@nestjs/event-emitter';
import { describe, expect, it } from 'vitest';

import { produceDiscount, spicesDiscount } from '@sut/support/example-discounts';

import { setupSut } from '../support/app';

describe('POST /discounts', () => {
  describe('success', () => {
    it('should answer 201 with the published discount as JSON and a Location naming it', async () => {
      const { http } = await setupSut();

      const response = await http.post('/discounts').send(spicesDiscount);

      expect(response.status).to.equal(201);
      expect(response.body).to.deep.equal({ id: response.body.id, ...spicesDiscount });
      expect(response.headers.location).to.equal(`/discounts/${response.body.id}`);
    });
    it('should publish the item, rate, store name and store address the request gives', async () => {
      const { http } = await setupSut();

      const response = await http.post('/discounts').send(produceDiscount);

      expect(response.body, 'the discount published').to.deep.equal({ id: response.body.id, ...produceDiscount });
    });
    it.todo('should answer with a body matching the discount response schema');
    it('should publish DiscountPublished on the application event emitter for the discount published', async () => {
      const { app, http } = await setupSut();
      const published: unknown[] = [];
      app.get(EventEmitter2).on('discount.published', (event: { discount: unknown }) => published.push(event.discount));

      const response = await http.post('/discounts').send(spicesDiscount);

      expect(published).to.deep.equal([{ id: response.body.id, ...spicesDiscount }]);
    });
  });

  describe('malformed request', () => {
    it.todo('should answer 400 naming every missing or mistyped field at once');
    it.todo('should answer 400 for a JSON body that is an array, a string, a number or null');
    it.todo('should answer 400 for a body that is not valid JSON');
    it.todo('should answer every error with a body matching the error schema');
  });

  describe('strictness', () => {
    it.todo('should keep the publish request schema no stricter than Discount: no length cap, any characters');
    it.todo('should keep the discount response schema no stricter than Discount');
  });

  describe('empty', () => {
    it.todo('should answer 400 naming the item, the store name and the store address when each is only blank space');
    it.todo('should answer 400 naming the rate when the rate is only blank space');
  });

  describe('A1 input boundary', () => {
    it.todo('should answer 400 naming the item, the store name and the store address when each is longer than allowed');
  });

  describe('A3 handle guessing (no accounts)', () => {
    it.todo('should give the published discount an id of its own, ignoring an id sent in the request');
  });

  describe('A4 concurrency', () => {
    it.todo('should keep both of two discounts published at the same moment');
    it.todo('should create one discount when the same publish request arrives twice');
  });

  describe('A5 resource exhaustion', () => {
    it.todo('should answer 413 for a body above the transport limit and keep answering afterwards');
    it.todo('should throttle publishing from one source far faster than any store owner publishes');
  });

  describe('A6 business-logic abuse', () => {
    it.todo('should keep nothing the request sends beyond the item, rate, store name and store address');
  });
});
