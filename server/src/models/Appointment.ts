import { Service } from './Service';
import { User } from './User';

export interface Appointment {
  id: number;
  userId: number; // Who booked the appointment
  serviceId: number; // Which service is booked
  type: AppointmentType;
  status: AppointmentStatus;
  scheduledAt: Date;
  notes?: string;
  reference: string;
  createdAt: Date;
  updatedAt: Date;
  documents?: DocumentInfo[];
  service?: Service;
  user?: User;
}

export interface DocumentInfo {
  name: string;
  url: string;
}

export enum AppointmentType {
  IN_PERSON = 'IN_PERSON',
  ONLINE = 'ONLINE',
}

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}
