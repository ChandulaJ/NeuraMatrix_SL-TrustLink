export type AppointmentCreatedEvent = {
  id: number;
  userId: number;
  appointmentDate: string; // ISO string
  email?: string;
  serviceId: number;
  serviceName: string;
};

export type DomainEventMap = {
  'appointment.created': AppointmentCreatedEvent;
};

export type DomainEventKey = keyof DomainEventMap;

export type MailOptions = {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
};
