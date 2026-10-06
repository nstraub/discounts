import { isDeepStrictEqual } from 'node:util';

import type pg from 'pg';
import { describe, expect, it } from 'vitest';

import { CouponToken } from '@backend/discounts/application/domain/coupon-token';
import { spicesDiscount } from '@sut/support/example-discounts';

import { discountRepositoryOn } from '../support/discount-repository';
import { setupSut } from '../support/migrations';

const keepADiscountWithACouponRedeemed = async (client: pg.Client, databaseUrl: string) => {
  const { repository, keep } = discountRepositoryOn(client, databaseUrl);
  const kept = await keep(spicesDiscount);
  kept.issueCoupon(CouponToken.keptAs('7K3QX9M2PD'));
  kept.redeemCoupon(CouponToken.keptAs('7K3QX9M2PD'));
  await repository.save(kept);
  return kept;
};

const theRedeemedCouponLoadedBackAsKept = async (client: pg.Client, databaseUrl: string) => {
  await client.query('TRUNCATE app.discounts, app.coupons');
  const kept = await keepADiscountWithACouponRedeemed(client, databaseUrl);
  const loaded = await discountRepositoryOn(client, databaseUrl).loadOnItsOwnConnection();
  return loaded.some((discount) => isDeepStrictEqual(discount.toJSON(), kept.toJSON()));
};

describe('the migration that lets a coupon be redeemed', () => {
  it('should migrate forward from empty, the redeemed-coupon round-trip lines passing on the result', async () => {
    const { client, databaseUrl, migrateForward } = await setupSut();

    await migrateForward();

    expect(await theRedeemedCouponLoadedBackAsKept(client, databaseUrl), 'a redeemed coupon loaded back as kept').to.equal(true);
  });
  it.todo('should run backward to coupons that cannot be redeemed, their lines passing, and forward again, the redemption lines passing: lossy, every use is lost');
  it.todo('should read back unused, through the repository, a coupon issued before the migration');
  it.todo('should keep and load back, as the deployed version does, a discount with its coupons on the migrated schema');
});
