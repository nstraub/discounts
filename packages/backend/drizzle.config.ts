import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/app/infra/schema.ts',
  out: './src/app/infra/migrations',
  schemaFilter: ['app'],
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      `postgres://app_user:app_password@localhost:${process.env.POSTGRES_HOST_PORT ?? 5432}/app_dev`,
  },
});
