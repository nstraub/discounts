import { mock } from 'vitest-mock-extended';
import { describe, expect, it } from 'vitest';

import { DiscountService } from '@backend/discounts/application/discount-service';
import { DiscountFactory } from '@backend/discounts/application/domain/discount-factory';
import type { DiscountRepository } from '@backend/discounts/application/domain/discount-repository';
import type { DomainEventPublisher } from '@backend/discounts/application/domain/domain-event-publisher';
import { spicesDiscount } from '@sut/support/example-discounts';

const setupSut = () => {
  const events = mock<DomainEventPublisher>();
  const factory = new DiscountFactory(events);
  const repository = mock<DiscountRepository>();
  repository.withId.calledWith('spices-id').mockResolvedValue(factory.reconstitute({ id: 'spices-id', ...spicesDiscount }));
  return { events, repository, service: new DiscountService(factory, repository) };
};

describe('class DiscountService', () => {
  describe('changing the rate of a discount', () => {
    it('should keep the discount named at its new rate', async () => {
      const { repository, service } = setupSut();

      await service.changeRate('spices-id', '25');

      expect(repository.save.mock.lastCall?.at(0)?.toJSON()).to.deep.equal({ id: 'spices-id', ...spicesDiscount, rate: '25' });
    });
    it.todo('should announce DiscountRateChanged once the change is kept');

    describe('state', () => {
      it.todo('should report that there is no such discount when no discount has that id, changing nothing');
    });

    describe('dependency failure', () => {
      it.todo('should report that the rate could not be changed when the change cannot be kept');
    });
  });
});
