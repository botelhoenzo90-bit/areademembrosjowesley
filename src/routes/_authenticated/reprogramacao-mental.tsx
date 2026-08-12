import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Play, Clock, Sparkles, Flame, ChevronRight, Activity, Target, Shield, Compass, Lock } from "lucide-react";
import heroAsset from "@/assets/cover-4.png.asset.json";
import { Splash } from "@/components/hero-journey/Splash";
import { ArchetypeCard } from "@/components/hero-journey/ArchetypeCard";
import { ARCHETYPES_CONTENT } from "@/lib/hero-content";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { getJourneyStats, getArchetypes } from "@/lib/hero-journey.functions";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const hero = heroAsset.url;
import s1 from "@/assets/level-1.jpg";

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
    await context.queryClient.ensureQueryData({
      queryKey: ['hero_journey_stats'],
      queryFn: () => getJourneyStats(),
    });
    await context.queryClient.ensureQueryData({
      queryKey: ['hero_journey_archetypes'],
      queryFn: () => getArchetypes(),
    });
  },
  component: Page,
});

function Page() {
  const { data: statsData } = useSuspenseQuery({
    queryKey: ['hero_journey_stats'],
    queryFn: () => getJourneyStats(),
  });
  const stats = statsData as any;
  
  const { data: userArchetypesData = [] } = useSuspenseQuery({
    queryKey: ['hero_journey_archetypes'],
    queryFn: () => getArchetypes(),
  });
  const userArchetypes = userArchetypesData as any[];

  const [showSplash, setShowSplash] = useState(false);
  const [userName, setUserName] = useState("Herói");

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        const p = profile as any;
        const name = p?.display_name || p?.full_name || "Herói";
        setUserName(name.split(' ')[0]);
      }
    };
    checkUser();
    
    const visited = localStorage.getItem('hero_journey_visited');
    if (!visited) {
      setShowSplash(true);
    }
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

  if (showSplash) {
    return <Splash userName={userName} onStart={handleStart} />;
  }

  return (
    <main className="relative min-h-screen pb-24 bg-background">
      <Link to="/home" className="fixed left-4 top-4 z-30 rounded-full glass p-2 text-foreground hover:bg-surface-elevated">
        <ArrowLeft className="h-4 w-4" />
      </Link>

      <section className="relative h-[60vh] overflow-hidden">
        <img src={hero} alt="Jornada do Herói" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
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

      <section className="mx-4 -mt-10 relative z-10 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:mx-auto lg:max-w-6xl">
        <StatCard icon={<Activity className="h-4 w-4 text-gold" />} label="Progresso" value={`${stats?.total_progress ?? 0}%`} />
        <StatCard icon={<Compass className="h-4 w-4 text-gold" />} label="Arquétipos" value={`${stats?.archetypes_explored ?? 0}/6`} />
        <StatCard icon={<Target className="h-4 w-4 text-gold" />} label="Missões" value={stats?.missions_completed ?? 0} />
        <StatCard icon={<Shield className="h-4 w-4 text-gold" />} label="Consciência" value={`Nível ${stats?.consciousness_level ?? 1}`} />
      </section>

      <section className="mx-4 mt-12 lg:mx-auto lg:max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h2 className="font-display text-2xl text-foreground">MAPA DO HERÓI INTERIOR</h2>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Explore as estações da sua consciência</p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Object.values(ARCHETYPES_CONTENT).map((arch) => (
            <ArchetypeCard 
              key={arch.id}
              archetype={arch}
              status={getStatus(arch.id)}
              progress={getProgress(arch.id)}
              onClick={() => navigate({ to: `/hero-journey/archetype/${arch.id}` })}
            />
          ))}
          {['altruista', 'nomade', 'mago'].filter(id => !ARCHETYPES_CONTENT[id]).map(id => (
             <div key={id} className="relative overflow-hidden rounded-3xl border border-border/50 opacity-50 glass p-6 h-[280px] flex flex-col justify-center items-center text-center gap-4">
                <Lock className="h-8 w-8 text-muted-foreground" />
                <div>
                   <h3 className="font-display text-xl text-foreground uppercase">{id}</h3>
                   <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Em desenvolvimento</p>
                </div>
             </div>
          ))}
        </div>
      </section>

      <section className="mx-4 mt-20 lg:mx-auto lg:max-w-6xl">
        <p className="mb-4 text-[10px] uppercase tracking-widest text-gold">Recurso Adicional</p>
        <div className="relative overflow-hidden rounded-3xl border border-border shadow-elevated">
          <img src={s1} alt="Herói Interior Video" className="h-64 w-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute bottom-0 p-8">
            <h3 className="font-display text-2xl text-foreground uppercase tracking-tight">Aula: Código da Mente Extraordinária</h3>
            <p className="mt-2 max-w-lg text-sm text-muted-foreground">Assista à aula fundamental que serve como base para toda a jornada de reprogramação.</p>
            <a href="https://youtu.be/Ql3H9jAvDrY" target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-glow hover:scale-105 transition-transform">
              <Play className="h-4 w-4 fill-current" /> Assistir Aula
            </a>
          </div>
        </div>
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
