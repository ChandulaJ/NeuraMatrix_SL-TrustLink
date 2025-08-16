export interface Department {
  id: number;
  icon: string;
  name: string;
  code: string;   // Unique department code, e.g. IMMIG, LABOUR
  description: string;
  location: string;
  createdAt: Date;
  updatedAt: Date;
}
