export interface Department {
  id: number;
  name: string;
  code: string;   // Unique department code, e.g. IMMIG, LABOUR
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
