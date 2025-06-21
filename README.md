# 🚀 AI App Builder

A production-ready **NO CODE AI APP BUILDER** that generates complete React applications from natural language descriptions using **Cerebras AI** models.

![AI App Builder](https://img.shields.io/badge/AI-Powered-blue) ![React](https://img.shields.io/badge/React-18-blue) ![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)

## ✨ Features

- 🤖 **Cerebras AI Integration** - Lightning-fast code generation with Llama models
- 🎨 **Modern UI/UX** - Beautiful, responsive interface with dark/light mode
- ⚡ **Real-time Code Editor** - Monaco Editor with syntax highlighting
- 🔐 **Secure Authentication** - JWT-based auth with bcrypt encryption
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- 🚀 **One-Click Deploy** - Deploy to Vercel instantly
- 💾 **Project Management** - Save, organize, and manage projects
- 🎭 **Theme Support** - Dark/Light mode with smooth transitions
- 📊 **Real-time Preview** - Live preview of generated applications

## 🛠️ Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18 + TypeScript
- Tailwind CSS + Framer Motion
- Monaco Editor (VS Code)
- Zustand (State Management)
- React Hook Form + Zod

**Backend:**
- Next.js API Routes
- Prisma ORM + PostgreSQL
- JWT Authentication
- Cerebras AI SDK

**Deployment:**
- Vercel (Frontend + Serverless)
- Supabase/Railway (Database)

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/ai-app-builder.git
cd ai-app-builder
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
cp .env.example .env.local
```

Add your environment variables:
```env
# Cerebras AI
CEREBRAS_API_KEY=your_cerebras_api_key

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/aiappbuilder"

# Authentication
NEXTAUTH_SECRET="your-super-secret-jwt-key-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Database Setup
```bash
npx prisma generate
npx prisma db push
```

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 One-Click Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/ai-app-builder)

### Manual Deployment

1. **Fork this repository**
2. **Connect to Vercel:**
   ```bash
   npm i -g vercel
   vercel login
   vercel
   ```
3. **Set Environment Variables in Vercel Dashboard:**
   - `CEREBRAS_API_KEY`
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`

4. **Deploy:**
   ```bash
   vercel --prod
   ```

## 📖 API Documentation

### Authentication Endpoints

```typescript
POST /api/auth/register
POST /api/auth/login
```

### Project Management

```typescript
GET /api/projects          // Get user projects
POST /api/projects         // Create new project
PUT /api/projects/[id]     // Update project
DELETE /api/projects/[id]  // Delete project
```

### AI Generation

```typescript
POST /api/generate         // Generate app from prompt
```

## 🎯 Usage Examples

### Generate a Todo App
```
Create a modern todo application with:
- Add/edit/delete tasks
- Mark tasks as complete
- Filter by status
- Dark mode support
- Responsive design
```

### Generate a Dashboard
```
Build a analytics dashboard with:
- Charts and graphs
- Data tables
- Sidebar navigation
- User profile
- Real-time updates
```

## 🔧 Configuration

### Cerebras AI Models
The app uses `llama-4-scout-17b-16e-instruct` by default. You can modify the model in `src/lib/cerebras.ts`:

```typescript
model: "llama-4-scout-17b-16e-instruct"
```

### Database Schema
The app uses Prisma with PostgreSQL. Schema is defined in `prisma/schema.prisma`.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Cerebras](https://cerebras.ai/) for AI inference
- [Vercel](https://vercel.com/) for hosting platform
- [Next.js](https://nextjs.org/) team for the framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Prisma](https://prisma.io/) for database ORM

## 📞 Support

- 📧 Email: support@aiappbuilder.com
- 💬 Discord: [Join our community](https://discord.gg/aiappbuilder)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/ai-app-builder/issues)

---

**Built with ❤️ and AI** | **Star ⭐ this repo if you found it helpful!**