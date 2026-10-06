import { describe, expect, it } from 'vitest';

import { requestRejection } from '@app/types/discounts';
import { spicesDiscount } from '@sut/support/example-discounts';

import { setupSut } from '../support/app';

describe('POST /discounts with a rate written another way', () => {
  describe('type', () => {
    it('should answer 400 naming the rate, or publish it, when the rate is sent as a JSON number, never a 500', async () => {
      const { http } = await setupSut();

      const response = await http.post('/discounts').send({ ...spicesDiscount, rate: Number(spicesDiscount.rate) });

      expect([response.status, requestRejection.parse(response.body).fields]).to.deep.equal([400, ['rate']]);
    });
  });

  describe('A1 input boundary', () => {
    it.todo('should answer 400 naming the rate when it is 10 000 characters long');
  });
});
