import { mock } from 'vitest-mock-extended';
import { describe, expect, it } from 'vitest';

import { InMemoryDiscountRepository } from '@backend/app/mocks/in-memory-discount-repository';
import { aSourceDrawing } from '@backend/app/mocks/random-sources';
import { DiscountService } from '@backend/discounts/application/discount-service';
import { DiscountDetails } from '@backend/discounts/application/domain/discount-details';
import { DiscountPublicationRejected } from '@backend/discounts/application/domain/discount-publication-rejected';
import { DiscountPublished } from '@backend/discounts/application/domain/discount-published';
import { DiscountFactory } from '@backend/discounts/application/domain/discount-factory';
import type { DomainEventPublisher } from '@backend/discounts/application/domain/domain-event-publisher';
import { PiecesMissingException } from '@backend/discounts/application/domain/pieces-missing-exception';
import { RateNotValidException } from '@backend/discounts/application/domain/rate-not-valid-exception';
import { spicesDiscount } from '@sut/support/example-discounts';

const spicesDetails = new DiscountDetails(spicesDiscount);
const aRateItsRulesRefuse = '150';
const spicesDetailsAtARateItsRulesRefuse = spicesDetails.withRate(aRateItsRulesRefuse);

const spicesDetailsWithItsItemAndStoreNameLeftOut = new DiscountDetails({ ...spicesDiscount, item: '', storeName: ' ' });

const setupSut = () => {
  const events = mock<DomainEventPublisher>();
  const repository = new InMemoryDiscountRepository();
  return { events, repository, service: new DiscountService(new DiscountFactory(events), repository, aSourceDrawing('7K3QX9M2PD')) };
};

describe('class DiscountService', () => {
  describe('publishing a discount', () => {
    it('should keep the discount Mike publishes among the published discounts', async () => {
      const { repository, service } = setupSut();

      await service.publish(spicesDetails);

      const kept = await repository.all();
      expect(kept.map((discount) => discount.toJSON())).to.deep.equal([{ id: 'test-uuid', ...spicesDiscount, coupons: [] }]);
    });
    it('should announce DiscountPublished once the discount is kept', async () => {
      const { events, repository, service } = setupSut();
      const keptWhenAnnounced: unknown[] = [];
      events.publish.mockImplementation(async () => {
        keptWhenAnnounced.push(...(await repository.all()).map((discount) => discount.toJSON()));
      });

      await service.publish(spicesDetails);

      expect(events.publish).to.have.been.calledWith(expect.any(DiscountPublished));
      expect(keptWhenAnnounced).to.deep.equal([{ id: 'test-uuid', ...spicesDiscount, coupons: [] }]);
    });
    it('should answer with the discount it published', async () => {
      const { repository, service } = setupSut();

      const answered = await service.publish(spicesDetails);

      const [published] = await repository.all();
      expect(answered).to.equal(published);
    });
  });
  describe('publishing a discount at a rate its rules refuse', () => {
    it('should report the rate as not valid', async () => {
      const { service } = setupSut();

      await expect(service.publish(spicesDetailsAtARateItsRulesRefuse)).rejects.to.be.instanceOf(RateNotValidException);
    });
    it('should keep nothing when the rate is refused', async () => {
      const { repository, service } = setupSut();

      await expect(service.publish(spicesDetailsAtARateItsRulesRefuse)).rejects.to.be.instanceOf(RateNotValidException);

      expect(await repository.all()).to.deep.equal([]);
    });
    it('should announce DiscountPublicationRejected for the rate refused', async () => {
      const { events, service } = setupSut();

      await expect(service.publish(spicesDetailsAtARateItsRulesRefuse)).rejects.to.be.instanceOf(RateNotValidException);

      expect(events.publish).to.have.been.calledWith(new DiscountPublicationRejected(aRateItsRulesRefuse, 'not valid', ['rate']));
    });
  });
  describe('publishing a discount with a piece left out', () => {
    it('should report the pieces left out as missing', async () => {
      const { service } = setupSut();

      await expect(service.publish(spicesDetailsWithItsItemAndStoreNameLeftOut)).rejects.to.have.deep.property('pieces', ['item', 'storeName']);
    });
    it('should keep nothing when a piece is left out', async () => {
      const { repository, service } = setupSut();

      await expect(service.publish(spicesDetailsWithItsItemAndStoreNameLeftOut)).rejects.to.be.instanceOf(PiecesMissingException);

      expect(await repository.all()).to.deep.equal([]);
    });
  });
});
