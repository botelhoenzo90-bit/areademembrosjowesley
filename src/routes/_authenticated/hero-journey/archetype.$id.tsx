import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, ChevronRight, Info, Eye, Zap, 
  Target, Shield, CheckCircle2, Award, 
  Sparkles, Heart, Compass, Sword, Wand2, Sun, Bandage
} from "lucide-react";
import { ARCHETYPES_CONTENT } from "@/lib/hero-content";
import { updateArchetypeProgress, getArchetypes } from "@/lib/hero-journey.functions";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type Stage = 'discover' | 'understand' | 'observe' | 'experiment' | 'implement' | 'conclude';

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

  const { data: userArchetypes = [] } = useQuery({
    queryKey: ['hero_journey_archetypes'],
    queryFn: () => getArchetypes(),
  });

  const currentArchData = (userArchetypes as any[]).find((a: any) => a.archetype === id);
  const initialStage: Stage = (currentArchData?.status === 'completed') ? 'conclude' : 'discover';

  const [stage, setStage] = useState<Stage>(initialStage);
  const [reflectionText, setReflectionText] = useState(currentArchData?.reflection_text || "");
  const [protocolSteps, setProtocolSteps] = useState<number[]>(currentArchData?.protocol_steps_completed || []);
  const [selectedPerception, setSelectedPerception] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  if (!archetype) {
    return <div>Arquétipo não encontrado.</div>;
  }

  const handleNext = async () => {
    const stages: Stage[] = ['discover', 'understand', 'observe', 'experiment', 'implement', 'conclude'];
    const currentIndex = stages.indexOf(stage);
    
    if (currentIndex < stages.length - 1) {
      const nextStage = stages[currentIndex + 1];
      setStage(nextStage);
      
      // Update intermediate progress
      const progress = Math.round(((currentIndex + 1) / (stages.length - 1)) * 100);
      await updateProgress({ 
        data: {
          archetype: id as any, 
          progress, 
          status: (progress === 100 ? 'completed' : 'in_progress') as any
        }
      });
      queryClient.invalidateQueries({ queryKey: ['hero_journey_archetypes'] });
      queryClient.invalidateQueries({ queryKey: ['hero_journey_stats'] });
    } else {
      navigate({ to: "/reprogramacao-mental" });
    }
  };

  const toggleProtocolStep = (index: number) => {
    setProtocolSteps(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
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

      <div className="pt-24 px-6 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {stage === 'discover' && (
            <motion.div
              key="discover"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <div className="mx-auto w-20 h-20 rounded-3xl bg-surface-elevated flex items-center justify-center text-4xl shadow-glow">
                  {archetype.symbol}
                </div>
                <h2 className="font-display text-3xl uppercase">Quem é {archetype.name}?</h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <InfoCard 
                  title="Essência" 
                  content={archetype.essence} 
                  onDetails={() => setSelectedCategory('essence')}
                />
                <InfoCard 
                  title="Objetivo" 
                  content={archetype.objective} 
                  onDetails={() => setSelectedCategory('objective')}
                />
                <InfoCard 
                  title="Força" 
                  content={archetype.strength} 
                  onDetails={() => setSelectedCategory('strength')}
                />
                <InfoCard 
                  title="Necessidade" 
                  content={archetype.need} 
                  onDetails={() => setSelectedCategory('need')}
                />
                <InfoCard 
                  title="Sombra" 
                  content={archetype.shadow} 
                  onDetails={() => setSelectedCategory('shadow')}
                />
                <InfoCard 
                  title="Ilusão" 
                  content={archetype.illusion} 
                  onDetails={() => setSelectedCategory('illusion')}
                />
              </div>

              <div className="rounded-2xl border border-gold/30 bg-gold/5 p-6 text-center italic">
                <p className="text-gold">Pergunta Central:</p>
                <p className="mt-2 text-xl font-display text-foreground">"{archetype.question}"</p>
              </div>
            </motion.div>
          )}

          {stage === 'understand' && (
            <motion.div
              key="understand"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <h2 className="font-display text-2xl text-center uppercase tracking-tight">O Arquétipo em sua vida</h2>
              <p className="text-center text-sm text-muted-foreground">Toque em cada categoria para revelar como esse padrão se manifesta.</p>
              
              <div className="grid gap-3">
                {Object.entries(archetype.categories).map(([key, items]) => (
                  <CategoryAccordion key={key} title={key} items={items as string[]} />
                ))}
              </div>
            </motion.div>
          )}

          {stage === 'observe' && (
            <motion.div
              key="observe"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <h2 className="font-display text-2xl text-center uppercase tracking-tight">Você se reconhece?</h2>
              
              <div className="space-y-6">
                {archetype.selfPerceptionQuestions.map((q: any, idx: number) => (
                  <div key={idx} className="space-y-4">
                    <p className="text-lg text-foreground">{q.question}</p>
                    <div className="grid gap-3">
                      {q.options.map((opt: any, oIdx: number) => (
                        <button
                          key={oIdx}
                          onClick={() => setSelectedPerception(oIdx)}
                          className={`w-full text-left rounded-2xl border p-4 transition-all ${
                            selectedPerception === oIdx 
                              ? 'border-gold bg-gold/10 text-foreground' 
                              : 'border-border glass text-muted-foreground hover:border-gold/50'
                          }`}
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
            <motion.div
              key="experiment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <Eye className="h-8 w-8 mx-auto text-gold" />
                <h2 className="font-display text-2xl uppercase tracking-tight">Olhe para Dentro</h2>
              </div>
              
              <div className="space-y-4">
                <p className="text-foreground">{archetype.reflectionQuestion}</p>
                <textarea
                  value={reflectionText}
                  onChange={(e) => setReflectionText(e.target.value)}
                  placeholder="Escreva sua reflexão aqui..."
                  className="w-full h-40 rounded-2xl border border-border glass p-4 text-sm outline-none focus:border-gold/50 resize-none"
                />
                <button 
                  onClick={async () => {
                    await updateProgress({ data: { archetype: id as any, reflection_text: reflectionText } });
                    toast.success("Reflexão salva com sucesso.");
                  }}
                  className="w-full py-3 rounded-full border border-border glass text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                >
                  Salvar Reflexão
                </button>
              </div>
            </motion.div>
          )}

          {stage === 'implement' && (
            <motion.div
              key="implement"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <div className="rounded-3xl border border-border glass p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <Target className="h-5 w-5 text-gold" />
                    <h3 className="font-display text-xl uppercase">Sua Missão</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{archetype.mission}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-gold" />
                    <h3 className="font-display text-xl uppercase">Protocolo</h3>
                  </div>
                  <div className="space-y-3">
                    {['Perceber', 'Nomear', 'Questionar', 'Escolher', 'Praticar'].map((step, idx) => (
                      <button
                        key={idx}
                        onClick={() => toggleProtocolStep(idx)}
                        className={`w-full flex items-center gap-4 rounded-2xl border p-4 transition-all ${
                          protocolSteps.includes(idx)
                            ? 'border-emerald-500/50 bg-emerald-500/5'
                            : 'border-border glass'
                        }`}
                      >
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center border ${
                          protocolSteps.includes(idx) 
                            ? 'bg-emerald-500 border-emerald-500 text-white' 
                            : 'border-border'
                        }`}>
                          {protocolSteps.includes(idx) ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-[10px]">{idx + 1}</span>}
                        </div>
                        <span className={`text-sm ${protocolSteps.includes(idx) ? 'text-foreground' : 'text-muted-foreground'}`}>{step}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {stage === 'conclude' && (
            <motion.div
              key="conclude"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8 text-center"
            >
              <div className="relative mx-auto w-32 h-32">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-2 border-dashed border-gold/30"
                />
                <div className="absolute inset-2 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
                  <Award className="h-12 w-12 text-primary-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="font-display text-3xl uppercase tracking-tighter">Arquétipo Concluído</h2>
                <div className="flex justify-center gap-4 text-[10px] uppercase tracking-widest text-gold">
                  <span className="flex items-center gap-1"><Sparkles className="h-3 w-3" /> + Consciência</span>
                  <span className="flex items-center gap-1"><Zap className="h-3 w-3" /> + Experiência</span>
                </div>
              </div>

              <div className="rounded-3xl border border-border glass p-8 text-sm leading-relaxed text-muted-foreground text-left max-h-[400px] overflow-y-auto scrollbar-hidden">
                <p className="mb-6 text-foreground font-medium">{archetype.gamificationText}</p>
                <div className="h-px w-full bg-border/50 mb-6" />
                <p className="italic">{archetype.conclusionScript}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedCategory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/95 backdrop-blur-md"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="w-full max-w-lg rounded-3xl border border-gold/20 bg-surface p-8 shadow-2xl relative"
              >
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="absolute top-4 right-4 rounded-full p-2 hover:bg-surface-elevated text-muted-foreground"
                >
                  <ArrowLeft className="h-5 w-5 rotate-90" />
                </button>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-medium">Aprofundamento</span>
                    <h3 className="font-display text-3xl uppercase text-foreground">
                      {selectedCategory === 'essence' && 'Essência'}
                      {selectedCategory === 'objective' && 'Objetivo'}
                      {selectedCategory === 'strength' && 'Força'}
                      {selectedCategory === 'need' && 'Necessidade'}
                      {selectedCategory === 'shadow' && 'Sombra'}
                      {selectedCategory === 'illusion' && 'Ilusão'}
                    </h3>
                  </div>

                  <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                    <p className="text-foreground text-lg">
                      {archetype[selectedCategory as keyof typeof archetype] as string}
                    </p>
                    <p>
                      {selectedCategory === 'essence' && "A essência representa o núcleo puro deste padrão em você. É a força vital que guia suas percepções mais profundas."}
                      {selectedCategory === 'objective' && "Este é o 'norte' da sua bússola interna quando este arquétipo está ativo. É o que sua alma busca alcançar agora."}
                      {selectedCategory === 'strength' && "Seu maior aliado. Esta habilidade natural permite que você navegue por desafios com uma vantagem única."}
                      {selectedCategory === 'need' && "O que sustenta sua estrutura emocional. Ignorar esta necessidade pode gerar desequilíbrio na sua jornada."}
                      {selectedCategory === 'shadow' && "A parte oculta. Não é ruim, mas precisa de consciência. Quando ignorada, ela pode sabotar seus resultados."}
                      {selectedCategory === 'illusion' && "O véu que distorce a realidade. Reconhecer esta ilusão é o primeiro passo para o verdadeiro despertar."}
                    </p>
                  </div>

                  <button 
                    onClick={() => setSelectedCategory(null)}
                    className="w-full py-4 rounded-full bg-foreground text-background text-sm font-medium hover:brightness-110 transition-all"
                  >
                    Entendi, continuar
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="fixed bottom-0 left-0 right-0 p-6 glass-strong z-40">
          <button
            onClick={handleNext}
            disabled={stage === 'observe' && selectedPerception === null}
            className="w-full flex items-center justify-center gap-2 rounded-full bg-foreground py-4 text-sm font-medium text-background transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
          >
            {stage === 'conclude' ? 'Concluir Jornada' : 'Continuar'} <ChevronRight className="h-4 w-4" />
          </button>
        </footer>
      </div>
    </main>
  );
}

function InfoCard({ title, content, onDetails }: { title: string; content: string; onDetails?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div 
      onClick={() => {
        setIsOpen(!isOpen);
        if (!isOpen && onDetails) {
          // Pequeno delay para a animação do card antes de abrir o modal se for o caso
          // ou simplesmente abrir o modal se preferir ação direta
          onDetails();
        }
      }}
      className="rounded-2xl border border-border glass p-4 space-y-1 cursor-pointer hover:border-gold/50 transition-all active:scale-95"
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{title}</span>
        <ChevronRight className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </div>
      <p className="text-sm text-foreground leading-tight font-medium">
        {content}
      </p>
      <div className="pt-2 flex items-center gap-1 text-[9px] uppercase tracking-tighter text-gold opacity-70">
        <Zap className="h-2.5 w-2.5" /> Clique para aprofundar
      </div>
    </div>
  );
}

function CategoryAccordion({ title, items }: { title: string; items: string[] }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const translations: Record<string, { label: string; icon: any }> = {
    thoughts: { label: 'Pensamentos', icon: Sparkles },
    emotions: { label: 'Emoções', icon: Heart },
    behaviors: { label: 'Comportamentos', icon: Zap },
    relationships: { label: 'Relacionamentos', icon: Heart },
    decisions: { label: 'Decisões', icon: Target },
    identity: { label: 'Identidade', icon: Shield },
  };

  const info = translations[title] || { label: title, icon: Info };
  const Icon = info.icon;

  return (
    <div className={`rounded-2xl border transition-all ${isOpen ? 'border-gold/30 bg-gold/5' : 'border-border glass'}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-surface-elevated p-2">
            <Icon className="h-4 w-4 text-gold" />
          </div>
          <span className="text-sm font-medium uppercase tracking-tight">{info.label}</span>
        </div>
        <ChevronRight className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 space-y-2">
              {items.map((item, idx) => (
                <div key={idx} className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
                  <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}