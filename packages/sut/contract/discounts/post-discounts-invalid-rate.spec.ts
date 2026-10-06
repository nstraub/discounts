import { describe, expect, it } from 'vitest';

import { requestRejection } from '@app/types/request-rejection';
import { spicesDiscount } from '@sut/support/example-discounts';

import { setupSut } from '../support/app';
import { bodiesNotMatchingTheErrorSchema } from '../support/error-schema';
import { publicationRejectionsHeardBy } from '../support/publication-rejections';

type Http = Awaited<ReturnType<typeof setupSut>>['http'];

const aRateAbove100 = '150';

const ratesTheScenarioRefuses = [aRateAbove100, '100.5', '12.25', '0', '-10'];

const publishAtTheRate = (http: Http, rate: string) => http.post('/discounts').send({ ...spicesDiscount, rate });

describe('POST /discounts with a rate that is not valid', () => {
  describe('the rate refused', () => {
    it('should answer 400 naming the rate as not valid for 150, 100.5, 12.25, 0 and -10', async () => {
      const { http } = await setupSut();
      const answers = [];

      for (const rate of ratesTheScenarioRefuses) {
        answers.push(await publishAtTheRate(http, rate));
      }

      const statusAndFields = answers.map((answer) => [answer.status, requestRejection.parse(answer.body).fields]);
      expect(statusAndFields).to.deep.equal(ratesTheScenarioRefuses.map(() => [400, ['rate']]));
    });
    it('should answer with a body matching the error schema when the rate is not valid', async () => {
      const { http } = await setupSut();

      const response = await publishAtTheRate(http, aRateAbove100);

      expect(bodiesNotMatchingTheErrorSchema([response])).to.deep.equal([]);
    });
    it('should publish nothing when the rate is not valid, listing no discount afterwards', async () => {
      const { http } = await setupSut();

      await publishAtTheRate(http, aRateAbove100);

      const listed = await http.get('/discounts');
      expect(listed.body).to.deep.equal([]);
    });
    it('should publish DiscountPublicationRejected on the application event emitter for the rate refused', async () => {
      const { app, http } = await setupSut();
      const rejected = publicationRejectionsHeardBy(app);

      await publishAtTheRate(http, aRateAbove100);

      expect(rejected.map(({ rate, reason }) => ({ rate, reason }))).to.deep.equal([{ rate: aRateAbove100, reason: 'not valid' }]);
    });
    it('should publish no DiscountPublicationRejected when the request schema refuses the body before any rule decides', async () => {
      const { app, http } = await setupSut();
      const rejected = publicationRejectionsHeardBy(app);

      await http.post('/discounts').send({ ...spicesDiscount, rate: Number(aRateAbove100) });

      expect(rejected).to.deep.equal([]);
    });
  });

  describe('combination', () => {
    it.todo('should name at once the rate as not valid and the item as missing when both are wrong');
  });
});
