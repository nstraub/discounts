import { Inject, Module, type OnApplicationShutdown } from '@nestjs/common';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import pg from 'pg';

export const database = Symbol('database');

export type Database = NodePgDatabase;

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
