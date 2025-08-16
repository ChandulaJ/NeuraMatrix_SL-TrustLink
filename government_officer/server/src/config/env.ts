import 'dotenv/config';

function required(name: string, fallback?: string) {
  const v = process.env[name] ?? fallback;
  if (!v) throw new Error(`Missing env ${name}`);
  return v;
}

export const env = {
  PORT: Number(process.env.PORT ?? 4000),
  JWT_SECRET: required('JWT_SECRET'),
  DEFAULT_APPOINTMENT_MINUTES: Number(process.env.DEFAULT_APPOINTMENT_MINUTES ?? 60),
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? '*',
};
