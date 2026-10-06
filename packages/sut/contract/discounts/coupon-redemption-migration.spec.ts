import { isDeepStrictEqual } from 'node:util';

import type pg from 'pg';
import { describe, expect, it } from 'vitest';

import { CouponToken } from '@backend/discounts/application/domain/coupon-token';
import { spicesDiscount } from '@sut/support/example-discounts';

import { discountRepositoryOn } from '../support/discount-repository';
import { insertACoupon, insertADiscountWithout } from '../support/discounts-table';
import { migrateBackwardPast, setupSut } from '../support/migrations';

const theMigration = '0006_let_a_coupon_be_redeemed';

const theMigrationsAfterIt = ['0007_let_a_coupon_be_counted'];

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
  it('should run backward to coupons that cannot be redeemed, their lines passing, and forward again, the redemption lines passing: lossy, every use is lost', async () => {
    const { client, databaseUrl, migrateForward } = await setupSut();
    await migrateForward();
    const keptBefore = await keepADiscountWithACouponRedeemed(client, databaseUrl);

    await migrateBackwardPast(client, theMigration, theMigrationsAfterIt);

    const backward = await client.query('SELECT * FROM app.coupons');
    expect(backward.rows.map((row) => Object.keys(row)), 'the coupons, backward').to.deep.equal([['id', 'token', 'discount_id']]);

    await migrateForward();

    const foundAgain = await discountRepositoryOn(client, databaseUrl).repository.withId(keptBefore.toJSON().id);
    expect(foundAgain?.toJSON().coupons, 'forward again, the use lost').to.deep.equal([{ token: '7K3QX9M2PD', redeemed: false, counted: false }]);
    expect(await theRedeemedCouponLoadedBackAsKept(client, databaseUrl), 'forward again, a redeemed coupon loaded back as kept').to.equal(true);
  });
  it('should read back unused, through the repository, a coupon issued before the migration', async () => {
    const { client, databaseUrl, migrateForward } = await setupSut();
    await migrateForward();
    await migrateBackwardPast(client, theMigration, theMigrationsAfterIt);
    await insertADiscountWithout(client, 'hook');
    await insertACoupon(client, { token: '7K3QX9M2PD', discount_id: 'constraint-id' });

    await migrateForward();

    const readBack = await discountRepositoryOn(client, databaseUrl).repository.withId('constraint-id');
    expect(readBack?.toJSON().coupons.map(({ redeemed }) => redeemed), 'the coupon issued before, redeemed').to.deep.equal([false]);
  });
  it('should keep and load back, as the deployed version does, a discount with its coupons on the migrated schema', async () => {
    const { client, databaseUrl, migrateForward } = await setupSut();
    await migrateForward();
    const kept = await keepADiscountWithACouponRedeemed(client, databaseUrl);
    kept.issueCoupon(CouponToken.keptAs('R4WZ0BH8NE'));
    await discountRepositoryOn(client, databaseUrl).repository.save(kept);

    const [loaded] = await discountRepositoryOn(client, databaseUrl).loadOnItsOwnConnection();

    expect(loaded?.toJSON(), 'the discount loaded back').to.deep.equal(kept.toJSON());
  });
});
