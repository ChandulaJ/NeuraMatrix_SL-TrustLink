import type { AppointmentCreatedEvent } from '../types';
import { reminderQueue } from '../queues/reminderQueue';
import { sendImmediateNotification } from '../utils/sendImmediateNotification';

export async function handleAppointmentCreated(
  evt: AppointmentCreatedEvent
): Promise<void> {
  // 1) Fire-and-forget immediate notification
  await sendImmediateNotification(evt);

  // 2) Schedule 24h reminder via BullMQ delayed job
  const appointmentMs = new Date(evt.appointmentDate).getTime();
  const reminderAtMs = appointmentMs - 24 * 60 * 60 * 1000; // -24h
  const delay = reminderAtMs - Date.now();

  if (delay > 0) {
    await reminderQueue.add(
      'send-24h-reminder',
      { evt },
      {
        delay, // ms
        removeOnComplete: 1000,
        removeOnFail: 1000,
        // Optional: use jobId for de-duplication (one reminder per appointment)
        jobId: `reminder:${evt.id}:24h`,
      }
    );
    console.log(
      `[Notification] Scheduled 24h reminder for appt=${evt.id} in ${Math.round(
        delay / 1000
      )}s`
    );
  } else {
    console.log(
      `[Notification] Skipped scheduling 24h reminder: time already passed for appt=${evt.id}`
    );
  }
}
