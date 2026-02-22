"use client"
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Heart, ArrowRight, Flame } from 'lucide-react';
import { useRoutineStore } from '@/app/store/useRoutineStore';

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const { completeOnboarding } = useRoutineStore();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-primary/10 flex items-center justify-center glow-primary"
            >
              <Flame className="w-10 h-10 text-primary" />
            </motion.div>
            <h1 className="text-4xl font-bold mb-4 text-foreground">
              Routine <span className="text-gradient-primary">Evaluator</span>
            </h1>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              A psychology-driven system to evaluate, track, and optimize your daily identity. 
              Not just what you do — who you're becoming.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium transition-all hover:shadow-lg hover:shadow-primary/20"
            >
              Begin Assessment <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="persona"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg w-full"
          >
            <h2 className="text-2xl font-bold text-center mb-2 text-foreground">Select Your Mode</h2>
            <p className="text-muted-foreground text-center mb-8 text-sm">
              This calibrates difficulty, task density, and feedback intensity.
            </p>

            <div className="grid gap-4">
              <PersonaCard
                icon={<Zap className="w-6 h-6" />}
                title="High Achiever"
                description="6 tasks, aggressive targets, full dopamine feedback. You thrive under pressure and want to push limits."
                features={['Morning workout', 'Deep work blocks', '8 glasses water', 'Reading', 'Meditation', 'Journaling']}
                onClick={() => completeOnboarding('high-achiever')}
              />
              <PersonaCard
                icon={<Heart className="w-6 h-6" />}
                title="Burnout Recovery"
                description="4 gentle tasks, lower targets, compassionate pacing. Rebuilding momentum without burning out again."
                features={['Gentle walk', 'Hydration', 'Screen-free hour', 'Gratitude note']}
                onClick={() => completeOnboarding('burnout-recovery')}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PersonaCard = ({
  icon,
  title,
  description,
  features,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  onClick: () => void;
}) => (
  <motion.button
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.99 }}
    onClick={onClick}
    className="glass-card-hover p-6 text-left w-full"
  >
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-3">{description}</p>
        <div className="flex flex-wrap gap-1.5">
          {features.map(f => (
            <span key={f} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-mono">
              {f}
            </span>
          ))}
        </div>
      </div>
      <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0 mt-1" />
    </div>
  </motion.button>
);

export default Onboarding;
