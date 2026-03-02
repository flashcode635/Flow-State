"use client"
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useRoutineStore } from '@/app/store/useRoutineStore';
import type { TaskType, TaskPriority } from '@/app/types/routine';

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddTaskDialog = ({ open, onOpenChange }: AddTaskDialogProps) => {
  const { addTemplate } = useRoutineStore();
  const [name, setName] = useState('');
  const [type, setType] = useState<TaskType>('boolean');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [target, setTarget] = useState('');
  const [unit, setUnit] = useState('');
  const [category, setCategory] = useState('');
  const [ifText, setIfText] = useState('');
  const [thenText, setThenText] = useState('');

  const handleSubmit = () => {
    if (!name.trim() || !category.trim()) return;
    addTemplate({
      name: name.trim(),
      type,
      priority,
      target: type !== 'boolean' ? Number(target) || undefined : undefined,
      unit: type !== 'boolean' ? unit || undefined : undefined,
      category: category.trim(),
      ifThen: ifText && thenText ? { if: ifText, then: thenText } : undefined,
    });
    setName(''); setType('boolean'); setPriority('medium'); setTarget(''); setUnit(''); setCategory(''); setIfText(''); setThenText('');
    onOpenChange(false);
  };

  return (
    <AnimatePresence>
      {open && (
      <>
        <div >
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 "
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-[10%] left-1/2 -translate-x-1/2 w-[90vw] max-w-screen h-screen z-50 glass-card p-6 shadow-2xl bg-background/90 mt-3"
          >  
          <div  className="fixed top-[1%] left-1/2 -translate-x-1/2 w-full max-w-md z-50 glass-card p-6 shadow-2xl bg-black mt-3">

            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">New Task</h2>
              <button onClick={() => onOpenChange(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <input
                value={name} onChange={e => setName(e.target.value)}
                placeholder="Task name"
                className="w-full px-3 py-2 rounded-lg bg-muted text-foreground placeholder:text-muted-foreground outline-none text-sm border border-border focus:border-primary/50 transition-colors"
              />
              <input
                value={category} onChange={e => setCategory(e.target.value)}
                placeholder="Category (e.g., Health, Fitness)"
                className="w-full px-3 py-2 rounded-lg bg-muted text-foreground placeholder:text-muted-foreground outline-none text-sm border border-border focus:border-primary/50 transition-colors"
              />

              <div>
                <label className="text-xs text-muted-foreground mb-1 block font-mono">Type</label>
                <div className="flex gap-2">
                  {(['boolean', 'quantitative', 'duration'] as TaskType[]).map(t => (
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-mono transition-colors ${type === t ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1 block font-mono">Priority</label>
                <div className="flex gap-2">
                  {(['low', 'medium', 'high', 'critical'] as TaskPriority[]).map(p => (
                    <button
                      key={p}
                      onClick={() => setPriority(p)}
                      className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-mono transition-colors ${priority === p ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {type !== 'boolean' && (
                <div className="flex gap-2">
                  <input
                    value={target} onChange={e => setTarget(e.target.value)}
                    placeholder={type === 'duration' ? 'Seconds (e.g., 900)' : 'Target (e.g., 8)'}
                    type="number"
                    className="flex-1 px-3 py-2 rounded-lg bg-muted text-foreground placeholder:text-muted-foreground outline-none text-sm border border-border focus:border-primary/50 transition-colors"
                  />
                  <input
                    value={unit} onChange={e => setUnit(e.target.value)}
                    placeholder="Unit (e.g., glasses)"
                    className="flex-1 px-3 py-2 rounded-lg bg-muted text-foreground placeholder:text-muted-foreground outline-none text-sm border border-border focus:border-primary/50 transition-colors"
                  />
                </div>
              )}

              <div className="border-t border-border/50 pt-3">
                <label className="text-xs text-muted-foreground mb-1 block font-mono">Implementation Intention (optional)</label>
                <div className="flex gap-2">
                  <input
                    value={ifText} onChange={e => setIfText(e.target.value)}
                    placeholder="If..."
                    className="flex-1 px-3 py-2 rounded-lg bg-muted text-foreground placeholder:text-muted-foreground outline-none text-sm border border-border focus:border-primary/50 transition-colors"
                  />
                  <input
                    value={thenText} onChange={e => setThenText(e.target.value)}
                    placeholder="Then I will..."
                    className="flex-1 px-1 py-2 rounded-lg bg-muted text-foreground placeholder:text-muted-foreground outline-none text-sm border border-border focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!name.trim() || !category.trim()}
                className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm disabled:opacity-40 hover:shadow-lg hover:shadow-primary/20 transition-all"
              >
                Add Task
              </button>
            </div>
          </div>
          </motion.div>
        </div>
      </>
      )}
    </AnimatePresence>
  );
};

export default AddTaskDialog;