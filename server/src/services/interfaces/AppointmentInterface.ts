import { Appointment } from "../../models/Appointment";

export interface AppointmentInterface {
  create(appointment: Appointment): Promise<Appointment>;
  findById(id: number): Promise<Appointment | null>;
  update(appointment: Appointment): Promise<Appointment>;
  delete(id: number): Promise<void>;
  findByUser(userId: number): Promise<Appointment[]>;
}
