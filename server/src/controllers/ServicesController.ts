import { Request, Response } from "express";
import { ServicesService } from "../services/ServicesService";
import { PrismaServiceInterface } from "../infrastructure/database/interfaces/PrismaServiceInterface";
import logger from "../shared/logger";

const servicesService = new ServicesService(new PrismaServiceInterface());

export class ServicesController {
  static async createService(req: Request, res: Response): Promise<void> {
    try {
      const service = await servicesService.createService(req.body);
      res.status(201).json(service);
    } catch (error) {
      logger.error("Error creating service:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getServiceById(req: Request, res: Response): Promise<void> {
    try {
      const service = await servicesService.getServiceById(req.params.id);
      if (service) {
        res.status(200).json(service);
      } else {
        res.status(404).json({ error: "Service not found" });
      }
    } catch (error) {
      logger.error("Error fetching service:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async updateService(req: Request, res: Response): Promise<void> {
    try {
      const updatedService = await servicesService.updateService(req.params.id, req.body);
      if (updatedService) {
        res.status(200).json(updatedService);
      } else {
        res.status(404).json({ error: "Service not found" });
      }
    } catch (error) {
      logger.error("Error updating service:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async deleteService(req: Request, res: Response): Promise<void> {
    try {
      const deleted = await servicesService.deleteService(req.params.id);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: "Service not found" });
      }
    } catch (error) {
      logger.error("Error deleting service:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getAllServices(req: Request, res: Response): Promise<void> {
    try {
      const services = await servicesService.getAllServices();
      res.status(200).json(services);
    } catch (error) {
      logger.error("Error fetching services:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
