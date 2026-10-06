import { isDeepStrictEqual } from 'node:util';

import type pg from 'pg';
import { describe, expect, it } from 'vitest';

import { CouponToken } from '@backend/discounts/application/domain/coupon-token';
import { spicesDiscount } from '@sut/support/example-discounts';

import { discountRepositoryOn } from '../support/discount-repository';
import { insertACoupon } from '../support/discounts-table';
import { setupSut } from '../support/migrations';

const theCouponLinesPassing = {
  loadedBackAsKept: true,
  refusedTwiceTokenWithoutTokenAndOfNoDiscount: ['23505', '23502', '23503'],
};

const outcomeOfTheCouponLines = async (client: pg.Client, databaseUrl: string) => {
  const { repository, keep, loadOnItsOwnConnection } = discountRepositoryOn(client, databaseUrl);
  const kept = await keep(spicesDiscount);
  kept.issueCoupon(CouponToken.keptAs('7K3QX9M2PD'));
  await repository.save(kept);
  const loaded = await loadOnItsOwnConnection();
  const discountId = kept.toJSON().id;
  return {
    loadedBackAsKept: loaded.some((discount) => isDeepStrictEqual(discount.toJSON(), kept.toJSON())),
    refusedTwiceTokenWithoutTokenAndOfNoDiscount: [
      await insertACoupon(client, { token: '7K3QX9M2PD', discount_id: discountId }),
      await insertACoupon(client, { discount_id: discountId }),
      await insertACoupon(client, { token: 'R4WZ0BH8NE', discount_id: 'an-id-no-discount-has' }),
    ],
  };
};

describe('the migration that adds the coupons table', () => {
  it('should migrate forward from empty, the coupon round-trip and constraint lines passing on the result', async () => {
    const { client, databaseUrl, migrateForward } = await setupSut();

    await migrateForward();

    expect(await outcomeOfTheCouponLines(client, databaseUrl)).to.deep.equal(theCouponLinesPassing);
  });
  it.todo('should run backward to discounts without coupons, their lines passing, and forward again, the coupon lines passing: lossy, every coupon is lost');
  it.todo('should read back, through the repository, a discount kept before the migration, with no coupon');
  it.todo('should keep and load back, as the deployed version does, a discount on the migrated schema');
});
