import { Test } from '@nestjs/testing';
import request from 'supertest';
import { onTestFinished } from 'vitest';

import { AppModule } from '@backend/app.module';
import { resetTestDatabase } from '@sut/support/test-database';

import { connectToTestDatabase } from './test-database';

/**
 * The wired app over an empty test database.
 * @returns the database client and an HTTP client for the app.
 */
export const setupSut = async () => {
  const client = await connectToTestDatabase();
  await resetTestDatabase(client);
  const module = await Test.createTestingModule({ imports: [AppModule] }).compile();
  const app = await module.createNestApplication().init();
  onTestFinished(() => app.close());
  return { client, http: request(app.getHttpServer()) };
};
