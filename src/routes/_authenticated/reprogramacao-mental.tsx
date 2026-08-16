import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { ArrowLeft, Play, Sparkles, Flame, Activity, Target, Shield, Compass, Lock, FileText } from "lucide-react";
import heroAsset from "@/assets/cover-4.png.asset.json";
import { Splash } from "@/components/hero-journey/Splash";
import { ArchetypeCard } from "@/components/hero-journey/ArchetypeCard";
import { ARCHETYPES_CONTENT } from "@/lib/hero-content";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getJourneyStats, getArchetypes } from "@/lib/hero-journey.functions";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const hero = heroAsset.url;

export const Route = createFileRoute("/_authenticated/reprogramacao-mental")({
  head: () => ({
    meta: [
      { title: "Reprogramação Mental — Instituto Neuroconsciência" },
      { name: "description", content: "Jornada do Herói Interior: Descubra os padrões que conduzem sua vida." },
      { property: "og:title", content: "Reprogramação Mental" },
      { property: "og:description", content: "Aplicativo interativo de autoconhecimento e transformação." },
    ],
  }),
  loader: async ({ context }) => {
    try {
      await Promise.all([
        context.queryClient.ensureQueryData({
          queryKey: ['hero_journey_stats'],
          queryFn: () => getJourneyStats(),
        }),
        context.queryClient.ensureQueryData({
          queryKey: ['hero_journey_archetypes'],
          queryFn: () => getArchetypes(),
        })
      ]);
    } catch (e: any) {
      console.error("Hero Journey Loader Error:", e);
      return { error: e.message || "Unknown error" };
    }
  },
  component: Page,
});

function youtubeId(url: string | null): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

function Page() {
  const navigate = useNavigate();
  const loaderData = Route.useLoaderData();
  
  const { data: statsData, error: statsError } = useSuspenseQuery({
    queryKey: ['hero_journey_stats'],
    queryFn: () => getJourneyStats(),
  });
  const stats = (statsData as any) || { total_progress: 0, archetypes_explored: 0, missions_completed: 0, consciousness_level: 1, protocols_realized: 0 };
  
  const { data: userArchetypesData = [], error: archetypesError } = useSuspenseQuery({
    queryKey: ['hero_journey_archetypes'],
    queryFn: () => getArchetypes(),
  });
  const userArchetypes = (userArchetypesData || []) as any[];

  const [showSplash, setShowSplash] = useState(false);
  const [userName, setUserName] = useState("Herói");
  const [isLoaded, setIsLoaded] = useState(false);

  const error = (loaderData as any)?.error || statsError?.message || archetypesError?.message;

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6 text-center">
        <div className="max-w-md space-y-6">
          <h2 className="text-2xl font-display text-foreground uppercase tracking-tight">Algo saiu do fluxo</h2>
          <p className="text-sm text-muted-foreground">{error}</p>
          <button 
            className="w-full rounded-full bg-gradient-primary py-3 text-sm font-medium text-primary-foreground shadow-glow"
            onClick={() => window.location.reload()}
          >
            Tentar Novamente
          </button>
          <button 
            className="w-full text-xs text-muted-foreground uppercase tracking-widest mt-4"
            onClick={() => navigate({ to: "/home" })}
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    let isMounted = true;
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && isMounted) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name, full_name')
            .eq('id', user.id)
            .maybeSingle();
          
          if (isMounted) {
            const name = (profile as any)?.display_name || (profile as any)?.full_name || "Herói";
            setUserName(name.split(' ')[0]);
          }
        }
      } catch (error) {
        console.error("Error checking user:", error);
      }
    };
    
    checkUser();
    
    const visited = localStorage.getItem('hero_journey_visited');
    if (!visited && isMounted) {
      setShowSplash(true);
    }
    if (isMounted) setIsLoaded(true);

    return () => { isMounted = false; };
  }, []);

  const handleStart = () => {
    setShowSplash(false);
    localStorage.setItem('hero_journey_visited', 'true');
  };

  const getStatus = (id: string) => {
    const arch = userArchetypes.find(a => a.archetype === id);
    if (arch) return arch.status;
    
    const sequence = ['inocente', 'orfao', 'guerreiro', 'altruista', 'nomade', 'mago'];
    const index = sequence.indexOf(id);
    if (index === 0) return 'available';
    
    const prevId = sequence[index - 1];
    const prevArch = userArchetypes.find(a => a.archetype === prevId);
    return prevArch?.status === 'completed' ? 'available' : 'locked';
  };

  const getProgress = (id: string) => {
    const arch = userArchetypes.find(a => a.archetype === id);
    return arch?.progress ?? 0;
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="space-y-4 text-center">
          <Sparkles className="h-8 w-8 text-gold animate-pulse mx-auto" />
          <p className="text-xs text-muted-foreground uppercase tracking-widest">Iniciando Jornada...</p>
        </div>
      </div>
    );
  }

  if (showSplash) {
    return <Splash userName={userName} onStart={handleStart} />;
  }

  const consciousnessLevels: Record<number, string> = {
    1: "O Despertar",
    2: "A Percepção",
    3: "O Confronto",
    4: "A Escolha",
    5: "A Transformação",
    6: "A Integração"
  };

  return (
    <main className="relative min-h-screen pb-24 bg-background">
      <Link to="/home" className="fixed left-4 top-4 z-30 rounded-full glass p-2 text-foreground hover:bg-surface-elevated">
        <ArrowLeft className="h-4 w-4" />
      </Link>

      <section className="relative h-[45vh] overflow-hidden flex items-end">
        <div className="absolute inset-0">
          <img 
            src={hero} 
            alt="Hero Background"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-1 text-[10px] uppercase tracking-widest text-gold">
              <Flame className="h-3 w-3" /> Aplicativo Interativo
            </span>
            <h1 className="font-display text-4xl leading-tight text-foreground sm:text-6xl uppercase">
              Jornada do <br /> Herói Interior
            </h1>
            <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
              Explore os seis arquétipos fundamentais e descubra qual padrão parece estar conduzindo sua vida agora.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="mx-4 -mt-10 relative z-10 grid grid-cols-2 gap-3 sm:grid-cols-5 lg:mx-auto lg:max-w-6xl">
        <StatCard icon={<Activity className="h-4 w-4 text-gold" />} label="Progresso" value={`${stats.total_progress ?? 0}%`} />
        <StatCard icon={<Compass className="h-4 w-4 text-gold" />} label="Arquétipos" value={`${stats.archetypes_explored ?? 0}/6`} />
        <StatCard icon={<Target className="h-4 w-4 text-gold" />} label="Missões" value={stats.missions_completed ?? 0} />
        <StatCard icon={<Shield className="h-4 w-4 text-gold" />} label="Consciência" value={`Nível ${stats.consciousness_level ?? 1}`} />
        <StatCard icon={<FileText className="h-4 w-4 text-gold" />} label="Protocolos" value={stats.protocols_realized ?? 0} />
      </section>

      <section className="mx-4 mt-12 lg:mx-auto lg:max-w-6xl">
        <div className="mb-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl text-foreground uppercase tracking-tight">MINHA JORNADA</h2>
            <div className="text-[10px] uppercase tracking-widest text-gold border border-gold/30 px-3 py-1 rounded-full glass">
              {consciousnessLevels[stats.consciousness_level ?? 1]}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-gold/20 shadow-glow bg-surface-elevated">
            <div className="aspect-video w-full">
              <iframe 
                src={`https://www.youtube.com/embed/${youtubeId("https://youtu.be/Ql3H9jAvDrY")}?rel=0&modestbranding=1&autoplay=0`}
                className="h-full w-full"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="font-display text-2xl text-foreground uppercase tracking-tight">MAPA DO HERÓI INTERIOR</h2>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Explore as estações da sua consciência</p>
            </div>
            {stats.archetypes_explored >= 6 && (
              <Link 
                to="/hero-journey/diagnostico"
                className="rounded-full bg-gold/10 border border-gold/30 px-6 py-2 text-[10px] uppercase tracking-widest text-gold hover:bg-gold/20 transition-all shadow-glow shadow-gold/5"
              >
                Iniciar Diagnóstico Final
              </Link>
            )}
          </div>
        </div>

        <div className="space-y-16">
          {/* FASE 1: SEGURANÇA */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-border/50" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium bg-background px-4">Fase 1: Segurança</span>
              <div className="h-px flex-1 bg-border/50" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.values(ARCHETYPES_CONTENT).slice(0, 2).map((arch) => (
                <ArchetypeCard 
                  key={arch.id}
                  archetype={arch}
                  status={getStatus(arch.id)}
                  progress={getProgress(arch.id)}
                  onClick={() => navigate({ to: "/hero-journey/archetype/$id", params: { id: arch.id } })}
                />
              ))}
            </div>
          </div>

          {/* FASE 2: DESENVOLVIMENTO */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-border/50" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium bg-background px-4">Fase 2: Desenvolvimento</span>
              <div className="h-px flex-1 bg-border/50" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.values(ARCHETYPES_CONTENT).slice(2, 4).map((arch) => (
                <ArchetypeCard 
                  key={arch.id}
                  archetype={arch}
                  status={getStatus(arch.id)}
                  progress={getProgress(arch.id)}
                  onClick={() => navigate({ to: "/hero-journey/archetype/$id", params: { id: arch.id } })}
                />
              ))}
            </div>
          </div>

          {/* FASE 3: INTEGRAÇÃO */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-border/50" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium bg-background px-4">Fase 3: Integração</span>
              <div className="h-px flex-1 bg-border/50" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.values(ARCHETYPES_CONTENT).slice(4, 6).map((arch) => (
                <ArchetypeCard 
                  key={arch.id}
                  archetype={arch}
                  status={getStatus(arch.id)}
                  progress={getProgress(arch.id)}
                  onClick={() => navigate({ to: "/hero-journey/archetype/$id", params: { id: arch.id } })}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-4 mt-20 lg:mx-auto lg:max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <p className="text-[10px] uppercase tracking-widest text-gold">Fundamentos</p>
          <div className="rounded-3xl border border-border p-8 bg-surface shadow-elevated group hover:border-gold/30 transition-all">
            <h3 className="font-display text-2xl text-foreground uppercase tracking-tight">Código da Mente Extraordinária</h3>
            <p className="mt-2 text-sm text-muted-foreground">Esta é a aula fundamental que serve como base para toda a jornada de reprogramação.</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <p className="text-[10px] uppercase tracking-widest text-gold">Ferramentas</p>
          <div className="grid grid-cols-2 gap-4">
             <Link to="/hero-journey/resultado" className="rounded-2xl border border-border glass p-6 text-center group hover:border-gold/30 transition-all">
               <Brain className="h-6 w-6 mx-auto mb-2 text-muted-foreground group-hover:text-gold" />
               <span className="text-[10px] uppercase tracking-widest">Meu Mapa</span>
             </Link>
             <button 
               onClick={() => toast.info("Funcionalidade de reflexões em desenvolvimento.")}
               className="rounded-2xl border border-border glass p-6 text-center group hover:border-gold/30 transition-all"
             >
               <FileText className="h-6 w-6 mx-auto mb-2 text-muted-foreground group-hover:text-gold" />
               <span className="text-[10px] uppercase tracking-widest">Reflexões</span>
             </button>
          </div>
        </div>
      </section>
      
      <section className="mx-4 mt-12 lg:mx-auto lg:max-w-6xl border-t border-border pt-8 text-center">
         <button 
           onClick={async () => {
             if (confirm("Tem certeza que deseja reiniciar sua jornada? Isso apagará todo o seu progresso.")) {
               const { resetJourney } = await import("@/lib/hero-journey.functions");
               await resetJourney();
               window.location.reload();
             }
           }}
           className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-red-500 transition-colors"
         >
           Reiniciar Minha Jornada
         </button>
      </section>
    </main>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-border glass p-4 space-y-2">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      </div>
      <p className="font-display text-2xl text-foreground">{value}</p>
    </div>
  );
}

const Brain = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.54Z"/>
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.54Z"/>
  </svg>
);
