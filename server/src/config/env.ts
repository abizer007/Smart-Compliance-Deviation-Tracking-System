import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: process.env.PORT ? Number(process.env.PORT) : 4000,
  databaseUrl: process.env.DATABASE_URL ?? '',
  jwtSecret: process.env.JWT_SECRET ?? 'change-me-in-production',
  corsOrigin: process.env.CORS_ORIGIN ?? '*'
};

if (!env.databaseUrl) {
  // In production you should fail fast; here we just log to avoid crashing dev before config.
  // eslint-disable-next-line no-console
  console.warn('DATABASE_URL is not set');
}

