import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface StageProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

export function TimeLineStep({ onNext, onBack }: StageProps) {
  const [period, setPeriod] = useState<string>("1 ano");
  
  const now = new Date();
  
  const getUnlockDate = (p: string) => {
    const d = new Date();
    if (p === "6 meses") d.setMonth(d.getMonth() + 6);
    else if (p === "1 ano") d.setFullYear(d.getFullYear() + 1);
    else if (p === "2 anos") d.setFullYear(d.getFullYear() + 2);
    else if (p === "3 anos") d.setFullYear(d.getFullYear() + 3);
    else if (p === "5 anos") d.setFullYear(d.getFullYear() + 5);
    return d;
  };

  const unlockDate = getUnlockDate(period);

  const options = ["6 meses", "1 ano", "2 anos", "3 anos", "5 anos"];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 text-center"
    >
      <div className="space-y-4">
        <h2 className="text-3xl font-display text-gold">Etapa 3: Sua Linha do Tempo</h2>
        <p className="text-muted-foreground text-lg">
          Defina quando esta cápsula do tempo será aberta.
        </p>
      </div>

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 max-w-2xl mx-auto py-8">
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
            <Calendar className="text-gold" />
          </div>
          <span className="text-sm font-bold">Hoje</span>
          <span className="text-xs text-muted-foreground">{format(now, "dd/MM/yyyy")}</span>
        </div>

        <div className="flex-1 h-px bg-gradient-to-r from-gold/50 to-transparent hidden md:block" />
        <ArrowRight className="text-gold/50 md:hidden" />

        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center border border-gold/50 shadow-glow">
            <Clock className="text-gold w-8 h-8" />
          </div>
          <span className="text-sm font-bold text-gold">Sua Jornada</span>
        </div>

        <div className="flex-1 h-px bg-gradient-to-l from-gold/50 to-transparent hidden md:block" />
        <ArrowRight className="text-gold/50 md:hidden" />

        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
            <Calendar className="text-gold" />
          </div>
          <span className="text-sm font-bold">Abertura</span>
          <span className="text-xs text-muted-foreground">{format(unlockDate, "dd/MM/yyyy")}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => setPeriod(opt)}
            className={`px-4 py-3 rounded-xl border transition-all ${
              period === opt 
                ? "bg-gold text-black border-gold font-bold" 
                : "bg-white/5 border-white/10 hover:bg-white/10 text-muted-foreground"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center pt-8">
        <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/10">
          Voltar
        </Button>
        <Button 
          onClick={() => onNext({ unlock_date: unlockDate.toISOString() })}
          size="lg"
          className="bg-gold text-black hover:bg-gold/90 px-8 py-6 rounded-full text-lg font-bold"
        >
          Confirmar e Escrever
        </Button>
      </div>
    </motion.div>
  );
}
