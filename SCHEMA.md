# Routine Evaluator - Project Schema

## Project Overview

A psychology-driven routine tracking system that helps users build sustainable habits through persona-based task management, daily scoring, and streak tracking.

---

## 1. Core Data Models

### 1.1 User State (Client-Side - Zustand Store)

Stored in browser localStorage under key `routine-evaluator`

```typescript
interface UserState {
  persona: UserPersona; // 'high-achiever' | 'burnout-recovery' | null
  onboarded: boolean; // Has user completed onboarding?
  templates: TaskTemplate[]; // Array of task templates
  instances: TaskInstance[]; // Array of completed/tracked task instances
  history: DayRecord[]; // Daily summary records
  currentStreak: number; // Consecutive days with score >= 60
  longestStreak: number; // Longest streak achieved
  failStreak: number; // Consecutive days below 60% score
}
```

### 1.2 TaskTemplate

Represents a recurring task/routine that the user can perform

```typescript
interface TaskTemplate {
  id: string; // Unique identifier (random string)
  name: string; // Task name (e.g., "Morning Workout")
  type: TaskType; // 'boolean' | 'quantitative' | 'duration'
  priority: TaskPriority; // 'critical' | 'high' | 'medium' | 'low'
  target?: number; // Goal value (reps/glasses/seconds)
  unit?: string; // Unit label (e.g., "glasses", "minutes", "reps")
  ifThen?: {
    // Implementation intention pattern
    if: string; // Trigger condition
    then: string; // Action/response
  };
  category: string; // Task category (e.g., "Fitness", "Health")
}
```

**TaskType Definitions:**

- `boolean`: Simple yes/no completion (e.g., "Read 30 pages")
- `quantitative`: Numerical tracking (e.g., "8 glasses of water")
- `duration`: Time-based tracking in seconds (e.g., "45-minute workout")

**TaskPriority Weights:**

```typescript
{
  critical: 4,    // 40% impact on daily score
  high: 3,        // 30% impact
  medium: 2,      // 20% impact
  low: 1          // 10% impact
}
```

### 1.3 TaskInstance

Represents a specific task completion on a specific date

```typescript
interface TaskInstance {
  id: string; // Unique identifier
  templateId: string; // Reference to TaskTemplate
  date: string; // Format: YYYY-MM-DD
  completed: boolean; // Is task marked complete?
  value: number; // Actual value (0/1 for boolean, count for quant, seconds for duration)
  completedAt?: number; // Timestamp when completed (milliseconds)
}
```

### 1.4 DayRecord

Daily summary of performance

```typescript
interface DayRecord {
  date: string; // Format: YYYY-MM-DD
  score: number; // 0-100, calculated based on completion and weights
  tasksCompleted: number; // Count of completed tasks that day
  totalTasks: number; // Total tasks available that day
}
```

### 1.5 UserPersona

User's selected difficulty/pacing mode

```typescript
type UserPersona = 'high-achiever' | 'burnout-recovery' | null;

// Preset task templates for each persona
PERSONA_DEFAULTS: {
  'high-achiever': [
    {
      id: '1',
      name: 'Morning Workout',
      type: 'duration',
      priority: 'high',
      target: 2700,              // 45 minutes in seconds
      unit: 'minutes',
      category: 'Fitness',
      ifThen: { if: 'it is 6:30 AM', then: 'I will start my workout' }
    },
    {
      id: '2',
      name: 'Deep Work Block',
      type: 'duration',
      priority: 'critical',
      target: 5400,              // 90 minutes in seconds
      unit: 'minutes',
      category: 'Productivity',
      ifThen: { if: 'it is 9:00 AM', then: 'I will begin deep work' }
    },
    {
      id: '3',
      name: 'Water Intake',
      type: 'quantitative',
      priority: 'medium',
      target: 8,
      unit: 'glasses',
      category: 'Health'
    },
    // ... 6 total tasks
  ],
  'burnout-recovery': [
    {
      id: '1',
      name: 'Gentle Walk',
      type: 'duration',
      priority: 'medium',
      target: 900,               // 15 minutes
      unit: 'minutes',
      category: 'Movement'
    },
    // ... 4 total tasks
  ]
}
```

---

## 2. Score Calculation System

### Daily Score Algorithm

```typescript
getDailyScore(): number {
  totalWeight = 0;
  earnedWeight = 0;

  for each template:
    weight = PRIORITY_WEIGHTS[template.priority]
    totalWeight += weight

    instance = find instance for template on today's date

    if instance exists and is completed:
      earnedWeight += weight
    else if instance exists and template.type != 'boolean':
      // Partial credit for quantitative/duration tasks
      earnedWeight += weight * Math.min(1, instance.value / template.target)

  return Math.round((earnedWeight / totalWeight) * 100)
}
```

### Streak Logic

```typescript
endDay():
  score = getDailyScore()

  if score >= 60:
    currentStreak += 1
    failStreak = 0
  else:
    currentStreak = 0
    failStreak += 1

  if currentStreak > longestStreak:
    longestStreak = currentStreak
```

### Scale-Down Trigger

```typescript
shouldScaleDown(): boolean {
  return failStreak >= 3  // Three consecutive days below 60%
}
```

---

## 3. Task Operations

### Toggle Task (Boolean Type)

```typescript
toggleTask(templateId: string):
  if instance exists for today:
    completed = !completed
    value = completed ? 1 : 0
    completedAt = completed ? now : undefined
  else:
    create new instance with completed=true, value=1, completedAt=now
```

### Increment Task (Quantitative/Duration Type)

```typescript
incrementTask(templateId: string, amount: number = 1):
  instance = find or create instance for today
  instance.value = max(0, instance.value + amount)

  if template.target exists:
    instance.completed = instance.value >= template.target
  else:
    instance.completed = instance.value > 0

  if completed:
    instance.completedAt = now
```

### Set Task Value

```typescript
setTaskValue(templateId: string, value: number):
  instance = find or create instance for today
  instance.value = value

  if template.target exists:
    instance.completed = value >= template.target
  else:
    instance.completed = value > 0
```

---

## 4. User Personas & Defaults

### High Achiever

**6 Tasks**, aggressive targets, full feedback intensity

- Morning Workout (45 min) - High
- Deep Work Block (90 min) - Critical
- Water Intake (8 glasses) - Medium
- Read 30 Pages - Medium
- Meditation (15 min) - High
- Journal Entry - Low

### Burnout Recovery

**4 Tasks**, gentle pacing, compassionate approach

- Gentle Walk (15 min) - Medium
- Hydrate (6 glasses) - High
- Screen-Free Hour - High
- Gratitude Note - Low

---

## 5. User Auth Schema (To Be Implemented)

```typescript
interface UserData {
  email: string; // User email
  password: string; // Hashed password
  name: string; // Display name
}

// Validation schema
SignInSchema = z.object({
  email: z.string().email().min(4).max(25),
  password: z.string().min(6).max(10),
});
```

---

## 6. Database Schema (Prisma - To Be Completed)

Currently, the Prisma schema is empty but configured with PostgreSQL. The following models should be added:

```prisma
// User profile
model User {
  id                String @id @default(cuid())
  email             String @unique
  passwordHash      String
  name              String
  persona           String?  // 'high-achiever' | 'burnout-recovery'
  onboarded         Boolean @default(false)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  templates         TaskTemplate[]
  instances         TaskInstance[]
  history           DayRecord[]
}

// Task templates
model TaskTemplate {
  id                String @id @default(cuid())
  userId            String
  user              User @relation(fields: [userId], references: [id], onDelete: Cascade)

  name              String
  type              String  // 'boolean' | 'quantitative' | 'duration'
  priority          String  // 'critical' | 'high' | 'medium' | 'low'
  target            Int?
  unit              String?
  category          String
  ifThenIf          String?
  ifThenThen        String?

  createdAt         DateTime @default(now())
  instances         TaskInstance[]

  @@index([userId])
}

// Task instances (daily tracking)
model TaskInstance {
  id                String @id @default(cuid())
  templateId        String
  template          TaskTemplate @relation(fields: [templateId], references: [id], onDelete: Cascade)

  date              String  // YYYY-MM-DD
  completed         Boolean
  value             Int
  completedAt       DateTime?

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@unique([templateId, date])
  @@index([templateId])
}

// Daily summary
model DayRecord {
  id                String @id @default(cuid())
  userId            String
  user              User @relation(fields: [userId], references: [id], onDelete: Cascade)

  date              String  // YYYY-MM-DD
  score             Int     // 0-100
  tasksCompleted    Int
  totalTasks        Int

  createdAt         DateTime @default(now())

  @@unique([userId, date])
  @@index([userId])
}
```

---

## 7. Component Tree

```
App (page.tsx)
├── Onboarding (persona selection)
└── Dashboard
    ├── CommandPalette (⌘K shortcuts)
    ├── Header (title, sign out)
    ├── ScoreRing (circular progress visualization)
    ├── TaskCard[] (individual task UI)
    │   ├── BooleanInput (checkbox)
    │   ├── QuantitativeInput (+/- buttons)
    │   └── DurationInput (play/pause timer)
    ├── AddTaskDialog (create custom tasks)
    ├── Heatmap (yearly calendar view)
    └── Dialogbox (additional actions)
```

---

## 8. State Management

**Current:** Zustand store with localStorage persistence

- Store: `useRoutineStore`
- Persist key: `routine-evaluator`

**Future:** Should migrate to Prisma + backend API for:

- Multi-device sync
- Data persistence
- Authentication
- User-specific data isolation

---

## 9. Key Metrics

- **Daily Score**: 0-100 based on weighted task completion
- **Current Streak**: Days with score >= 60
- **Longest Streak**: Best streak ever achieved
- **Fail Streak**: Consecutive days below 60% (triggers scale-down)
- **Completion Rate**: Tasks completed / total tasks per day
- **Task Density**: Number of tasks (6 for high-achiever, 4 for burnout-recovery)

---

## 10. File Structure

```
app/
├── components/
│   ├── Dashboard.tsx          # Main dashboard view
│   ├── TaskCard.tsx           # Individual task component
│   ├── Heatmap.tsx            # Calendar heatmap visualization
│   ├── ScoreRing.tsx          # Circular progress indicator
│   ├── Onboarding.tsx         # Persona selection flow
│   ├── AddTaskDialog.tsx      # Custom task creation
│   └── CommandPalette.tsx     # Keyboard shortcuts (⌘K)
├── hooks/
│   ├── use-toast.ts           # Toast notifications
│   └── use-mobile.tsx         # Mobile detection
├── lib/
│   ├── prismaDb.ts            # Prisma client setup
│   ├── schema.ts              # Zod validation schemas
│   └── utils.ts               # Utility functions
├── store/
│   └── useRoutineStore.ts     # Zustand store (main state)
├── types/
│   ├── routine.ts             # Core type definitions
│   └── types.ts               # Auth types
└── api/
    └── (auth)/
        ├── signin/route.ts
        └── signup/route.ts
```

---

## 11. Data Flow

1. **User Onboarding**: Select persona → Templates loaded from PERSONA_DEFAULTS
2. **Daily Tracking**: User interacts with TaskCards → TaskInstances created/updated
3. **End of Day**: Score calculated → DayRecord saved → Streak updated
4. **Scale Down**: If failStreak >= 3, system suggests reducing task complexity
5. **Heatmap**: Historical DayRecords visualized across calendar

---

## 12. Current Limitations & TODOs

- [ ] Complete Prisma schema models
- [ ] Implement authentication (signin/signup)
- [ ] Move data from localStorage to database
- [ ] Add API endpoints for CRUD operations
- [ ] Implement multi-device sync
- [ ] Add data export/import functionality
- [ ] Create mobile-responsive UI improvements
- [ ] Add notifications for streaks/milestones
