import { DepartmentInterface } from "./interfaces/DepartmentInterface";
import { Department } from "../models/Department";
import logger from "../shared/logger";


export class DepartmentService {
    constructor(private readonly departmentInterface: DepartmentInterface) { }

    async createDepartment(data: Department): Promise<Department> {
        return await this.departmentInterface.createDepartment(data);
    }

    async getDepartmentById(id: number): Promise<Department | null> {
        return await this.departmentInterface.getDepartmentById(id);
    }

    async updateDepartment(id: number, data: Partial<Department>): Promise<Department | null> {
        return await this.departmentInterface.updateDepartment(id, data);
    }

    async deleteDepartment(id: number): Promise<boolean> {
        return await this.departmentInterface.deleteDepartment(id);
    }

    async getAllDepartments(): Promise<Department[]> {
        try {
            return await this.departmentInterface.getAllDepartments();
        } catch (error) {
            logger.error("Error fetching all departments:", error);
            throw new Error("Could not fetch departments");
        }
    }
}
