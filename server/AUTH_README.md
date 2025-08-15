# Authentication System Documentation

## Overview

This authentication system provides a comprehensive user authentication solution for the NeuraMatrix SL-TrustLink application. It includes user registration, login, email verification, password reset, and profile management functionality.

## Features

### 🔐 Core Authentication
- **User Registration**: Secure user registration with role-based validation
- **User Login**: JWT-based authentication (no email verification required)
- **Password Security**: Bcrypt hashing with 12 salt rounds
- **Password Reset**: Secure forgot password and reset functionality

### 👤 User Management
- **Profile Management**: Get and update user profiles
- **Password Change**: Authenticated password change
- **Role-Based Access**: Support for different user roles (CITIZEN, FOREIGNER, BUSINESS_OWNER, ADMIN)
- **Session Management**: JWT token-based sessions

### 🛡️ Security Features
- **Input Validation**: Comprehensive validation using express-validator
- **Password Requirements**: Strong password policy enforcement
- **Token Security**: JWT tokens with configurable expiration
- **Role Validation**: Role-specific field requirements
- **Error Handling**: Secure error responses without information leakage

## User Roles

### CITIZEN
- Required: National ID
- Access: Basic appointment booking and management

### FOREIGNER
- Required: Passport Number
- Access: Basic appointment booking and management

### BUSINESS_OWNER
- Required: Business Registration Number
- Access: Business-specific services and appointments

### ADMIN
- Access: Full system access and user management

## API Endpoints

### Public Endpoints

#### POST `/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "phoneNumber": "+1234567890",
  "gender": "MALE",
  "dateOfBirth": "1990-01-01",
  "role": "CITIZEN",
  "nationalId": "123456789012"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "user": {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "CITIZEN",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### POST `/auth/login`
Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "CITIZEN",
      "lastLoginAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```



#### POST `/auth/forgot-password`
Request password reset.

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

#### POST `/auth/reset-password`
Reset password using token.

**Request Body:**
```json
{
  "token": "reset-token-here",
  "newPassword": "NewSecurePass123!"
}
```

### Protected Endpoints (Require Authentication)

#### GET `/auth/profile`
Get current user profile.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

#### PUT `/auth/profile`
Update user profile.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phoneNumber": "+1234567890",
  "gender": "MALE",
  "dateOfBirth": "1990-01-01"
}
```

#### POST `/auth/change-password`
Change user password.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!"
}
```

#### POST `/auth/logout`
Logout user (client-side token removal).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

### Admin Endpoints

#### GET `/auth/admin/users`
Get all users (Admin only).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

## Database Schema

The authentication system uses the following database schema:

```sql
model User {
  id                    Int       @id @default(autoincrement())
  firstName            String
  lastName             String
  email                String    @unique
  password             String
  phoneNumber          String?
  gender               Gender?
  dateOfBirth          DateTime?
  role                 Role
  nationalId           String?    // For citizens
  passportNo           String?    // For foreigners
  businessRegNo        String?    // For business owners
  isEmailVerified      Boolean   @default(false)
  emailVerificationToken String?
  passwordResetToken   String?
  passwordResetExpires DateTime?
  lastLoginAt          DateTime?
  appointments         Appointment[]
  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt
}
```

## Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/database_name"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Server Configuration
PORT=3001
NODE_ENV=development
```

## Password Requirements

Passwords must meet the following criteria:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (@$!%*?&)

## Security Considerations

### Production Deployment
1. **Change JWT Secret**: Use a strong, unique JWT secret in production
2. **HTTPS Only**: Always use HTTPS in production
3. **Email Service**: Implement proper email service for verification and reset emails
4. **Rate Limiting**: Implement rate limiting for authentication endpoints
5. **Token Blacklisting**: Consider implementing token blacklisting for logout
6. **CORS Configuration**: Configure CORS properly for your frontend domain

### Security Features Implemented
- Password hashing with bcrypt (12 salt rounds)
- JWT token expiration
- Input validation and sanitization
- Secure error responses
- Role-based access control

## Usage Examples

### Frontend Integration

#### Login Example
```javascript
const login = async (email, password) => {
  try {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Store token in localStorage or secure storage
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      return data.data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};
```

#### Protected Request Example
```javascript
const getProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('/auth/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    return data.data.user;
  } catch (error) {
    console.error('Failed to get profile:', error);
    throw error;
  }
};
```

## Error Handling

The authentication system provides consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

## Testing

To test the authentication system:

1. **Start the server**: `npm run dev`
2. **Test registration**: Use the `/auth/register` endpoint
3. **Test login**: Use the `/auth/login` endpoint
4. **Test protected routes**: Include the JWT token in the Authorization header

## Dependencies

The authentication system requires the following packages:
- `express`: Web framework
- `bcryptjs`: Password hashing
- `jsonwebtoken`: JWT token handling
- `express-validator`: Input validation
- `@prisma/client`: Database ORM
- `crypto`: Cryptographic functions (Node.js built-in)

## Support

For issues or questions about the authentication system, please refer to the project documentation or contact the development team.
