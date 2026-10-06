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
  it('should load the discount found with every one of its coupons, not only the one with that token', async () => {
    const { keep, repository } = await setupSut();
    const spices = await keep(spicesDiscount);
    spices.issueCoupon(CouponToken.keptAs('7K3QX9M2PD'));
    spices.issueCoupon(CouponToken.keptAs('R4WZ0BH8NE'));
    await repository.save(spices);

    const found = await repository.withCouponToken(CouponToken.keptAs('R4WZ0BH8NE'));

    expect(found?.toJSON().coupons.map(({ token }) => token)).to.deep.equal(['7K3QX9M2PD', 'R4WZ0BH8NE']);
  });
  it('should find nothing for a token no kept coupon has', async () => {
    const { keep, repository } = await setupSut();
    const spices = await keep(spicesDiscount);
    spices.issueCoupon(CouponToken.keptAs('7K3QX9M2PD'));
    await repository.save(spices);

    const found = await repository.withCouponToken(CouponToken.keptAs('R4WZ0BH8NE'));

    expect(found).to.equal(undefined);
  });

  describe('A2 injection', () => {
    it('should find nothing for a token with quotes, semicolons and SQL keywords, every kept discount and coupon left as it was', async () => {
      const { keep, repository, loadOnItsOwnConnection } = await setupSut();
      const spices = await keep(spicesDiscount);
      spices.issueCoupon(CouponToken.keptAs('7K3QX9M2PD'));
      await repository.save(spices);

      const found = await repository.withCouponToken(CouponToken.keptAs("x' OR '1'='1'; DELETE FROM app.coupons; --"));

      expect(found, 'the discount found').to.equal(undefined);
      expect((await loadOnItsOwnConnection()).map((kept) => kept.toJSON()), 'every discount kept').to.deep.equal([spices.toJSON()]);
    });
  });
});
