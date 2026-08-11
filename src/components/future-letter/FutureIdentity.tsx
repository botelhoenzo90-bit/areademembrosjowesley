import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

interface StageProps {
  onNext: (data: any) => void;
  onBack: () => void;
  initialData?: string;
}

export function FutureIdentity({ onNext, onBack, initialData }: StageProps) {
  const [text, setText] = useState(initialData || "");

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 text-left"
    >
      <div className="space-y-4">
        <h2 className="text-3xl font-display text-gold">Etapa 2: Quem você deseja se tornar?</h2>
        <p className="text-muted-foreground leading-relaxed text-lg">
          Visualize a pessoa que você será. As metas mudam, mas a sua identidade é o que permanece.
        </p>
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-sm text-muted-foreground space-y-2">
          <p>• Como você deseja pensar e agir?</p>
          <p>• Como deseja tratar sua família e as pessoas ao seu redor?</p>
          <p>• Como lidará com suas finanças e saúde?</p>
          <p>• Qual legado você deseja deixar no mundo?</p>
        </div>
      </div>

      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Descreva quem você deseja se tornar..."
        className="min-h-[300px] bg-white/5 border-white/10 rounded-2xl p-6 text-lg focus:ring-gold/50"
      />

      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/10">
          Voltar
        </Button>
        <Button 
          onClick={() => onNext({ future_identity: text })}
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
