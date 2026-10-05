import { drizzle } from 'drizzle-orm/node-postgres';
import { mock } from 'vitest-mock-extended';

import { DiscountFactory } from '@backend/discounts/application/domain/discount-factory';
import type { DomainEventPublisher } from '@backend/discounts/application/domain/domain-event-publisher';
import { DiscountDrizzleRepository } from '@backend/discounts/infra/discount-drizzle-repository';
import { resetTestDatabase } from '@sut/support/test-database';

import { connectToTestDatabase } from './test-database';

export const setupSut = async () => {
  const client = await connectToTestDatabase();
  await resetTestDatabase(client);
  const factory = new DiscountFactory(mock<DomainEventPublisher>());
  const repositoryOnItsOwnConnection = async () => new DiscountDrizzleRepository(drizzle(await connectToTestDatabase()), factory);
  return { client, factory, repository: new DiscountDrizzleRepository(drizzle(client), factory), repositoryOnItsOwnConnection };
};
