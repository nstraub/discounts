import { describe, expect, it } from 'vitest';

import { setupSut } from '../support/app';

describe('GET /discounts', () => {
  describe('success', () => {
    it.todo('should answer 200 with every published discount as JSON');
    it('should answer 200 with an empty list when nothing is published', async () => {
      const { http } = await setupSut();

      const response = await http.get('/discounts');

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal([]);
    });
    it.todo('should answer with a body matching the published-discounts response schema');
    it.todo('should list both of two identical discounts, each with its own id');
  });

  describe('strictness', () => {
    it.todo('should keep the published-discounts response schema no stricter than Discount');
  });
});
