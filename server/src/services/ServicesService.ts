import { ServiceInterface } from "./interfaces/ServiceInterface";
import { Service } from "../models/Service";
import logger from "../shared/logger";
export class ServicesService {
    constructor(private readonly serviceInterface: ServiceInterface) { }

    async createService(data: Service): Promise<Service> {
        return await this.serviceInterface.createService(data);
    }

    async getServiceById(id: string): Promise<Service | null> {
        return await this.serviceInterface.getServiceById(id);
    }

    async updateService(id: string, data: Partial<Service>): Promise<Service | null> {
        return await this.serviceInterface.updateService(id, data);
    }

    async deleteService(id: string): Promise<boolean> {
        return await this.serviceInterface.deleteService(id);
    }

    async getAllServices(): Promise<Service[]> {
        try {
            return await this.serviceInterface.getAllServices();
        } catch (error) {
            logger.error("Error fetching all services:", error);
            throw new Error("Could not fetch services");
        }
    }
}
