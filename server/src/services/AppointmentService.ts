import { Appointment, AppointmentStatus } from "../models/Appointment";
import { AppointmentInterface } from "./interfaces/AppointmentInterface";
import logger from "../shared/logger";
import { log } from "winston";

export class AppointmentService {
    constructor(private readonly appointmentInterface: AppointmentInterface) { }

    async createAppointment(data: Omit<Appointment, "createdAt" | "updatedAt">): Promise<Appointment> {
        try {
            // create a new reference after the recent reference in the format of department code and then number
            //const latestAppointment = await this.appointmentInterface.findLatest();
            //const newReference = await this.generateReference(latestAppointment);
            return await this.appointmentInterface.create({
                ...data,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        } catch (error) {
            logger.error(`Failed to create appointment: ${(error as Error).message}`);
            throw new Error(`Failed to create appointment: ${(error as Error).message}`);
        }
    }

    async updateStatus(id: number, status: AppointmentStatus): Promise<Appointment> {
        try {
            const appointment = await this.appointmentInterface.findById(id);
            if (!appointment) {
                throw new Error("Appointment not found");
            }

            appointment.status = status;
            appointment.updatedAt = new Date();
            return await this.appointmentInterface.update(appointment);
        } catch (error) {
            logger.error(`Failed to update appointment status: ${(error as Error).message}`);
            throw new Error(`Failed to update appointment status: ${(error as Error).message}`);
        }
    }

    async getUserAppointments(userId: number): Promise<Appointment[]> {
        try {
            return await this.appointmentInterface.findByUser(userId);
        } catch (error) {
            logger.error(`Failed to get user appointments: ${(error as Error).message}`);
            throw new Error(`Failed to get user appointments: ${(error as Error).message}`);
        }
    }
    
    async deleteAppointment(id: number): Promise<void> {
        try {
            const appointment = await this.appointmentInterface.findById(id);
            if (!appointment) {
                throw new Error("Appointment not found");
            }

            await this.appointmentInterface.delete(id);
        } catch (error) {
            logger.error(`Failed to delete appointment: ${(error as Error).message}`);
            throw new Error(`Failed to delete appointment: ${(error as Error).message}`);
        }
    }

    async generateReference(latestAppointment: Appointment | null): Promise<string> {
        const departmentCode = latestAppointment?.service?.department?.code || "DEPT";
        const latestNumber = latestAppointment ? parseInt(latestAppointment.reference.split("-")[1]) : 0;
        const newNumber = latestNumber + 1;
        return `${departmentCode}-${newNumber}`;
    }
}
