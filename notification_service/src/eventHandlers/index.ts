import type { DomainEventKey, DomainEventMap } from '../types';
import { handleAppointmentCreated } from './appointmentCreated';

export const eventHandlers: Record<
  DomainEventKey,
  (payload: DomainEventMap[DomainEventKey]) => Promise<void>
> = {
  'appointment.created': handleAppointmentCreated,
};
