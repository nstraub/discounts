import { mock } from 'vitest-mock-extended';
import { describe, expect, it } from 'vitest';

import { DiscountDetails } from '@backend/discounts/application/domain/discount-details';
import { DiscountFactory } from '@backend/discounts/application/domain/discount-factory';
import { DiscountRateChanged } from '@backend/discounts/application/domain/discount-rate-changed';
import type { DomainEventPublisher } from '@backend/discounts/application/domain/domain-event-publisher';
import { spicesDiscount } from '@sut/support/example-discounts';

const setupSut = () => {
  const events = mock<DomainEventPublisher>();
  return { events, discount: new DiscountFactory(events).create(new DiscountDetails(spicesDiscount)) };
};

describe('class Discount', () => {
  describe('changing its rate', () => {
    describe('the discount changed', () => {
      it('should hold the new rate once its rate is changed', () => {
        const { discount } = setupSut();

        discount.changeRate('25');

        expect(discount.toJSON().rate).to.equal('25');
      });
      it('should raise DiscountRateChanged carrying its id and its new rate', () => {
        const { events, discount } = setupSut();

        discount.changeRate('25');

        const [raised] = events.publish.mock.lastCall ?? [];
        expect(raised).to.be.instanceOf(DiscountRateChanged);
        expect(raised).to.deep.include({ id: 'test-uuid', rate: '25' });
      });
      it.todo('should keep its item, store name and store address when its rate changes');
    });

    describe('state', () => {
      it.todo('should hold the later rate when its rate is changed twice');
      it.todo('should accept a change to the rate it already has, staying as it is');
    });

    describe('empty', () => {
      it.todo('should refuse a new rate made only of blank space, its rejection naming the rate as missing, keeping its rate');
    });

    describe('type', () => {
      it.todo('should refuse a new rate that is not a number, its rejection naming the rate as not valid, keeping its rate');
    });
  });
});
