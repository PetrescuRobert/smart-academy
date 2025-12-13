import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/drizzle/schema/*', // Adjust path
  out: './migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
});
