import { Appointment, AppointmentStatus } from "../../../models/Appointment";
import { AppointmentInterface } from "../../../services/interfaces/AppointmentInterface";
import { prisma } from "../prisma";


export class PrismaAppointmentInterface implements AppointmentInterface {
  async create(appointment: Appointment): Promise<Appointment> {
    return prisma.appointment.create({ data: appointment });
  }

  async findById(id: number): Promise<Appointment | null> {
    return prisma.appointment.findUnique({ where: { id },include: {
        user: true,
        service: {
          include: {
            department: true,
          },
        },
      }, });
  }

  async update(appointment: Appointment): Promise<Appointment> {
    return prisma.appointment.update({
      where: { id: appointment.id },
      data: appointment
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.appointment.delete({ where: { id } });
  }

  async findByUser(userId: number): Promise<Appointment[]> {
    return prisma.appointment.findMany({ where: { userId },include: {
        user: true,
        service: {
          include: {
            department: true,
          },
        },
      }, });
  }

  async findLatest(): Promise<Appointment | null> {
    return prisma.appointment.findFirst({
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        service: {
          include: {
            department: true,
          },
        },
      },
      take: 1,
    });
  }

}
