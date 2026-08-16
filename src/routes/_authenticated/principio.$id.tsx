import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { 
  ArrowLeft, CheckCircle2, Play, Trophy, Sparkles, 
  ChevronRight, Brain, ClipboardList, Loader2,
  Star, Zap
} from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { 
  getPrinciplesData, 
  savePrincipleResponse, 
  generatePrincipleDiagnosis, 
  completePrincipleProtocol 
} from "@/lib/principles.functions";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

const QUIZ_QUESTIONS = [
  { id: 'q1', text: "Com que frequência você assume total responsabilidade por seus resultados?", options: [{ label: "Sempre", value: 3 }, { label: "Às vezes", value: 2 }, { label: "Raramente", value: 1 }] },
  { id: 'q2', text: "Você sente que suas ações estão alinhadas com seu propósito?", options: [{ label: "Totalmente", value: 3 }, { label: "Parcialmente", value: 2 }, { label: "Não sinto", value: 1 }] },
  { id: 'q3', text: "Quão claro é o mapa dos seus objetivos?", options: [{ label: "Muito claro", value: 3 }, { label: "Vago", value: 2 }, { label: "Inexistente", value: 1 }] },
  { id: 'q4', text: "Você pratica a projeção inteligente de seus desejos?", options: [{ label: "Sim, diariamente", value: 3 }, { label: "De vez em quando", value: 2 }, { label: "Nunca", value: 1 }] },
  { id: 'q5', text: "Você busca a excelência mesmo nas pequenas tarefas?", options: [{ label: "Sempre", value: 3 }, { label: "Na maioria das vezes", value: 2 }, { label: "Apenas no que é importante", value: 1 }] },
  { id: 'q6', text: "Qual a importância da leitura na sua rotina?", options: [{ label: "Fundamental", value: 3 }, { label: "Moderada", value: 2 }, { label: "Baixa", value: 1 }] },
  { id: 'q7', text: "Você dedica tempo ao conhecimento diariamente?", options: [{ label: "Sim", value: 3 }, { label: "Às vezes", value: 2 }, { label: "Quase nunca", value: 1 }] },
  { id: 'q8', text: "Você tem mentores que guiam sua evolução?", options: [{ label: "Sim, vários", value: 3 }, { label: "Tenho um", value: 2 }, { label: "Não tenho", value: 1 }] },
  { id: 'q9', text: "Como você avalia sua conexão espiritual hoje?", options: [{ label: "Forte", value: 3 }, { label: "Em desenvolvimento", value: 2 }, { label: "Fraca", value: 1 }] }
];

export function PrincipleJourneyPage() {
  const { id } = useParams({ from: "/_authenticated/principio/$id" as any });
  const principleNumber = parseInt(id);
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [step, setStep] = useState<'aula' | 'quiz' | 'diagnostico' | 'protocolo' | 'concluido'>('aula');
  const [quizIndex, setQuizIndex] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [diagnosis, setDiagnosis] = useState<any>(null);
  const [processing, setProcessing] = useState(false);

  const getPrinciples = useServerFn(getPrinciplesData);
  const saveResponses = useServerFn(savePrincipleResponse);
  const genDiagnosis = useServerFn(generatePrincipleDiagnosis);
  const completeProtocol = useServerFn(completePrincipleProtocol);

  useEffect(() => {
    getPrinciples()
      .then(res => {
        setData(res);
        const currentPrinciple = res.principles.find((p: any) => p.principle_number === principleNumber);
        const prog = res.progress.find((p: any) => p.principle_id === currentPrinciple?.id);
        
        if (prog?.status === 'locked' && principleNumber !== 1) {
          navigate({ to: "/treinamento-premium" });
          return;
        }

        if (prog?.protocol_completed) setStep('concluido');
        else if (prog?.quiz_completed && currentPrinciple) {
            genDiagnosis({ data: { principleId: currentPrinciple.id } }).then(setDiagnosis);
            setStep('diagnostico');
        }
      })
      .finally(() => setLoading(false));
  }, [principleNumber, navigate, getPrinciples, genDiagnosis]);

  if (loading || !data) return <div className="flex h-screen items-center justify-center bg-black"><Loader2 className="animate-spin text-gold" /></div>;

  const principle = data.principles.find((p: any) => p.principle_number === principleNumber) || { name: `Princípio ${principleNumber}`, id: null };
  const userName = data.userName || 'Guerreiro';

  const handleStartQuiz = () => setStep('quiz');

  const handleAnswer = async (value: number) => {
    const newAnswers = [...answers, { questionId: QUIZ_QUESTIONS[quizIndex].id, answerValue: value }];
    setAnswers(newAnswers);

    if (quizIndex < QUIZ_QUESTIONS.length - 1) {
      setQuizIndex(quizIndex + 1);
    } else {
      setProcessing(true);
      try {
        if (!principle.id) throw new Error("Principle ID not found");
        await saveResponses({ data: { principleId: principle.id, responses: newAnswers } });
        const diag = await genDiagnosis({ data: { principleId: principle.id } });
        setDiagnosis(diag);
        setStep('diagnostico');
      } catch (e) {
        toast.error("Erro ao processar quiz.");
      } finally {
        setProcessing(false);
      }
    }
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#ffffff', '#3B82F6']
    });
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
    audio.play().catch(() => {});
  };

  const handleCompleteProtocol = async () => {
    setProcessing(true);
    try {
      if (!principle.id) throw new Error("Principle ID not found");
      await completeProtocol({ data: { principleId: principle.id, principleNumber } });
      triggerCelebration();
      setStep('concluido');
    } catch (e) {
      toast.error("Erro ao concluir protocolo.");
    } finally {
      setProcessing(false);
    }
  };

  const getYoutubeEmbedUrl = (url: string | null) => {
    if (!url) return null;
    // Enhanced regex to handle ?is= and other complex params
    const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/)|v=|is=)([A-Za-z0-9_-]{11})/);
    if (m) return `https://www.youtube.com/embed/${m[1]}?rel=0&modestbranding=1&autoplay=0`;
    return null;
  };

  return (
    <main className="min-h-screen bg-black text-foreground pb-20 overflow-x-hidden">
      <nav className="p-6 flex items-center justify-between border-b border-white/10 sticky top-0 bg-black/80 backdrop-blur-md z-30">
        <Button variant="ghost" onClick={() => navigate({ to: "/treinamento-premium" })}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Jornada da Evolução</p>
          <p className="text-gold font-display">{principleNumber}/18 Princípios</p>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-12">
        <header className="mb-12 text-center">
            <motion.span 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="text-gold font-display text-xl tracking-[0.3em] mb-4 block"
            >
                PRINCÍPIO {principleNumber}
            </motion.span>
            <motion.h1 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="text-4xl sm:text-6xl font-display mb-6 tracking-tighter uppercase"
            >
                {principle.name}
            </motion.h1>
            <div className="h-1 w-24 bg-gold mx-auto rounded-full" />
        </header>

        <AnimatePresence mode="wait">
            {step === 'aula' && (
                <motion.section 
                    key="aula" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                >
                    <div className="aspect-video w-full rounded-[2.5rem] overflow-hidden border border-white/10 shadow-glow bg-surface relative group">
                        {principle.video_url ? (
                            <iframe 
                                className="w-full h-full"
                                src={getYoutubeEmbedUrl(principle.video_url)!}
                                title={principle.name}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-black/40">
                                <Play className="h-20 w-20 text-gold fill-gold/20 mb-4" />
                                <p className="text-muted-foreground uppercase tracking-widest text-xs">Aula em breve</p>
                            </div>
                        )}
                    </div>
                    
                    <div className="glass-strong p-8 rounded-3xl border border-white/10 space-y-4">
                        <h3 className="text-xl font-display text-gold uppercase">A Sabedoria deste Princípio</h3>
                        <p className="text-muted-foreground leading-relaxed italic">
                            "{userName}, você nasceu para atingir seu máximo potencial. Este princípio é a chave para o seu próximo nível."
                        </p>
                    </div>

                    <Button 
                        className="w-full py-8 rounded-2xl text-xl bg-gold hover:bg-gold/90 text-black font-bold tracking-widest shadow-glow" 
                        onClick={handleStartQuiz}
                    >
                        CONCLUIR AULA & INICIAR MAPEAMENTO
                    </Button>
                </motion.section>
            )}

            {step === 'quiz' && (
                <motion.section 
                    key="quiz" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}
                    className="space-y-12"
                >
                    <div className="text-center space-y-4">
                        <Brain className="h-12 w-12 text-gold mx-auto animate-pulse" />
                        <h3 className="text-2xl font-display uppercase tracking-widest">Mapeamento Individual</h3>
                        <Progress value={((quizIndex + 1) / QUIZ_QUESTIONS.length) * 100} className="h-2 bg-white/10" />
                        <p className="text-xs text-muted-foreground uppercase tracking-widest">Pergunta {quizIndex + 1} de {QUIZ_QUESTIONS.length}</p>
                    </div>

                    <Card className="glass-strong border-gold/20 p-8 rounded-[2.5rem]">
                        <CardContent className="space-y-8 p-0">
                            <h4 className="text-2xl font-display text-center leading-tight">
                                {QUIZ_QUESTIONS[quizIndex].text}
                            </h4>
                            <div className="grid gap-4">
                                {QUIZ_QUESTIONS[quizIndex].options.map((opt, i) => (
                                    <Button 
                                        key={i} variant="outline" 
                                        className="py-6 rounded-2xl border-white/10 hover:border-gold/50 hover:bg-gold/5 text-lg"
                                        onClick={() => handleAnswer(opt.value)}
                                        disabled={processing}
                                    >
                                        {opt.label}
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.section>
            )}

            {step === 'diagnostico' && diagnosis && (
                <motion.section 
                    key="diagnostico" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="space-y-12"
                >
                    <div className="text-center space-y-2">
                        <Star className="h-12 w-12 text-gold mx-auto" />
                        <h3 className="text-3xl font-display tracking-tighter uppercase">Seu Diagnóstico Personalizado</h3>
                    </div>

                    <Card className="glass-strong border-gold/30 p-10 rounded-[3rem] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Brain className="h-32 w-32" />
                        </div>
                        <CardContent className="p-0 space-y-6 relative z-10">
                            <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed text-lg whitespace-pre-wrap">
                                {diagnosis.diagnosisText}
                            </div>
                            <div className="pt-8 border-t border-white/10 text-center">
                                <span className="text-[10px] uppercase tracking-[0.3em] text-gold/60">Instituto Neuroconsciência — Evolução Sistêmica</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Button 
                        className="w-full py-8 rounded-2xl text-xl bg-surface-elevated hover:bg-surface-elevated/80 text-white font-bold tracking-widest border border-white/10 shadow-glow"
                        onClick={() => setStep('protocolo')}
                    >
                        VER PROTOCOLO PRÁTICO <ChevronRight className="ml-2" />
                    </Button>
                </motion.section>
            )}

            {step === 'protocolo' && diagnosis && (
                <motion.section 
                    key="protocolo" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="space-y-12"
                >
                    <div className="text-center space-y-2">
                        <ClipboardList className="h-12 w-12 text-gold mx-auto" />
                        <h3 className="text-3xl font-display tracking-tighter uppercase">Protocolo de Implementação</h3>
                    </div>

                    <div className="space-y-4">
                        {diagnosis.protocolSteps.map((step: any, i: number) => (
                            <div key={i} className="glass border-white/5 p-6 rounded-2xl flex items-center gap-4 group hover:bg-white/[0.02] transition-colors">
                                <div className="h-8 w-8 rounded-full border border-gold/30 flex items-center justify-center text-gold font-bold text-xs">
                                    {i + 1}
                                </div>
                                <p className="flex-1 text-muted-foreground">{step.text}</p>
                            </div>
                        ))}
                    </div>

                    <Button 
                        className="w-full py-8 rounded-2xl text-xl bg-gold hover:bg-gold/90 text-black font-bold tracking-widest shadow-glow"
                        onClick={handleCompleteProtocol}
                        disabled={processing}
                    >
                        {processing ? <Loader2 className="animate-spin" /> : "CONCLUIR PRINCÍPIO & EVOLUIR"}
                    </Button>
                </motion.section>
            )}

            {step === 'concluido' && (
                <motion.section 
                    key="concluido" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-12 py-10"
                >
                    <div className="glass-strong p-16 rounded-[4rem] border border-gold/30 relative overflow-hidden shadow-glow">
                        <div className="absolute inset-0 bg-gold/5 animate-pulse" />
                        <Zap className="h-20 w-20 text-gold mx-auto mb-6" />
                        <h2 className="text-5xl font-display text-gold mb-4 uppercase tracking-tighter">PARABÉNS, {userName.toUpperCase()}!</h2>
                        <h3 className="text-2xl font-display text-white mb-8 uppercase tracking-widest">VOCÊ CONCLUIU ESTE PRINCÍPIO.</h3>
                        
                        <p className="text-lg text-muted-foreground mb-12 italic">
                            "Você agora integrou uma nova camada de consciência. Mantenha o foco e continue avançando em sua jornada de evolução."
                        </p>

                        {principleNumber < 18 ? (
                            <Button 
                                className="bg-white text-black hover:bg-white/90 px-12 py-8 rounded-2xl text-xl font-bold tracking-widest uppercase shadow-glow"
                                onClick={() => {
                                    setStep('aula');
                                    setQuizIndex(0);
                                    setAnswers([]);
                                    setDiagnosis(null);
                                    navigate({ to: "/_authenticated/principio/$id" as any, params: { id: (principleNumber + 1).toString() } as any });
                                }}
                            >
                                PRÓXIMO PRINCÍPIO <ChevronRight className="ml-4" />
                            </Button>
                        ) : (
                            <div className="space-y-6">
                                <Trophy className="h-24 w-24 text-gold mx-auto mb-4" />
                                <h3 className="text-4xl font-display text-gold tracking-widest uppercase text-shadow-glow">JORNADA CONCLUÍDA</h3>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    Parabéns, {userName}! Você atravessou os 18 princípios fundamentais da sua evolução. O seu máximo potencial não é mais um destino, é a sua nova realidade. Viva cada princípio, integre cada sabedoria e nunca pare de buscar a luz da consciência.
                                </p>
                                <Button 
                                    className="bg-gold text-black hover:bg-gold/90 px-12 py-6 rounded-2xl text-lg font-bold shadow-glow"
                                    onClick={() => navigate({ to: "/treinamento-premium" })}
                                >
                                    VOLTAR AO PAINEL
                                </Button>
                            </div>
                        )}
                    </div>
                </motion.section>
            )}
        </AnimatePresence>
      </div>
    </main>
  );
}
