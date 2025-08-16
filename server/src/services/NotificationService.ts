import { Redis } from 'ioredis';
import { Worker, Queue } from 'bullmq';
import { eventHandlers } from '../eventHandlers';
import dotenv from 'dotenv';
import {
  NotificationInterface,
  AppointmentCreatedEvent,
  MailOptions,
} from './interfaces/NotificationInterface';
import sendEmail from '../utils/sendEmail';

dotenv.config();

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = Number(process.env.REDIS_PORT || 6379);

export class NotificationService implements NotificationInterface {
  private subscriber: Redis;
  private reminderQueue: Queue;
  private worker: Worker | null = null;
  private isRunning = false;

  constructor() {
    this.subscriber = new Redis({
      host: REDIS_HOST,
      port: REDIS_PORT,
    });

    this.reminderQueue = new Queue('reminders', {
      connection: { host: REDIS_HOST, port: REDIS_PORT },
      defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 100,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
    });
  }

  async sendImmediateNotification(
    event: AppointmentCreatedEvent
  ): Promise<void> {
    const immediateJobId = `immediate:${event.id}`;

    try {
      await this.reminderQueue.add(
        'send-immediate-notification',
        { evt: event, type: 'immediate' },
        {
          jobId: immediateJobId,
          removeOnComplete: 100,
          removeOnFail: 100,
        }
      );
      console.log(
        `[Notification] Scheduled immediate notification for appointment ${event.id}`
      );
    } catch (error) {
      if ((error as any).message?.includes('Job with id')) {
        console.log(
          `[Notification] Immediate notification already scheduled for appointment ${event.id}`
        );
      } else {
        console.error(
          `[Notification] Failed to schedule immediate notification:`,
          error
        );
        throw error;
      }
    }
  }

  async scheduleReminder(event: AppointmentCreatedEvent): Promise<void> {
    const reminderAtMs = new Date(event.appointmentDate).getTime();
    if (isNaN(reminderAtMs)) {
      throw new Error(`Invalid appointment date: ${event.appointmentDate}`);
    }

    const reminderDate = new Date(reminderAtMs - 24 * 60 * 60 * 1000);
    if (isNaN(reminderDate.getTime())) {
      throw new Error(`Invalid reminder date calculated`);
    }

    if (reminderDate < new Date()) {
      console.warn(
        `[Notification] Reminder date for appointment ${event.id} is in the past, skipping`
      );
      return;
    }

    const delay = reminderDate.getTime() - Date.now();
    const reminderJobId = `reminder:${event.id}:24h`;

    try {
      await this.reminderQueue.add(
        'send-24h-reminder',
        { evt: event, type: 'reminder' },
        {
          delay: delay,
          jobId: reminderJobId,
          removeOnComplete: 100,
          removeOnFail: 100,
        }
      );

      console.log(
        `[Notification] Scheduled 24h reminder for appointment ${
          event.id
        } in ${Math.round(delay / 1000)}s`
      );
    } catch (error) {
      if ((error as any).message?.includes('Job with id')) {
        console.log(
          `[Notification] Reminder already exists for appointment ${event.id}`
        );
      } else {
        console.error(`[Notification] Failed to schedule reminder:`, error);
        throw error;
      }
    }
  }

  private async startSubscriber(): Promise<void> {
    try {
      const channels = Object.keys(eventHandlers);
      await this.subscriber.subscribe(...channels);
      console.log(`[Notification] Subscribed to: ${channels.join(', ')}`);

      this.subscriber.on(
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

      this.subscriber.on('error', (error) => {
        console.error('[Notification] Redis subscriber error:', error);
      });
    } catch (error) {
      console.error('[Notification] Failed to start subscriber:', error);
      throw error;
    }
  }

  private startReminderWorker(): void {
    this.worker = new Worker(
      'reminders',
      async (job) => {
        const { evt, type } = job.data;

        console.log(
          `[Worker] Processing ${type} notification for appointment ${evt.id}`
        );

        if (type === 'immediate') {
          // Send immediate notification
          const mailOptions: MailOptions = {
            from: 'SL_TRUST_LINK',
            to: evt.email || '',
            subject: 'Appointment Submission',
            text: `Your appointment for service ${
              evt.serviceName || 'Unknown Service'
            } has been confirmed for ${
              evt.appointmentDate
            }. Your appointment ID is ${evt.id}.`,
            html: `<p>Your appointment for service <b>${
              evt.serviceName || 'Unknown Service'
            }</b> has been submitted for approval . The appointment will be on <b>${
              evt.appointmentDate
            }</b>.</p>
                   <p>Your appointment ID is <b>${evt.id}</b>.</p>
                   <p>Thank you for choosing our services!</p>`,
          };

          await sendEmail(mailOptions);
          console.log(
            `[Immediate] Sent confirmation to ${evt.email} for appointment ${evt.id}`
          );
        } else if (type === 'reminder') {
          // Send reminder notification
          const mailOptions: MailOptions = {
            from: 'SL_TRUST_LINK',
            to: evt.email || '',
            subject: '24h Appointment Reminder',
            text: `You have an upcoming appointment for service ${
              evt.serviceName || 'Unknown Service'
            } on ${evt.appointmentDate}. Your appointment ID is ${
              evt.id
            }. Please make sure to come on time.`,
            html: `<p>You have an upcoming appointment for service <b>${
              evt.serviceName || 'Unknown Service'
            }</b> on <b>${evt.appointmentDate}</b>.</p>
                   <p>Your appointment ID is <b>${evt.id}</b>.</p>
                   <p>Please make sure to come on time.</p>`,
          };

          await sendEmail(mailOptions);
          console.log(
            `[Reminder] 24h reminder sent to ${evt.email} for appointment ${evt.id}`
          );
        }
      },
      {
        connection: { host: REDIS_HOST, port: REDIS_PORT },
        concurrency: 5,
      }
    );

    this.worker.on('completed', (job) => {
      console.log(
        `[Worker] Completed ${job.data.type} job ${job.id} for appointment ${job.data.evt.id}`
      );
    });

    this.worker.on('failed', (job, err) => {
      console.error(`[Worker] Failed ${job?.data.type} job ${job?.id}:`, err);
    });

    this.worker.on('error', (err) => {
      console.error('[Worker] Worker error:', err);
    });
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('[Notification] Service already running');
      return;
    }

    try {
      await this.startSubscriber();
      this.startReminderWorker();
      this.isRunning = true;
      console.log('[Notification] Service started successfully');
    } catch (error) {
      console.error('[Notification] Failed to start service:', error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (!this.isRunning) {
      console.log('[Notification] Service not running');
      return;
    }

    try {
      await this.subscriber.disconnect();
      if (this.worker) {
        await this.worker.close();
      }
      await this.reminderQueue.close();
      this.isRunning = false;
      console.log('[Notification] Service stopped successfully');
    } catch (error) {
      console.error('[Notification] Error stopping service:', error);
      throw error;
    }
  }
}

// Create singleton instance
export const notificationService = new NotificationService();
