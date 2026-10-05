import { mock } from 'vitest-mock-extended';
import { describe, expect, it } from 'vitest';

import { InMemoryDiscountRepository } from '@backend/app/mocks/in-memory-discount-repository';
import { DiscountService } from '@backend/discounts/application/discount-service';
import { DiscountDetails } from '@backend/discounts/application/domain/discount-details';
import { DiscountPublished } from '@backend/discounts/application/domain/discount-published';
import { DiscountFactory } from '@backend/discounts/application/domain/discount-factory';
import type { DomainEventPublisher } from '@backend/discounts/application/domain/domain-event-publisher';

const spicesDiscount = { item: 'Peruvian spices', rate: 20, storeName: "Mike's Groceries", storeAddress: '12 Market Street' };

const setupSut = () => {
  const events = mock<DomainEventPublisher>();
  const repository = new InMemoryDiscountRepository();
  return { events, repository, service: new DiscountService(new DiscountFactory(events), repository) };
};

describe('class DiscountService', () => {
  describe('publishing a discount', () => {
    it('should keep the discount Mike publishes among the published discounts', async () => {
      const { repository, service } = setupSut();

      await service.publish(new DiscountDetails(spicesDiscount));

      const kept = await repository.all();
      expect(kept.map((discount) => discount.toJSON())).to.deep.equal([{ id: 'test-uuid', ...spicesDiscount }]);
    });
    it('should announce DiscountPublished once the discount is kept', async () => {
      const { events, repository, service } = setupSut();
      const keptWhenAnnounced: unknown[] = [];
      events.publish.mockImplementation(async () => {
        keptWhenAnnounced.push(...(await repository.all()).map((discount) => discount.toJSON()));
      });

      await service.publish(new DiscountDetails(spicesDiscount));

      expect(events.publish).to.have.been.calledWith(expect.any(DiscountPublished));
      expect(keptWhenAnnounced).to.deep.equal([{ id: 'test-uuid', ...spicesDiscount }]);
    });
    it.todo('should answer with the discount it published');
  });
});
