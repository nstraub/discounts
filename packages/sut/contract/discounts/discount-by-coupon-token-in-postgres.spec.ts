import { describe, expect, it } from 'vitest';

import { CouponToken } from '@backend/discounts/application/domain/coupon-token';
import { produceDiscount, spicesDiscount } from '@sut/support/example-discounts';

import { setupSut } from '../support/discount-repository';

describe('a discount found by one of its coupons\' tokens in PostgreSQL', () => {
  it('should find the kept discount that owns the coupon with that token among several discounts with coupons', async () => {
    const { keep, repository } = await setupSut();
    const spices = await keep(spicesDiscount);
    spices.issueCoupon(CouponToken.keptAs('7K3QX9M2PD'));
    await repository.save(spices);
    const produce = await keep(produceDiscount);
    produce.issueCoupon(CouponToken.keptAs('R4WZ0BH8NE'));
    await repository.save(produce);

    const found = await repository.withCouponToken(CouponToken.keptAs('R4WZ0BH8NE'));

    expect(found?.toJSON()).to.deep.equal(produce.toJSON());
  });
  it.todo('should load the discount found with every one of its coupons, not only the one with that token');
  it.todo('should find nothing for a token no kept coupon has');

  describe('A2 injection', () => {
    it.todo('should find nothing for a token with quotes, semicolons and SQL keywords, every kept discount and coupon left as it was');
  });
});
