import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/common/database/schema/*', // Adjust path
  out: './migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
});
