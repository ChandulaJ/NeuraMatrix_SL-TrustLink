# User Service Architecture

This document describes the refactored architecture for the User service in the appointment system.

## Architecture Overview

The new architecture follows a clean, layered approach with clear separation of concerns:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Controllers   │    │     Services    │    │   Repositories  │
│                 │    │                 │    │                 │
│ UserController  │───▶│  UserService    │───▶│PrismaUserRepo   │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Routes      │    │   Interfaces    │    │     Models      │
│                 │    │                 │    │                 │
│  UserRoutes     │    │ UserInterface   │    │      User       │
│  authRoutes     │    │PrismaUserInterface│  │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Components

### 1. Models (`src/models/User.ts`)
- Defines the User data structure
- Contains enums for Role and Gender
- Represents the domain entities

### 2. Interfaces (`src/services/interfaces/UserInterface.ts`)
- Defines the contract for UserService
- Includes all user-related operations
- Provides type safety and consistency

### 3. PrismaUserInterface (`src/infrastructure/database/interfaces/PrismaUserInterface.ts`)
- Defines the contract for database operations
- Abstracts Prisma-specific implementation details
- Enables easy testing and mocking

### 4. UserService (`src/services/UserService.ts`)
- Contains all business logic
- Implements UserInterface
- Handles validation, password hashing, token generation
- Returns standardized UserResponse objects

### 5. PrismaUserRepository (`src/infrastructure/database/PrismaUserRepository.ts`)
- Concrete implementation of PrismaUserInterface
- Handles all database operations using Prisma
- Manages database connections

### 6. UserController (`src/controllers/UserController.ts`)
- Handles HTTP requests and responses
- Delegates business logic to UserService
- Manages validation and error handling
- Returns appropriate HTTP status codes

### 7. Routes
- **UserRoutes** (`src/routes/UserRoutes.ts`): Dedicated user management routes
- **authRoutes** (`src/routes/authRoutes.ts`): Authentication-related routes

## Key Benefits

1. **Separation of Concerns**: Each layer has a specific responsibility
2. **Testability**: Services and repositories can be easily mocked for testing
3. **Maintainability**: Changes in one layer don't affect others
4. **Scalability**: Easy to add new features or modify existing ones
5. **Type Safety**: Full TypeScript support with proper interfaces

## Usage Example

```typescript
// Creating a user
const userService = new UserService(new PrismaUserRepository());
const result = await userService.createUser({
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  password: "securePassword123",
  role: "CITIZEN",
  nationalId: "1234567890"
});

if (result.success) {
  console.log("User created:", result.data.user);
  console.log("Token:", result.data.token);
} else {
  console.error("Error:", result.message);
}
```

## Response Format

All service methods return a standardized `UserResponse` object:

```typescript
interface UserResponse {
  success: boolean;
  message: string;
  data?: any;
}
```

## Error Handling

- Services return error responses instead of throwing exceptions
- Controllers handle HTTP-specific error responses
- Consistent error message format across the application

## Authentication & Authorization

- JWT-based authentication
- Role-based access control (ADMIN, CITIZEN, FOREIGNER, BUSINESS_OWNER)
- Protected routes require valid authentication tokens
- Admin-only routes require ADMIN role

## Database Operations

- All database operations go through the repository layer
- Prisma handles database connections and query optimization
- Repository pattern enables easy database switching if needed

## Future Improvements

1. **Dependency Injection**: Use a proper DI container
2. **Caching**: Implement Redis or in-memory caching
3. **Logging**: Add structured logging with different levels
4. **Metrics**: Add performance monitoring and metrics
5. **Rate Limiting**: Implement API rate limiting
6. **Audit Trail**: Track user actions for security

## Testing

The architecture makes it easy to test each component in isolation:

```typescript
// Mock the repository for service testing
const mockRepository = {
  create: jest.fn(),
  findUnique: jest.fn(),
  // ... other methods
};

const userService = new UserService(mockRepository);
// Test service methods with mocked data
```

## Migration Notes

- Old controller functions have been replaced with class-based methods
- All business logic moved to UserService
- Database operations abstracted through interfaces
- Routes updated to use new controller instances
- Validation middleware remains the same for backward compatibility
