import type pg from 'pg';
import { describe, expect, it } from 'vitest';

import { CouponToken } from '@backend/discounts/application/domain/coupon-token';
import { spicesDiscount } from '@sut/support/example-discounts';

import { discountRepositoryOn, isKeptAndLoadedBackOnEmptiedTables } from '../support/discount-repository';
import { migrateBackwardPast, setupSut } from '../support/migrations';

const theMigration = '0007_let_a_coupon_be_counted';

const keepADiscountWithASaleCounted = async (client: pg.Client, databaseUrl: string) => {
  const { repository, keepWithCouponsIssued } = discountRepositoryOn(client, databaseUrl);
  const kept = await keepWithCouponsIssued(spicesDiscount, ['7K3QX9M2PD']);
  kept.redeemCoupon(CouponToken.keptAs('7K3QX9M2PD'));
  kept.count();
  await repository.save(kept);
  return kept;
};

const theCountedSaleLoadedBackAsKept = (client: pg.Client, databaseUrl: string) =>
  isKeptAndLoadedBackOnEmptiedTables(client, databaseUrl, keepADiscountWithASaleCounted);

describe('the migration that lets a discount\'s sales be counted', () => {
  it('should migrate forward from empty, the counted-sales round-trip lines passing on the result', async () => {
    const { client, databaseUrl, migrateForward } = await setupSut();

    await migrateForward();

    expect(await theCountedSaleLoadedBackAsKept(client, databaseUrl), 'a counted sale loaded back as kept').to.equal(true);
  });
  it('should run backward to sales that cannot be counted, their lines passing, and forward again, the count lines passing: lossy, every count is lost and the sales counted before count again', async () => {
    const { client, databaseUrl, migrateForward } = await setupSut();
    await migrateForward();
    const keptBefore = await keepADiscountWithASaleCounted(client, databaseUrl);

    await migrateBackwardPast(client, theMigration, []);

    const backward = await client.query('SELECT * FROM app.coupons');
    expect(backward.rows.map((row) => Object.keys(row)), 'the coupons, backward').to.deep.equal([['id', 'token', 'discount_id', 'redeemed']]);

    await migrateForward();

    const foundAgain = await discountRepositoryOn(client, databaseUrl).repository.withId(keptBefore.toJSON().id);
    expect(foundAgain?.count().toJSON().discountedSales, 'forward again, the sale counted before counted again').to.equal(1);
    expect(await theCountedSaleLoadedBackAsKept(client, databaseUrl), 'forward again, a counted sale loaded back as kept').to.equal(true);
  });
  it.todo('should count, in the first count after the migration, the coupons redeemed before it');
  it.todo('should keep and load back, as the deployed version does, a discount with a redeemed coupon on the migrated schema');
});
