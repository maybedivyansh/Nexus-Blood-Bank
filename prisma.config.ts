import { loadEnvConfig } from '@next/env';

// Load environment variables so Next.js `.env` is captured
loadEnvConfig(process.cwd());

/**
 * Note: `prisma.config.ts` is officially supported in Prisma ORM v6.4.0+.
 * If you are on Prisma v5.22.0 (your current version), this file will be ignored.
 */
export default {
  schema: {
    datasource: {
      url: process.env.DIRECT_URL,
    },
  },
};
