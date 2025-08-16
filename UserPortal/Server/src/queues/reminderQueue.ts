import { Queue } from 'bullmq';
import dotenv from 'dotenv';
dotenv.config();

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = Number(process.env.REDIS_PORT || 6379);

export const reminderQueue = new Queue('reminders', {
  connection: {
    host: REDIS_HOST,
    port: REDIS_PORT,
    maxRetriesPerRequest: 3,
    retryDelayOnFailover: 100,
  },
  defaultJobOptions: {
    removeOnComplete: 100, // Keep last 100 completed jobs
    removeOnFail: 100, // Keep last 100 failed jobs
    attempts: 3, // Retry failed jobs 3 times
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
});

// Handle Redis connection events
reminderQueue.on('error', (error) => {
  console.error('[ReminderQueue] Redis connection error:', error);
});

reminderQueue.on('waiting', (jobId) => {
  console.log(`[ReminderQueue] Job ${jobId} is waiting`);
});
