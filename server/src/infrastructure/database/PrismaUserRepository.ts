import { PrismaClient } from '@prisma/client';
import { PrismaUserInterface, CreateUserData } from './interfaces/PrismaUserInterface';
import { User } from '../../models/User';

export class PrismaUserRepository implements PrismaUserInterface {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(data: CreateUserData): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phoneNumber: data.phoneNumber,
        gender: data.gender as any,
        dateOfBirth: data.dateOfBirth,
        role: data.role as any,
        nationalId: data.nationalId,
        passportNo: data.passportNo,
        businessRegNo: data.businessRegNo
      }
    });

    return user as User;
  }

  async findUnique(where: { email: string } | { id: number }): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: where
    });

    return user as User | null;
  }

  async findFirst(where: { emailVerificationToken?: string; passwordResetToken?: string }): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: where
    });

    return user as User | null;
  }

  async update(where: { id: number }, data: Partial<User>): Promise<User> {
    const user = await this.prisma.user.update({
      where: where,
      data: data
    });

    return user as User;
  }

  async findMany(where?: any, select?: any): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: where,
      select: select
    });

    return users as User[];
  }

  async delete(where: { id: number }): Promise<User> {
    const user = await this.prisma.user.delete({
      where: where
    });

    return user as User;
  }

  // Cleanup method for graceful shutdown
  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}
