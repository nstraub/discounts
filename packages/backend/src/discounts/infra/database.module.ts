import { Inject, Module, type OnApplicationShutdown } from '@nestjs/common';
import { drizzle, type NodePgQueryResultHKT } from 'drizzle-orm/node-postgres';
import type { PgDatabase } from 'drizzle-orm/pg-core';
import pg from 'pg';

export const database = Symbol('database');

export type Database = PgDatabase<NodePgQueryResultHKT>;

const pool = Symbol('pool');

@Module({
  providers: [
    { provide: pool, useFactory: () => new pg.Pool({ connectionString: process.env.DATABASE_URL }) },
    { provide: database, useFactory: (connections: pg.Pool): Database => drizzle(connections), inject: [pool] },
  ],
  exports: [database],
})
export class DatabaseModule implements OnApplicationShutdown {
  constructor(@Inject(pool) private readonly connections: pg.Pool) {}

  async onApplicationShutdown(): Promise<void> {
    await this.connections.end();
  }
}
