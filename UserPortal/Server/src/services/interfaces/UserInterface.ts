import { User } from "../../models/User";

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  gender?: string;
  dateOfBirth?: string;
  role: string;
  nationalId?: string;
  passportNo?: string;
  businessRegNo?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface PasswordResetData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  gender?: string;
  dateOfBirth?: string;
}

export interface UserResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface UserInterface {
  // User management
  createUser(data: CreateUserData): Promise<UserResponse>;
  getUserById(id: number): Promise<UserResponse>;
  updateUser(id: number, data: Partial<User>): Promise<UserResponse>;
  deleteUser(id: number): Promise<UserResponse>;
  
  // Authentication
  login(data: LoginData): Promise<UserResponse>;
  logout(): Promise<UserResponse>;
  
  // Password management
  forgotPassword(data: PasswordResetData): Promise<UserResponse>;
  resetPassword(data: ResetPasswordData): Promise<UserResponse>;
  changePassword(userId: number, data: ChangePasswordData): Promise<UserResponse>;
  
  // Profile management
  getProfile(userId: number): Promise<UserResponse>;
  updateProfile(userId: number, data: UpdateProfileData): Promise<UserResponse>;
  
  // Email verification
  verifyEmail(token: string): Promise<UserResponse>;
}