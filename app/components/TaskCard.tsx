"use client"
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus, Minus, Play, Pause, RotateCcw, Trash2 } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { type TaskTemplate, type TaskInstance } from '@/app/types/routine';
import { useRoutineStore } from '@/app/store/useRoutineStore';

interface TaskCardProps {
  template: TaskTemplate;
  instance: TaskInstance;
}

const TaskCard = ({ template, instance }: TaskCardProps) => {
  const { toggleTask, incrementTask, setTaskValue, removeTemplate } = useRoutineStore();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card-hover p-4 ${instance.completed ? 'border-success/30' : ''}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">
              {template.category}
            </span>
            <PriorityBadge priority={template.priority} />
          </div>
          <h3 className={`font-medium truncate ${instance.completed ? 'text-success line-through opacity-70' : 'text-foreground'}`}>
            {template.name}
          </h3>
          {template.ifThen && (
            <p className="text-xs text-muted-foreground mt-1 truncate">
              If {template.ifThen.if}, then {template.ifThen.then}
            </p>
          )}
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <div>
            {template.type === 'boolean' && (
              <BooleanInput completed={instance.completed} onToggle={() => toggleTask(template.id)} />
            )}
            {template.type === 'quantitative' && (
              <QuantitativeInput
                value={instance.value}
                target={template.target || 1}
                unit={template.unit || ''}
                onIncrement={() => incrementTask(template.id)}
                onDecrement={() => incrementTask(template.id, -1)}
              />
            )}
            {template.type === 'duration' && (
              <DurationInput
                value={instance.value}
                target={template.target || 600}
                onUpdate={(v) => setTaskValue(template.id, v)}
                completed={instance.completed}
              />
            )}
          </div>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => removeTemplate(template.id)}
            className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {instance.completed && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute inset-0 pointer-events-none flex items-center justify-center"
          >
            <div className="w-full h-full rounded-xl glow-success opacity-20" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const PriorityBadge = ({ priority }: { priority: string }) => {
  const colors: Record<string, string> = {
    critical: 'bg-destructive/20 text-destructive',
    high: 'bg-primary/20 text-primary',
    medium: 'bg-warning/20 text-warning',
    low: 'bg-muted text-muted-foreground',
  };
  return (
    <span className={`text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-mono ${colors[priority] || colors.low}`}>
      {priority}
    </span>
  );
};

const BooleanInput = ({ completed, onToggle }: { completed: boolean; onToggle: () => void }) => (
  <motion.button
    whileTap={{ scale: 0.85 }}
    onClick={onToggle}
    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
      completed
        ? 'bg-success text-success-foreground glow-success'
        : 'bg-muted hover:bg-muted/80 text-muted-foreground'
    }`}
  >
    <AnimatePresence mode="wait">
      {completed ? (
        <motion.div key="check" initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }}>
          <Check className="w-5 h-5" />
        </motion.div>
      ) : (
        <motion.div key="empty" className="w-3 h-3 rounded-sm border-2 border-muted-foreground" />
      )}
    </AnimatePresence>
  </motion.button>
);

const QuantitativeInput = ({
  value,
  target,
  unit,
  onIncrement,
  onDecrement,
}: {
  value: number;
  target: number;
  unit: string;
  onIncrement: () => void;
  onDecrement: () => void;
}) => {
  const progress = Math.min(1, value / target);
  const completed = value >= target;

  return (
    <div className="flex items-center gap-2">
      <motion.button whileTap={{ scale: 0.85 }} onClick={onDecrement} className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
        <Minus className="w-3 h-3" />
      </motion.button>
      <div className="text-center min-w-15">
        <div className={`font-mono text-lg font-bold ${completed ? 'text-success' : 'text-foreground'}`}>
          {value}<span className="text-muted-foreground text-xs">/{target}</span>
        </div>
        <div className="w-full h-1 rounded-full bg-muted mt-1 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            style={{ backgroundColor: completed ? 'hsl(var(--success))' : undefined }}
          />
        </div>
        <span className="text-[9px] text-muted-foreground uppercase">{unit}</span>
      </div>
      <motion.button whileTap={{ scale: 0.85 }} onClick={onIncrement} className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
        <Plus className="w-3 h-3" />
      </motion.button>
    </div>
  );
};

const DurationInput = ({
  value,
  target,
  onUpdate,
  completed,
}: {
  value: number;
  target: number;
  onUpdate: (v: number) => void;
  completed: boolean;
}) => {
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const tick = useCallback(() => {
    const newVal = valueRef.current + 1;
    onUpdate(newVal);
  }, [onUpdate]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(tick, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, tick]);

  useEffect(() => {
    if (completed && running) setRunning(false);
  }, [completed, running]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const progress = Math.min(1, value / target);

  return (
    <div className="flex items-center gap-2">
      <div className="text-center min-w-17.5">
        <div className={`font-mono text-lg font-bold ${completed ? 'text-success' : 'text-foreground'}`}>
          {formatTime(value)}
        </div>
        <div className="w-full h-1 rounded-full bg-muted mt-1 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{ width: `${progress * 100}%` }}
            style={{ backgroundColor: completed ? 'hsl(var(--success))' : undefined }}
          />
        </div>
        <span className="text-[9px] text-muted-foreground">{formatTime(target)} goal</span>
      </div>
      <div className="flex flex-col gap-1">
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => setRunning(r => !r)}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            running ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
          }`}
        >
          {running ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => { setRunning(false); onUpdate(0); }}
          className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
        </motion.button>
      </div>
    </div>
  );
};

export default TaskCard;
