import type { AppointmentCreatedEvent } from '../types';
import sendEmail from './sendEmail';

export async function sendImmediateNotification(
  evt: AppointmentCreatedEvent
): Promise<void> {
  // Example: Nodemailer, Twilio, Firebase, etc.
  sendEmail(evt.email || '', 'immediate');
  console.log(
    `[Notification] Immediate: user=${evt.userId} appt=${evt.id} date=${evt.appointmentDate}`
  );
}
