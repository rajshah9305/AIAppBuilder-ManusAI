# AI App Builder - Authentication System

## Overview
This project has a complete authentication system implemented using Next.js, Prisma, JWT, and bcrypt.

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build the application
- `npm run type-check` - Run TypeScript type checking
- `npm run lint` - Run ESLint

## Authentication System Components

### 1. Database Setup
- **Prisma ORM** with PostgreSQL
- User model with email, name, password, and timestamps
- Proper database relationships with projects

### 2. API Routes
- **POST /api/auth/login** - Authenticate user and return JWT token
- **POST /api/auth/register** - Create new user account
- **POST /api/auth/logout** - Clear authentication cookies

### 3. Authentication Library (`src/lib/auth.ts`)
- JWT token generation and verification
- Password hashing with bcrypt (12 rounds)
- Token storage utilities for localStorage
- Request authentication helpers

### 4. Database Functions (`src/lib/database.ts`)
- User creation with hashed passwords
- User lookup by email
- Project CRUD operations
- Proper error handling and validation

### 5. Validation (`src/lib/validation.ts`)
- Zod schemas for login and registration forms
- Email validation
- Password strength requirements (min 6 characters)
- Name validation (min 2 characters)

### 6. React Components
- **LoginForm** - Complete login form with error handling
- **RegisterForm** - Registration form with validation
- **useAuth** hook - Authentication state management

### 7. Middleware (`middleware.ts`)
- Route protection for authenticated pages
- JWT token verification
- Automatic redirects for auth flow

## Security Features
- Password hashing with bcrypt (12 rounds)
- JWT tokens with 7-day expiration
- HTTP-only cookies for additional security
- Input validation and sanitization
- CSRF protection via SameSite cookies
- Proper error handling without information leakage

## Environment Variables
```
# Required environment variables in .env.local:
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
DATABASE_URL="postgresql://username:password@localhost:5432/database"
CEREBRAS_API_KEY=your-cerebras-api-key-from-cerebras-cloud
```

## Core Implementation Status
✅ **COMPLETE**: All core functionality is implemented and functional:

1. **Cerebras AI Integration** (`src/lib/cerebras.ts`) - Real AI code generation using Cerebras Cloud SDK
2. **Database Operations** (`src/lib/database.ts`) - Full Prisma integration with PostgreSQL  
3. **Generation API** (`app/api/generate/route.ts`) - Complete flow from prompt to database storage

## Setup Instructions
See `SETUP.md` for detailed environment setup and configuration instructions.

## Authentication Flow
1. User submits login/register form
2. API validates input using Zod schemas
3. For login: verify credentials against database
4. For register: create new user with hashed password
5. Generate JWT token and set HTTP-only cookie
6. Return user data (without password) to client
7. Client stores token in localStorage and updates state
8. Middleware protects routes requiring authentication

## Testing
The authentication system includes:
- Form validation on both client and server
- Proper error messages for users
- Secure password handling
- Token expiration and refresh handling
- Protected route access control

## Key Files
- `app/api/auth/login/route.ts` - Login API endpoint
- `app/api/auth/register/route.ts` - Registration API endpoint
- `app/api/auth/logout/route.ts` - Logout API endpoint
- `src/lib/auth.ts` - Authentication utilities
- `src/lib/database.ts` - Database operations
- `src/lib/validation.ts` - Input validation schemas
- `src/hooks/useAuth.ts` - Authentication React hook
- `components/auth/LoginForm.tsx` - Login form component
- `components/auth/RegisterForm.tsx` - Registration form component
- `middleware.ts` - Route protection middleware
