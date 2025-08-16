import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { PrismaUserInterface } from '../infrastructure/database/interfaces/PrismaUserInterface';
import { UserInterface, CreateUserData, LoginData, PasswordResetData, ResetPasswordData, ChangePasswordData, UpdateProfileData, UserResponse } from './interfaces/UserInterface';
import { generateToken } from '../middleware/UserAuth';
import { Role, Gender, User } from '../models/User';

export class UserService implements UserInterface {
  constructor(private prismaUser: PrismaUserInterface) {}

  async createUser(data: CreateUserData): Promise<UserResponse> {
    try {
      // Check if user already exists
      const existingUser = await this.prismaUser.findUserByEmail(data.email);

      if (existingUser) {
        return {
          success: false,
          message: 'User with this email already exists'
        };
      }

      // Validate role-specific fields
      if (data.role === 'CITIZEN' && !data.nationalId) {
        return {
          success: false,
          message: 'National ID is required for citizens'
        };
      }

      if (data.role === 'FOREIGNER' && !data.passportNo) {
        return {
          success: false,
          message: 'Passport number is required for foreigners'
        };
      }

      if (data.role === 'BUSINESS_OWNER' && !data.businessRegNo) {
        return {
          success: false,
          message: 'Business registration number is required for business owners'
        };
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(data.password, saltRounds);

      // Create user
      const userResponse = await this.prismaUser.createUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: hashedPassword,
        phoneNumber: data.phoneNumber,
        gender: data.gender ? (data.gender as Gender) : undefined,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        role: data.role as Role,
        nationalId: data.nationalId,
        passportNo: data.passportNo,
        businessRegNo: data.businessRegNo
      });
      
      if (!userResponse.success || !userResponse.data) {
        return userResponse;
      }
      
      const user = userResponse.data;

      // Generate JWT token
      const token = generateToken(user.id, user.email, user.role);

      // Remove sensitive data from response
      const { password: _, emailVerificationToken: __, ...userWithoutSensitiveData } = user;

      return {
        success: true,
        message: 'User registered successfully.',
        data: {
          user: userWithoutSensitiveData,
          token
        }
      };

    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Internal server error during registration'
      };
    }
  }

  async login(data: LoginData): Promise<UserResponse> {
    try {
      // Find user by email
      const userResponse = await this.prismaUser.findUserByEmail(data.email);
      
      if (!userResponse) {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }
      
      const user = userResponse;

      if (!user) {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }

      if (!user.password) {
        return {
          success: false,
          message: "User does not have a password set."
        };
      }

      const isPasswordValid = await bcrypt.compare(data.password, user.password);
      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }

      // Update last login
      await this.prismaUser.updateUser(user.id, { lastLoginAt: new Date() });

      // Generate JWT token
      const token = generateToken(user.id, user.email, user.role);

      // Remove sensitive data from response
      const { password: _, emailVerificationToken: __, passwordResetToken: ___, ...userWithoutSensitiveData } = user;

      return {
        success: true,
        message: 'Login successful',
        data: {
          user: userWithoutSensitiveData,
          token
        }
      };

    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Internal server error during login'
      };
    }
  }

  async verifyEmail(token: string): Promise<UserResponse> {
    try {
      const user = await this.prismaUser.findFirst({ where: { emailVerificationToken: token } });

      if (!user) {
        return {
          success: false,
          message: 'Invalid or expired verification token'
        };
      }

      await this.prismaUser.updateUser(user.id, {
        isEmailVerified: true,
        emailVerificationToken: undefined
      });

      return {
        success: true,
        message: 'Email verified successfully'
      };

    } catch (error) {
      console.error('Email verification error:', error);
      return {
        success: false,
        message: 'Internal server error during email verification'
      };
    }
  }

  async forgotPassword(data: PasswordResetData): Promise<UserResponse> {
    try {
      const user = await this.prismaUser.findUnique({ email: data.email });

      if (!user) {
        // Don't reveal if user exists or not for security
        return {
          success: true,
          message: 'If an account with that email exists, a password reset link has been sent'
        };
      }

      // Generate password reset token
      const passwordResetToken = crypto.randomBytes(32).toString('hex');
      const passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour

      await this.prismaUser.updateUser(user.id, {
        passwordResetToken,
        passwordResetExpires
      });

      // TODO: Send email with reset link
      // For now, just return the token (in production, send via email)
      return {
        success: true,
        message: 'Password reset link sent to your email',
        data: {
          resetToken: passwordResetToken // Remove this in production
        }
      };

    } catch (error) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        message: 'Internal server error during password reset request'
      };
    }
  }

  async resetPassword(data: ResetPasswordData): Promise<UserResponse> {
    try {
      const user = await this.prismaUser.findFirst({
        where: { passwordResetToken: data.token }
      });

      if (!user) {
        return {
          success: false,
          message: 'Invalid or expired reset token'
        };
      }

      // Check if token is expired
      if (user.passwordResetExpires && user.passwordResetExpires < new Date()) {
        return {
          success: false,
          message: 'Reset token has expired'
        };
      }

      // Hash new password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(data.newPassword, saltRounds);

      await this.prismaUser.updateUser(user.id, {
        password: hashedPassword,
        passwordResetToken: undefined,
        passwordResetExpires: undefined
      });

      return {
        success: true,
        message: 'Password reset successfully'
      };

    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        message: 'Internal server error during password reset'
      };
    }
  }

  async changePassword(userId: number, data: ChangePasswordData): Promise<UserResponse> {
    try {
      const user = await this.prismaUser.findUnique({ where: { id: userId } });

      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      if (!user.password) {
        return {
          success: false,
          message: "User does not have a password set."
        };
      }

      const isCurrentPasswordValid = await bcrypt.compare(data.currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return {
          success: false,
          message: 'Current password is incorrect'
        };
      }

      // Hash new password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(data.newPassword, saltRounds);

      await this.prismaUser.updateUser(userId, { password: hashedPassword });

      return {
        success: true,
        message: 'Password changed successfully'
      };

    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        message: 'Internal server error during password change'
      };
    }
  }

  async getProfile(userId: number): Promise<UserResponse> {
    try {
      const user = await this.prismaUser.findUnique({ where: { id: userId } });

      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      // Remove sensitive data
      const { password: _, emailVerificationToken: __, ...userProfile } = user;

      return {
        success: true,
        message: 'User retrieved successfully',
        data: { user: userProfile }
      };

    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        message: 'Internal server error while fetching profile'
      };
    }
  }

  async updateProfile(userId: number, data: UpdateProfileData): Promise<UserResponse> {
    try {
      const updatedUserResponse = await this.prismaUser.updateUser(
        userId,
        {
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber,
          gender: data.gender ? (data.gender as Gender) : undefined,
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined
        }
      );
      
      if (!updatedUserResponse.success || !updatedUserResponse.data) {
        return updatedUserResponse;
      }
      
      const updatedUser = updatedUserResponse.data;

      // Remove sensitive data
      const { password: _, emailVerificationToken: __, ...userProfile } = updatedUser;

      return {
        success: true,
        message: 'User updated successfully',
        data: { user: updatedUser }
      };

    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        message: 'Internal server error while updating profile'
      };
    }
  }

  async logout(): Promise<UserResponse> {
    try {
      // In a more sophisticated setup, you might want to blacklist the token
      // For now, just return success - client should remove the token
      return {
        success: true,
        message: 'Logged out successfully'
      };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        message: 'Internal server error during logout'
      };
    }
  }

  async getUserById(id: number): Promise<UserResponse> {
    try {
      const user = await this.prismaUser.findUnique({ where: { id } });
      
      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      return {
        success: true,
        message: 'User retrieved successfully',
        data: { user }
      };
    } catch (error) {
      console.error('Get user by ID error:', error);
      return {
        success: false,
        message: 'Internal server error while fetching user'
      };
    }
  }

  async updateUser(id: number, data: Partial<User>): Promise<UserResponse> {
    try {
      const updatedUserResponse = await this.prismaUser.updateUser(id, data);
      
      if (!updatedUserResponse.success || !updatedUserResponse.data) {
        return updatedUserResponse;
      }
      
      const updatedUser = updatedUserResponse.data;
      
      return {
        success: true,
        message: 'User updated successfully',
        data: { user: updatedUser }
      };
    } catch (error) {
      console.error('Update user error:', error);
      return {
        success: false,
        message: 'Internal server error while updating user'
      };
    }
  }

  async deleteUser(id: number): Promise<UserResponse> {
    try {
      await this.prismaUser.deleteUser(id);
      
      return {
        success: true,
        message: 'User deleted successfully'
      };
    } catch (error) {
      console.error('Delete user error:', error);
      return {
        success: false,
        message: 'Internal server error while deleting user'
      };
    }
  }

  async getUserByEmail(email: string): Promise<UserResponse> {
    try {
      const user = await this.prismaUser.findUserByEmail(email);

      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      return {
        success: true,
        message: 'User retrieved successfully',
        data: { user }
      };
    } catch (error) {
      console.error('Get user by email error:', error);
      return {
        success: false,
        message: 'Internal server error while fetching user by email'
      };
    }
  }
}
