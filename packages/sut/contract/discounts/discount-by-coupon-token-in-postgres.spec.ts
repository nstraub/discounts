import { describe, expect, it } from 'vitest';

import { CouponToken } from '@backend/discounts/application/domain/coupon-token';
import { produceDiscount, spicesDiscount } from '@sut/support/example-discounts';

import { setupSut } from '../support/discount-repository';

describe('a discount found by one of its coupons\' tokens in PostgreSQL', () => {
  it('should find the kept discount that owns the coupon with that token among several discounts with coupons', async () => {
    const { keepWithCouponsIssued, repository } = await setupSut();
    await keepWithCouponsIssued(spicesDiscount, ['7K3QX9M2PD']);
    const produce = await keepWithCouponsIssued(produceDiscount, ['R4WZ0BH8NE']);

    const found = await repository.withCouponToken(CouponToken.keptAs('R4WZ0BH8NE'));

    expect(found?.toJSON()).to.deep.equal(produce.toJSON());
  });
  it('should load the discount found with every one of its coupons, not only the one with that token', async () => {
    const { keepWithCouponsIssued, repository } = await setupSut();
    await keepWithCouponsIssued(spicesDiscount, ['7K3QX9M2PD', 'R4WZ0BH8NE']);

    const found = await repository.withCouponToken(CouponToken.keptAs('R4WZ0BH8NE'));

    expect(found?.toJSON().coupons.map(({ token }) => token)).to.deep.equal(['7K3QX9M2PD', 'R4WZ0BH8NE']);
  });
  it('should find nothing for a token no kept coupon has', async () => {
    const { keepWithCouponsIssued, repository } = await setupSut();
    await keepWithCouponsIssued(spicesDiscount, ['7K3QX9M2PD']);

    const found = await repository.withCouponToken(CouponToken.keptAs('R4WZ0BH8NE'));

    expect(found).to.equal(undefined);
  });

  describe('A2 injection', () => {
    it('should find nothing for a token with quotes, semicolons and SQL keywords, every kept discount and coupon left as it was', async () => {
      const { keepWithCouponsIssued, repository, loadOnItsOwnConnection } = await setupSut();
      const spices = await keepWithCouponsIssued(spicesDiscount, ['7K3QX9M2PD']);

      const found = await repository.withCouponToken(CouponToken.keptAs("x' OR '1'='1'; DELETE FROM app.coupons; --"));

      expect(found, 'the discount found').to.equal(undefined);
      expect((await loadOnItsOwnConnection()).map((kept) => kept.toJSON()), 'every discount kept').to.deep.equal([spices.toJSON()]);
    });
  });
});
