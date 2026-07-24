import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Play, CheckCircle2, Loader2, Clock, Sparkles, ChevronRight, Trophy, LinkIcon } from "lucide-react";
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

export const Route = createFileRoute("/_authenticated/treinamento-premium/nivel/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `Temporada — Treinamento Premium` },
      { name: "description", content: `Episódios e progresso da temporada ${params.slug}.` },
    ],
  }),
  component: LevelPage,
});

type Level = {
  id: string; slug: string; order_index: number; name: string;
  theme: string; objective: string; final_message: string | null; cover_key: string;
};
type Workshop = { id: string; order_index: number; title: string; duration_minutes: number; video_url: string | null };

function LevelPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const [level, setLevel] = useState<Level | null>(null);
  const [nextLevel, setNextLevel] = useState<Level | null>(null);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [progress, setProgress] = useState<Record<string, string>>({});
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [celebrate, setCelebrate] = useState(false);
  const [linkModal, setLinkModal] = useState<Workshop | null>(null);
  const [linkValue, setLinkValue] = useState("");

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const load = async () => {
    setLoading(true);
    const { data: u } = await supabase.auth.getUser();
    const uid = u.user?.id ?? null;
    setUserId(uid);

    const { data: lvls } = await supabase.from("premium_levels").select("*").order("order_index");
    const all = (lvls ?? []) as Level[];
    const cur = all.find((l) => l.slug === slug) ?? null;
    setLevel(cur);
    setNextLevel(cur ? all.find((l) => l.order_index === cur.order_index + 1) ?? null : null);

    if (cur) {
      const { data: ws } = await supabase.from("premium_workshops")
        .select("*").eq("level_id", cur.id).order("order_index");
      const list = (ws ?? []) as Workshop[];
      setWorkshops(list);

      if (uid && list.length) {
        const { data: prog } = await supabase.from("user_workshop_progress")
          .select("workshop_id, status").eq("user_id", uid).in("workshop_id", list.map((w) => w.id));
        const map: Record<string, string> = {};
        for (const p of prog ?? []) map[(p as any).workshop_id] = (p as any).status;
        setProgress(map);
      }
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [slug]);

  const completed = workshops.filter((w) => progress[w.id] === "completed").length;
  const percent = workshops.length ? Math.round((completed / workshops.length) * 100) : 0;
  const totalMin = workshops.reduce((a, w) => a + w.duration_minutes, 0);
  const doneMin = workshops.filter((w) => progress[w.id] === "completed").reduce((a, w) => a + w.duration_minutes, 0);
  const nextWs = useMemo(() => workshops.find((w) => progress[w.id] !== "completed") ?? workshops[0], [workshops, progress]);

  const updateLevelProgress = async (uid: string, completedNow: number) => {
    if (!level) return;
    const p = workshops.length ? Math.round((completedNow / workshops.length) * 100) : 0;
    await supabase.from("user_level_progress").upsert({
      user_id: uid, level_id: level.id, percent: p, workshops_completed: completedNow,
      last_accessed_at: new Date().toISOString(),
    }, { onConflict: "user_id,level_id" });
  };

  const toggleWorkshop = async (ws: Workshop) => {
    if (!userId) return;
    const isDone = progress[ws.id] === "completed";
    const newStatus = isDone ? "in_progress" : "completed";
    setProgress((p) => ({ ...p, [ws.id]: newStatus }));

    await supabase.from("user_workshop_progress").upsert({
      user_id: userId, workshop_id: ws.id, status: newStatus,
      completed_at: newStatus === "completed" ? new Date().toISOString() : null,
    }, { onConflict: "user_id,workshop_id" });

    const newDone = workshops.filter((w) => (w.id === ws.id ? newStatus === "completed" : progress[w.id] === "completed")).length;
    await updateLevelProgress(userId, newDone);
    if (newStatus === "completed" && newDone === workshops.length) setCelebrate(true);
  };

  const startWorkshop = async (ws: Workshop) => {
    if (!userId) return;
    if (progress[ws.id] !== "completed") {
      setProgress((p) => ({ ...p, [ws.id]: "in_progress" }));
      await supabase.from("user_workshop_progress").upsert({
        user_id: userId, workshop_id: ws.id, status: "in_progress",
      }, { onConflict: "user_id,workshop_id" });
      const done = workshops.filter((w) => progress[w.id] === "completed").length;
      await updateLevelProgress(userId, done);
    }
    if (ws.video_url) window.open(ws.video_url, "_blank");
    else setLinkModal(ws);
  };

  const saveLink = async () => {
    if (!linkModal || !linkValue.trim()) return;
    await supabase.from("premium_workshops").update({ video_url: linkValue.trim() }).eq("id", linkModal.id);
    setLinkModal(null); setLinkValue("");
    load();
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>;
  if (!level) return (
    <div className="p-8 text-center">
      <p className="text-muted-foreground">Temporada não encontrada.</p>
      <Link to="/treinamento-premium" className="mt-4 inline-block text-gold underline">Voltar</Link>
    </div>
  );

  const cover = COVER[level.cover_key] ?? l1;

  return (
    <main className="relative">
      {/* HERO */}
      <header className="relative h-[68vh] min-h-[440px] overflow-hidden">
        <div className="absolute inset-0 will-change-transform" style={{ transform: `translateY(${scrollY * 0.35}px) scale(1.12)` }}>
          <img src={cover} alt={level.name} className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-background/20" />
        <div className="absolute inset-0 bg-vignette" />

        <button onClick={() => navigate({ to: "/treinamento-premium" })}
          className="absolute left-4 top-6 z-20 flex items-center gap-2 rounded-full glass px-4 py-2 text-sm text-foreground">
          <ArrowLeft className="h-4 w-4" /> Temporadas
        </button>

        <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-10">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full glass px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-gold">
            <Sparkles className="h-3 w-3" /> Temporada {String(level.order_index).padStart(2, "0")}
          </span>
          <h1 className="font-display text-4xl leading-tight text-foreground sm:text-6xl animate-fade-in">{level.name}</h1>
          <p className="mt-3 text-sm text-gold/90 sm:text-base">{level.theme}</p>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{level.objective}</p>
        </div>
      </header>

      {/* STATS */}
      <section className="mx-4 -mt-16 relative z-10 rounded-3xl border border-border glass-strong p-5 sm:p-6 shadow-elevated">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="Episódios" value={String(workshops.length)} />
          <Stat label="Tempo estimado" value={`${totalMin} min`} />
          <Stat label="Concluído" value={`${percent}%`} highlight />
          <Stat label="Finalizados" value={`${completed}/${workshops.length}`} />
        </div>
        <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-white/5">
          <div className="h-full bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--gold)] transition-all duration-700" style={{ width: `${percent}%` }} />
        </div>
        {nextWs && (
          <button onClick={() => startWorkshop(nextWs)}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:brightness-110 active:scale-95 sm:w-auto">
            <Play className="h-4 w-4 fill-current" />
            {completed === 0 ? "Começar temporada" : "Continuar assistindo"}
          </button>
        )}
      </section>

      {/* EPISODES */}
      <section className="mx-4 mt-10">
        <h2 className="font-display text-2xl text-foreground">Episódios</h2>
        <p className="mt-1 text-xs uppercase tracking-[0.25em] text-muted-foreground">Assista em ordem para melhor experiência</p>

        <div className="mt-6 space-y-4">
          {workshops.map((ws) => {
            const status = progress[ws.id] ?? "not_started";
            const isDone = status === "completed";
            const inProg = status === "in_progress";
            const hasLink = !!ws.video_url;
            return (
              <article key={ws.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all hover:border-gold/40 hover:shadow-glow sm:flex-row">
                <div className="relative aspect-video w-full shrink-0 overflow-hidden sm:w-60">
                  <img src={cover} alt={ws.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <span className="absolute left-3 top-3 rounded-full glass px-2 py-0.5 text-[10px] font-medium tracking-widest text-gold">
                    EP {String(ws.order_index).padStart(2, "0")}
                  </span>
                  <button onClick={() => startWorkshop(ws)}
                    className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
                      <Play className="h-5 w-5 fill-current text-primary-foreground" />
                    </span>
                  </button>
                </div>
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-lg text-foreground">{ws.title}</h3>
                      {isDone && <CheckCircle2 className="h-5 w-5 shrink-0 text-gold" />}
                    </div>
                    {!hasLink && (
                      <p className="mt-1.5 text-xs italic text-muted-foreground">Link será adicionado futuramente.</p>
                    )}
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {ws.duration_minutes} min</span>
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] uppercase tracking-widest ${
                        isDone ? "bg-gold/15 text-gold" : inProg ? "bg-primary/20 text-primary-foreground" : "glass"
                      }`}>
                        {isDone ? "Concluído" : inProg ? "Em andamento" : "Não iniciado"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleWorkshop(ws)}
                        className="rounded-full glass px-3 py-2 text-xs text-foreground transition hover:bg-surface-elevated">
                        {isDone ? "Reabrir" : "Marcar concluído"}
                      </button>
                      {hasLink ? (
                        <button onClick={() => startWorkshop(ws)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow-glow transition hover:brightness-110">
                          <Play className="h-3.5 w-3.5 fill-current" /> Assistir
                        </button>
                      ) : (
                        <button onClick={() => { setLinkModal(ws); setLinkValue(""); }}
                          className="inline-flex items-center gap-1.5 rounded-full glass px-4 py-2 text-xs text-foreground transition hover:bg-surface-elevated">
                          <LinkIcon className="h-3.5 w-3.5" /> Adicionar Link
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

      {level.final_message && (
        <section className="mx-4 mt-10 rounded-3xl border border-border bg-gradient-to-br from-primary/20 to-surface p-8 shadow-elevated">
          <p className="font-display text-xl italic text-foreground sm:text-2xl">"{level.final_message}"</p>
        </section>
      )}

      {/* CELEBRATION */}
      {celebrate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xl p-6 animate-fade-in">
          <div className="relative max-w-lg overflow-hidden rounded-3xl border border-gold/40 bg-gradient-to-br from-surface-elevated to-surface p-8 text-center shadow-glow animate-scale-in">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-gold animate-pulse-glow">
              <Trophy className="h-10 w-10 text-background" />
            </div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Temporada concluída</p>
            <h3 className="mt-2 font-display text-3xl text-foreground">{level.name}</h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Você concluiu {workshops.length} episódios · {doneMin} min de estudo. Sua jornada continua — cada temporada te aproxima da sua nova versão.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button onClick={() => setCelebrate(false)}
                className="rounded-full glass px-5 py-2.5 text-sm text-foreground">Ficar aqui</button>
              {nextLevel && (
                <Link to="/treinamento-premium/nivel/$slug" params={{ slug: nextLevel.slug }}
                  onClick={() => setCelebrate(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-glow">
                  Iniciar Próximo Nível <ChevronRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* LINK MODAL */}
      {linkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xl p-6" onClick={() => setLinkModal(null)}>
          <div className="w-full max-w-md rounded-3xl border border-border glass-strong p-6 shadow-elevated animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-xl text-foreground">Adicionar link do episódio</h3>
            <p className="mt-1 text-sm text-muted-foreground">{linkModal.title}</p>
            <input value={linkValue} onChange={(e) => setLinkValue(e.target.value)}
              placeholder="https://..." autoFocus
              className="mt-4 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none focus:border-primary" />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setLinkModal(null)} className="rounded-full glass px-4 py-2 text-xs text-foreground">Cancelar</button>
              <button onClick={saveLink} className="rounded-full bg-gradient-primary px-5 py-2 text-xs font-medium text-primary-foreground shadow-glow">Salvar</button>
            </div>
          </div>
        </div>
      )}

      {/* NEXT LEVEL */}
      {nextLevel && (
        <section className="mx-4 mt-8 mb-4 flex justify-end">
          <Link to="/treinamento-premium/nivel/$slug" params={{ slug: nextLevel.slug }}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:brightness-110 active:scale-95">
            Próxima Temporada — {nextLevel.name}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </section>
      )}
    </main>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl border border-border p-4 ${highlight ? "bg-gradient-primary shadow-glow" : "glass"}`}>
      <p className={`text-[10px] uppercase tracking-widest ${highlight ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{label}</p>
      <p className={`mt-1 font-display text-xl ${highlight ? "text-primary-foreground" : "text-foreground"}`}>{value}</p>
    </div>
  );
}
