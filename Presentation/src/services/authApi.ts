import { toast } from "sonner";

const API_BASE_URL = 'http://localhost:3000';

export type Role = 'CITIZEN' | 'FOREIGNER' | 'BUSINESS_OWNER';

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth?: string;
  role: Role;
  nationalId?: string;
  passportNo?: string;
  businessRegNo?: string;
  isEmailVerified?: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastLoginAt?: Date;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: any;
    token: string;
  };
}

export const authApi = {
  register: async (payload: RegisterRequest): Promise<AuthResponse> => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      return data;
    } catch (error) {
      toast.error(error.message);
      console.error('Registration error:', error);
      throw new Error('Registration failed');
    }
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed');
    }

  },

  getProfile: async (token: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load profile');
      return data.data.user;
    } catch (error) {
      console.error('Profile loading error:', error);
      throw new Error('Failed to load profile');
    }
  },

  updateProfile: async (token: string, updates: any) => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update profile');
      return data.data.user;
    } catch (error) {
      console.error('Profile update error:', error);
      throw new Error('Failed to update profile');
    }
  },
};


