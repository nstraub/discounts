import { describe, expect, it } from 'vitest';

import { publishedProduceDiscount, publishedSpicesDiscount } from '@sut/support/example-discounts';

import { setupSut } from './discounts-store-of-an-app';

describe('Store discounts', () => {
  describe('loading the published discounts', () => {
    describe('none, one and many', () => {
      it('should hold no discount when none is published', async () => {
        const { restApi, discounts } = setupSut();
        restApi.get.mockResolvedValue([]);

        await discounts.load();

        expect(discounts.published).to.deep.equal([]);
      });
      it('should hold every discount published', async () => {
        const { restApi, discounts } = setupSut();
        const everyDiscount = [publishedSpicesDiscount, publishedProduceDiscount];
        restApi.get.mockResolvedValue(everyDiscount);

        await discounts.load();

        expect(discounts.published).to.deep.equal(everyDiscount);
      });
    });

    describe('dependency failure', () => {
      it.todo('should hold that the discounts cannot be shown when they cannot be loaded');
    });
  });
});
