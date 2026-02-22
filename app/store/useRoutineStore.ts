import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type UserState, type TaskTemplate, type TaskInstance, type DayRecord, type UserPersona, PRIORITY_WEIGHTS, PERSONA_DEFAULTS } from '@/app/types/routine';

const today = () => new Date().toISOString().split('T')[0];

const generateId = () => Math.random().toString(36).substring(2, 10);

interface RoutineActions {
  setPersona: (persona: UserPersona) => void;
  completeOnboarding: (persona: 'high-achiever' | 'burnout-recovery') => void;
  addTemplate: (template: Omit<TaskTemplate, 'id'>) => void;
  removeTemplate: (id: string) => void;
  toggleTask: (templateId: string) => void;
  incrementTask: (templateId: string, amount?: number) => void;
  setTaskValue: (templateId: string, value: number) => void;
  getDailyScore: () => number;
  getTodayInstances: () => (TaskInstance & { template: TaskTemplate })[];
  getOrCreateInstance: (templateId: string) => TaskInstance;
  endDay: () => void;
  freshStart: () => void;
  getHeatmapData: () => DayRecord[];
  shouldScaleDown: () => boolean;
}

type RoutineStore = UserState & RoutineActions;

export const useRoutineStore = create<RoutineStore>()(
  persist(
    (set, get) => ({
      persona: null,
      onboarded: false,
      templates: [],
      instances: [],
      history: [],
      currentStreak: 0,
      longestStreak: 0,
      failStreak: 0,

      setPersona: (persona) => set({ persona }),

      completeOnboarding: (persona) => {
        const templates = PERSONA_DEFAULTS[persona].map(t => ({ ...t, id: generateId() }));
        set({ persona, onboarded: true, templates });
      },

      addTemplate: (template) => {
        const id = generateId();
        set(s => ({ templates: [...s.templates, { ...template, id }] }));
      },

      removeTemplate: (id) => {
        set(s => ({
          templates: s.templates.filter(t => t.id !== id),
          instances: s.instances.filter(i => i.templateId !== id),
        }));
      },

      toggleTask: (templateId) => {
        const date = today();
        set(s => {
          const existing = s.instances.find(i => i.templateId === templateId && i.date === date);
          if (existing) {
            return {
              instances: s.instances.map(i =>
                i.id === existing.id
                  ? { ...i, completed: !i.completed, value: i.completed ? 0 : 1, completedAt: i.completed ? undefined : Date.now() }
                  : i
              ),
            };
          }
          return {
            instances: [...s.instances, {
              id: generateId(),
              templateId,
              date,
              completed: true,
              value: 1,
              completedAt: Date.now(),
            }],
          };
        });
      },

      incrementTask: (templateId, amount = 1) => {
        const date = today();
        set(s => {
          const existing = s.instances.find(i => i.templateId === templateId && i.date === date);
          const template = s.templates.find(t => t.id === templateId);
          if (existing) {
            const newValue = Math.max(0, existing.value + amount);
            const completed = template?.target ? newValue >= template.target : newValue > 0;
            return {
              instances: s.instances.map(i =>
                i.id === existing.id
                  ? { ...i, value: newValue, completed, completedAt: completed ? Date.now() : undefined }
                  : i
              ),
            };
          }
          const newValue = Math.max(0, amount);
          const completed = template?.target ? newValue >= template.target : newValue > 0;
          return {
            instances: [...s.instances, {
              id: generateId(),
              templateId,
              date,
              completed,
              value: newValue,
              completedAt: completed ? Date.now() : undefined,
            }],
          };
        });
      },

      setTaskValue: (templateId, value) => {
        const date = today();
        set(s => {
          const existing = s.instances.find(i => i.templateId === templateId && i.date === date);
          const template = s.templates.find(t => t.id === templateId);
          const completed = template?.target ? value >= template.target : value > 0;
          if (existing) {
            return {
              instances: s.instances.map(i =>
                i.id === existing.id
                  ? { ...i, value, completed, completedAt: completed ? Date.now() : undefined }
                  : i
              ),
            };
          }
          return {
            instances: [...s.instances, {
              id: generateId(),
              templateId,
              date,
              completed,
              value,
              completedAt: completed ? Date.now() : undefined,
            }],
          };
        });
      },

      getOrCreateInstance: (templateId) => {
        const date = today();
        const state = get();
        const existing = state.instances.find(i => i.templateId === templateId && i.date === date);
        if (existing) return existing;
        const instance: TaskInstance = {
          id: generateId(),
          templateId,
          date,
          completed: false,
          value: 0,
        };
        set(s => ({ instances: [...s.instances, instance] }));
        return instance;
      },

      getTodayInstances: () => {
        const state = get();
        const date = today();
        return state.templates.map(template => {
          const instance = state.instances.find(i => i.templateId === template.id && i.date === date);
          return {
            ...(instance || { id: '', templateId: template.id, date, completed: false, value: 0 }),
            template,
          };
        });
      },

      getDailyScore: () => {
        const state = get();
        const date = today();
        let totalWeight = 0;
        let earnedWeight = 0;

        for (const template of state.templates) {
          const weight = PRIORITY_WEIGHTS[template.priority];
          totalWeight += weight;
          const instance = state.instances.find(i => i.templateId === template.id && i.date === date);
          if (instance?.completed) {
            earnedWeight += weight;
          } else if (instance && template.target && template.type !== 'boolean') {
            earnedWeight += weight * Math.min(1, instance.value / template.target);
          }
        }

        return totalWeight === 0 ? 0 : Math.round((earnedWeight / totalWeight) * 100);
      },

      endDay: () => {
        const state = get();
        const date = today();
        const score = state.getDailyScore();
        const todayTasks = state.getTodayInstances();
        const completed = todayTasks.filter(t => t.completed).length;

        const record: DayRecord = {
          date,
          score,
          tasksCompleted: completed,
          totalTasks: todayTasks.length,
        };

        const isSuccess = score >= 60;
        const newStreak = isSuccess ? state.currentStreak + 1 : 0;
        const newFailStreak = isSuccess ? 0 : state.failStreak + 1;

        set(s => ({
          history: [...s.history.filter(h => h.date !== date), record],
          currentStreak: newStreak,
          longestStreak: Math.max(s.longestStreak, newStreak),
          failStreak: newFailStreak,
        }));
      },

      freshStart: () => {
        set({
          persona: null,
          onboarded: false,
          templates: [],
          instances: [],
          history: [],
          currentStreak: 0,
          longestStreak: 0,
          failStreak: 0,
        });
      },

      getHeatmapData: () => {
        return get().history.sort((a, b) => a.date.localeCompare(b.date));
      },

      shouldScaleDown: () => {
        return get().failStreak >= 3;
      },
    }),
    {
      name: 'routine-evaluator',
    }
  )
);
