import { Department } from "../../models/Department";

export interface DepartmentInterface {
  createDepartment(data: Department): Promise<Department>;
  getDepartmentById(id: string): Promise<Department | null>;
  updateDepartment(id: string, data: Partial<Department>): Promise<Department | null>;
  deleteDepartment(id: string): Promise<boolean>;
  getAllDepartments(): Promise<Department[]>;
}
