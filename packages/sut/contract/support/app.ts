import { Test } from '@nestjs/testing';
import request from 'supertest';
import { onTestFinished } from 'vitest';

import { AppModule } from '@backend/app.module';
import { resetTestDatabase } from '@sut/support/test-database';

import { connectToTestDatabase } from './test-database';

/**
 * The wired app over an empty test database, for a test that shuts the app down itself.
 * @returns the app, the database client and an HTTP client for the app.
 */
export const setupSutThatTheTestShutsDown = async () => {
  const client = await connectToTestDatabase();
  await resetTestDatabase(client);
  const module = await Test.createTestingModule({ imports: [AppModule] }).compile();
  const app = await module.createNestApplication().init();
  return { app, client, http: request(app.getHttpServer()) };
};

/**
 * The wired app over an empty test database, shut down when the test finishes.
 * @returns the app, the database client and an HTTP client for the app.
 */
export const setupSut = async () => {
  const sut = await setupSutThatTheTestShutsDown();
  onTestFinished(() => sut.app.close());
  return sut;
};
