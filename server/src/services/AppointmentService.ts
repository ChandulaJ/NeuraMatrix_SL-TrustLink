import { Appointment, AppointmentStatus } from '../models/Appointment';
import { AppointmentInterface } from './interfaces/AppointmentInterface';
import logger from '../shared/logger';
import { log } from 'winston';
import { publishEvent } from '../events/publisher';

export class AppointmentService {
  constructor(private readonly appointmentInterface: AppointmentInterface) {}

  async createAppointment(
    data: Omit<Appointment, 'createdAt' | 'updatedAt'>
  ): Promise<Appointment> {
    try {
      // return await this.appointmentInterface.create({
      //     ...data,
      //     createdAt: new Date(),
      //     updatedAt: new Date(),
      // });

      const created = await this.appointmentInterface.create({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Publish domain event (keep naming stable!)
      await publishEvent('appointment.created', {
        id: created.id,
        userId: created.userId,
        appointmentDate:
          created.scheduledAt instanceof Date
            ? created.scheduledAt.toISOString()
            : new Date(created.scheduledAt as any).toISOString(),
      });

      return created;
    } catch (error) {
      logger.error(`Failed to create appointment: ${(error as Error).message}`);
      throw new Error(
        `Failed to create appointment: ${(error as Error).message}`
      );
    }
  }

  async updateStatus(
    id: number,
    status: AppointmentStatus
  ): Promise<Appointment> {
    try {
      const appointment = await this.appointmentInterface.findById(id);
      if (!appointment) {
        throw new Error('Appointment not found');
      }

      appointment.status = status;
      appointment.updatedAt = new Date();
      return await this.appointmentInterface.update(appointment);
    } catch (error) {
      logger.error(
        `Failed to update appointment status: ${(error as Error).message}`
      );
      throw new Error(
        `Failed to update appointment status: ${(error as Error).message}`
      );
    }
  }

  async getUserAppointments(userId: number): Promise<Appointment[]> {
    try {
      return await this.appointmentInterface.findByUser(userId);
    } catch (error) {
      logger.error(
        `Failed to get user appointments: ${(error as Error).message}`
      );
      throw new Error(
        `Failed to get user appointments: ${(error as Error).message}`
      );
    }
  }

  async deleteAppointment(id: number): Promise<void> {
    try {
      const appointment = await this.appointmentInterface.findById(id);
      if (!appointment) {
        throw new Error('Appointment not found');
      }

      await this.appointmentInterface.delete(id);
    } catch (error) {
      logger.error(`Failed to delete appointment: ${(error as Error).message}`);
      throw new Error(
        `Failed to delete appointment: ${(error as Error).message}`
      );
    }
  }
}
