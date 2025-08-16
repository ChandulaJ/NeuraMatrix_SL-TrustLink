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
  documents?: DocumentInfo[];
  qrcode?: string;
  createdAt: Date;
  updatedAt: Date;
  service?: Service;
  user?: User;
  documentsRelation?: Documents[];
}

export interface Documents{
  id: number;
  appointmentId: number;
  name: string;
  url: string;
  appointment: Appointment;
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
