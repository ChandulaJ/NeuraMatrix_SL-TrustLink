import { Appointment, DocumentInfo, Documents } from "../../models/Appointment";

export interface AppointmentInterface {
  create(appointment: Appointment): Promise<Appointment>;
  findById(id: number): Promise<Appointment | null>;
  update(updateData: Partial<Appointment>): Promise<Appointment>;
  delete(id: number): Promise<void>;
  findByUser(userId: number): Promise<Appointment[]>;
  findLatest(): Promise<Appointment | null>;
  addDocument(appointmentId: number, document: DocumentInfo): Promise<Documents>;
  addMultipleDocuments(appointmentId: number, documents: DocumentInfo[]): Promise<Documents[]>;
}
