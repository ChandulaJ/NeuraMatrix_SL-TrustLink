import { Department } from "../../models/Department";

export interface DepartmentInterface {
  createDepartment(data: Department): Promise<Department>;
  getDepartmentById(id: number): Promise<Department | null>;
  updateDepartment(id: number, data: Partial<Department>): Promise<Department | null>;
  deleteDepartment(id: number): Promise<boolean>;
  getAllDepartments(): Promise<Department[]>;
}
