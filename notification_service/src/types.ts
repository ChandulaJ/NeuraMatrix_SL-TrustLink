export type AppointmentCreatedEvent = {
  id: number;
  userId: number;
  appointmentDate: string; // ISO string
  channelPreferences?: {
    email?: string;
    sms?: string;
    pushToken?: string;
  };
};

export type DomainEventMap = {
  'appointment.created': AppointmentCreatedEvent;
};

export type DomainEventKey = keyof DomainEventMap;
