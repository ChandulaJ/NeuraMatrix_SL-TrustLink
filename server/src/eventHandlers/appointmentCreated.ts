import { AppointmentCreatedEvent } from '../services/interfaces/NotificationInterface';
import { notificationService } from '../services/NotificationService';

export async function handleAppointmentCreated(
  evt: AppointmentCreatedEvent
): Promise<void> {
  try {
    console.log(
      `[EventHandler] Processing appointment created event for appointment ${evt.id}`
    );

    // Send immediate notification
    await notificationService.sendImmediateNotification(evt);

    // Schedule 24h reminder
    await notificationService.scheduleReminder(evt);

    console.log(
      `[EventHandler] Successfully processed appointment created event for appointment ${evt.id}`
    );
  } catch (error) {
    console.error(
      `[EventHandler] Failed to process appointment created event for appointment ${evt.id}:`,
      error
    );
    // Don't throw - we don't want to crash the event handler
  }
}
