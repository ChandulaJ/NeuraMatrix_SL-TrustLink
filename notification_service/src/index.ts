import { Redis } from 'ioredis';
import { Worker } from 'bullmq';
import { eventHandlers } from './eventHandlers';
// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

const REDIS_HOST = process.env.REDIS_HOST || 'redis';
const REDIS_PORT = Number(process.env.REDIS_PORT || 6379);

// --- Redis subscriber for domain events ---
const subscriber = new (Redis as any)({ host: REDIS_HOST, port: REDIS_PORT });

async function startSubscriber() {
  const channels = Object.keys(eventHandlers);
  await subscriber.subscribe(...channels);
  console.log(`[Notification] Subscribed to: ${channels.join(', ')}`);

  subscriber.on(
    'message',
    async (channel: keyof typeof eventHandlers, raw: string) => {
      try {
        const payload = JSON.parse(raw);
        const handler = eventHandlers[channel];
        if (handler) await handler(payload as any);
      } catch (err) {
        console.error(
          `[Notification] Handler error for channel ${channel}:`,
          err
        );
      }
    }
  );
}

// --- BullMQ worker for reminders ---
function startReminderWorker() {
  const worker = new Worker(
    'reminders',
    async (job) => {
      const { evt } = job.data as {
        evt: { id: number; userId: number; appointmentDate: string };
      };
      // TODO: swap this with your real sender (email/SMS/push)
      console.log(
        `[Reminder] 24h: user=${evt.userId} appt=${evt.id} date=${evt.appointmentDate} (jobId=${job.id})`
      );
    },
    { connection: { host: REDIS_HOST, port: REDIS_PORT } }
  );

  worker.on('completed', (job) =>
    console.log(`[Reminder] Completed job ${job.id}`)
  );
  worker.on('failed', (job, err) =>
    console.error(`[Reminder] Failed job ${job?.id}:`, err)
  );
}

async function main() {
  await startSubscriber();
  startReminderWorker();
}

main().catch((e) => {
  console.error('[Notification] Fatal error:', e);
  process.exit(1);
});
