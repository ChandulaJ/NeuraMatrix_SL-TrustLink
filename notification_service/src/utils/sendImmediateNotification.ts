import type { AppointmentCreatedEvent } from '../types';

export async function sendImmediateNotification(
  evt: AppointmentCreatedEvent
): Promise<void> {
  // Example: Nodemailer, Twilio, Firebase, etc.
  console.log(
    `[Notification] Immediate: user=${evt.userId} appt=${evt.id} date=${evt.appointmentDate}`
  );
}
