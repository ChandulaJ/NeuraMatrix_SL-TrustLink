import { Request, Response } from "express";
import { AppointmentService } from "../services/AppointmentService";
import { PrismaAppointmentInterface } from "../infrastructure/database/interfaces/PrismaAppointmentInterface";
import logger from "../shared/logger";

const appointmentService = new AppointmentService(new PrismaAppointmentInterface());

export class AppointmentController {
  static async create(req: Request, res: Response) {
    try {
      const appointment = await appointmentService.createAppointment(req.body);
      res.status(201).json(appointment);
    } catch (error) {
      logger.error(`Failed to create appointment: ${(error as Error).message}`);
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const appointment = await appointmentService.updateStatus(Number(id), status);
      res.status(200).json(appointment);
    } catch (error) {
      logger.error(`Failed to update appointment status: ${(error as Error).message}`);
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async getUserAppointments(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const appointments = await appointmentService.getUserAppointments(Number(userId));
      res.status(200).json(appointments);
    } catch (error) {
      logger.error(`Failed to get user appointments: ${(error as Error).message}`);
      res.status(400).json({ error: (error as Error).message });
    }
    }

    static async deleteAppointment(req: Request, res: Response) {
      try {
        const { id } = req.params;
        await appointmentService.deleteAppointment(Number(id));
        res.status(204).send();
      } catch (error) {
        logger.error(`Failed to delete appointment: ${(error as Error).message}`);
        res.status(400).json({ error: (error as Error).message });
      }
    }
}
