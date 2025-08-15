import {
  Appointment,
  AppointmentStatus,
  DocumentInfo,
} from '../models/Appointment';
import { AppointmentInterface } from './interfaces/AppointmentInterface';

import logger from '../shared/logger';
import { log } from 'winston';
import { publishEvent } from '../events/publisher';
import { DocumentService } from './DocumentService';
import { Request, Response } from 'express';
import { sseManager } from '../controllers/SSEController';
import { UserInterface } from './interfaces/UserInterface';
import { ServiceInterface } from './interfaces/ServiceInterface';

export class AppointmentService {
  constructor(
    private readonly appointmentInterface: AppointmentInterface,
    private readonly documentService: DocumentService = new DocumentService(),
    private readonly userInterface: UserInterface,
    private readonly serviceInterface: ServiceInterface
  ) {}

  async createAppointment(req: Request): Promise<Appointment> {
    try {
      // Extract uploaded files safely
      const files = Array.isArray(req.files)
        ? (req.files as Express.Multer.File[])
        : [];

      // Prepare appointment data with type conversions
      const appointmentData: Omit<Appointment, 'createdAt' | 'updatedAt'> = {
        ...req.body,
        userId: Number(req.body.userId),
        serviceId: Number(req.body.serviceId),
        scheduledAt: new Date(req.body.scheduledAt),
        notes: req.body.notes || undefined,
      };

      //get user email from userId
      const userId = appointmentData.userId;
      const user = await this.userInterface.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      const userEmail = user.data.email;

      //get the service booked
      const serviceId = appointmentData.serviceId;
      const service = await this.serviceInterface.getServiceById(serviceId);
      if (!service) {
        throw new Error('Service not found');
      }
      const serviceName = service.name;

      let documents: DocumentInfo[] = [];

      // Upload documents if provided (use original file names)
      if (files.length > 0) {
        const fileNames = files.map((file) => file.originalname);
        documents = await this.documentService.uploadMultipleDocuments(
          files,
          fileNames,
          appointmentData.userId
        );
        logger.info(`Uploaded ${documents.length} documents for appointment.`);
      }

      // Create appointment
      const created = await this.appointmentInterface.create({
        ...appointmentData,
        documents,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      sseManager.broadcast('appointment.created', {
        appointment: {
          id: created.id,
          userId: created.userId,
          serviceId: created.serviceId,
          type: created.type,
          status: created.status,
          scheduledAt: created.scheduledAt,
          notes: created.notes,
          documents: created.documents,
          createdAt: created.createdAt,
        },
        timestamp: new Date().toISOString(),
        message: 'New appointment created',
      });

      // Publish event
      await publishEvent('appointment.created', {
        id: created.id,
        userId: created.userId,
        serviceId: created.serviceId,
        email: userEmail,
        serviceName: serviceName,
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
