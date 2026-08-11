import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

interface StageProps {
  onNext: (data: any) => void;
  initialData?: string;
}

export function RealityToday({ onNext, initialData }: StageProps) {
  const [text, setText] = useState(initialData || "");

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 text-left"
    >
      <div className="space-y-4">
        <h2 className="text-3xl font-display text-gold">Etapa 1: Onde você está hoje?</h2>
        <p className="text-muted-foreground leading-relaxed text-lg">
          Reconhecer sua realidade atual é o primeiro passo para a mudança. Seja honesto consigo mesmo sobre este momento.
        </p>
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-sm text-muted-foreground space-y-2">
          <p>• Como está sua vida atualmente?</p>
          <p>• Quais dificuldades você enfrenta?</p>
          <p>• Quais emoções predominam no seu dia a dia?</p>
          <p>• Quais hábitos você deseja abandonar?</p>
          <p>• O que você mais deseja transformar agora?</p>
        </div>
      </div>

      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Descreva sua realidade atual aqui..."
        className="min-h-[300px] bg-white/5 border-white/10 rounded-2xl p-6 text-lg focus:ring-gold/50"
      />

      <div className="flex justify-end">
        <Button 
          onClick={() => onNext({ reality_today: text })}
          disabled={!text.trim()}
          size="lg"
          className="bg-gold text-black hover:bg-gold/90 px-8 py-6 rounded-full text-lg font-bold"
        >
          Próxima Etapa
        </Button>
      </div>
    </motion.div>
  );
}
