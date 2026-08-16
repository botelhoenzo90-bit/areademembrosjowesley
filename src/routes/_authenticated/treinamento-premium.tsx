import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Lock, CheckCircle2, ChevronRight, Trophy, Sparkles, MapPin, Zap, Brain, ClipboardList, Play } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { getPrinciplesData } from "@/lib/principles.functions";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

export const Route = createFileRoute("/_authenticated/treinamento-premium")({
  component: PrinciplesDashboard,
});

function PrinciplesDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const getPrinciples = useServerFn(getPrinciplesData);

  useEffect(() => {
    getPrinciples()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gold border-t-transparent mx-auto" />
          <p className="text-gold font-display tracking-widest animate-pulse uppercase">Carregando Princípios...</p>
        </div>
      </div>
    );
  }

  const { principles, progress, userName } = data;
  const completedCount = progress.filter((p: any) => p.status === 'completed').length;
  const totalCount = principles.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <main className="min-h-screen bg-black pb-20 text-foreground overflow-x-hidden">
      <header className="relative min-h-[500px] overflow-hidden flex flex-col justify-end">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        <div className="relative z-10 p-6 md:p-12 max-w-6xl mx-auto w-full">
          <Button variant="ghost" className="mb-8 hover:bg-white/10 text-white" onClick={() => navigate({ to: "/home" })}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Início
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-6">
                <motion.span 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="inline-block px-4 py-1 rounded-full border border-gold/30 bg-gold/10 text-gold text-[10px] tracking-[0.4em] font-bold uppercase"
                >
                    Jornada de Desenvolvimento Pessoal
                </motion.span>
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="font-display text-5xl md:text-8xl leading-tight tracking-tighter"
                >
                    18 Princípios para <br />
                    <span className="text-gold">Você Evoluir</span>
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                    className="text-xl text-muted-foreground max-w-xl italic"
                >
                    "{userName}, você nasceu para atingir seu máximo potencial."
                </motion.p>
            </div>

            <motion.div 
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                className="glass-strong p-8 rounded-[2.5rem] border border-white/10 min-w-[320px] space-y-6"
            >
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-gold" />
                        <span className="text-sm font-bold tracking-widest">{completedCount * 50} XP</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-gold" />
                        <span className="text-sm font-bold tracking-widest uppercase">Nível {Math.floor(completedCount / 3) + 1}</span>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between text-[10px] tracking-[0.2em] text-muted-foreground font-bold">
                        <span>PROGRESSO DA EVOLUÇÃO</span>
                        <span>{completedCount}/{totalCount} ETAPAS</span>
                    </div>
                    <Progress value={progressPercent} className="h-2 bg-white/10" />
                </div>
            </motion.div>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center gap-4 mb-12">
            <div className="h-px flex-1 bg-white/10" />
            <h2 className="text-2xl font-display tracking-widest text-muted-foreground uppercase">O Caminho Evolutivo</h2>
            <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {layers.map((layer: any) => {
                const prog = (processedProgress as any[]).find((p: any) => p.layer_id === layer.id) || { status: 'locked' };
                const isLocked = prog.status === 'locked';
                const isCompleted = prog.status === 'completed';
                const isIntro = layer.layer_number === 0;

                return (
                    <div 
                        key={layer.id} 
                        className={`group relative rounded-[2.5rem] overflow-hidden border transition-all duration-500 ${
                            isLocked ? 'border-white/5 bg-white/[0.02] grayscale opacity-60' : 
                            isCompleted ? 'border-green-500/30 bg-green-500/[0.02]' : 
                            'border-gold/30 bg-gold/[0.02] shadow-[0_0_30px_rgba(212,175,55,0.05)] scale-[1.02] z-10'
                        }`}
                    >
                        {/* Status Badge */}
                        <div className="absolute top-6 right-6 z-20">
                            {isLocked ? (
                                <div className="bg-black/60 backdrop-blur-md p-2 rounded-full border border-white/10">
                                    <Lock className="h-4 w-4 text-muted-foreground" />
                                </div>
                            ) : isCompleted ? (
                                <div className="bg-green-500/20 backdrop-blur-md p-2 rounded-full border border-green-500/40">
                                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                                </div>
                            ) : (
                                <div className="bg-gold/20 backdrop-blur-md px-3 py-1 rounded-full border border-gold/40 flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
                                    <span className="text-[10px] font-bold text-gold uppercase tracking-tighter">
                                        {isIntro ? 'Iniciar' : 'Disponível'}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Content Area */}
                        <div className="p-8 flex flex-col h-full min-h-[320px]">
                            <div className="mb-6">
                                <span className={`font-display text-4xl ${isLocked ? 'text-muted-foreground' : 'text-gold'}`}>
                                    {isIntro ? '★' : `0${layer.layer_number}`}
                                </span>
                            </div>
                            
                            <div className="flex-1">
                                <h3 className="font-display text-2xl text-foreground mb-2 group-hover:text-gold transition-colors">{layer.name}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 italic">"{layer.essence}"</p>
                                <p className="text-xs text-muted-foreground/60 leading-relaxed">{layer.description}</p>
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/5">
                                <Button 
                                    className={`w-full py-6 rounded-2xl text-sm font-bold tracking-widest transition-all duration-300 ${
                                        isLocked ? 'bg-white/5 text-muted-foreground border border-white/10 cursor-not-allowed' :
                                        isCompleted ? 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20' :
                                        'bg-gold text-black hover:bg-gold/90 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                                    }`}
                                    disabled={isLocked}
                                    onClick={() => navigate({ to: `/treinamento-premium/camada/${layer.layer_number}` })}
                                >
                                    {isLocked ? 'CONTEÚDO BLOQUEADO' : isCompleted ? 'REVER CONTEÚDO' : 'INICIAR TRAVESSIA'}
                                </Button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
      </section>

      {/* FOOTER GAMIFICATION */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
                <h2 className="text-3xl font-display mb-6">Suas Conquistas</h2>
                <div className="flex flex-wrap gap-4">
                    {badges.map((badge: any) => {
                        const isUnlocked = userBadges.some((ub: any) => ub.badge_id === badge.id);
                        return (
                            <div 
                                key={badge.id}
                                className={`group relative p-4 rounded-2xl border transition-all ${
                                    isUnlocked ? 'bg-gold/10 border-gold/30 text-gold' : 'bg-white/5 border-white/10 text-muted-foreground opacity-40'
                                }`}
                                title={badge.description}
                            >
                                <MapPin className={`h-6 w-6 mb-2 ${isUnlocked ? 'animate-bounce' : ''}`} />
                                <p className="text-[10px] font-bold uppercase tracking-widest">{badge.name}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="glass-strong p-8 rounded-[2.5rem] border border-white/10">
                <h3 className="text-xl font-display mb-4 flex items-center gap-2">
                    <RefreshCw className="h-5 w-5 text-gold" /> Recomeçar Jornada
                </h3>
                <p className="text-sm text-muted-foreground mb-6">Deseja reiniciar sua travessia pelas 9 camadas? Isso apagará todo o seu progresso, pontos e registros atuais.</p>
                <Button 
                    variant="outline" 
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                    onClick={async () => {
                        if (confirm("Tem certeza de que deseja reiniciar sua jornada? Seu progresso atual será apagado.")) {
                            await restartPassportJornada();
                            window.location.reload();
                        }
                    }}
                >
                    Zerar Progresso Atual
                </Button>
            </div>
        </div>
      </section>
    </main>
  );
}
