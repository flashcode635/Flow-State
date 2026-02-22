"use client"
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, TrendingDown, AlertTriangle, RotateCcw, Plus, Command } from 'lucide-react';
import { useRoutineStore } from '@/app/store/useRoutineStore';
import ScoreRing from '@/app/components/ScoreRing';
import TaskCard from '@/app/components/TaskCard';
import Heatmap from '@/app/components/Heatmap';
import CommandPalette from '@/app/components/CommandPalette';
import AddTaskDialog from '@/app/components/AddTaskDialog';
import { useState } from 'react';

const Dashboard = () => {
  const { templates, getTodayInstances, getDailyScore, currentStreak, longestStreak, shouldScaleDown, freshStart, endDay } = useRoutineStore();
  const todayTasks = getTodayInstances();
  const score = getDailyScore();
  const completedCount = todayTasks.filter((t:any) => t.completed).length;
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <CommandPalette />
      <AddTaskDialog open={addOpen} onOpenChange={setAddOpen} />

      {/* Header or buttonsbar*/}
      <header className="border-b border-border/50 backdrop-blur-xl bg-background/80 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-primary" />
            <span className="font-bold text-foreground">Routine Evaluator</span>
          </div>
          <div className="flex items-center gap-3">
            <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono hidden sm:inline">⌘K</kbd>
            <button
              onClick={() => setAddOpen(true)}
              className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
            onClick={freshStart}
            className="px-2 py-2 rounded-xl bg-muted flex self-end text-muted-foreground hover:text-destructive transition-colors"
            title="Fresh Start Protocol"
          >
            {/* <RotateCcw className="w-4 h-4" /> */}
            Sign Out
          </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Scale Down Warning */}
        <AnimatePresence>
          {shouldScaleDown() && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-card border-warning/30 p-4 flex items-start gap-3"
            >
              <AlertTriangle className="w-5 h-5 text-warning  shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">3+ days below threshold</p>
                <p className="text-xs text-muted-foreground mt-1">Consider scaling down. Momentum matters more than perfection.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Score + Stats */}
        <div className="flex items-center gap-6">
          <ScoreRing score={score} />
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono">Today's Progress</p>
              <p className="text-2xl font-bold text-foreground">
                {completedCount}<span className="text-muted-foreground text-base">/{templates.length}</span>
              </p>
            </div>
            <div className="flex gap-4">
              <StatBlock label="Streak" value={currentStreak} icon={<Flame className="w-3 h-3 text-primary" />} />
              <StatBlock label="Best" value={longestStreak} icon={<TrendingDown className="w-3 h-3 text-success rotate-180" />} />
            </div>
          </div>
        </div>

        {/* Tasks */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-mono">Daily Tasks</h2>
          </div>
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {todayTasks.map((task:any) => (
                <TaskCard key={task.template.id} template={task.template} instance={task} />
              ))}
            </AnimatePresence>
          </div>
          {templates.length === 0 && (
            <div className="glass-card p-8 text-center">
              <p className="text-muted-foreground text-sm">No tasks yet. Add your first routine.</p>
            </div>
          )}
        </section>

        {/* Heatmap */}
        <Heatmap />

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={endDay}
            className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:shadow-lg hover:shadow-primary/20 transition-all"
          >
            End Day & Save Score
          </button>
          
        </div>
      </main>
    </div>
  );
};

const StatBlock = ({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) => (
  <div className="glass-card px-3 py-2 flex items-center gap-2">
    {icon}
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-mono font-bold text-foreground">{value}</p>
    </div>
  </div>
);

export default Dashboard;
