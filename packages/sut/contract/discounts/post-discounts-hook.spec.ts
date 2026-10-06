import { describe, expect, it } from 'vitest';

import { spicesDiscount, spicesDiscountWithItsHook } from '@sut/support/example-discounts';

import { setupSut } from '../support/app';

describe('POST /discounts with a hook', () => {
  describe('success', () => {
    it('should publish the hook the request gives and answer with it', async () => {
      const { client, http } = await setupSut();

      const response = await http.post('/discounts').send(spicesDiscountWithItsHook);

      const { rows } = await client.query('SELECT hook FROM app.discounts');
      expect(rows.map((row) => row.hook), 'the hook kept').to.deep.equal([spicesDiscountWithItsHook.hook]);
      expect(response.body, 'the discount published').to.deep.equal({ id: response.body.id, ...spicesDiscountWithItsHook });
    });
    it('should answer with no hook when the request gives none', async () => {
      const { http } = await setupSut();

      const response = await http.post('/discounts').send(spicesDiscount);

      expect(response.body).to.not.have.property('hook');
    });
  });

  describe('empty', () => {
    it.todo('should publish no hook when the hook is null, empty or only blank space');
  });

  describe('type', () => {
    it.todo('should answer 400 naming the hook when it is a number, an array or an object, never a 500');
  });

  describe('A1 input boundary', () => {
    it.todo('should answer 400 naming the hook when it is longer than allowed');
  });
});
