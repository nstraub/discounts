import { describe, expect, it } from 'vitest';
import { mock } from 'vitest-mock-extended';

import { CouponIssued } from '@backend/discounts/application/domain/coupon-issued';
import type { DiscountRepository } from '@backend/discounts/application/domain/discount-repository';
import { NoSuchDiscountException } from '@backend/discounts/application/domain/no-such-discount-exception';
import { publishedProduceDiscount, spicesDiscount } from '@sut/support/example-discounts';

import { aServiceOverAKeptDiscount } from './a-service-over-a-kept-discount';

const setupSut = aServiceOverAKeptDiscount;

describe('class DiscountService', () => {
  describe('issuing a coupon for a discount', () => {
    it('should keep the discount named with its new coupon', async () => {
      const { repository, service } = setupSut();

      await service.issueCoupon('spices-id');

      expect(repository.save.mock.lastCall?.at(0)?.toJSON()).to.deep.include({ id: 'spices-id', coupons: [{ token: '7K3QX9M2PD', redeemed: false, counted: false }] });
    });
    it('should announce CouponIssued for the coupon the discount named issues', async () => {
      const { events, service } = setupSut();

      await service.issueCoupon('spices-id');

      expect(events.publish).to.have.been.calledWith(new CouponIssued('spices-id', '7K3QX9M2PD'));
    });
    it('should answer with the coupon\'s token and the store it is for', async () => {
      const { service } = setupSut();

      const answered = await service.issueCoupon('spices-id');

      expect(answered.toJSON()).to.deep.equal({ token: '7K3QX9M2PD', storeName: spicesDiscount.storeName });
    });
    it('should answer with the token and the store of a coupon for another discount', async () => {
      const { service } = setupSut({ kept: publishedProduceDiscount, drawing: 'R4WZ0BH8NE' });

      const answered = await service.issueCoupon('produce-id');

      expect(answered.toJSON()).to.deep.equal({ token: 'R4WZ0BH8NE', storeName: publishedProduceDiscount.storeName });
    });

    describe('one change at a time', () => {
      it('should keep the discount named with its new coupon through the repository its change is given', async () => {
        const { repository, service } = setupSut();
        const given = mock<DiscountRepository>();
        given.withId.mockResolvedValue(await repository.withId('spices-id'));
        repository.changing.mockImplementation((work) => work(given));

        await service.issueCoupon('spices-id');

        expect(given.save.mock.lastCall?.at(0)?.toJSON().coupons, 'the coupons kept through the repository given').to.deep.equal([
          { token: '7K3QX9M2PD', redeemed: false, counted: false },
        ]);
      });
    });

    describe('state', () => {
      it('should report that there is no such discount when no discount has that id, issuing nothing', async () => {
        const { events, repository, service } = setupSut();

        await expect(service.issueCoupon('an-id-no-discount-has')).rejects.to.be.instanceOf(NoSuchDiscountException);
        expect(repository.save.mock.calls, 'the discounts saved').to.deep.equal([]);
        expect(events.publish.mock.calls, 'the events published').to.deep.equal([]);
      });
    });

    describe('dependency failure', () => {
      it.todo('should report that the coupon could not be got when it cannot be kept, issuing nothing');
    });
  });
});
