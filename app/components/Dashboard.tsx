"use client"
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, TrendingDown, AlertTriangle } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useRoutineStore } from '@/app/store/useRoutineStore';
import ScoreRing from '@/app/components/ScoreRing';
import TaskCard from '@/app/components/TaskCard';
import Heatmap from '@/app/components/Heatmap';
import CommandPalette from '@/app/components/CommandPalette';
import { Dialogbox } from './dialogbox';
import { useState } from 'react';

const Dashboard = () => {
  const params = useParams();
  const userId = params.userId as string;
  const { templates, getTodayInstances, getDailyScore, currentStreak, longestStreak, shouldScaleDown, freshStart, endDay } = useRoutineStore();
  const todayTasks = getTodayInstances();
  const score = getDailyScore();
  const completedCount = todayTasks.filter((t:any) => t.completed).length;
  const [isEndingDay, setIsEndingDay] = useState(false);

  const handleEndDay = async () => {
    setIsEndingDay(true);
    try {
      // Get current state
      const date = new Date().toISOString().split('T')[0];
      const score = getDailyScore();
      const todayTasks = getTodayInstances();
      const completed = todayTasks.filter((t:any) => t.completed).length;

      // Call local endDay to update state
       endDay();

      // Save to database via API
      const response = await fetch('/api/endDay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date,
          score,
          tasksCompleted: completed,
          totalTasks: todayTasks.length,
          userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to save to database:', errorData.error);
      }
    } catch (error) {
      console.error('Failed to end day:', error);
    } finally {
      setIsEndingDay(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <CommandPalette />
      

      {/* Header or buttonsbar*/}
      <header className="border-b border-border/50 backdrop-blur-xl bg-background/80 sticky 
      top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-primary" />
            <span className="font-bold text-foreground">Flow State</span>
          </div>
          <div className="flex items-center gap-3">
            <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground 
            font-mono hidden sm:inline">⌘</kbd>

            <Dialogbox/>
            <button
            onClick={freshStart}
            className="px-2 py-2 rounded-xl bg-muted flex self-end text-muted-foreground hover:text-destructive transition-colors"
            title="Fresh Start Protocol"
          >
            {/* <RotateCcw className="w-4 h-4" /> */}
            Reset
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
            onClick={handleEndDay}
            disabled={isEndingDay}
            className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground 
            font-medium text-sm hover:shadow-lg hover:shadow-primary/20 transition-all 
            disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEndingDay ? "Saving..." : "End Day & Save Score"}
          </button>
          
        </div>
      </main>
    </div>
  );
};

const StatBlock = ({ label, value, icon }:
   { label: string; value: number; icon: React.ReactNode }) => (
  <div className="glass-card px-3 py-2 flex items-center gap-2">
    {icon}
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-mono font-bold text-foreground">{value}</p>
    </div>
  </div>
);

export default Dashboard;
