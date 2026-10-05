import { EventEmitter2 } from '@nestjs/event-emitter';
import { describe, expect, it } from 'vitest';

import { discountResponse, requestRejection } from '@app/types/discounts';
import { produceDiscount, spicesDiscount } from '@sut/support/example-discounts';

import { setupSut } from '../support/app';

type Http = Awaited<ReturnType<typeof setupSut>>['http'];

const longTextInAnyCharacters = {
  item: 'Ají panca 🌶️ '.repeat(1_000),
  storeName: "D'Ángelo's <b>Bodega</b>",
  storeAddress: 'Calle Ñuñoa 4; piso 2 '.repeat(500),
};

const aDiscountAboveTheTransportLimit = { ...spicesDiscount, item: 'x'.repeat(200_000) };

const postWrittenAsJson = (http: Http, body: string) => http.post('/discounts').set('Content-Type', 'application/json').send(body);

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
    it('should answer with a body matching the discount response schema', async () => {
      const { http } = await setupSut();

      const response = await http.post('/discounts').send(spicesDiscount);

      expect(discountResponse.safeParse(response.body).error).to.equal(undefined);
    });
    it('should publish DiscountPublished on the application event emitter for the discount published', async () => {
      const { app, http } = await setupSut();
      const published: unknown[] = [];
      app.get(EventEmitter2).on('discount.published', (event: { discount: unknown }) => published.push(event.discount));

      const response = await http.post('/discounts').send(spicesDiscount);

      expect(published).to.deep.equal([{ id: response.body.id, ...spicesDiscount }]);
    });
  });

  describe('malformed request', () => {
    it('should answer 400 naming every missing or mistyped field at once', async () => {
      const { http } = await setupSut();

      const response = await http.post('/discounts').send({ item: spicesDiscount.item, rate: '20' });

      expect(response.status).to.equal(400);
      expect(requestRejection.parse(response.body).fields).to.have.members(['rate', 'storeName', 'storeAddress']);
    });
    it('should answer 400 naming only the field that is missing when the others are given', async () => {
      const { http } = await setupSut();
      const { rate, storeName, storeAddress } = spicesDiscount;

      const response = await http.post('/discounts').send({ rate, storeName, storeAddress });

      expect(requestRejection.parse(response.body).fields).to.deep.equal(['item']);
    });
    it('should answer 400 for a JSON body that is an array, a string, a number or null', async () => {
      const { http } = await setupSut();
      const bodiesThatAreNotObjects = ['[]', '"Peruvian spices"', '20', 'null'];

      const statuses = [];
      for (const body of bodiesThatAreNotObjects) {
        const response = await postWrittenAsJson(http, body);
        statuses.push(response.status);
      }

      expect(statuses).to.deep.equal([400, 400, 400, 400]);
    });
    it('should answer 400 for a body that is not valid JSON', async () => {
      const { http } = await setupSut();

      const response = await postWrittenAsJson(http, '{"item": "Peruvian spices",');

      expect(response.status).to.equal(400);
    });
    it('should answer every error with a body matching the error schema', async () => {
      const { http } = await setupSut();
      const errors = [
        await http.post('/discounts').send({ item: spicesDiscount.item }),
        await postWrittenAsJson(http, '[]'),
        await postWrittenAsJson(http, '"Peruvian spices"'),
        await postWrittenAsJson(http, '20'),
        await postWrittenAsJson(http, 'null'),
        await postWrittenAsJson(http, '{"item": "Peruvian spices",'),
        await http.post('/discounts').send(aDiscountAboveTheTransportLimit),
      ];

      const unmatched = errors.map((response) => response.body).filter((body) => !requestRejection.safeParse(body).success);

      expect(unmatched).to.deep.equal([]);
    });
  });

  describe('strictness', () => {
    it('should keep the publish request schema no stricter than Discount: no length cap, any characters', async () => {
      const { http } = await setupSut();

      const response = await http.post('/discounts').send({ ...spicesDiscount, ...longTextInAnyCharacters });

      expect(response.status).to.equal(201);
      expect(response.body).to.deep.include(longTextInAnyCharacters);
    });
    it('should keep the discount response schema no stricter than Discount', async () => {
      const { http } = await setupSut();

      const response = await http.post('/discounts').send({ ...spicesDiscount, ...longTextInAnyCharacters });

      expect(discountResponse.safeParse(response.body).error).to.equal(undefined);
    });
  });

  describe('empty', () => {
    it.todo('should answer 400 naming the item, the store name and the store address when each is only blank space');
    it.todo('should answer 400 naming the rate when the rate is only blank space');
  });

  describe('A1 input boundary', () => {
    it.todo('should answer 400 naming the item, the store name and the store address when each is longer than allowed');
  });

  describe('A3 handle guessing (no accounts)', () => {
    it('should give the published discount an id of its own, ignoring an id sent in the request', async () => {
      const { http } = await setupSut();

      const response = await http.post('/discounts').send({ ...spicesDiscount, id: 'chosen-by-the-caller' });

      expect(response.body.id).to.not.equal('chosen-by-the-caller');
      expect(response.headers.location).to.equal(`/discounts/${response.body.id}`);
    });
  });

  describe('A4 concurrency', () => {
    it('should keep both of two discounts published at the same moment', async () => {
      const { client, http } = await setupSut();

      await Promise.all([http.post('/discounts').send(spicesDiscount), http.post('/discounts').send(produceDiscount)]);

      const { rows } = await client.query('SELECT item FROM app.discounts');
      expect(rows.map((row) => row.item)).to.have.members([spicesDiscount.item, produceDiscount.item]);
    });
    it.todo('should create one discount when the same publish request arrives twice');
  });

  describe('A5 resource exhaustion', () => {
    it('should answer 413 for a body above the transport limit and keep answering afterwards', async () => {
      const { http } = await setupSut();

      const oversized = await http.post('/discounts').send(aDiscountAboveTheTransportLimit);
      const afterwards = await http.post('/discounts').send(spicesDiscount);

      expect(oversized.status).to.equal(413);
      expect(afterwards.status).to.equal(201);
    });
    it.todo('should throttle publishing from one source far faster than any store owner publishes');
  });

  describe('A6 business-logic abuse', () => {
    it('should keep nothing the request sends beyond the item, rate, store name and store address', async () => {
      const { client, http } = await setupSut();

      const response = await http.post('/discounts').send({ ...spicesDiscount, publishedBy: 'Mike', featured: true });

      const { rows } = await client.query('SELECT * FROM app.discounts');
      const { item, rate, storeName, storeAddress } = spicesDiscount;
      expect(rows).to.deep.equal([{ id: response.body.id, item, rate, store_name: storeName, store_address: storeAddress }]);
      expect(response.body, 'the discount published').to.deep.equal({ id: response.body.id, ...spicesDiscount });
    });
  });
});
