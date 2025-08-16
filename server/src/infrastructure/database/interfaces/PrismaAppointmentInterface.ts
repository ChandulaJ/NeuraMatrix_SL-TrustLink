import { Appointment, AppointmentStatus, DocumentInfo, Documents } from "../../../models/Appointment";
import { AppointmentInterface } from "../../../services/interfaces/AppointmentInterface";
import { prisma } from "../prisma";


export class PrismaAppointmentInterface implements AppointmentInterface {
  async create(appointment: Appointment): Promise<Appointment> {
    return prisma.appointment.create({ data: appointment });
  }

  async findById(id: number): Promise<Appointment | null> {
    return prisma.appointment.findUnique({
      where: { id }, include: {
        user: true,
        service: {
          include: {
            department: true,

          },
        },
        documentsRelation: true,
      },
    });
  }

  async update(updateData: Partial<Appointment>): Promise<Appointment> {
    return prisma.appointment.update({
      where: { id: updateData.id },
      data: updateData
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.appointment.delete({ where: { id } });
  }

  async findByUser(userId: number): Promise<Appointment[]> {
    return prisma.appointment.findMany({
      where: { userId }, include: {
        user: true,
        service: {
          include: {
            department: true,
          },
        },
        documentsRelation: true,
      },
    });
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
        documentsRelation: true,
      },
      take: 1,
    });
  }

  async addDocument(appointmentId: number, document: Documents): Promise<Documents> {
    const appointment = await prisma.appointment.findUnique({ where: { id: appointmentId } });
    if (!appointment) throw new Error('Appointment not found');

    const newDocument = await prisma.documents.create({
      data: {
        ...document,
        appointmentId: appointmentId,
      },
    });

    return newDocument;
  }

  async addMultipleDocuments(appointmentId: number, documents: DocumentInfo[]): Promise<Documents[]> {
    const appointment = await prisma.appointment.findUnique({ where: { id: appointmentId } });
    if (!appointment) throw new Error('Appointment not found');

    const newDocuments = await prisma.documents.createMany({
      data: documents.map(doc => ({
        ...doc,
        appointmentId: appointmentId,
      })),
    });

    return newDocuments;
  }

}
