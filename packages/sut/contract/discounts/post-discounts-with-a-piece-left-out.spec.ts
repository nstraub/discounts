import { describe, expect, it } from 'vitest';

import { requestRejection } from '@app/types/request-rejection';
import { spicesDiscount } from '@sut/support/example-discounts';

import { setupSut } from '../support/app';
import { bodiesNotMatchingTheErrorSchema, theFieldsNamedBy } from '../support/error-schema';
import { publicationRejectionsHeardBy } from '../support/publication-rejections';

const { item, rate, storeName, storeAddress } = spicesDiscount;

const spicesDiscountLeavingOutEachPiece = [
  { piece: 'item', discount: { rate, storeName, storeAddress } },
  { piece: 'rate', discount: { item, storeName, storeAddress } },
  { piece: 'storeName', discount: { item, rate, storeAddress } },
  { piece: 'storeAddress', discount: { item, rate, storeName } },
];

describe('POST /discounts with a piece left out', () => {
  describe('the pieces missing', () => {
    it('should answer 400 listing as missing each of the item, the rate, the store name and the store address left out', async () => {
      const { http } = await setupSut();
      const answers = [];

      for (const { discount } of spicesDiscountLeavingOutEachPiece) {
        answers.push(await http.post('/discounts').send(discount));
      }

      const statusAndMissing = answers.map((answer) => [answer.status, requestRejection.parse(answer.body).missing]);
      expect(statusAndMissing).to.deep.equal(spicesDiscountLeavingOutEachPiece.map(({ piece }) => [400, [piece]]));
    });
    it('should list as missing only the pieces left out, not a piece of the wrong type', async () => {
      const { http } = await setupSut();

      const response = await http.post('/discounts').send({ item, rate: 20, storeName });

      expect(requestRejection.parse(response.body).missing).to.deep.equal(['storeAddress']);
    });
    it('should list a rate left out as missing and not list a rate of 150 as missing, fields naming the rate in both', async () => {
      const { http } = await setupSut();

      const rateLeftOut = await http.post('/discounts').send({ item, storeName, storeAddress });
      const rateOf150 = await http.post('/discounts').send({ ...spicesDiscount, rate: '150' });

      expect(theFieldsNamedBy(rateLeftOut, rateOf150), 'the fields named').to.deep.equal([['rate'], ['rate']]);
      expect([rateLeftOut, rateOf150].map((answer) => requestRejection.parse(answer.body).missing)).to.deep.equal([['rate'], undefined]);
    });
    it('should answer 400 listing the item, the store name and the store address as missing when each is empty text', async () => {
      const { http } = await setupSut();

      const response = await http.post('/discounts').send({ item: '', rate, storeName: '', storeAddress: '' });

      expect(response.status).to.equal(400);
      expect(requestRejection.parse(response.body).missing).to.deep.equal(['item', 'storeName', 'storeAddress']);
    });
    it('should answer with a body matching the error schema when pieces are missing', async () => {
      const { http } = await setupSut();

      const answers = [
        await http.post('/discounts').send({ item, storeName, storeAddress }),
        await http.post('/discounts').send({ ...spicesDiscount, item: '' }),
      ];

      expect(bodiesNotMatchingTheErrorSchema(answers)).to.deep.equal([]);
    });
    it('should publish nothing when a piece is missing, listing no discount afterwards', async () => {
      const { http } = await setupSut();

      await http.post('/discounts').send({ ...spicesDiscount, item: '' });

      const listed = await http.get('/discounts');
      expect(listed.body).to.deep.equal([]);
    });
    it('should publish DiscountPublicationRejected on the application event emitter for a piece made only of blank space', async () => {
      const { app, http } = await setupSut();
      const rejected = publicationRejectionsHeardBy(app);

      await http.post('/discounts').send({ ...spicesDiscount, storeName: '   ' });

      expect(rejected.map(({ reason, pieces }) => ({ reason, pieces }))).to.deep.equal([{ reason: 'missing', pieces: ['storeName'] }]);
    });
  });
});
