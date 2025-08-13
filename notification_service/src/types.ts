export type AppointmentCreatedEvent = {
  id: number;
  userId: number;
  appointmentDate: string; // ISO string
  email?: string;
};

export type DomainEventMap = {
  'appointment.created': AppointmentCreatedEvent;
};

export type DomainEventKey = keyof DomainEventMap;
