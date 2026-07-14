# 🔥 Flow State

> **A psychology-driven routine tracking system that helps users build sustainable habits through persona-based task management, daily scoring, and streak tracking.**

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-7.4.1-2D3748?logo=prisma)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Architecture](#-architecture)
- [User Personas](#-user-personas)
- [Scoring System](#-scoring-system)
- [Database Schema](#-database-schema)
- [Environment Variables](#-environment-variables)
- [Development](#-development)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**Flow State** is a modern habit tracking application designed with psychological principles at its core. Unlike traditional habit trackers, Flow State adapts to your lifestyle through persona-based templates and provides intelligent feedback through weighted scoring, streak tracking, and adaptive difficulty scaling.

### Core Philosophy

- **Psychology-First Design**: Built on implementation intention patterns (if-then planning)
- **Persona-Based Tracking**: Pre-configured templates for different life stages
- **Adaptive Difficulty**: Automatic scale-down suggestions when struggling
- **Weighted Scoring**: Not all tasks are equal - critical tasks carry more weight
- **Sustainable Habits**: Focus on consistency over perfection (60% threshold)

---

## ✨ Features

### 🎯 Smart Task Management

- **Three Task Types**:
  - **Boolean**: Simple yes/no completion (e.g., "Read 30 pages")
  - **Quantitative**: Numerical tracking with partial credit (e.g., "8 glasses of water")
  - **Duration**: Time-based tracking with timers (e.g., "45-minute workout")

### 📊 Intelligent Scoring

- Weighted daily score (0-100) based on task priority
- Four priority levels: Critical, High, Medium, Low
- Partial credit for quantitative and duration tasks
- Real-time score visualization with circular progress ring

### 🔥 Streak Tracking

- **Current Streak**: Days with score ≥ 60%
- **Longest Streak**: Personal best record
- **Fail Streak**: Consecutive days below 60% (triggers scale-down)
- Visual heatmap calendar showing yearly performance

### 🧠 Persona System

- **High Achiever**: 6 challenging tasks for ambitious individuals
- **Burnout Recovery**: 4 gentle tasks for sustainable rebuilding
- Pre-configured templates with psychology-backed defaults

### 🔐 Production-Ready Authentication

- **Session-based authentication**: Secure token-based sessions instead of credential-only auth
- **HTTP-only, Secure cookies**: Prevents XSS attacks and ensures secure transmission
- **Session hashing**: Uses bcrypt to hash session tokens before storing in database
- **Session expiration**: 7-day absolute expiration with sliding expiration for active sessions
- **Protected routes**: Middleware ensures only authenticated users can access private pages
- **Audit logging**: Tracks login/logout events and session creation/expiration
- **Secure logout**: Invalidates sessions both server-side and client-side

### 🎨 Modern UI/UX

- Dark mode with amber/orange accent theme
- Glassmorphic components with smooth animations
- Command palette (⌘K) for keyboard shortcuts
- Fully responsive design for mobile and desktop
- Real-time task completion animations

### 📅 Data Visualization

- Yearly heatmap calendar (GitHub-style)
- Daily score ring with animated progress
- Task completion statistics
- Streak indicators and milestones

---

## 🛠 Tech Stack

### Frontend

- **[Next.js 16.1.6](https://nextjs.org/)** - React framework with App Router
- **[React 19.2.3](https://react.dev/)** - UI library
- **[TypeScript 5.0](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS 4.0](https://tailwindcss.com/)** - Utility-first styling
- **[Framer Motion 12.34](https://www.framer.com/motion/)** - Animations
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives

### State Management

- **[Zustand 5.0](https://zustand-demo.pmnd.rs/)** - Lightweight state management
- **[React Query 5.90](https://tanstack.com/query)** - Server state management
- **[React Hook Form 7.71](https://react-hook-form.com/)** - Form handling
- **[Zod 4.3](https://zod.dev/)** - Schema validation

### Backend & Database

- **[Prisma 7.4.1](https://www.prisma.io/)** - ORM and database toolkit
- **[PostgreSQL](https://www.postgresql.org/)** - Primary database
- **[pg 8.19](https://node-postgres.com/)** - PostgreSQL client
- **[bcrypt 6.0](https://github.com/kelektiv/node.bcrypt.js)** - Password hashing

### UI Components

- **[Lucide React](https://lucide.dev/)** - Icon library
- **[Recharts](https://recharts.org/)** - Chart library
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications
- **[cmdk](https://cmdk.paco.me/)** - Command palette

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20.x or higher
- **npm** / **yarn** / **pnpm** / **bun**
- **PostgreSQL** database (local or hosted)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/flow-state.git
cd flow-state
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```bash
cp sample.env .env
```

Update the `.env` file with your PostgreSQL connection string:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/routine_tracker"
```

4. **Set up the database**

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma db push

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

5. **Run the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

6. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
flow-state/
├── app/
│   ├── api/                    # API routes
│   │   ├── signin/            # Sign in endpoint
│   │   ├── signup/            # Sign up endpoint
│   │   ├── logout/            # Logout endpoint
│   │   ├── me/                # Get current user endpoint
│   │   └── endDay/            # End day and save score
│   ├── components/            # React components
│   │   ├── ui/               # Reusable UI components (Radix UI)
│   │   ├── AuthForm.tsx      # Authentication form
│   │   ├── CommandPalette.tsx # Keyboard shortcuts (⌘K)
│   │   ├── Dashboard.tsx     # Main dashboard view
│   │   ├── Dialog.tsx        # Dialog/modal components
│   │   ├── dialogbox.tsx     # Additional dialog utilities
│   │   ├── Heatmap.tsx       # Yearly calendar heatmap
│   │   ├── Onboarding.tsx    # Persona selection flow
│   │   ├── ScoreRing.tsx     # Circular progress indicator
│   │   └── TaskCard.tsx      # Individual task component
│   ├── hooks/                # Custom React hooks
│   │   ├── use-mobile.tsx    # Mobile detection hook
│   │   └── use-toast.ts      # Toast notification hook
│   ├── lib/                  # Utility libraries
│   │   ├── auth.ts           # Authentication utilities (sessions, cookies)
│   │   ├── prismaDb.ts       # Prisma client singleton
│   │   ├── schema.ts         # Zod validation schemas
│   │   └── utils.ts          # Helper functions
│   ├── store/                # State management
│   │   └── useRoutineStore.ts # Zustand store (main state)
│   ├── types/                # TypeScript type definitions
│   │   ├── routine.ts        # Core routine types
│   │   └── types.ts          # Auth & utility types
│   ├── dashboard/            # Dashboard page (protected)
│   │   └── page.tsx
│   ├── signin/               # Sign in page
│   │   └── page.tsx
│   ├── signup/               # Sign up page
│   │   └── page.tsx
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout component
│   ├── page.tsx              # Landing page
│   └── not-found.tsx         # 404 page
├── prisma/
│   ├── schema.prisma         # Prisma database schema
│   └── migrations/          # Database migrations
├── public/                   # Static assets
├── ARCHITECTURE.md           # Detailed architecture documentation
├── SCHEMA.md                 # Data models and schema reference
├── sample.env                # Environment variables template
├── eslint.config.mjs         # ESLint configuration
├── next.config.ts            # Next.js configuration
├── package.json              # Dependencies and scripts
├── postcss.config.mjs        # PostCSS configuration
├── prisma.config.ts          # Prisma configuration
├── middleware.ts             # Next.js middleware (route protection)
├── tailwind.config.ts        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

---

## 🏗 Architecture

### Data Flow

```
User Interaction
    ↓
React Components (Dashboard, TaskCard)
    ↓
Zustand Store (useRoutineStore)
    ↓
localStorage (persistence layer)
    ↓
Future: Prisma ORM → PostgreSQL
```

### State Management

**Current**: Zustand + localStorage  
**Planned**: Prisma + PostgreSQL for multi-device sync

### Core State (Zustand)

```typescript
interface UserState {
  persona: "high-achiever" | "burnout-recovery" | null;
  onboarded: boolean;
  templates: TaskTemplate[]; // Recurring tasks
  instances: TaskInstance[]; // Daily completions
  history: DayRecord[]; // Daily summaries
  currentStreak: number;
  longestStreak: number;
  failStreak: number;
}
```

---

## 👤 User Personas

### 🚀 High Achiever

**Profile**: Ambitious individuals seeking peak performance

**Task Load**: 6 tasks  
**Difficulty**: Challenging targets  
**Focus**: Productivity, fitness, learning

**Default Tasks**:

- Morning Workout (45 min) - **High Priority**
- Deep Work Block (90 min) - **Critical Priority**
- Water Intake (8 glasses) - **Medium Priority**
- Read 30 Pages - **Medium Priority**
- Meditation (15 min) - **High Priority**
- Journal Entry - **Low Priority**

---

### 🌿 Burnout Recovery

**Profile**: Individuals rebuilding healthy habits after burnout

**Task Load**: 4 tasks  
**Difficulty**: Gentle, achievable targets  
**Focus**: Self-care, movement, mindfulness

**Default Tasks**:

- Gentle Walk (15 min) - **Medium Priority**
- Hydrate (6 glasses) - **High Priority**
- Screen-Free Hour - **High Priority**
- Gratitude Note - **Low Priority**

---

## 📐 Scoring System

### Priority Weights

| Priority | Weight | Impact on Score |
| -------- | ------ | --------------- |
| Critical | 4      | 40%             |
| High     | 3      | 30%             |
| Medium   | 2      | 20%             |
| Low      | 1      | 10%             |

### Score Calculation

```typescript
Daily Score = (Earned Weight / Total Weight) × 100

// Example:
// Critical task completed: +4 points
// High task at 50%: +1.5 points (3 × 0.5)
// Medium task incomplete: +0 points
// Low task completed: +1 point
// Score = (6.5 / 10) × 100 = 65%
```

### Streak Rules

- **Score ≥ 60%**: Day counts toward current streak
- **Score < 60%**: Current streak resets, fail streak increments
- **Fail Streak ≥ 3**: System suggests scaling down tasks

### Partial Credit

- **Boolean Tasks**: 0% or 100% (all or nothing)
- **Quantitative Tasks**: Proportional credit (6/8 glasses = 75%)
- **Duration Tasks**: Proportional credit (30/45 min = 67%)

---

## 💾 Database Schema

### User Model

```prisma
model user {
  id            String   @id @default(cuid())
  email         String   @unique
  password      String
  username      String
  persona       String?
  onboarded     Boolean  @default(false)
  currentStreak Int      @default(0)
  longestStreak Int      @default(0)
  failStreak    Int      @default(0)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  templates      taskTemplate[]
  instances      taskInstance[]
  historyRecords dayRecord[]
}
```

### TaskTemplate Model

```prisma
model taskTemplate {
  id         String   @id @default(cuid())
  userId     String
  name       String
  type       String   // 'boolean' | 'quantitative' | 'duration'
  priority   String   // 'critical' | 'high' | 'medium' | 'low'
  category   String
  target     Int?
  unit       String?
  ifThenIf   String?
  ifThenThen String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  instances  taskInstance[]
}
```

### TaskInstance Model

```prisma
model taskInstance {
  id          String    @id @default(cuid())
  templateId  String
  date        String    // YYYY-MM-DD
  completed   Boolean
  value       Int
  completedAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@unique([templateId, date])
}
```

### DayRecord Model

```prisma
model dayRecord {
  id             String   @id @default(cuid())
  userId         String
  date           String   // YYYY-MM-DD
  score          Int      // 0-100
  tasksCompleted Int
  totalTasks     Int
  createdAt      DateTime @default(now())

  @@unique([userId, date])
}
```

### Session Model

```prisma
model session {
  id         String   @id @default(cuid())
  userId     String
  tokenHash  String   @unique
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([userId])
  @@index([tokenHash])
}
```

### AuditLog Model

```prisma
model auditLog {
  id         String   @id @default(cuid())
  userId     String?
  action     String   // 'LOGIN_SUCCESS' | 'LOGIN_FAILURE' | 'LOGOUT' | 'SESSION_CREATED' | 'SESSION_EXPIRED'
  ipAddress  String?
  userAgent  String?
  createdAt  DateTime @default(now())

  @@index([userId])
  @@index([action])
  @@index([createdAt])
}
```

---

## 🔐 Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/routine_tracker"

# Optional: For production
# NEXTAUTH_SECRET="your-secret-key"
# NEXTAUTH_URL="https://your-domain.com"
```

---

## 💻 Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint code
npm run lint

# Generate Prisma Client
npm run postinstall
```

### Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# Push schema changes to database
npx prisma db push

# Create migration
npx prisma migrate dev --name migration_name

# Open Prisma Studio (database GUI)
npx prisma studio

# Reset database (⚠️ destructive)
npx prisma migrate reset
```

### Code Style

This project uses:

- **ESLint** for code linting
- **TypeScript** for type checking
- **Prettier** (configured in ESLint)

---

## 🌐 Deployment

### Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/flow-state)

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Database Setup

For production, use:

- [Neon](https://neon.tech/) - Serverless PostgreSQL
- [Supabase](https://supabase.com/) - PostgreSQL + Auth
- [Railway](https://railway.app/) - PostgreSQL hosting

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Add comments for complex logic
- Test thoroughly before submitting PR
- Update documentation if needed

---

## 📚 Additional Resources

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Detailed architecture diagrams and data flow
- [SCHEMA.md](./SCHEMA.md) - Complete schema reference and examples
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/) by Vercel
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons by [Lucide](https://lucide.dev/)
- Inspired by habit tracking psychology and behavioral science


