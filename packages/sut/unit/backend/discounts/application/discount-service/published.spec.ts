import { mock } from 'vitest-mock-extended';
import { describe, expect, it } from 'vitest';

import { InMemoryDiscountRepository } from '@backend/app/mocks/in-memory-discount-repository';
import { DiscountService } from '@backend/discounts/application/discount-service';
import { DiscountFactory } from '@backend/discounts/application/domain/discount-factory';
import type { DomainEventPublisher } from '@backend/discounts/application/domain/domain-event-publisher';
import { publishedProduceDiscount, publishedSpicesDiscount } from '@sut/support/example-discounts';

const setupSut = () => {
  const factory = new DiscountFactory(mock<DomainEventPublisher>());
  const repository = new InMemoryDiscountRepository();
  const keep = (discount: typeof publishedSpicesDiscount) => repository.save(factory.reconstitute({ ...discount, coupons: [] }));
  return { keep, service: new DiscountService(factory, repository) };
};

describe('class DiscountService', () => {
  describe('the published discounts', () => {
    describe('none, one and many', () => {
      it('should answer with no discount when none is published', async () => {
        const { service } = setupSut();

        const published = await service.published();

        expect(published).to.deep.equal([]);
      });
      it('should answer with the one discount published', async () => {
        const { keep, service } = setupSut();
        await keep(publishedSpicesDiscount);

        const published = await service.published();

        expect(published.map((discount) => discount.toJSON())).to.deep.equal([{ ...publishedSpicesDiscount, coupons: [] }]);
      });
      it('should answer with every discount published when there are several', async () => {
        const { keep, service } = setupSut();
        await keep(publishedSpicesDiscount);
        await keep(publishedProduceDiscount);

        const published = await service.published();

        expect(published.map((discount) => discount.toJSON())).to.deep.equal([
          { ...publishedSpicesDiscount, coupons: [] },
          { ...publishedProduceDiscount, coupons: [] },
        ]);
      });
    });

    describe('dependency failure', () => {
      it.todo('should report that the discounts cannot be read when they cannot be read');
    });
  });
});
