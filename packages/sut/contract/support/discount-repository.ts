import { drizzle } from 'drizzle-orm/node-postgres';
import type pg from 'pg';
import { mock } from 'vitest-mock-extended';

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
  const loadOnItsOwnConnection = async () => new DiscountDrizzleRepository(drizzle(await connectToTestDatabase(databaseUrl)), factory).all();
  return { client, factory, repository, keep, loadOnItsOwnConnection };
};

export const setupSut = async () => {
  const client = await connectToTestDatabase(testDatabaseUrl);
  await resetTestDatabase(client);
  return discountRepositoryOn(client, testDatabaseUrl);
};
