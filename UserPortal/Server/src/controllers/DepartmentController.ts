import { Request, Response } from "express";
import { DepartmentService } from "../services/DepartmentService";
import { PrismaDepartmentInterface } from "../infrastructure/database/interfaces/PrismaDepartmentInterface";
import logger from "../shared/logger";

const departmentService = new DepartmentService(new PrismaDepartmentInterface());

export class DepartmentController {
  static async createDepartment(req: Request, res: Response): Promise<void> {
    try {
      const department = await departmentService.createDepartment(req.body);
      res.status(201).json(department);
    } catch (error) {
      logger.error("Error creating department:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getDepartmentById(req: Request, res: Response): Promise<void> {
    try {
      const department = await departmentService.getDepartmentById(Number(req.params.id));
      if (department) {
        res.status(200).json(department);
      } else {
        res.status(404).json({ error: "Department not found" });
      }
    } catch (error) {
      logger.error("Error fetching department:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async updateDepartment(req: Request, res: Response): Promise<void> {
    try {
      const updatedDepartment = await departmentService.updateDepartment(Number(req.params.id), req.body);
      if (updatedDepartment) {
        res.status(200).json(updatedDepartment);
      } else {
        res.status(404).json({ error: "Department not found" });
      }
    } catch (error) {
      logger.error("Error updating department:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async deleteDepartment(req: Request, res: Response): Promise<void> {
    try {
      const deleted = await departmentService.deleteDepartment(Number(req.params.id));
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: "Department not found" });
      }
    } catch (error) {
      logger.error("Error deleting department:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getAllDepartments(req: Request, res: Response): Promise<void> {
    try {
      const departments = await departmentService.getAllDepartments();
      res.status(200).json(departments);
    } catch (error) {
      logger.error("Error fetching departments:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
