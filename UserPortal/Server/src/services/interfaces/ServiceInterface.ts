import { Service } from "../../models/Service";

export interface ServiceInterface {
  createService(data: Service): Promise<Service>;
  getServiceById(id: number): Promise<Service | null>;
  updateService(id: number, data: Partial<Service>): Promise<Service | null>;
  deleteService(id: number): Promise<boolean>;
  getAllServices(): Promise<Service[]>;
  getServicesByDepartment(departmentId: number): Promise<Service[]>;
}
