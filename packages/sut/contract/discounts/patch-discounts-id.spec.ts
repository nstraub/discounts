import { EventEmitter2 } from '@nestjs/event-emitter';
import { describe, expect, it } from 'vitest';

import { type Http, publishTheSpicesDiscount, setupSut } from '../support/app';
import { statusesAnsweringBodiesThatAreNotObjects } from '../support/bodies-that-are-not-objects';
import { bodiesNotMatchingTheErrorSchema, theFieldsNamedBy } from '../support/error-schema';

const patchTheDiscount = (http: Http, id: string) => http.patch(`/discounts/${id}`);

const patchWrittenAsJson = (http: Http, id: string, body: string) => patchTheDiscount(http, id).set('Content-Type', 'application/json').send(body);

describe('PATCH /discounts/:id', () => {
  describe('success', () => {
    it('should answer 204 with no body when the rate is changed', async () => {
      const { http } = await setupSut();
      const published = await publishTheSpicesDiscount(http);

      const response = await patchTheDiscount(http, published.id).send({ rate: '25' });

      expect(response.status).to.equal(204);
      expect(response.text).to.equal('');
    });
    it('should list the discount once, at its new rate, after the change', async () => {
      const { http } = await setupSut();
      const published = await publishTheSpicesDiscount(http);

      await patchTheDiscount(http, published.id).send({ rate: '25' });

      const listed = await http.get('/discounts');
      expect(listed.body, 'the discounts listed after the change').to.deep.equal([{ ...published, rate: '25' }]);
    });
    it('should publish DiscountRateChanged on the application event emitter for the discount changed', async () => {
      const { app, http } = await setupSut();
      const changed: unknown[] = [];
      app.get(EventEmitter2).on('discount.rate-changed', (event: { id: string; rate: string }) => changed.push({ id: event.id, rate: event.rate }));
      const published = await publishTheSpicesDiscount(http);

      await patchTheDiscount(http, published.id).send({ rate: '25' });

      expect(changed).to.deep.equal([{ id: published.id, rate: '25' }]);
    });
  });

  describe('malformed request', () => {
    it('should answer 400 naming the rate when it is missing or not text, never a 500', async () => {
      const { http } = await setupSut();
      const published = await publishTheSpicesDiscount(http);

      const missing = await patchTheDiscount(http, published.id).send({});
      const notText = await patchTheDiscount(http, published.id).send({ rate: 25 });

      expect([missing.status, notText.status]).to.deep.equal([400, 400]);
      expect(theFieldsNamedBy(missing, notText)).to.deep.equal([['rate'], ['rate']]);
    });
    it('should answer 400 for a JSON body that is an array, a string, a number or null', async () => {
      const { http } = await setupSut();
      const published = await publishTheSpicesDiscount(http);

      const statuses = await statusesAnsweringBodiesThatAreNotObjects((body) => patchWrittenAsJson(http, published.id, body));

      expect(statuses).to.deep.equal([400, 400, 400, 400]);
    });
    it('should answer 400 for a body that is not valid JSON', async () => {
      const { http } = await setupSut();
      const published = await publishTheSpicesDiscount(http);

      const response = await patchWrittenAsJson(http, published.id, '{"rate": "25",');

      expect(response.status).to.equal(400);
    });
    it('should answer every error with a body matching the error schema', async () => {
      const { http } = await setupSut();
      const published = await publishTheSpicesDiscount(http);
      const errors = [
        await patchTheDiscount(http, published.id).send({}),
        await patchTheDiscount(http, published.id).send({ rate: 25 }),
        await patchWrittenAsJson(http, published.id, '[]'),
        await patchWrittenAsJson(http, published.id, '"25"'),
        await patchWrittenAsJson(http, published.id, '25'),
        await patchWrittenAsJson(http, published.id, 'null'),
        await patchWrittenAsJson(http, published.id, '{"rate": "25",'),
      ];

      expect(bodiesNotMatchingTheErrorSchema(errors)).to.deep.equal([]);
    });
  });

  describe('strictness', () => {
    it('should keep the change request schema no stricter than Discount', async () => {
      const { http } = await setupSut();
      const published = await publishTheSpicesDiscount(http);
      const aRateInLongTextOfAnyCharacters = 'Veinticinco ½ <b>%</b> 🌶️ '.repeat(500);

      const response = await patchTheDiscount(http, published.id).send({ rate: aRateInLongTextOfAnyCharacters });

      expect(response.status).to.equal(204);
      expect((await http.get('/discounts')).body, 'the discounts listed after the change').to.deep.equal([{ ...published, rate: aRateInLongTextOfAnyCharacters }]);
    });
  });

  describe('empty', () => {
    it.todo('should answer 400 naming the rate when it is only blank space, the discount keeping its rate');
  });

  describe('type', () => {
    it.todo('should answer 400 naming the rate when it is not a number, the discount keeping its rate');
  });

  describe('A3 handle guessing (no accounts)', () => {
    it('should answer 404 for an id no discount has, changing no discount', async () => {
      const { http } = await setupSut();
      const published = await publishTheSpicesDiscount(http);

      const response = await patchTheDiscount(http, 'an-id-no-discount-has').send({ rate: '25' });

      expect(response.status).to.equal(404);
      expect((await http.get('/discounts')).body, 'the discounts listed after the change').to.deep.equal([published]);
    });
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
  describe('A6 business-logic abuse of the hook', () => {
    it.todo('should leave the hook as it was when a change request carries another one');
  });
});
