import { Service } from "../../../models/Service";
import { ServiceInterface } from "../../../services/interfaces/ServiceInterface";
import { prisma } from "../prisma";

export class PrismaServiceInterface implements ServiceInterface {
    async createService(data: Service): Promise<Service> {
        return await prisma.service.create({ data });
    }

    async getServiceById(id: string): Promise<Service | null> {
        return await prisma.service.findUnique({ where: { id } });
    }

    async updateService(id: string, data: Partial<Service>): Promise<Service | null> {
        return await prisma.service.update({ where: { id }, data });
    }

    async deleteService(id: string): Promise<boolean> {
        const result = await prisma.service.delete({ where: { id } });
        return !!result;
    }

    async getAllServices(): Promise<Service[]> {
        return await prisma.service.findMany();
    }

    async getServicesByDepartment(departmentId: number): Promise<Service[]> {
        return await prisma.service.findMany({ where: { departmentId } });
    }
}
