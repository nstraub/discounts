import { isDeepStrictEqual } from 'node:util';

import { drizzle } from 'drizzle-orm/node-postgres';
import type pg from 'pg';
import { mock } from 'vitest-mock-extended';

import { CouponToken } from '@backend/discounts/application/domain/coupon-token';
import type { Discount } from '@backend/discounts/application/domain/discount';
import { DiscountDetails } from '@backend/discounts/application/domain/discount-details';
import { DiscountFactory } from '@backend/discounts/application/domain/discount-factory';
import type { DomainEventPublisher } from '@backend/discounts/application/domain/domain-event-publisher';
import { DiscountDrizzleRepository } from '@backend/discounts/infra/discount-drizzle-repository';
import { resetTestDatabase, testDatabaseUrl } from '@sut/support/test-database';

import { connectToTestDatabase } from './test-database';

export const discountRepositoryOn = (client: pg.Client, databaseUrl: string) => {
  const factory = new DiscountFactory(mock<DomainEventPublisher>());
  const repository = new DiscountDrizzleRepository(drizzle(client), factory);
  const keep = async (details: ConstructorParameters<typeof DiscountDetails>[0]) => {
    const discount = factory.create(new DiscountDetails(details));
    await repository.save(discount);
    return discount;
  };
  const keepWithCouponsIssued = async (details: ConstructorParameters<typeof DiscountDetails>[0], tokens: string[]) => {
    const discount = await keep(details);
    tokens.forEach((token) => discount.issueCoupon(CouponToken.keptAs(token)));
    await repository.save(discount);
    return discount;
  };
  const loadOnItsOwnConnection = async () => new DiscountDrizzleRepository(drizzle(await connectToTestDatabase(databaseUrl)), factory).all();
  return { client, factory, repository, keep, keepWithCouponsIssued, loadOnItsOwnConnection };
};

export const setupSut = async () => {
  const client = await connectToTestDatabase(testDatabaseUrl);
  await resetTestDatabase(client);
  return discountRepositoryOn(client, testDatabaseUrl);
};

export const isKeptAndLoadedBackOnEmptiedTables = async (
  client: pg.Client,
  databaseUrl: string,
  keepADiscount: (client: pg.Client, databaseUrl: string) => Promise<Discount>,
): Promise<boolean> => {
  await client.query('TRUNCATE app.discounts, app.coupons');
  const kept = await keepADiscount(client, databaseUrl);
  const loaded = await discountRepositoryOn(client, databaseUrl).loadOnItsOwnConnection();
  return loaded.some((discount) => isDeepStrictEqual(discount.toJSON(), kept.toJSON()));
};
