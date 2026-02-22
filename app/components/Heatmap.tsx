"use client"
import { useMemo } from 'react';
import { useRoutineStore } from '@/app/store/useRoutineStore';

const Heatmap = () => {
  const history = useRoutineStore(s => s.history);

  const cells = useMemo(() => {
    const today = new Date();
    const days: { date: string; score: number }[] = [];
    
    for (let i = 83; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const record = history.find((h:any) => h.date === dateStr);
      days.push({ date: dateStr, score: record?.score ?? -1 });
    }
    return days;
  }, [history]);

  const getColor = (score: number) => {
    if (score < 0) return 'bg-muted/30';
    if (score === 0) return 'bg-muted';
    if (score < 30) return 'bg-destructive/40';
    if (score < 50) return 'bg-warning/30';
    if (score < 70) return 'bg-primary/40';
    if (score < 90) return 'bg-primary/70';
    return 'bg-success';
  };

  return (
    <div className="glass-card p-4">
      <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-mono">
        Identity Heatmap — Who You Are Becoming
      </h3>
      <div className="grid grid-cols-12 gap-1">
        {cells.map(cell => (
          <div
            key={cell.date}
            className={`heatmap-cell aspect-square ${getColor(cell.score)}`}
            title={`${cell.date}: ${cell.score >= 0 ? cell.score + '%' : 'No data'}`}
          />
        ))}
      </div>
      <div className="flex items-center justify-end gap-1 mt-2">
        <span className="text-[9px] text-muted-foreground mr-1">Less</span>
        {['bg-muted', 'bg-destructive/40', 'bg-warning/30', 'bg-primary/40', 'bg-primary/70', 'bg-success'].map((c, i) => (
          <div key={i} className={`w-2.5 h-2.5 rounded-sm ${c}`} />
        ))}
        <span className="text-[9px] text-muted-foreground ml-1">More</span>
      </div>
    </div>
  );
};

export default Heatmap;
