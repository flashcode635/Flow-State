export type UserPersona = 'high-achiever' | 'burnout-recovery' | null;

export type TaskType = 'boolean' | 'quantitative' | 'duration';

export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';

export interface TaskTemplate {
  id: string;
  name: string;
  type: TaskType;
  priority: TaskPriority;
  target?: number; // for quantitative (reps/glasses) or duration (seconds)
  unit?: string; // "glasses", "reps", "minutes"
  ifThen?: { if: string; then: string }; // implementation intention
  category: string;
}

export interface TaskInstance {
  id: string;
  templateId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  value: number; // 0/1 for boolean, count for quantitative, seconds for duration
  completedAt?: number; // timestamp
}

export interface DayRecord {
  date: string;
  score: number; // 0-100
  tasksCompleted: number;
  totalTasks: number;
}

export interface UserState {
  persona: UserPersona;
  onboarded: boolean;
  templates: TaskTemplate[];
  instances: TaskInstance[];
  history: DayRecord[];
  currentStreak: number;
  longestStreak: number;
  failStreak: number; // consecutive days below threshold
}

// Weights for priority
export const PRIORITY_WEIGHTS: Record<TaskPriority, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export const PERSONA_DEFAULTS: Record<'high-achiever' | 'burnout-recovery', TaskTemplate[]> = {
  'high-achiever': [
    { id: '1', name: 'Morning Workout', type: 'duration', priority: 'high', target: 2700, unit: 'minutes', category: 'Fitness', ifThen: { if: 'it is 6:30 AM', then: 'I will start my workout' } },
    { id: '2', name: 'Deep Work Block', type: 'duration', priority: 'critical', target: 5400, unit: 'minutes', category: 'Productivity', ifThen: { if: 'it is 9:00 AM', then: 'I will begin deep work' } },
    { id: '3', name: 'Water Intake', type: 'quantitative', priority: 'medium', target: 8, unit: 'glasses', category: 'Health' },
    { id: '4', name: 'Read 30 Pages', type: 'boolean', priority: 'medium', category: 'Growth' },
    { id: '5', name: 'Meditation', type: 'duration', priority: 'high', target: 900, unit: 'minutes', category: 'Mindfulness', ifThen: { if: 'I finish dinner', then: 'I will meditate for 15 minutes' } },
    { id: '6', name: 'Journal Entry', type: 'boolean', priority: 'low', category: 'Reflection' },
  ],
  'burnout-recovery': [
    { id: '1', name: 'Gentle Walk', type: 'duration', priority: 'medium', target: 900, unit: 'minutes', category: 'Movement', ifThen: { if: 'it is 10:00 AM', then: 'I will take a walk outside' } },
    { id: '2', name: 'Hydrate', type: 'quantitative', priority: 'high', target: 6, unit: 'glasses', category: 'Health' },
    { id: '3', name: 'Screen-Free Hour', type: 'boolean', priority: 'high', category: 'Rest', ifThen: { if: 'it is 8:00 PM', then: 'I will put away my phone' } },
    { id: '4', name: 'Gratitude Note', type: 'boolean', priority: 'low', category: 'Mindfulness' },
  ],
};
