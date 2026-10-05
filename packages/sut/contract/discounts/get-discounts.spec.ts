import { describe, expect, it } from 'vitest';

import { publishedDiscountsResponse } from '@app/types/discounts';
import { produceDiscount, spicesDiscount } from '@sut/support/example-discounts';

import { setupSut } from '../support/app';

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
  });

  describe('strictness', () => {
    it.todo('should keep the published-discounts response schema no stricter than Discount');
  });
});
