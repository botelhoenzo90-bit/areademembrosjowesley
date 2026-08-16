import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, ChevronRight, Info, Eye, Zap, 
  Target, Shield, CheckCircle2, Award, 
  Sparkles, Heart, Compass, BookOpen, HelpCircle
} from "lucide-react";
import { ARCHETYPES_CONTENT } from "@/lib/hero-content";
import { updateArchetypeProgress, getArchetypes, saveQuizResponses, updateProtocol } from "@/lib/hero-journey.functions";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type Stage = 'discover' | 'mentorship' | 'understand' | 'quiz' | 'observe' | 'experiment' | 'implement' | 'conclude';

export const Route = createFileRoute("/_authenticated/hero-journey/archetype/$id")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData({
      queryKey: ['hero_journey_archetypes'],
      queryFn: () => getArchetypes(),
    });
  },
  component: ArchetypeJourneyPage,
});

function ArchetypeJourneyPage() {
  const { id } = useParams({ from: "/_authenticated/hero-journey/archetype/$id" });
  const archetype = ARCHETYPES_CONTENT[id as string];
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const updateProgress = useServerFn(updateArchetypeProgress);
  const submitQuiz = useServerFn(saveQuizResponses);

  const { data: userArchetypes = [] } = useQuery({
    queryKey: ['hero_journey_archetypes'],
    queryFn: () => getArchetypes(),
  });

  const currentArchData = (userArchetypes as any[]).find((a: any) => a.archetype === id);
  const [stage, setStage] = useState<Stage>('discover');
  const [reflectionText, setReflectionText] = useState("");
  const [protocolSteps, setProtocolSteps] = useState<number[]>([]);
  const [selectedPerception, setSelectedPerception] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentQuizStep, setCurrentQuizStep] = useState(0);
  const [quizResponses, setQuizResponses] = useState<{question_index: number, answer_index: number, score: number}[]>([]);

  useEffect(() => {
    if (currentArchData) {
      if (currentArchData.status === 'completed') setStage('conclude');
      setReflectionText(currentArchData.reflection_text || "");
      setProtocolSteps(currentArchData.protocol_steps_completed || []);
    }
  }, [currentArchData]);

  if (!archetype) return <div>Arquétipo não encontrado.</div>;

  const handleNext = async () => {
    const stages: Stage[] = ['discover', 'mentorship', 'understand', 'quiz', 'observe', 'experiment', 'implement', 'conclude'];
    const currentIndex = stages.indexOf(stage);
    
    if (currentIndex < stages.length - 1) {
      const nextStage = stages[currentIndex + 1];
      setStage(nextStage);
      const progress = Math.round(((currentIndex + 1) / (stages.length - 1)) * 100);
      await updateProgress({ 
        data: { archetype: id as any, progress, status: (progress === 100 ? 'completed' : 'in_progress') as any }
      });
      queryClient.invalidateQueries({ queryKey: ['hero_journey_archetypes'] });
    } else {
      navigate({ to: "/reprogramacao-mental" });
    }
  };

  return (
    <main className="relative min-h-screen bg-background pb-24">
      <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between p-4 glass">
        <Link to="/reprogramacao-mental" className="rounded-full p-2 text-foreground hover:bg-surface-elevated">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-widest text-gold">{archetype.phase}</span>
          <h1 className="font-display text-lg uppercase">{archetype.name}</h1>
        </div>
        <div className="w-8" />
      </header>

      <div className="pt-24 px-6 max-w-2xl mx-auto flex flex-col min-h-[calc(100vh-6rem)]">
        <div className="flex-1">
          <AnimatePresence mode="wait">
             {stage === 'discover' && (
                <motion.div key="discover" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-20 h-20 rounded-3xl bg-surface-elevated flex items-center justify-center text-4xl shadow-glow">
                      {archetype.symbol}
                    </div>
                    <h2 className="font-display text-3xl uppercase">Quem é {archetype.name}?</h2>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {['Essência', 'Objetivo', 'Força', 'Necessidade', 'Sombra', 'Ilusão'].map(cat => (
                      <button key={cat} onClick={() => setSelectedCategory(cat.toLowerCase())} className="rounded-2xl border border-border glass p-4 text-left">
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{cat}</span>
                        <p className="text-sm font-medium">{archetype[cat.toLowerCase() as keyof typeof archetype] as string}</p>
                      </button>
                    ))}
                  </div>
                </motion.div>
             )}
             {stage === 'conclude' && (
                <motion.div key="conclude" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 text-center pt-12">
                   <div className="relative mx-auto w-32 h-32">
                     <div className="absolute inset-0 rounded-full border-2 border-dashed border-gold/30 animate-spin-slow" />
                     <div className="absolute inset-2 rounded-full bg-gradient-primary flex items-center justify-center">
                       <Award className="h-12 w-12 text-primary-foreground" />
                     </div>
                   </div>
                   <h2 className="font-display text-3xl uppercase">Arquétipo Concluído</h2>
                   <div className="rounded-3xl border border-border glass p-8 text-sm text-left whitespace-pre-line text-muted-foreground">
                     {archetype.gamificationText}
                   </div>
                </motion.div>
             )}
          </AnimatePresence>
        </div>

        <div className="mt-12">
          <button onClick={handleNext} className="w-full rounded-full bg-foreground py-4 text-sm font-bold text-background uppercase tracking-[0.2em] hover:brightness-110 active:scale-95">
            {stage === 'conclude' ? 'Voltar ao Mapa' : 'Continuar Jornada'}
          </button>
        </div>
      </div>
    </main>
  );
}