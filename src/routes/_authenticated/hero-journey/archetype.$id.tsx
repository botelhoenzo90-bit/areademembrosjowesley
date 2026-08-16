import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, ChevronRight, Eye, Zap, 
  Target, Shield, CheckCircle2, Award, 
  Sparkles, BookOpen, HelpCircle
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
  const updateProto = useServerFn(updateProtocol);

  const { data: userArchetypes = [] } = useQuery({
    queryKey: ['hero_journey_archetypes'],
    queryFn: () => getArchetypes(),
  });

  const currentArchData = (userArchetypes as any[]).find((a: any) => a.archetype === id);
  const [stage, setStage] = useState<Stage>('discover');
  const [reflectionText, setReflectionText] = useState("");
  const [protocolSteps, setProtocolSteps] = useState<number[]>([]);
  const [selectedPerception, setSelectedPerception] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'essence' | 'objective' | 'strength' | 'need' | 'shadow' | 'illusion' | null>(null);
  const [currentQuizStep, setCurrentQuizStep] = useState(0);
  const [quizResponses, setQuizResponses] = useState<{question_index: number, answer_index: number, score: number}[]>([]);

  useEffect(() => {
    if (currentArchData) {
      if (currentArchData.status === 'completed') setStage('conclude');
      // If we're not at the start, try to determine stage from progress
      else if (currentArchData.progress > 0 && stage === 'discover') {
        const stages: Stage[] = ['discover', 'mentorship', 'understand', 'quiz', 'observe', 'experiment', 'implement', 'conclude'];
        const calculatedIndex = Math.floor((currentArchData.progress / 100) * (stages.length - 1));
        setStage(stages[calculatedIndex] || 'discover');
      }
      
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
      
      // Save specific data based on the current stage before moving forward
      if (stage === 'experiment') {
        try {
          await updateProgress({ 
            data: { 
              archetype: id as any, 
              reflection_text: reflectionText 
            } 
          });
          toast.success("Reflexão salva com sucesso!");
        } catch (error) {
          console.error("Erro ao salvar reflexão:", error);
          toast.error("Erro ao salvar reflexão. Tente novamente.");
          return; // Stop progression if save fails
        }
      }

      setStage(nextStage);
      
      // Ensure we save progress on every step
      const progress = Math.round(((currentIndex + 1) / (stages.length - 1)) * 100);
      try {
        await updateProgress({ 
          data: { 
            archetype: id as any, 
            progress: Math.min(progress, 100), 
            status: (progress >= 100 ? 'completed' : 'in_progress') as any 
          }
        });
      } catch (error) {
        console.error("Erro ao atualizar progresso:", error);
      }
      
      queryClient.invalidateQueries({ queryKey: ['hero_journey_archetypes'] });
      queryClient.invalidateQueries({ queryKey: ['hero_journey_stats'] });
    } else {
      navigate({ to: "/reprogramacao-mental" });
    }
  };

  return (
    <main className="relative min-h-screen bg-background pb-24 text-foreground">
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
                  {[
                    { label: 'Essência', key: 'essence' },
                    { label: 'Objetivo', key: 'objective' },
                    { label: 'Força', key: 'strength' },
                    { label: 'Necessidade', key: 'need' },
                    { label: 'Sombra', key: 'shadow' },
                    { label: 'Ilusão', key: 'illusion' }
                  ].map(cat => (
                    <button key={cat.label} onClick={() => setSelectedCategory(cat.key as any)} className="rounded-2xl border border-border glass p-4 text-left hover:border-gold/50 transition-all">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{cat.label}</span>
                      <p className="text-sm font-medium leading-tight mt-1">{archetype[cat.key as keyof typeof archetype] as string}</p>
                    </button>
                  ))}
                </div>
                <div className="rounded-2xl border border-gold/30 bg-gold/5 p-6 text-center italic">
                  <p className="text-gold text-[10px] uppercase tracking-widest mb-2">Pergunta Central</p>
                  <p className="text-xl font-display">"{archetype.question}"</p>
                </div>
              </motion.div>
            )}

            {stage === 'mentorship' && (
              <motion.div key="mentorship" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="text-center space-y-4">
                  <BookOpen className="mx-auto h-12 w-12 text-gold" />
                  <h2 className="font-display text-2xl uppercase tracking-tight">Mini Mentoria</h2>
                </div>
                <div className="rounded-3xl border border-border glass p-8 text-sm leading-relaxed text-muted-foreground whitespace-pre-line relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gold/30" />
                  {archetype.mentorship}
                </div>
              </motion.div>
            )}

            {stage === 'understand' && (
              <motion.div key="understand" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <h2 className="font-display text-2xl text-center uppercase tracking-tight">O Arquétipo em sua vida</h2>
                <div className="grid gap-4">
                  {Object.entries(archetype.categories).map(([key, items]) => (
                    <div key={key} className="rounded-2xl border border-border glass p-6 space-y-3">
                      <h3 className="text-[10px] uppercase tracking-widest text-gold font-bold">
                        {key === 'thoughts' ? 'Pensamentos' : key === 'emotions' ? 'Emoções' : key === 'behaviors' ? 'Comportamentos' : key === 'relationships' ? 'Relacionamentos' : key === 'decisions' ? 'Decisões' : 'Identidade'}
                      </h3>
                      <ul className="space-y-2">
                        {(items as string[]).map((item, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-gold/50 mt-1.5 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {stage === 'quiz' && (
              <motion.div key="quiz" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="text-center space-y-2">
                  <HelpCircle className="mx-auto h-12 w-12 text-gold" />
                  <h2 className="font-display text-2xl uppercase tracking-tight">Quiz do Herói</h2>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Pergunta {currentQuizStep + 1} de {archetype.quiz.length}</p>
                </div>
                <div className="space-y-6">
                  <p className="text-lg text-center">{archetype.quiz[currentQuizStep].question}</p>
                  <div className="grid gap-3">
                    {archetype.quiz[currentQuizStep].options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={async () => {
                          const newResponses = [...quizResponses, { question_index: currentQuizStep, answer_index: idx, score: opt.score }];
                          setQuizResponses(newResponses);
                          if (currentQuizStep < archetype.quiz.length - 1) {
                            setCurrentQuizStep(prev => prev + 1);
                          } else {
                            await submitQuiz({ data: { archetype: id as any, responses: newResponses } });
                            handleNext();
                          }
                        }}
                        className="w-full text-left rounded-2xl border border-border glass p-5 text-sm hover:border-gold/50 transition-all"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {stage === 'observe' && (
              <motion.div key="observe" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <h2 className="font-display text-2xl text-center uppercase tracking-tight">Você se reconhece?</h2>
                <div className="space-y-8">
                  {archetype.selfPerceptionQuestions.map((q, qIdx) => (
                    <div key={qIdx} className="space-y-4">
                      <p className="text-lg text-center">{q.question}</p>
                      <div className="grid gap-3">
                        {q.options.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            onClick={() => setSelectedPerception(oIdx)}
                            className={`w-full text-left rounded-2xl border p-5 transition-all ${selectedPerception === oIdx ? 'border-gold bg-gold/10' : 'border-border glass'}`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {stage === 'experiment' && (
              <motion.div key="experiment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="text-center space-y-4">
                  <Eye className="h-12 w-12 mx-auto text-gold" />
                  <h2 className="font-display text-2xl uppercase tracking-tight">Olhe para Dentro</h2>
                </div>
                <div className="space-y-6">
                  <p className="text-lg text-center">{archetype.reflectionQuestion}</p>
                  <textarea
                    value={reflectionText}
                    onChange={(e) => setReflectionText(e.target.value)}
                    placeholder="Sua reflexão..."
                    className="w-full h-48 rounded-3xl border border-border glass p-6 text-sm outline-none focus:border-gold/50 resize-none bg-surface"
                  />
                  <button onClick={async () => {
                    await updateProgress({ data: { archetype: id as any, reflection_text: reflectionText } });
                    toast.success("Reflexão salva!");
                  }} className="w-full py-4 rounded-full border border-gold/30 text-[10px] uppercase tracking-widest text-gold">
                    Salvar Reflexão
                  </button>
                </div>
              </motion.div>
            )}

            {stage === 'implement' && (
              <motion.div key="implement" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="rounded-3xl border border-border glass p-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <Target className="h-6 w-6 text-gold" />
                    <h3 className="font-display text-xl uppercase">Sua Missão</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{archetype.mission}</p>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Shield className="h-6 w-6 text-gold" />
                    <h3 className="font-display text-xl uppercase">Protocolo</h3>
                  </div>
                  <div className="grid gap-3">
                    {['Perceber', 'Nomear', 'Questionar', 'Escolher', 'Praticar'].map((step, idx) => (
                      <button
                        key={idx}
                        onClick={async () => {
                          const newSteps = protocolSteps.includes(idx) ? protocolSteps.filter(i => i !== idx) : [...protocolSteps, idx];
                          setProtocolSteps(newSteps);
                          await updateProto({ data: { archetype: id as any, steps_completed: newSteps, is_completed: newSteps.length === 5 } });
                        }}
                        className={`w-full flex items-center gap-4 rounded-2xl border p-5 transition-all ${protocolSteps.includes(idx) ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-border glass'}`}
                      >
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center border ${protocolSteps.includes(idx) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-border'}`}>
                          {protocolSteps.includes(idx) ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-[10px]">{idx + 1}</span>}
                        </div>
                        <span className="text-sm uppercase tracking-widest">{step}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {stage === 'conclude' && (
              <motion.div key="conclude" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10 text-center pt-12">
                <div className="relative mx-auto w-40 h-40">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border-2 border-dashed border-gold/20" />
                  <div className="absolute inset-4 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow shadow-gold/20">
                    <Award className="h-16 w-16 text-primary-foreground" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h2 className="font-display text-4xl uppercase">{archetype.name} Concluído</h2>
                  <div className="flex justify-center gap-6 py-4">
                    <div className="text-center"><p className="text-gold text-[10px] font-bold uppercase tracking-widest">+Consciência</p></div>
                    <div className="text-center"><p className="text-gold text-[10px] font-bold uppercase tracking-widest">+EXP</p></div>
                    <div className="text-center"><p className="text-gold text-[10px] font-bold uppercase tracking-widest">+Progresso</p></div>
                  </div>
                </div>
                <div className="rounded-3xl border border-border glass p-8 text-sm text-left whitespace-pre-line text-muted-foreground leading-relaxed max-h-[400px] overflow-y-auto">
                  <p className="text-foreground font-medium mb-6 text-lg">{archetype.gamificationText}</p>
                  <div className="h-px w-full bg-border/50 my-6" />
                  <p className="italic">{archetype.conclusionScript}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-12 pb-12">
          <button
            onClick={handleNext}
            disabled={
              (stage === 'quiz' && quizResponses.length < archetype.quiz.length) ||
              (stage === 'observe' && selectedPerception === null) || 
              (stage === 'experiment' && reflectionText.length < 10) || 
              (stage === 'implement' && protocolSteps.length < 5)
            }
            className="w-full group relative flex items-center justify-center rounded-full bg-foreground px-8 py-5 text-sm font-bold text-background transition-all hover:scale-[1.02] active:scale-[0.98] shadow-glow disabled:opacity-50 disabled:grayscale"
          >
            <span className="relative z-10 tracking-[0.2em] uppercase">
              {stage === 'discover' && 'Entender Arquétipo'}
              {stage === 'mentorship' && 'Aprofundar Percepção'}
              {stage === 'understand' && 'Iniciar Quiz'}
              {stage === 'quiz' && 'Avançar para Percepção'}
              {stage === 'observe' && 'Ir para Reflexão'}
              {stage === 'experiment' && 'Iniciar Missão Prática'}
              {stage === 'implement' && 'Concluir Arquétipo'}
              {stage === 'conclude' && 'Voltar ao Mapa do Herói'}
            </span>
            <ChevronRight className="relative z-10 ml-2 h-4 w-4" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {selectedCategory && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/95 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-lg rounded-3xl border border-gold/20 bg-surface p-8 shadow-2xl relative">
              <button onClick={() => setSelectedCategory(null)} className="absolute top-4 right-4 rounded-full p-2 hover:bg-surface-elevated text-muted-foreground">
                <ArrowLeft className="h-5 w-5 rotate-90" />
              </button>
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-medium">Aprofundamento</span>
                  <h3 className="font-display text-3xl uppercase text-foreground">
                    {selectedCategory === 'essence' ? 'Essência' : 
                     selectedCategory === 'objective' ? 'Objetivo' : 
                     selectedCategory === 'strength' ? 'Força' : 
                     selectedCategory === 'need' ? 'Necessidade' : 
                     selectedCategory === 'shadow' ? 'Sombra' : 
                     selectedCategory === 'illusion' ? 'Ilusão' : selectedCategory}
                  </h3>
                </div>
                <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                  <p className="text-foreground text-lg">{archetype[selectedCategory as keyof typeof archetype] as string}</p>
                  <p>Este pilar representa uma parte fundamental da manifestação do arquétipo na sua psique. Compreender este aspecto permite uma integração mais consciente do padrão em sua vida.</p>
                </div>
                <button onClick={() => setSelectedCategory(null)} className="w-full py-4 rounded-full bg-foreground text-background text-sm font-medium hover:brightness-110">
                  Entendi, continuar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}