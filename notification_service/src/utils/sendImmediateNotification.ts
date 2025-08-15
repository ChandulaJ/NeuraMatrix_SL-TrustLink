import type { AppointmentCreatedEvent } from '../types';
import sendEmail from './sendEmail';

export async function sendImmediateNotification(
  evt: AppointmentCreatedEvent
): Promise<void> {
  const mailOptions = {
    from: 'SL_TRUST_LINK',
    to: evt.email || '',
    subject: 'Appointment Notification',
    text: `Your appointment for service ${evt.serviceName} on ${evt.appointmentDate} has been sent for approval. Your appointment ID is ${evt.id}.`,
    html: `<p>Your appointment for service <b>${evt.serviceName}</b> on <b>${evt.appointmentDate}</b> has been sent for approval. Your appointment ID is <b>${evt.id}.</b></p>`,
  };
  sendEmail(mailOptions);
  console.log(
    `[Notification] Immediate: user=${evt.userId} appt=${evt.id} date=${evt.appointmentDate}`
  );
}
