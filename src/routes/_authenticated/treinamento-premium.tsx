import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Lock, CheckCircle2, ChevronRight, Trophy, Sparkles, Zap, Play } from "lucide-react";
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

  if (loading || !data) {
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

      {/* VÍDEO DE ABERTURA */}
      <section className="max-w-6xl mx-auto px-6 mt-12">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-gold/20 shadow-glow bg-surface group">
          <div className="absolute inset-0 z-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <div className="aspect-video w-full relative z-10">
            <iframe 
              src="https://www.youtube.com/embed/Cs7ZzmaCmh8?rel=0&modestbranding=1"
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="p-6 border-t border-gold/10 bg-black/40 backdrop-blur-sm">
            <h2 className="text-xl font-display text-white tracking-widest uppercase">Comece por aqui: A Visão Geral</h2>
            <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest">Assista a introdução antes de iniciar sua jornada.</p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {principles.map((principle: any, idx: number) => {
            const prog = progress.find((p: any) => p.principle_id === principle.id);
            const isAvailable = prog?.status === 'available' || prog?.status === 'completed' || prog?.status === 'in_progress' || principle.principle_number === 1;
            const isCompleted = prog?.status === 'completed';

            return (
              <motion.div
                key={principle.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
              >
                <button
                  disabled={!isAvailable}
                  onClick={() => navigate({ to: "/treinamento-premium/principio/$id" as any, params: { id: principle.principle_number.toString() } as any })}
                  className={`w-full group relative text-left transition-all duration-500 rounded-[2.5rem] overflow-hidden aspect-[4/5] md:aspect-auto md:min-h-[320px] ${
                    !isAvailable ? 'grayscale opacity-40 cursor-not-allowed' : 'hover:-translate-y-2'
                  }`}
                >
                  {/* Banner Image Background */}
                  <div className="absolute inset-0 z-0">
                    <img 
                        src={principle.banner_url || "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070"} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        alt={principle.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/20" />
                  </div>

                  <div className={`absolute inset-0 z-0 border border-white/10 group-hover:border-gold/30 transition-colors rounded-[2.5rem]`} />
                  
                  <div className="relative z-10 p-8 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-display text-xl border ${
                        isCompleted ? 'bg-gold/20 border-gold/50 text-gold' : 
                        isAvailable ? 'bg-white/5 border-white/20 text-white' : 'bg-black/50 border-white/5 text-muted-foreground'
                      }`}>
                        {principle.principle_number}
                      </div>
                      {isCompleted ? (
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      ) : !isAvailable ? (
                        <Lock className="h-6 w-6 text-muted-foreground" />
                      ) : (
                        <div className="h-6 w-6 rounded-full border border-gold/30 flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-gold animate-pulse" />
                        </div>
                      )}
                    </div>

                    <h3 className={`text-2xl font-display mb-4 tracking-tight leading-tight ${
                      isAvailable ? 'text-white' : 'text-muted-foreground'
                    }`}>
                      {principle.name}
                    </h3>

                    <div className="mt-auto pt-6 flex items-center justify-between">
                      <span className="text-[10px] tracking-[0.2em] font-bold text-muted-foreground uppercase">
                        {isCompleted ? 'Integrado' : isAvailable ? 'Disponível' : 'Bloqueado'}
                      </span>
                      {isAvailable && (
                        <div className="flex items-center gap-2 text-gold group-hover:gap-4 transition-all">
                          <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Iniciar</span>
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>
      </section>

      {completedCount === totalCount && (
        <section className="max-w-4xl mx-auto px-6 py-20 text-center">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                className="glass-strong p-16 rounded-[4rem] border border-gold/30 relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gold/5 animate-pulse" />
                <Trophy className="h-24 w-24 text-gold mx-auto mb-8" />
                <h2 className="text-5xl font-display text-white mb-6 tracking-tighter uppercase">Mestria Alcançada</h2>
                <p className="text-xl text-muted-foreground leading-relaxed italic">
                    "{userName}, você completou os 18 princípios. Agora, o seu potencial não tem limites. O mundo aguarda a sua melhor versão."
                </p>
            </motion.div>
        </section>
      )}
    </main>
  );
}
