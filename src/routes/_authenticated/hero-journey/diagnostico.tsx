import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Brain, ChevronRight, 
  Sparkles, Shield, Target, Zap 
} from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { saveDiagnosis } from "@/lib/hero-journey.functions";
import { ARCHETYPES_CONTENT } from "@/lib/hero-content";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/hero-journey/diagnostico")({
  component: DiagnosisPage,
});

const DIAGNOSIS_QUESTIONS = [
  {
    id: 1,
    question: "Em uma situação de crise inesperada, sua primeira tendência é:",
    options: [
      { label: "Manter o otimismo e acreditar que passará.", archetype: "inocente" },
      { label: "Sentir-se injustiçado ou sozinho no problema.", archetype: "orfao" },
      { label: "Tomar as rédeas e lutar contra a dificuldade.", archetype: "guerreiro" },
      { label: "Cuidar para que as outras pessoas fiquem bem.", archetype: "altruista" },
      { label: "Buscar uma nova alternativa ou caminho.", archetype: "nomade" },
      { label: "Tentar entender o aprendizado oculto na crise.", archetype: "mago" },
    ]
  },
  {
    id: 2,
    question: "O que mais te motiva a seguir em frente?",
    options: [
      { label: "A busca pela paz e segurança.", archetype: "inocente" },
      { label: "O desejo de pertencer e ser compreendido.", archetype: "orfao" },
      { label: "A vontade de vencer e ter sucesso.", archetype: "guerreiro" },
      { label: "O propósito de ajudar e ser útil.", archetype: "altruista" },
      { label: "A necessidade de liberdade e descoberta.", archetype: "nomade" },
      { label: "A capacidade de transformar minha realidade.", archetype: "mago" },
    ]
  }
];

function DiagnosisPage() {
  const navigate = useNavigate();
  const saveDiag = useServerFn(saveDiagnosis);
  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  const handleAnswer = (archetype: string) => {
    setScores(prev => ({ ...prev, [archetype]: (prev[archetype] || 0) + 1 }));
    
    if (currentStep < DIAGNOSIS_QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      finishDiagnosis();
    }
  };

  const finishDiagnosis = async () => {
    setLoading(true);
    try {
      // Find archetype with max score
      let predominant = "inocente";
      let maxScore = -1;
      for (const [arch, score] of Object.entries(scores)) {
        if (score > maxScore) {
          maxScore = score;
          predominant = arch;
        }
      }

      await saveDiag({ 
        data: {
          predominant_archetype: predominant,
          details: { scores }
        }
      });
      
      toast.success("Diagnóstico concluído!");
      navigate({ to: "/hero-journey/resultado" });
    } catch (err) {
      toast.error("Erro ao salvar diagnóstico.");
    } finally {
      setLoading(false);
    }
  };

  const question = DIAGNOSIS_QUESTIONS[currentStep];

  return (
    <main className="relative min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between p-4 glass">
        <Link to="/reprogramacao-mental" className="rounded-full p-2 text-foreground hover:bg-surface-elevated">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="font-display text-lg uppercase">Diagnóstico</h1>
        <div className="w-8" />
      </header>

      <div className="pt-24 px-6 max-w-xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <Brain className="h-10 w-10 mx-auto text-gold animate-pulse" />
          <h2 className="font-display text-2xl uppercase tracking-tighter">Descubra seu Herói Interior</h2>
          <div className="h-1 w-full bg-surface-elevated rounded-full overflow-hidden">
             <motion.div 
               animate={{ width: `${((currentStep + 1) / DIAGNOSIS_QUESTIONS.length) * 100}%` }}
               className="h-full bg-gradient-gold"
             />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <p className="text-xl text-foreground text-center">{question.question}</p>
            <div className="grid gap-3">
              {question.options.map((opt, idx) => (
                <button
                  key={idx}
                  disabled={loading}
                  onClick={() => handleAnswer(opt.archetype)}
                  className="w-full text-left rounded-2xl border border-border glass p-5 transition-all hover:border-gold/50 hover:bg-gold/5 active:scale-[0.98] group flex items-center justify-between"
                >
                  <span className="text-sm">{opt.label}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-gold" />
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}