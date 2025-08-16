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
import qrcode from 'qrcode-terminal';
import { sendQRCode } from './WhatsappService';

export class AppointmentService {
  constructor(
    private readonly appointmentInterface: AppointmentInterface,
    private readonly documentService: DocumentService = new DocumentService(),
    private readonly userInterface: UserInterface,
    private readonly serviceInterface: ServiceInterface
  ) {}

  async createAppointment(req: Request): Promise<Appointment> {
    try {
      logger.info('Starting appointment creation...');
      logger.info(`Request body: ${JSON.stringify(req.body)}`);
      
      // Extract uploaded files safely
      const files = Array.isArray(req.files)
        ? (req.files as Express.Multer.File[])
        : [];
      
      logger.info(`Number of files uploaded: ${files.length}`);

      // Prepare appointment data with type conversions
      const appointmentData: Omit<Appointment, 'createdAt' | 'updatedAt'> = {
        ...req.body,
        userId: Number(req.body.userId),
        serviceId: Number(req.body.serviceId),
        scheduledAt: new Date(req.body.scheduledAt),
        notes: req.body.notes || undefined,
        reference: req.body.reference,
      };
      
      logger.info(`Appointment data prepared: ${JSON.stringify(appointmentData)}`);

      //get user email from userId
      const userId = appointmentData.userId;
      logger.info(`Looking up user with ID: ${userId}`);
      const userResponse = await this.userInterface.getUserById(userId);
      if (!userResponse.success || !userResponse.data) {
        logger.error(`User not found for ID: ${userId}`);
        throw new Error('User not found');
      }
      const userEmail = userResponse.data.email;
      const userPhoneNumber = userResponse.data.phoneNumber;
      logger.info(`User found: ${userEmail}`);

      //get the service booked
      const serviceId = appointmentData.serviceId;
      logger.info(`Looking up service with ID: ${serviceId}`);
      const service = await this.serviceInterface.getServiceById(serviceId);
      if (!service) {
        logger.error(`Service not found for ID: ${serviceId}`);
        throw new Error('Service not found');
      }
      const serviceName = service.name;
      logger.info(`Service found: ${serviceName}`);

      let documents: DocumentInfo[] = [];

      // Upload documents if provided (use original file names)
      if (files.length > 0) {
        logger.info(`Starting document upload for ${files.length} files`);
        const fileNames = files.map((file) => file.originalname);
        logger.info(`File names: ${JSON.stringify(fileNames)}`);
        
        try {
          documents = await this.documentService.uploadMultipleDocuments(
            files,
            fileNames,
            appointmentData.userId
          );
          logger.info(`Successfully uploaded ${documents.length} documents for appointment.`);
        } catch (uploadError) {
          logger.error(`Document upload failed: ${(uploadError as Error).message}`);
          throw new Error(`Document upload failed: ${(uploadError as Error).message}`);
        }
      } else {
        logger.info('No documents to upload');
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

      // Generate QR code data
      const qrCodeData = JSON.stringify({
        appointmentId: created.id,
        userId: created.userId,
        serviceName: serviceName,
        scheduledAt: created.scheduledAt,
        reference: created.reference,
        status: created.status
      }, null, 2);

      // Display QR code in terminal (for debugging)
      const qrCode = qrcode.generate(qrCodeData);

      // Send QR code via WhatsApp if user has phone number
      if (userPhoneNumber) {
        try {
          const caption = `Your appointment QR code for ${serviceName}\nDate: ${created.scheduledAt.toLocaleDateString()}\nTime: ${created.scheduledAt.toLocaleTimeString()}\nReference: ${created.reference}`;
          await sendQRCode(userPhoneNumber, qrCodeData, caption);
          logger.info(`QR code sent to WhatsApp for user ${userId}`);
        } catch (whatsappError) {
          logger.error(`Failed to send QR code via WhatsApp: ${(whatsappError as Error).message}`);
          // Don't throw error here as appointment creation should still succeed
        }
      } else {
        logger.info(`User ${userId} has no phone number, skipping WhatsApp QR code`);
      }

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

  async generateReference(
    latestAppointment: Appointment | null
  ): Promise<string> {
    const departmentCode =
      latestAppointment?.service?.department?.code || 'DEPT';
    const latestNumber = latestAppointment
      ? parseInt(latestAppointment.reference.split('-')[1])
      : 0;
    const newNumber = latestNumber + 1;
    return `${departmentCode}-${newNumber}`;
  }
}
