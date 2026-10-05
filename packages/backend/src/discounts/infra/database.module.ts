import { Module } from '@nestjs/common';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import pg from 'pg';

export const database = Symbol('database');

export type Database = NodePgDatabase;

@Module({
  providers: [
    {
      provide: database,
      useFactory: (): Database => drizzle(new pg.Pool({ connectionString: process.env.DATABASE_URL })),
    },
  ],
  exports: [database],
})
export class DatabaseModule {}
