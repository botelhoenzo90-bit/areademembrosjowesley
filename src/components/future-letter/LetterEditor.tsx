import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Shield } from "lucide-react";

interface StageProps {
  onNext: (data: any) => void;
  onBack: () => void;
  initialData?: string;
}

const SUGGESTIONS = [
  "Como espero estar vivendo...",
  "O que desejo ter aprendido...",
  "Quais hábitos quero ter desenvolvido...",
  "Como desejo cuidar das pessoas que amo...",
  "Quais medos espero ter superado...",
  "Que tipo de pessoa desejo ser...",
  "O que quero agradecer ao meu eu do futuro..."
];

export function LetterEditor({ onNext, onBack, initialData }: StageProps) {
  const [content, setContent] = useState(initialData || "");
  const [wordCount, setWordCount] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    setWordCount(content.trim() ? content.trim().split(/\s+/).length : 0);
  }, [content]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 text-left"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display text-gold">Etapa 4: Escrevendo sua Carta</h2>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>{wordCount} palavras</span>
          {lastSaved && (
            <span className="flex items-center gap-1">
              <Save className="w-3 h-3" /> Salvo {lastSaved.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      <div className="relative group">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder=""
          className="min-h-[500px] bg-white/5 border-white/10 rounded-2xl p-8 text-lg focus:ring-gold/50 resize-none leading-relaxed"
        />
        
        {content.length === 0 && (
          <div className="absolute inset-8 pointer-events-none space-y-4 opacity-40">
            {SUGGESTIONS.map((s, i) => (
              <p key={i} className="text-lg italic">{s}</p>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-3 text-sm text-gold/80 italic">
        <Shield className="w-4 h-4 shrink-0" />
        Sua carta é protegida por criptografia e só poderá ser aberta na data escolhida.
      </div>

      <div className="flex justify-between items-center pt-4">
        <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/10">
          Voltar
        </Button>
        <Button 
          onClick={() => onNext({ content })}
          disabled={!content.trim()}
          size="lg"
          className="bg-gold text-black hover:bg-gold/90 px-12 py-6 rounded-full text-lg font-bold shadow-glow"
        >
          Selar Cápsula do Tempo
        </Button>
      </div>
    </motion.div>
  );
}
