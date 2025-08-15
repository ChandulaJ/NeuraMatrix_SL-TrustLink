import type { AppointmentCreatedEvent } from '../types';
import { reminderQueue } from '../queues/reminderQueue';
import { sendImmediateNotification } from '../utils/sendImmediateNotification';

export async function handleAppointmentCreated(
  evt: AppointmentCreatedEvent
): Promise<void> {
  // 1) Fire-and-forget immediate notification
  await sendImmediateNotification(evt);

  // 2) Schedule 24h reminder via BullMQ delayed job
  const reminderAtMs = new Date(evt.appointmentDate).getTime();
  if (isNaN(reminderAtMs)) {
    console.error(
      `[Notification] Invalid appointment date for evt=${evt.id}: ${evt.appointmentDate}`
    );
    return;
  }
  // const reminderDate = new Date(reminderAtMs - 10 * 1000);
  const reminderDate = new Date(reminderAtMs - 24 * 60 * 60 * 1000);
  if (isNaN(reminderDate.getTime())) {
    console.error(
      `[Notification] Invalid reminder date for evt=${evt.id}: ${reminderDate}`
    );
    return;
  }
  if (reminderDate < new Date()) {
    console.warn(
      `[Notification] Reminder date for evt=${evt.id} is in the past, skipping scheduling`
    );
    return;
  }
  // Calculate delay in milliseconds
  const delay = reminderDate.getTime() - Date.now();

  if (delay > 0) {
    await reminderQueue.add(
      'send-24h-reminder',
      { evt },
      {
        delay: 10000, // ms
        removeOnComplete: 1000,
        removeOnFail: 1000,
        jobId: `reminder:${evt.id}:24h`,
      }
    );
    console.log(
      `[Notification] Scheduled 24h reminder for appt=${evt.id} in ${Math.round(
        delay / 1000
      )}s to ${evt.email}`
    );
  } else {
    console.log(
      `[Notification] Skipped scheduling 24h reminder: time already passed for appt=${evt.id}`
    );
  }
}
