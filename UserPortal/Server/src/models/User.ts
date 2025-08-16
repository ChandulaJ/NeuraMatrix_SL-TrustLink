export enum Role {
  CITIZEN = "CITIZEN",
  FOREIGNER = "FOREIGNER",
  BUSINESS_OWNER = "BUSINESS_OWNER",
  ADMIN = "ADMIN"
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
  password?: string;
  gender?: Gender;
  dateOfBirth?: Date;
  role: Role;
  nationalId?: string;       // For Sri Lankan citizens
  passportNo?: string;       // For foreigners
  businessRegNo?: string;    // For business owners
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
