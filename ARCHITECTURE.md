# Routine Evaluator - Architecture & Data Flow Diagrams

## 1. Entity Relationship Diagram (ERD)

```
┌─────────────────────────────────────────────────────────────────┐
│                            USER                                 │
├─────────────────────────────────────────────────────────────────┤
│ id: String (cuid)                                              │
│ email: String (unique)                                         │
│ passwordHash: String                                           │
│ name: String                                                   │
│ persona: String? ('high-achiever' | 'burnout-recovery')      │
│ onboarded: Boolean                                             │
│ currentStreak: Int                                             │
│ longestStreak: Int                                             │
│ failStreak: Int                                                │
│ createdAt, updatedAt: DateTime                                │
└──────────────┬──────────────────────┬──────────────────────────┘
               │                      │
               │ 1:N                  │ 1:N
               │                      │
       ┌───────▼─────────────┐  ┌────▼──────────────────┐
       │  TASKTEMPLATE       │  │    DAYRECORD          │
       ├─────────────────────┤  ├───────────────────────┤
       │ id: String          │  │ id: String            │
       │ name: String        │  │ date: String (YYYY-MM-DD)  │
       │ type: String        │  │ score: Int (0-100)    │
       │ priority: String    │  │ tasksCompleted: Int   │
       │ category: String    │  │ totalTasks: Int       │
       │ target: Int?        │  │ createdAt: DateTime   │
       │ unit: String?       │  └───────────────────────┘
       │ ifThenIf: String?   │
       │ ifThenThen: String? │
       │ createdAt, updatedAt│
       └───────┬─────────────┘
               │
               │ 1:N
               │
       ┌───────▼──────────────────────┐
       │    TASKINSTANCE              │
       ├──────────────────────────────┤
       │ id: String                   │
       │ date: String (YYYY-MM-DD)    │
       │ completed: Boolean           │
       │ value: Int                   │
       │ completedAt: DateTime?       │
       │ createdAt, updatedAt         │
       └──────────────────────────────┘
```

## 2. Task Type & Priority System

### Task Types

```
┌──────────────────────────────────────────────────────┐
│                    TASK TYPE                         │
├──────────────────────────────────────────────────────┤
│                                                      │
│  BOOLEAN                QUANTITATIVE      DURATION  │
│  ────────────          ──────────────    ─────────  │
│  Yes/No completion     Countable items   Time-based │
│  value: 0 or 1         value: 0 - ∞      value: 0-∞ │
│  target: N/A           target: number    target: sec│
│                        unit: glasses     unit: min  │
│  Examples:             Examples:         Examples:  │
│  • Read 30 pages       • Water intake     • Workout  │
│  • Meditation done     • Exercise reps    • Deep work│
│  • Screen-free hour    • Push-ups         • Walk     │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Priority Weights (Impact on Daily Score)

```
┌────────────────────────────────────────────────────────────┐
│              PRIORITY WEIGHT SYSTEM                        │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  CRITICAL (Weight: 4)   40% of total score potential  ▓▓▓▓
│  HIGH     (Weight: 3)   30% of total score potential  ▓▓▓
│  MEDIUM   (Weight: 2)   20% of total score potential  ▓▓
│  LOW      (Weight: 1)   10% of total score potential  ▓
│                                                            │
│  Example: "High Achiever" persona                         │
│  ────────────────────────────────────────────────────     │
│  • Deep Work Block (CRITICAL) .......... 4 points        │
│  • Morning Workout (HIGH) .............. 3 points        │
│  • Meditation (HIGH) ................... 3 points        │
│  • Water Intake (MEDIUM) ............... 2 points        │
│  • Read Pages (MEDIUM) ................. 2 points        │
│  • Journal (LOW) ....................... 1 point         │
│  ─────────────────────────────────────────────────────── │
│  Total Weight: 15 points                                  │
│                                                            │
│  If user completes all HIGH + CRITICAL tasks:            │
│  Score = (7 / 15) × 100 = 47%                            │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

## 3. Daily Score Calculation Flow

```
                    ┌─────────────────┐
                    │ Retrieve Today's │
                    │ Task Templates   │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │ For Each Template│
                    └────────┬─────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
   Get Weight          Get Instance or         Calculate
   (1, 2, 3, 4)        Create Default      Earned Weight
   for Priority        (default: not done)
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                    ┌────────▼─────────┐
                    │ Is Completed?    │
                    └────┬───────┬─────┘
                         │       │
                    YES  │       │  NO
                         │       │
           ┌─────────────┘       └──────────────┐
           │                                    │
           ▼                                    ▼
    Earned Weight += Weight        Quantitative Score?
       (full credit)               ┌──────┬────────┐
                                   │YES   │  NO    │
                                   │      │        │
                              ┌────▼─┐   │     ┌──▼──┐
                              │Partial  │     │Zero  │
                              │Credit   │     │Credit│
                              │(value/  │     └──────┘
                              │target)  │
                              └────┬────┘
                                   │
                             ┌─────▼─────┐
                             │ Earned += │
                             │ Weight *% │
                             └───────────┘
                                   │
        ┌──────────────────────────┘
        │
        ▼
    ─────────────────────────────
    Final Score = (Earned / Total) × 100
    ─────────────────────────────
```

## 4. User State Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER LIFECYCLE                           │
└─────────────────────────────────────────────────────────────────┘

STEP 1: NEW USER (Onboarding)
├─ User lands on app
├─ If onboarded == false → Show Onboarding screen
├─ User selects persona: 'high-achiever' OR 'burnout-recovery'
└─ PERSONA_DEFAULTS tasks are loaded

STEP 2: DAILY TRACKING
├─ User interacts with TaskCards
├─ toggleTask() → For boolean tasks
├─ incrementTask() → For quantitative/duration tasks
├─ setTaskValue() → For manual value input
├─ TaskInstances created/updated in store
└─ Score updates in real-time

STEP 3: END OF DAY (Manual)
├─ User clicks "End Day" or system triggers at midnight
├─ getDailyScore() calculates final score (0-100)
├─ DayRecord created with date, score, counts
└─ Streak logic applied:
│  if score >= 60:
│    currentStreak++
│    failStreak = 0
│  else:
│    currentStreak = 0
│    failStreak++

STEP 4: ADAPTIVE DIFFICULTY
├─ System monitors failStreak
└─ if failStreak >= 3:
   ├─ shouldScaleDown() returns true
   ├─ UI suggests reducing task count/complexity
   └─ User can optionally:
      ├─ Remove low-priority tasks
      ├─ Adjust targets downward
      └─ Stay the course

STEP 5: VISUALIZATION
├─ Heatmap shows all DayRecords across calendar
├─ Color intensity = score (0% = red/empty, 100% = green/full)
├─ Current streak displayed prominently
├─ Longest streak shown as achievement
└─ Fail streak warnings if >= 2
```

## 5. Data Persistence Flow

```
┌───────────────────────────────────────────────────────────────┐
│           CLIENT-SIDE STATE MANAGEMENT (Zustand)             │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  useRoutineStore (with persist middleware)                   │
│  └─ localStorage key: "routine-evaluator"                    │
│                                                               │
│  Structure:                                                   │
│  {                                                            │
│    persona: "high-achiever" | "burnout-recovery" | null      │
│    onboarded: boolean                                        │
│    templates: TaskTemplate[]                                 │
│    instances: TaskInstance[]      ← Daily tracking          │
│    history: DayRecord[]            ← Historical data         │
│    currentStreak: 0-365                                      │
│    longestStreak: 0-365                                      │
│    failStreak: 0-∞                                           │
│  }                                                            │
│                                                               │
│  Persisted to: Browser's localStorage                        │
│  Restored on: App reload/navigation                          │
│                                                               │
└───────────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┴──────────────────┐
        │ (Future) Database Migration         │
        │                                     │
        ▼                                     ▼
   ┌─────────────┐                    ┌─────────────┐
   │  PostgreSQL │                    │    USER     │
   │  Database   │────────────────────│  TABLES     │
   └─────────────┘                    └─────────────┘
        │                                    │
        ├─────────────────────────────➤    │
        │   User                          │
        │   TaskTemplate                  │
        │   TaskInstance                  │
        │   DayRecord                     │
        │                                 │
        └─────────────────────────────────┘

With API endpoints:
  POST   /api/tasks          → Create new task template
  PUT    /api/tasks/:id      → Update task
  DELETE /api/tasks/:id      → Remove task
  POST   /api/tracking       → Record task instance
  GET    /api/history        → Fetch day records
  PUT    /api/end-day        → Finalize daily metrics
```

## 6. Component Hierarchy & Data Flow

```
┌─────────────────────────────────────────────────────┐
│                   App (page.tsx)                    │
│  Root component, manages onboarding state           │
└──────────────┬──────────────────────────────────────┘
               │
        ┌──────┴──────┐
        │             │
        ▼             ▼
    ┌────────────┐  ┌──────────────┐
    │ Onboarding │  │  Dashboard   │
    │ (Step 0-1) │  │  (Main app)  │
    └────────────┘  └──────┬───────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
    ┌──────────┐     ┌──────────┐    ┌─────────────┐
    │CommandPal│     │ScoreRing │    │  Heatmap    │
    │let (⌘K)  │     │(Progress)│    │(Cal View)   │
    └──────────┘     └──────────┘    └─────────────┘
          │
          ▼
    ┌────────────────────────────────┐
    │    TaskCard[] (Loop)            │
    │  (One per template)             │
    ├────────────────────────────────┤
    │  [Template metadata]            │
    │  ├─ BooleanInput (checkbox)     │
    │  ├─ QuantitativeInput (+/- btn) │
    │  └─ DurationInput (timer)       │
    └────────────────────────────────┘
          │
          ▼
    ┌────────────────────────────────┐
    │  Additional UI                  │
    │  ├─ AddTaskDialog               │
    │  └─ Dialogbox                   │
    └────────────────────────────────┘

Data Flow: useRoutineStore → All components receive data via hooks
Modified by: User interactions → Store updates → Re-render
```

## 7. Persona Comparison Matrix

```
┌─────────────────────────────────────────────────────────────────┐
│           HIGH ACHIEVER vs BURNOUT RECOVERY                     │
├──────────────────┬──────────────────────────────────────────────┤
│ METRIC           │ HIGH ACHIEVER      │ BURNOUT RECOVERY        │
├──────────────────┼────────────────────┼─────────────────────────┤
│ Task Count       │ 6 tasks            │ 4 tasks                 │
│ Difficulty       │ Aggressive targets │ Gentle/compassionate    │
│ Day Length       │ 90+ minutes total  │ 30-45 minutes total     │
│ Feedback Style   │ Dopamine-heavy     │ Supportive, low-pressure│
│ Core Philosophy  │ Push limits        │ Build sustainable habits│
├──────────────────┼────────────────────┼─────────────────────────┤
│ SAMPLE TASKS:                                                   │
├──────────────────┼────────────────────┼─────────────────────────┤
│                  │ Morning Workout    │ Gentle Walk             │
│ Movement         │ 45 min (Weight: 3) │ 15 min (Weight: 2)      │
│                  │ If: 6:30 AM        │ If: 10:00 AM            │
├──────────────────┼────────────────────┼─────────────────────────┤
│                  │ Deep Work Block    │ Hydrate                 │
│ Productivity     │ 90 min (Weight: 4) │ 6 glasses (Weight: 3)   │
│                  │ If: 9:00 AM        │ Spread throughout day   │
├──────────────────┼────────────────────┼─────────────────────────┤
│                  │ Water Intake       │ Screen-Free Hour        │
│ Health/Wellness  │ 8 glasses (W: 2)   │ (Weight: 3)             │
│                  │ Meditation: 15 min │ If: 8:00 PM             │
│                  │ (Weight: 3)        │ Gratitude Note (W: 1)   │
├──────────────────┼────────────────────┼─────────────────────────┤
│ Total Weight     │ 15 points          │ 9 points                │
│ Score Threshold  │ 60% (9/15 points)  │ 60% (5.4/9 points)      │
│ Expected % Score │ 60-90% typical     │ 70-95% typical          │
└──────────────────┴────────────────────┴─────────────────────────┘
```

## 8. Streak & Scale-Down System

```
┌─────────────────────────────────────────────────────┐
│             STREAK CALCULATION LOGIC                │
└─────────────────────────────────────────────────────┘

Daily Score (0-100)
        │
        ├─ >= 60 ──────────────────┬──────────────────
        │                          │
        ▼                          ▼
   SUCCESS                    FAILURE
   • currentStreak += 1        • currentStreak = 0
   • failStreak = 0            • failStreak += 1
   • Compare to longestStreak  • Check if failStreak >= 3
   • Update if greater             │
                                   ▼
                            shouldScaleDown() = true
                                   │
                                   ▼
                            System suggests:
                            • Remove 1 low-priority task
                            • Lower quantitative targets
                            • Extend duration targets
                            • OR: User ignores & keeps going

┌──────────────────────────────────────────────────┐
│      STREAK STATES & VISUAL FEEDBACK             │
├──────────────────────────────────────────────────┤
│                                                  │
│  currentStreak = 0        failStreak = 0         │
│  → "Start your streak"    → 🔥 Safe            │
│                                                  │
│  currentStreak = 1-6      failStreak = 1        │
│  → 🔥 Building momentum   → ⚠️ Watch out       │
│                                                  │
│  currentStreak = 7-14     failStreak = 2        │
│  → 🔥🔥 On fire!         → 🔴 Close to reset   │
│                                                  │
│  currentStreak = 15-30    failStreak = 3+       │
│  → 🔥🔥🔥 LEGENDARY!     → System rescales     │
│                                                  │
│  currentStreak = 30+      longestStreak = 30+   │
│  → 🌟 All-time record     │                     │
│    Personal best!         │                     │
│                           └─ Hall of fame       │
│                                                  │
└──────────────────────────────────────────────────┘
```

## 9. Data Types Reference

```typescript
// Core types used throughout the system

// User Personas
type UserPersona = 'high-achiever' | 'burnout-recovery' | null;

// Task Types (how to measure)
type TaskType = 'boolean' | 'quantitative' | 'duration';

// Priority Levels (weighted impact)
type TaskPriority = 'critical' | 'high' | 'medium' | 'low';

// Number Ranges
interface Ranges {
  score:            0 - 100        // Daily score
  currentStreak:    0 - 365        // Days
  longestStreak:    0 - 365        // Days
  failStreak:       0 - ∞          // Days
  tasksCompleted:   0 - 12         // Count
  totalTasks:       4 - 6          // Count
  taskValue:        0 - ∞          // Variable by type
  target:           1 - ∞          // Weight/quantity
}

// Example Task Values
interface TaskValueExamples {
  boolean:      { completed: 0|1, target: null }
  quantitative: { completed: 0-8, target: 8 }
                // Example: 6 glasses of 8 = 75% credit
  duration:     { completed: 0-3600, target: 3600 }
                // Example: 30 min of 60 min = 50% credit
}
```

---

This schema provides the complete blueprint for:

- ✅ Current client-side state (Zustand store)
- ✅ Future database schema (Prisma)
- ✅ All calculations and algorithms
- ✅ Data relationships and flows
- ✅ Component interactions
- ✅ Type definitions and constraints
