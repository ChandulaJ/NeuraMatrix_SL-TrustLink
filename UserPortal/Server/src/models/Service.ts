import { Department } from "./Department";

export interface Service {
  id: number;
  name: string;
  description?: string;
  departmentId: number;  // Which department provides this service
  duration?: number; // Duration in minutes
  price?: number; // Price of the service
  availableSlots?: number; // Number of available slots
  requirements: string[];
  category?: string; // Category of the service
  status: "available" | "not available";
  createdAt: Date;
  updatedAt: Date;

  department?: Department;
}
