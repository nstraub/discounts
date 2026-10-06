import { describe, expect, it } from 'vitest';

import { FetchRestApi } from '@app/types/rest-api';
import { BadRequestException, UnprocessableContentException } from '@app/types/rest-api-refusals';
import { spicesDiscount, stephaniesProduceDiscount, theStoreOf } from '@sut/support/example-discounts';

import { setupSut as setupTheApp } from '../../support/app';

const setupSut = async () => {
  const { app, client } = await setupTheApp();
  await app.listen(0);
  return { client, restApi: new FetchRestApi(await app.getUrl()) };
};

const refusalOf = (answer: Promise<unknown>): Promise<unknown> => answer.then(
  () => 'resolved',
  (refusal: unknown) => refusal,
);

const theRefusalOfARateNotValid = async (): Promise<unknown> => {
  const { restApi } = await setupSut();
  return refusalOf(restApi.post('/discounts', { ...spicesDiscount, rate: '150' }));
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
    it('should reject an answer of 422 with an exception of its own', async () => {
      const { restApi } = await setupSut();
      const published = await restApi.post<{ id: string }>('/discounts', spicesDiscount);
      const { token } = await restApi.post<{ token: string }>(`/discounts/${published.id}/coupons`, {});

      const refusal = await refusalOf(restApi.post('/redemptions', { code: token, ...theStoreOf(stephaniesProduceDiscount) }));

      expect(refusal).to.be.instanceOf(UnprocessableContentException);
    });
    it('should not reject an answer other than 422 as unprocessable', async () => {
      const { restApi } = await setupSut();

      const refusal = await refusalOf(restApi.post('/nowhere', spicesDiscount));

      expect(refusal).to.not.be.instanceOf(UnprocessableContentException);
    });
    it('should carry the fields a 400 lists as missing in the rejection', async () => {
      const { restApi } = await setupSut();

      const refusal = await refusalOf(restApi.post('/discounts', { ...spicesDiscount, item: '' }));

      expect(refusal).to.be.instanceOf(BadRequestException);
      expect(refusal).to.deep.include({ missing: ['item'] });
    });
    it('should carry other fields when a 400 lists others as missing', async () => {
      const { restApi } = await setupSut();

      const refusal = await refusalOf(restApi.post('/discounts', { ...spicesDiscount, storeName: '', storeAddress: '' }));

      expect(refusal).to.deep.include({ missing: ['storeName', 'storeAddress'] });
    });
    it('should carry no field as missing when a 400 lists none', async () => {
      const refusal = await theRefusalOfARateNotValid();

      expect(refusal).to.deep.include({ missing: [] });
    });
    it('should carry the fields a 400 names in the rejection', async () => {
      const refusal = await theRefusalOfARateNotValid();

      expect(refusal).to.deep.include({ fields: ['rate'] });
    });
    it('should carry other fields when a 400 names others', async () => {
      const { restApi } = await setupSut();

      const refusal = await refusalOf(restApi.post('/discounts', { ...spicesDiscount, item: '' }));

      expect(refusal).to.deep.include({ fields: ['item'] });
    });
  });

  describe('getting', () => {
    it('should reject when the answer is not ok', async () => {
      const { restApi } = await setupSut();

      const outcome = await outcomeOf(restApi.get('/nowhere'));

      expect(outcome).to.equal('GET /nowhere answered 404');
    });
  });
  describe('patching', () => {
    it('should send the body as JSON to the path with PATCH', async () => {
      const { client, restApi } = await setupSut();
      const published = await restApi.post<{ id: string }>('/discounts', spicesDiscount);

      await restApi.patch(`/discounts/${published.id}`, { rate: '25' });

      const { rows } = await client.query('SELECT rate FROM app.discounts');
      expect(rows).to.deep.equal([{ rate: '25' }]);
    });
    it('should resolve when the answer is ok with no content', async () => {
      const { restApi } = await setupSut();
      const published = await restApi.post<{ id: string }>('/discounts', spicesDiscount);

      const outcome = await outcomeOf(restApi.patch(`/discounts/${published.id}`, { rate: '25' }));

      expect(outcome).to.equal('resolved');
    });
    it('should reject when the answer is not ok', async () => {
      const { restApi } = await setupSut();
      const published = await restApi.post<{ id: string }>('/discounts', spicesDiscount);

      const outcome = await outcomeOf(restApi.patch(`/discounts/${published.id}`, {}));

      expect(outcome).to.equal(`PATCH /discounts/${published.id} answered 400`);
    });
  });
});
