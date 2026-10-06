import { describe, expect, it } from 'vitest';

import { CouponToken } from '@backend/discounts/application/domain/coupon-token';
import type { Discount } from '@backend/discounts/application/domain/discount';
import { spicesDiscount } from '@sut/support/example-discounts';
import { atTheSpicesStore } from '@sut/support/example-stores';
import { testDatabaseUrl } from '@sut/support/test-database';

import { keepADiscountWithASaleCounted, setupSut } from '../support/discount-repository';

const keepWithACouponIssued = async ({ keep }: Awaited<ReturnType<typeof setupSut>>) => {
  const discount = await keep(spicesDiscount);
  discount.issueCoupon(CouponToken.keptAs('7K3QX9M2PD'));
  return discount;
};

const savedAgainAfter = async (sut: Awaited<ReturnType<typeof setupSut>>, change: (found: Discount) => void) => {
  const [found] = await sut.loadOnItsOwnConnection();
  change(found!);
  await sut.repository.save(found!);
  const [loaded] = await sut.loadOnItsOwnConnection();
  return loaded;
};

const theFirstCouponLoadedBackAfter = async (sut: Awaited<ReturnType<typeof setupSut>>, change: (found: Discount) => void) =>
  (await savedAgainAfter(sut, change))?.toJSON().coupons.at(0);

const theSecondCoupon = CouponToken.keptAs('R4WZ0BH8NE');

const redeemTheSecondCoupon = (found: Discount) => found.redeemCoupon(theSecondCoupon, atTheSpicesStore);

describe('a discount kept in PostgreSQL', () => {
  describe('with its coupons', () => {
    it('should save a discount with its coupons and load it back equal, in a separate transaction', async () => {
      const sut = await setupSut();
      const discount = await keepWithACouponIssued(sut);

      await sut.repository.save(discount);

      const [loaded] = await sut.loadOnItsOwnConnection();
      expect(loaded?.toJSON(), 'the discount loaded back with its coupons').to.deep.equal(discount.toJSON());
    });
    it('should keep a discount\'s earlier coupons when another is issued and it is saved again', async () => {
      const sut = await setupSut();
      const discount = await keepWithACouponIssued(sut);
      await sut.repository.save(discount);

      const loaded = await savedAgainAfter(sut, (found) => found.issueCoupon(theSecondCoupon));

      expect(loaded?.toJSON().coupons.map(({ token }) => token)).to.deep.equal(['7K3QX9M2PD', 'R4WZ0BH8NE']);
    });
  });
  describe('with a redeemed coupon', () => {
    it('should save a discount with a redeemed coupon and load it back equal, in a separate transaction', async () => {
      const sut = await setupSut();
      const discount = await keepWithACouponIssued(sut);
      discount.redeemCoupon(CouponToken.keptAs('7K3QX9M2PD'), atTheSpicesStore);

      await sut.repository.save(discount);

      const [loaded] = await sut.loadOnItsOwnConnection();
      expect(loaded?.toJSON().coupons.at(0)?.redeemed, 'the coupon loaded back, redeemed').to.equal(true);
      expect(loaded?.toJSON(), 'the discount loaded back').to.deep.equal(discount.toJSON());
    });
    it('should keep a coupon redeemed once its discount, kept with it unused, is saved again', async () => {
      const sut = await setupSut();
      await sut.repository.save(await keepWithACouponIssued(sut));

      const loaded = await savedAgainAfter(sut, (found) => found.redeemCoupon(CouponToken.keptAs('7K3QX9M2PD'), atTheSpicesStore));

      expect(loaded?.toJSON().coupons.at(0)?.redeemed, 'the coupon loaded back, redeemed').to.equal(true);
    });
    it('should keep a discount\'s other coupons unused when one is redeemed and it is saved again', async () => {
      const sut = await setupSut();
      const discount = await keepWithACouponIssued(sut);
      discount.issueCoupon(theSecondCoupon);
      await sut.repository.save(discount);

      const loaded = await theFirstCouponLoadedBackAfter(sut, redeemTheSecondCoupon);

      expect(loaded, 'the other coupon loaded back').to.deep.equal({ token: '7K3QX9M2PD', redeemed: false, counted: false });
    });
    it('should keep a redeemed coupon redeemed when another coupon is issued and the discount is saved again', async () => {
      const sut = await setupSut();
      const discount = await keepWithACouponIssued(sut);
      discount.redeemCoupon(CouponToken.keptAs('7K3QX9M2PD'), atTheSpicesStore);
      await sut.repository.save(discount);

      const loaded = await theFirstCouponLoadedBackAfter(sut, (found) => found.issueCoupon(theSecondCoupon));

      expect(loaded, 'the coupon redeemed before').to.deep.equal({ token: '7K3QX9M2PD', redeemed: true, counted: false });
    });
  });
  describe('with its sales counted', () => {
    it('should save a discount with a counted and an uncounted redeemed coupon and load it back equal, in a separate transaction', async () => {
      const sut = await setupSut();
      const discount = await keepADiscountWithASaleCounted(sut.client, testDatabaseUrl);
      discount.issueCoupon(theSecondCoupon);
      discount.redeemCoupon(theSecondCoupon, atTheSpicesStore);

      await sut.repository.save(discount);

      const [loaded] = await sut.loadOnItsOwnConnection();
      expect(loaded?.toJSON().coupons.map(({ counted }) => counted), 'each coupon loaded back, counted').to.deep.equal([true, false]);
      expect(loaded?.toJSON(), 'the discount loaded back').to.deep.equal(discount.toJSON());
    });
    it('should keep a counted coupon counted when another coupon is redeemed and the discount is saved again', async () => {
      const sut = await setupSut();
      const discount = await keepADiscountWithASaleCounted(sut.client, testDatabaseUrl);
      discount.issueCoupon(theSecondCoupon);
      await sut.repository.save(discount);

      const loaded = await theFirstCouponLoadedBackAfter(sut, redeemTheSecondCoupon);

      expect(loaded, 'the coupon counted before').to.deep.equal({ token: '7K3QX9M2PD', redeemed: true, counted: true });
    });
  });
});
