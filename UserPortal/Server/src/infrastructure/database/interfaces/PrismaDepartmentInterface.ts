
import { Department } from "../../../models/Department";
import { DepartmentInterface } from "../../../services/interfaces/DepartmentInterface";
import { prisma } from "../prisma"; 

export class PrismaDepartmentInterface implements DepartmentInterface {
    async createDepartment(data: Department): Promise<Department> {
        return await prisma.department.create({ data });
    }

    async getDepartmentById(id: number): Promise<Department | null> {
        return await prisma.department.findUnique({ where: { id } });
    }

    async updateDepartment(id: number, data: Partial<Department>): Promise<Department | null> {
        return await prisma.department.update({ where: { id }, data });
    }

    async deleteDepartment(id: number): Promise<boolean> {
        const result = await prisma.department.delete({ where: { id } });
        return !!result;
    }

    async getAllDepartments(): Promise<Department[]> {
        return await prisma.department.findMany();
    }
}