import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Play, Sparkles, Lock, CheckCircle2, Loader2, ChevronRight, Trophy, Clock, Layers } from "lucide-react";
import { unlockDateFrom, isLocked, countdownLabel, PREMIUM_LOCK_DAYS } from "@/lib/premium-lock";

import heroImg from "@/assets/premium-hero.jpg";
import l1 from "@/assets/level-1.jpg";
import l2 from "@/assets/level-2.jpg";
import l3 from "@/assets/level-3.jpg";
import l4 from "@/assets/level-4.jpg";
import l5 from "@/assets/level-5.jpg";
import l6 from "@/assets/level-6.jpg";
import l7 from "@/assets/level-7.jpg";

const COVER: Record<string, string> = {
  "level-1": l1, "level-2": l2, "level-3": l3, "level-4": l4,
  "level-5": l5, "level-6": l6, "level-7": l7,
};

export const Route = createFileRoute("/_authenticated/treinamento-premium")({
  head: () => ({
    meta: [
      { title: "Treinamento Premium — Jornada da Transformação" },
      { name: "description", content: "Sua jornada progressiva em 7 temporadas para transformar mente, emoções e propósito." },
      { property: "og:title", content: "Treinamento Premium — Instituto Neuroconsciência" },
      { property: "og:description", content: "Experiência cinematográfica de desenvolvimento humano." },
    ],
  }),
  component: PremiumPage,
});

type Level = {
  id: string; slug: string; order_index: number; name: string;
  theme: string; objective: string; final_message: string | null; cover_key: string;
};
type Workshop = { id: string; level_id: string; order_index: number; title: string; duration_minutes: number; video_url: string | null };
type LevelProg = { level_id: string; percent: number; workshops_completed: number };

function PremiumPage() {
  const navigate = useNavigate();
  const [levels, setLevels] = useState<Level[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [wsProgress, setWsProgress] = useState<Record<string, string>>({});
  const [lvlProgress, setLvlProgress] = useState<Record<string, LevelProg>>({});
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [unlockAt, setUnlockAt] = useState<Date | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      const uid = u.user?.id;
      setUnlockAt(unlockDateFrom(u.user?.created_at));

      const [{ data: lvls }, { data: wks }] = await Promise.all([
        supabase.from("premium_levels").select("*").order("order_index"),
        supabase.from("premium_workshops").select("*").order("order_index"),
      ]);
      setLevels((lvls ?? []) as Level[]);
      setWorkshops((wks ?? []) as Workshop[]);

      if (uid) {
        const [{ data: wp }, { data: lp }] = await Promise.all([
          supabase.from("user_workshop_progress").select("workshop_id, status").eq("user_id", uid),
          supabase.from("user_level_progress").select("level_id, percent, workshops_completed").eq("user_id", uid),
        ]);
        const wsMap: Record<string, string> = {};
        for (const p of wp ?? []) wsMap[(p as any).workshop_id] = (p as any).status;
        setWsProgress(wsMap);
        const lvlMap: Record<string, LevelProg> = {};
        for (const p of lp ?? []) lvlMap[(p as any).level_id] = p as any;
        setLvlProgress(lvlMap);
      }
      setLoading(false);
    })();
  }, []);

  const stats = useMemo(() => {
    const totalLevels = levels.length;
    const totalWorkshops = workshops.length;
    const totalMin = workshops.reduce((a, w) => a + w.duration_minutes, 0);
    const completedWs = workshops.filter((w) => wsProgress[w.id] === "completed").length;
    const percent = totalWorkshops ? Math.round((completedWs / totalWorkshops) * 100) : 0;
    return { totalLevels, totalWorkshops, totalMin, completedWs, percent };
  }, [levels, workshops, wsProgress]);

  const nextWorkshop = useMemo(() => {
    for (const l of levels) {
      const ws = workshops.filter((w) => w.level_id === l.id).sort((a, b) => a.order_index - b.order_index);
      const next = ws.find((w) => wsProgress[w.id] !== "completed");
      if (next) return { level: l, workshop: next };
    }
    return null;
  }, [levels, workshops, wsProgress]);

  const isLevelUnlocked = (idx: number) => {
    if (idx === 0) return true;
    const prev = levels[idx - 1];
    if (!prev) return true;
    const p = lvlProgress[prev.id];
    return (p?.percent ?? 0) >= 100;
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>;
  }

  void now;
  if (isLocked(unlockAt)) {
    return (
      <main className="relative min-h-screen">
        <div className="absolute inset-0">
          <img src={heroImg} alt="" className="h-full w-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/70" aria-hidden />
        </div>
        <div className="relative z-10 mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full glass-strong shadow-glow">
            <Lock className="h-8 w-8 text-gold" />
          </span>
          <h1 className="mt-6 font-display text-4xl text-foreground">Treinamento Premium</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Este módulo é liberado {PREMIUM_LOCK_DAYS} dias após a criação da sua conta.
            Use esse tempo para concluir os módulos iniciais e preparar sua mente para a jornada.
          </p>
          <div className="mt-8 rounded-2xl border border-border glass px-8 py-6">
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Libera em</p>
            <p className="mt-2 font-display text-3xl text-gold">{countdownLabel(unlockAt)}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              {unlockAt?.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
            </p>
          </div>
          <button onClick={() => navigate({ to: "/home" })}
            className="mt-8 inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm text-foreground transition hover:bg-surface-elevated">
            <ArrowLeft className="h-4 w-4" /> Voltar para a Home
          </button>
        </div>
      </main>
    );
  }


  return (
    <main className="relative">
      {/* HERO */}
      <header className="relative h-[80vh] min-h-[520px] overflow-hidden">
        <div className="absolute inset-0 will-change-transform" style={{ transform: `translateY(${scrollY * 0.4}px) scale(1.15)` }}>
          <img src={heroImg} alt="Treinamento Premium" className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/30" aria-hidden />
        <div className="absolute inset-0 bg-vignette" aria-hidden />

        <button onClick={() => navigate({ to: "/home" })}
          className="absolute left-4 top-6 z-20 flex items-center gap-2 rounded-full glass px-4 py-2 text-sm text-foreground">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </button>

        <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-12">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-[10px] uppercase tracking-[0.25em] text-gold">
            <Sparkles className="h-3 w-3" /> Módulo Principal · 7 Temporadas
          </span>
          <h1 className="font-display text-4xl leading-[1.05] text-foreground sm:text-6xl md:text-7xl animate-fade-in max-w-4xl">
            Jornada da Transformação<br />da Mente e da Consciência
          </h1>
          <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Uma jornada progressiva para desenvolver inteligência emocional, reprogramar padrões mentais,
            fortalecer sua identidade e construir uma vida com propósito.
          </p>
        </div>
      </header>

      {/* STATS CARD */}
      <section className="mx-4 -mt-20 relative z-10 rounded-3xl border border-border glass-strong p-6 sm:p-8 shadow-elevated">
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
          <Stat icon={<Layers className="h-4 w-4" />} label="Temporadas" value={String(stats.totalLevels)} />
          <Stat icon={<Play className="h-4 w-4" />} label="Episódios" value={String(stats.totalWorkshops)} />
          <Stat icon={<Clock className="h-4 w-4" />} label="Tempo total" value={`${Math.round(stats.totalMin / 60)}h`} />
          <Stat icon={<Trophy className="h-4 w-4" />} label="Concluído" value={`${stats.percent}%`} highlight />
        </div>
        <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-white/5">
          <div className="h-full bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--gold)] transition-all duration-700"
            style={{ width: `${stats.percent}%` }} />
        </div>
        {nextWorkshop && (
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/treinamento-premium/nivel/$slug" params={{ slug: nextWorkshop.level.slug }}
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:brightness-110 active:scale-95">
              <Play className="h-4 w-4 fill-current" />
              {stats.completedWs === 0 ? "Continuar Jornada" : "Continuar Jornada"}
            </Link>
            <Link to="/treinamento-premium/nivel/$slug" params={{ slug: nextWorkshop.level.slug }}
              className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-medium text-foreground transition hover:bg-surface-elevated">
              Retomar último episódio
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </section>

      {/* LEVELS */}
      <section className="mx-4 mt-12">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl text-foreground">Temporadas</h2>
            <p className="mt-1 text-xs uppercase tracking-[0.25em] text-muted-foreground">7 níveis · progressão desbloqueável</p>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          {levels.map((lvl, idx) => {
            const cover = COVER[lvl.cover_key] ?? l1;
            const lvlWs = workshops.filter((w) => w.level_id === lvl.id);
            const prog = lvlProgress[lvl.id];
            const percent = prog?.percent ?? 0;
            const unlocked = isLevelUnlocked(idx);
            const completed = percent >= 100;
            const status = !unlocked ? "Bloqueado" : completed ? "Concluído" : percent > 0 ? "Em andamento" : "Disponível";

            return (
              <article key={lvl.id}
                className={`group relative overflow-hidden rounded-3xl border border-border glass-strong shadow-elevated transition-all duration-500 hover:-translate-y-1 hover:shadow-glow ${!unlocked ? "opacity-70" : ""}`}>
                <div className="flex flex-col md:flex-row">
                  <div className="relative h-64 w-full shrink-0 overflow-hidden md:h-auto md:w-[42%]">
                    <img src={cover} alt={lvl.name} loading="lazy" width={1600} height={900}
                      className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/60 md:bg-gradient-to-r md:from-transparent md:to-background/80" />
                    <span className="absolute left-4 top-4 rounded-full bg-gradient-primary px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-primary-foreground shadow-glow">
                      Temporada {String(lvl.order_index).padStart(2, "0")}
                    </span>
                    {!unlocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <Lock className="h-8 w-8" />
                          <span className="text-xs uppercase tracking-widest">Complete a anterior</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-display text-2xl text-foreground sm:text-3xl">{lvl.name}</h3>
                        {completed && <CheckCircle2 className="h-6 w-6 shrink-0 text-gold" />}
                      </div>
                      <p className="mt-2 text-sm text-gold/90">{lvl.theme}</p>
                      <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{lvl.objective}</p>
                    </div>

                    <div className="mt-6 space-y-4">
                      <div className="flex flex-wrap items-center gap-4 text-xs">
                        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                          <Play className="h-3.5 w-3.5" /> {lvlWs.length} episódios
                        </span>
                        <span className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-widest ${
                          completed ? "bg-gold/15 text-gold" : !unlocked ? "glass text-muted-foreground" :
                          percent > 0 ? "bg-primary/20 text-primary-foreground" : "glass"
                        }`}>{status}</span>
                      </div>

                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                        <div className="h-full bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--gold)] transition-all duration-700"
                          style={{ width: `${percent}%` }} />
                      </div>

                      {unlocked ? (
                        <Link to="/treinamento-premium/nivel/$slug" params={{ slug: lvl.slug }}
                          className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-glow transition hover:brightness-110 active:scale-95">
                          Explorar Nível <ChevronRight className="h-4 w-4" />
                        </Link>
                      ) : (
                        <button disabled className="inline-flex items-center gap-2 rounded-full glass px-5 py-2.5 text-sm text-muted-foreground">
                          <Lock className="h-4 w-4" /> Bloqueado
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* MINHA EVOLUÇÃO */}
      <section className="mx-4 mt-14 mb-6 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-surface-elevated to-surface p-6 sm:p-10 shadow-elevated">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-gold">
            <Trophy className="h-5 w-5 text-background" />
          </span>
          <div>
            <h2 className="font-display text-2xl text-foreground sm:text-3xl">Minha Evolução</h2>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Resumo da sua jornada</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="Temporadas concluídas" value={String(levels.filter((l) => (lvlProgress[l.id]?.percent ?? 0) >= 100).length)} />
          <Stat label="Episódios finalizados" value={String(stats.completedWs)} />
          <Stat label="Progresso geral" value={`${stats.percent}%`} highlight />
          <Stat label="Próximo passo" value={nextWorkshop ? `Temp. ${nextWorkshop.level.order_index}` : "—"} />
        </div>

        {nextWorkshop && (
          <div className="mt-6 rounded-2xl border border-border glass p-5">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Recomendação</p>
            <p className="mt-1 font-display text-lg text-foreground">{nextWorkshop.workshop.title}</p>
            <p className="text-sm text-muted-foreground">Temporada {nextWorkshop.level.order_index} — {nextWorkshop.level.name}</p>
            <Link to="/treinamento-premium/nivel/$slug" params={{ slug: nextWorkshop.level.slug }}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:brightness-110">
              <Play className="h-4 w-4 fill-current" /> Continuar de onde parou
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}

function Stat({ icon, label, value, highlight }: { icon?: React.ReactNode; label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl border border-border p-4 ${highlight ? "bg-gradient-primary shadow-glow" : "glass"}`}>
      <div className={`flex items-center gap-1.5 text-[10px] uppercase tracking-widest ${highlight ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
        {icon} {label}
      </div>
      <p className={`mt-1.5 font-display text-2xl ${highlight ? "text-primary-foreground" : "text-foreground"}`}>{value}</p>
    </div>
  );
}
