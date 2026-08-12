import { motion } from "framer-motion";
import { Lock, Play, CheckCircle2, Circle } from "lucide-react";
import { ArchetypeData } from "@/lib/hero-content";

interface ArchetypeCardProps {
  archetype: ArchetypeData;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  progress: number;
  onClick: () => void;
}

export function ArchetypeCard({ archetype, status, progress, onClick }: ArchetypeCardProps) {
  const isLocked = status === 'locked';
  
  return (
    <motion.div
      whileHover={!isLocked ? { y: -5 } : {}}
      onClick={!isLocked ? onClick : undefined}
      className={`relative overflow-hidden rounded-3xl border transition-all ${
        isLocked ? 'border-border/50 opacity-50' : 'border-border cursor-pointer hover:border-gold/50 shadow-elevated'
      } glass p-6`}
    >
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-elevated text-2xl">
          {isLocked ? <Lock className="h-5 w-5 text-muted-foreground" /> : archetype.symbol}
        </div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
          {archetype.phase}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-display text-xl text-foreground">{archetype.name}</h3>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{archetype.subtitle}</p>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-widest">
          <span className="text-muted-foreground">Progresso</span>
          <span className="text-foreground">{progress}%</span>
        </div>
        <div className="h-1 w-full rounded-full bg-surface-elevated">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full rounded-full bg-gradient-gold"
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {status === 'completed' ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          ) : status === 'in_progress' ? (
            <Circle className="h-4 w-4 text-gold animate-pulse" />
          ) : (
            <Circle className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
            {status === 'completed' ? 'Concluído' : status === 'in_progress' ? 'Em Jornada' : status === 'available' ? 'Disponível' : 'Bloqueado'}
          </span>
        </div>
        {!isLocked && (
          <div className="rounded-full bg-surface-elevated p-2 text-foreground">
            <Play className="h-3 w-3 fill-current" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
