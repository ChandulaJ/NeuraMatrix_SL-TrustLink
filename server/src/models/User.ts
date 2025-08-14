export enum Role {
  CITIZEN = "CITIZEN",
  FOREIGNER = "FOREIGNER",
  BUSINESS_OWNER = "BUSINESS_OWNER"
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER"
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  gender?: Gender;
  dateOfBirth?: Date;
  role: Role;
  nationalId?: string;       // For Sri Lankan citizens
  passportNo?: string;       // For foreigners
  businessRegNo?: string;    // For business owners
  createdAt: Date;
  updatedAt: Date;
}
