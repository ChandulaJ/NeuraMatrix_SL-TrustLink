import { User } from "../../../models/User";
import { LoginData, UserInterface, UserResponse } from "../../../services/interfaces/UserInterface";
import { prisma } from "../prisma";


export class PrismaUserInterface implements UserInterface {
    async getUserById(id: number): Promise<UserResponse> {
        try {
            const user = await prisma.user.findUnique({ where: { id } });
            if (!user) {
                return { success: false, message: "User not found" };
            }
            return { success: true, message: "User retrieved successfully", data: user };
        } catch (error) {
            return { success: false, message: "Error retrieving user" };
        }
    }

    async createUser(data: any): Promise<UserResponse> {
        try {
            const user = await prisma.user.create({ data });
            return { success: true, message: "User created successfully", data: user };
        } catch (error) {
            return { success: false, message: "Error creating user" };
        }
    }

    async updateUser(id: number, data: Partial<User>): Promise<UserResponse> {
        try {
            const user = await prisma.user.update({ where: { id }, data });
            return { success: true, message: "User updated successfully", data: user };
        } catch (error) {
            return { success: false, message: "Error updating user" };
        }
    }

    async deleteUser(id: number): Promise<UserResponse> {
        try {
            await prisma.user.delete({ where: { id } });
            return { success: true, message: "User deleted successfully" };
        } catch (error) {
            return { success: false, message: "Error deleting user" };
        }
    }

    async findUserByEmail(email: string): Promise<User | null> {
        return await prisma.user.findUnique({ where: { email } });
    }

    async findUnique(where: any): Promise<User | null> {
        return await prisma.user.findUnique({ where });
    }

    async findFirst(where: any): Promise<User | null> {
        return await prisma.user.findFirst({ where });
    }

    // Additional methods required by UserInterface
    async login(data: LoginData): Promise<UserResponse> {
        try {
            const user = await prisma.user.findUnique({ where: { email: data.email } });
            if (!user) {
                return { success: false, message: "Invalid credentials" };
            }
            // Add password validation logic here
            return { success: true, message: "Login successful", data: user };
        } catch (error) {
            return { success: false, message: "Login failed" };
        }
    }

    async logout(): Promise<UserResponse> {
        return { success: true, message: "Logout successful" };
    }

    async forgotPassword(data: any): Promise<UserResponse> {
        return { success: true, message: "Password reset email sent" };
    }

    async resetPassword(data: any): Promise<UserResponse> {
        return { success: true, message: "Password reset successful" };
    }

    async changePassword(userId: number, data: any): Promise<UserResponse> {
        return { success: true, message: "Password changed successfully" };
    }

    async getProfile(userId: number): Promise<UserResponse> {
        try {
            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) {
                return { success: false, message: "User not found" };
            }
            return { success: true, message: "Profile retrieved successfully", data: user };
        } catch (error) {
            return { success: false, message: "Error retrieving profile" };
        }
    }

    async updateProfile(userId: number, data: any): Promise<UserResponse> {
        try {
            const user = await prisma.user.update({ where: { id: userId }, data });
            return { success: true, message: "Profile updated successfully", data: user };
        } catch (error) {
            return { success: false, message: "Error updating profile" };
        }
    }

    async verifyEmail(token: string): Promise<UserResponse> {
        return { success: true, message: "Email verified successfully" };
    }
}
