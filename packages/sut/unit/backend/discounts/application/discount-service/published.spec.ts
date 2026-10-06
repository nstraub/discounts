import { mock } from 'vitest-mock-extended';
import { describe, expect, it } from 'vitest';

import { InMemoryDiscountRepository } from '@backend/app/mocks/in-memory-discount-repository';
import { DiscountService } from '@backend/discounts/application/discount-service';
import { DiscountDetails } from '@backend/discounts/application/domain/discount-details';
import { DiscountFactory } from '@backend/discounts/application/domain/discount-factory';
import type { DomainEventPublisher } from '@backend/discounts/application/domain/domain-event-publisher';
import { produceDiscount, spicesDiscount } from '@sut/support/example-discounts';

const setupSut = () => {
  const factory = new DiscountFactory(mock<DomainEventPublisher>());
  const repository = new InMemoryDiscountRepository();
  const keep = (details: typeof spicesDiscount) => repository.save(factory.create(new DiscountDetails(details)));
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
        await keep(spicesDiscount);

        const published = await service.published();

        expect(published.map((discount) => discount.toJSON())).to.deep.equal([{ id: 'test-uuid', ...spicesDiscount }]);
      });
      it('should answer with every discount published when there are several', async () => {
        const { keep, service } = setupSut();
        await keep(spicesDiscount);
        await keep(produceDiscount);

        const published = await service.published();

        expect(published.map((discount) => discount.toJSON())).to.deep.equal([
          { id: 'test-uuid', ...spicesDiscount },
          { id: 'test-uuid', ...produceDiscount },
        ]);
      });
    });

    describe('dependency failure', () => {
      it.todo('should report that the discounts cannot be read when they cannot be read');
    });
  });
});
