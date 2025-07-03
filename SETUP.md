# AI App Builder - Setup Instructions

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/aiappbuilder"

# JWT Secret for Authentication (change this to a secure random string)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Cerebras AI API Key (get this from https://cerebras.ai)
CEREBRAS_API_KEY="your-cerebras-api-key-here"
```

## Setup Steps

### 1. Database Setup

1. Install PostgreSQL or use a cloud provider like Supabase, PlanetScale, or Neon
2. Create a new database for your project
3. Update the `DATABASE_URL` in your `.env.local` file

### 2. Prisma Database Migration

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# (Optional) View your database
npx prisma studio
```

### 3. Cerebras AI Setup

1. Visit [Cerebras Cloud](https://cerebras.ai) and create an account
2. Generate an API key from your dashboard
3. Add the API key to your `.env.local` file as `CEREBRAS_API_KEY`

### 4. JWT Secret

Generate a secure JWT secret:

```bash
# Option 1: Use OpenSSL
openssl rand -base64 32

# Option 2: Use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Add the generated secret to your `.env.local` file as `JWT_SECRET`.

### 5. Run the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm run start
```

## Features Implemented

### ✅ Core Functionality Complete

1. **Cerebras AI Integration** - Real AI code generation using Cerebras Cloud SDK
2. **Database Operations** - Full Prisma integration with PostgreSQL
3. **Authentication System** - JWT-based auth with bcrypt password hashing
4. **Code Generation API** - Complete flow from prompt to database storage
5. **Project Management** - CRUD operations for user projects
6. **Code Preview** - Live React component rendering
7. **Error Handling** - Comprehensive error handling throughout

### ✅ API Endpoints

- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration  
- `POST /api/auth/logout` - User logout
- `POST /api/generate` - AI code generation

### ✅ Components

- Authentication forms (Login/Register)
- Dashboard with project management
- Code editor with Monaco Editor
- Live code preview
- Project cards and status management

## Environment Variables Details

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET` | Secret key for JWT tokens | `base64-encoded-random-string` |
| `CEREBRAS_API_KEY` | Cerebras AI API key | `your-api-key-from-cerebras` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |

## Testing the Complete Flow

1. **Register a new user** - Create account via `/register`
2. **Login** - Authenticate via `/login`  
3. **Generate code** - Enter a prompt like "Create a todo app with React"
4. **View results** - See generated code and live preview
5. **Manage projects** - View, edit, delete projects from dashboard

## Troubleshooting

### Database Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL format
- Run `npx prisma db push` to sync schema

### AI Generation Issues  
- Verify CEREBRAS_API_KEY is valid
- Check API key permissions on Cerebras Cloud
- Monitor API usage limits

### Authentication Issues
- Ensure JWT_SECRET is set and secure
- Check token expiration (default: 7 days)
- Clear browser cookies if needed

## Security Notes

- JWT tokens expire after 7 days
- Passwords are hashed with bcrypt (12 rounds)
- HTTP-only cookies for additional security
- Input validation with Zod schemas
- Proper error handling without information leakage
