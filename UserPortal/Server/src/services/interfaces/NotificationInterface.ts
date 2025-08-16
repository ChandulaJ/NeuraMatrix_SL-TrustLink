export interface NotificationInterface {
  sendImmediateNotification(event: AppointmentCreatedEvent): Promise<void>;
  scheduleReminder(event: AppointmentCreatedEvent): Promise<void>;
  start(): Promise<void>;
  stop(): Promise<void>;
}

export type AppointmentCreatedEvent = {
  id: number;
  userId: number;
  appointmentDate: string; // ISO string
  email?: string;
  serviceId: number;
  serviceName?: string;
};

export type MailOptions = {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
};
