import { Queue } from 'bullmq';

const REDIS_HOST = process.env.REDIS_HOST || 'redis';
const REDIS_PORT = Number(process.env.REDIS_PORT || 6379);

export const reminderQueue = new Queue('reminders', {
  connection: { host: REDIS_HOST, port: REDIS_PORT },
});
