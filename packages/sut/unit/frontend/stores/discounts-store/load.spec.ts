import { describe, expect, it } from 'vitest';

import { setupSut } from './discounts-store-of-an-app';

describe('Store discounts', () => {
  describe('loading the published discounts', () => {
    describe('empty', () => {
      it('should hold no discount when none is published', async () => {
        const { restApi, discounts } = setupSut();
        restApi.get.mockResolvedValue([]);

        await discounts.load();

        expect(discounts.published).to.deep.equal([]);
      });
      it.todo('should hold every discount published');
    });
  });
});
