import { Service } from "../../models/Service";

export interface ServiceInterface {
  createService(data: Service): Promise<Service>;
  getServiceById(id: string): Promise<Service | null>;
  updateService(id: string, data: Partial<Service>): Promise<Service | null>;
  deleteService(id: string): Promise<boolean>;
  getAllServices(): Promise<Service[]>;
  getServicesByDepartment(departmentId: number): Promise<Service[]>;
}
