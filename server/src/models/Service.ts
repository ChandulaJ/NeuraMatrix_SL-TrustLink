export interface Service {
  id: number;
  name: string;
  description?: string;
  departmentId: number;  // Which department provides this service
  createdAt: Date;
  updatedAt: Date;
}
