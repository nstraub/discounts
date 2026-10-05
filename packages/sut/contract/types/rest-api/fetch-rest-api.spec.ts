import { describe, expect, it } from 'vitest';

import { FetchRestApi } from '@app/types/rest-api';
import { spicesDiscount } from '@sut/support/example-discounts';

import { setupSut as setupTheApp } from '../../support/app';

const setupSut = async () => {
  const { app, client } = await setupTheApp();
  await app.listen(0);
  return { client, restApi: new FetchRestApi(await app.getUrl()) };
};

const outcomeOf = (answer: Promise<unknown>): Promise<string> =>
  answer.then(
    () => 'resolved',
    (error: Error) => error.message,
  );

describe('class FetchRestApi', () => {
  describe('posting', () => {
    it('should post the body as JSON to the path', async () => {
      const { client, restApi } = await setupSut();

      await restApi.post('/discounts', spicesDiscount);

      const { rows } = await client.query('SELECT item, rate, store_name, store_address FROM app.discounts');
      expect(rows).to.deep.equal([{ item: spicesDiscount.item, rate: spicesDiscount.rate, store_name: spicesDiscount.storeName, store_address: spicesDiscount.storeAddress }]);
    });
    it('should resolve to the body of the answer', async () => {
      const { restApi } = await setupSut();

      const answer = await restApi.post<{ item: string }>('/discounts', spicesDiscount);

      expect(answer?.item).to.equal(spicesDiscount.item);
    });
    it('should reject when the answer is not ok', async () => {
      const { restApi } = await setupSut();

      const outcome = await outcomeOf(restApi.post('/discounts', { item: spicesDiscount.item }));

      expect(outcome).to.equal('POST /discounts answered 400');
    });
    it('should name the path and the status of the answer in the rejection', async () => {
      const { restApi } = await setupSut();

      const outcome = await outcomeOf(restApi.post('/nowhere', spicesDiscount));

      expect(outcome).to.equal('POST /nowhere answered 404');
    });
  });
});
