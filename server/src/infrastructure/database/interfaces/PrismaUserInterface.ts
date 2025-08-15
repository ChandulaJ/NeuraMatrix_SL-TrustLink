import { User } from "../../../models/User";

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  gender?: string;
  dateOfBirth?: Date;
  role: string;
  nationalId?: string;
  passportNo?: string;
  businessRegNo?: string;
}

export interface PrismaUserInterface {
  create(data: CreateUserData): Promise<User>;
  findUnique(where: { email: string } | { id: number }): Promise<User | null>;
  findFirst(where: { emailVerificationToken?: string; passwordResetToken?: string }): Promise<User | null>;
  update(where: { id: number }, data: Partial<User>): Promise<User>;
  findMany(where?: any, select?: any): Promise<User[]>;
  delete(where: { id: number }): Promise<User>;
}
