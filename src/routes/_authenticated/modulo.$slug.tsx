import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Play, CheckCircle2, Clock, Sparkles, Loader2, ChevronRight, X, MessageCircle } from "lucide-react";

const COMMUNITY_URL = "https://chat.whatsapp.com/HkeVK7E2sVPJiSyrUPV9MN?s=cl&p=a&ilr=0";
import m1Asset from "@/assets/cover-1.png.asset.json";
const m1 = m1Asset.url;
import m2Asset from "@/assets/cover-2.png.asset.json";
const m2 = m2Asset.url;
import m3Asset from "@/assets/cover-3.png.asset.json";
const m3 = m3Asset.url;
import m4Asset from "@/assets/cover-4.png.asset.json";
const m4 = m4Asset.url;
import m5Asset from "@/assets/cover-5.png.asset.json";
const m5 = m5Asset.url;
import m6Asset from "@/assets/cover-6.png.asset.json";
const m6 = m6Asset.url;

const COVER_BY_ORDER: Record<number, string> = { 1: m1, 2: m2, 3: m3, 4: m4, 5: m5, 6: m6 };

export const Route = createFileRoute("/_authenticated/modulo/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `Módulo — Instituto Neuroconsciência` },
      { name: "description", content: `Aulas e progresso do módulo ${params.slug}.` },
    ],
  }),
  component: ModulePage,
});

type ModuleRow = {
  id: string; slug: string; name: string; short_description: string; long_description: string | null;
  order_index: number; lessons_count: number;
};
type Lesson = {
  id: string; order_index: number; title: string; description: string;
  duration_minutes: number; video_url: string | null;
};
type Progress = { lesson_id: string; status: string };

function youtubeId(url: string | null): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

function youtubeThumb(url: string | null): string | null {
  const id = youtubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}



function ModulePage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const [mod, setMod] = useState<ModuleRow | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<Record<string, string>>({});
  const [modules, setModules] = useState<ModuleRow[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [playing, setPlaying] = useState<Lesson | null>(null);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (slug === "treinamento-premium") {
      navigate({ to: "/treinamento-premium", replace: true });
      return;
    }
    if (slug === "reprogramacao-mental") {
      navigate({ to: "/reprogramacao-mental", replace: true });
      return;
    }
    if (slug === "ferramentas-de-crescimento") {
      navigate({ to: "/ferramentas", replace: true });
      return;
    }
    if (slug === "bonus-exclusivos") {
      navigate({ to: "/bonus", replace: true });
      return;
    }
  }, [slug, navigate]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: u } = await supabase.auth.getUser();
      const uid = u.user?.id ?? null;
      setUserId(uid);

      const { data: mods } = await supabase.from("modules").select("*").order("order_index");
      const all = (mods ?? []) as ModuleRow[];
      setModules(all);
      const current = all.find((m) => m.slug === slug) ?? null;
      setMod(current);

      if (current) {
        const { data: les } = await supabase
          .from("lessons").select("*").eq("module_id", current.id).order("order_index");
        setLessons((les ?? []) as Lesson[]);

        if (uid && les?.length) {
          const { data: prog } = await supabase
            .from("user_lesson_progress").select("lesson_id, status")
            .eq("user_id", uid).in("lesson_id", les.map((l) => l.id));
          const map: Record<string, string> = {};
          for (const p of (prog ?? []) as Progress[]) map[p.lesson_id] = p.status;
          setProgress(map);
        }
      }
      setLoading(false);
    })();
  }, [slug]);

  const completedCount = lessons.filter((l) => progress[l.id] === "completed").length;
  const percent = lessons.length ? Math.round((completedCount / lessons.length) * 100) : 0;
  const totalMin = lessons.reduce((a, l) => a + l.duration_minutes, 0);
  const nextLesson =
    lessons.find((l) => progress[l.id] !== "completed") ?? lessons[0];

  const updateModuleProgress = async (uid: string, completed: number) => {
    if (!mod) return;
    const p = lessons.length ? Math.round((completed / lessons.length) * 100) : 0;
    await supabase.from("user_module_progress").upsert(
      { user_id: uid, module_id: mod.id, percent: p, lessons_completed: completed, last_accessed_at: new Date().toISOString() },
      { onConflict: "user_id,module_id" },
    );
  };

  const toggleLesson = async (lesson: Lesson) => {
    if (!userId) return;
    const isCompleted = progress[lesson.id] === "completed";
    const newStatus = isCompleted ? "in_progress" : "completed";
    setProgress((p) => ({ ...p, [lesson.id]: newStatus }));

    await supabase.from("user_lesson_progress").upsert(
      {
        user_id: userId, lesson_id: lesson.id, status: newStatus,
        completed_at: newStatus === "completed" ? new Date().toISOString() : null,
      },
      { onConflict: "user_id,lesson_id" },
    );

    const newCompleted = lessons.filter((l) =>
      l.id === lesson.id ? newStatus === "completed" : progress[l.id] === "completed",
    ).length;
    await updateModuleProgress(userId, newCompleted);
  };

  const startLesson = async (lesson: Lesson) => {
    if (lesson.video_url) setPlaying(lesson);
    if (!userId) return;
    if (progress[lesson.id] !== "completed") {
      setProgress((p) => ({ ...p, [lesson.id]: "in_progress" }));
      await supabase.from("user_lesson_progress").upsert(
        { user_id: userId, lesson_id: lesson.id, status: "in_progress" },
        { onConflict: "user_id,lesson_id" },
      );
      const newCompleted = lessons.filter((l) => progress[l.id] === "completed").length;
      await updateModuleProgress(userId, newCompleted);
    }
  };

  const nextModule = mod ? modules.find((m) => m.order_index === mod.order_index + 1) : null;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }
  if (!mod) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Módulo não encontrado.</p>
        <Link to="/home" className="mt-4 inline-block text-gold underline">Voltar</Link>
      </div>
    );
  }

  const cover = COVER_BY_ORDER[mod.order_index] ?? m1;

  return (
    <main className="relative">
      {/* PARALLAX HERO */}
      <header className="relative h-[70vh] min-h-[420px] overflow-hidden">
        <div
          className="absolute inset-0 will-change-transform"
          style={{ transform: `translateY(${scrollY * 0.35}px) scale(1.1)` }}
        >
          <img src={cover} alt={mod.name} className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-transparent" aria-hidden />

        <button
          onClick={() => navigate({ to: "/home" })}
          className="absolute left-4 top-6 z-20 flex items-center gap-2 rounded-full glass px-4 py-2 text-sm text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </button>

        <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-10">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full glass px-3 py-1 text-[10px] uppercase tracking-widest text-gold">
            <Sparkles className="h-3 w-3" /> Módulo {String(mod.order_index).padStart(2, "0")}
          </span>
          <h1 className="font-display text-4xl leading-tight text-foreground sm:text-6xl animate-fade-in">
            {mod.name}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Sua transformação começa aqui. Conheça a plataforma, entenda sua jornada e descubra como aproveitar ao máximo todos os recursos disponíveis.
          </p>
        </div>
      </header>

      {/* STATS + PROGRESS */}
      <section className="mx-4 -mt-16 relative z-10 rounded-3xl border border-border glass-strong p-5 sm:p-6 shadow-elevated">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="Total de aulas" value={String(lessons.length)} />
          <Stat label="Tempo estimado" value={`${totalMin} min`} />
          <Stat label="Concluído" value={`${percent}%`} highlight />
          <Stat label="Aulas finalizadas" value={`${completedCount}/${lessons.length}`} />
        </div>
        <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--gold)] transition-all duration-700"
            style={{ width: `${percent}%` }}
          />
        </div>
        {nextLesson && (
          <button
            onClick={() => startLesson(nextLesson)}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:brightness-110 active:scale-95 sm:w-auto"
          >
            <Play className="h-4 w-4 fill-current" />
            {completedCount === 0 ? "Começar jornada" : "Continuar de onde parou"}
          </button>
        )}
      </section>

      {/* LESSONS LIST */}
      <section className="mx-4 mt-10">
        <h2 className="font-display text-2xl text-foreground">Aulas do módulo</h2>
        <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">Episódios cinematográficos</p>

        <div className="mt-6 space-y-4">
          {lessons.map((lesson) => {
            const status = progress[lesson.id] ?? "not_started";
            const isCompleted = status === "completed";
            const inProgress = status === "in_progress";
            const cover = youtubeThumb(lesson.video_url) ?? COVER_BY_ORDER[mod.order_index] ?? m1;

            return (
              <article
                key={lesson.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all hover:border-gold/40 hover:shadow-glow sm:flex-row"
              >
                <div className="relative aspect-video w-full shrink-0 overflow-hidden sm:w-56">
                  <img src={cover} alt={lesson.title} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute left-3 top-3 rounded-full glass px-2 py-0.5 text-[10px] font-medium tracking-widest text-gold">
                    AULA {String(lesson.order_index).padStart(2, "0")}
                  </span>
                  <button
                    onClick={() => startLesson(lesson)}
                    className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
                      <Play className="h-5 w-5 fill-current text-primary-foreground" />
                    </span>
                  </button>
                </div>

                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-lg text-foreground">{lesson.title}</h3>
                      {isCompleted && <CheckCircle2 className="h-5 w-5 shrink-0 text-gold" />}
                    </div>
                    <p className="mt-1.5 text-sm text-muted-foreground">{lesson.description}</p>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" /> {lesson.duration_minutes} min
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] uppercase tracking-widest ${
                          isCompleted
                            ? "bg-gold/15 text-gold"
                            : inProgress
                            ? "bg-primary/20 text-primary-foreground"
                            : "glass"
                        }`}
                      >
                        {isCompleted ? "Concluída" : inProgress ? "Em andamento" : "Não iniciada"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleLesson(lesson)}
                        className="rounded-full glass px-3 py-2 text-xs text-foreground transition hover:bg-surface-elevated"
                      >
                        {isCompleted ? "Reabrir" : "Marcar concluída"}
                      </button>
                      <button
                        onClick={() => startLesson(lesson)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-gradient-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow-glow transition hover:brightness-110"
                      >
                        <Play className="h-3.5 w-3.5 fill-current" /> Assistir
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
          {lessons.length === 0 && (
            <p className="rounded-2xl border border-border glass p-6 text-center text-sm text-muted-foreground">
              As aulas deste módulo estarão disponíveis em breve.
            </p>
          )}
        </div>
      </section>

      {/* EVOLUÇÃO */}
      <section className="mx-4 mt-12 rounded-3xl border border-border glass-strong p-6 sm:p-8">
        <h2 className="font-display text-2xl text-foreground">Sua evolução neste módulo</h2>
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="Aulas concluídas" value={`${completedCount}`} />
          <Stat label="Tempo estudado" value={`${lessons.filter((l) => progress[l.id] === "completed").reduce((a, l) => a + l.duration_minutes, 0)} min`} />
          <Stat label="Percentual" value={`${percent}%`} highlight />
          <Stat label="Próxima aula" value={nextLesson ? `Aula ${nextLesson.order_index}` : "—"} />
        </div>
        {nextLesson && (
          <p className="mt-4 text-sm text-muted-foreground">
            Recomendação: <span className="text-foreground">{nextLesson.title}</span>
          </p>
        )}
      </section>

      {/* SUA MISSÃO */}
      <section className="mx-4 mt-8 overflow-hidden rounded-3xl border border-border bg-gradient-primary p-8 shadow-glow">
        <h2 className="font-display text-3xl text-primary-foreground">Sua Missão</h2>
        <p className="mt-3 max-w-2xl text-sm text-primary-foreground/90">
          Cada aula concluída é um passo em direção à sua nova versão. Não interrompa o momentum — sua consistência é o que separa quem sonha de quem transforma. Continue avançando, um episódio de cada vez.
        </p>
      </section>

      {/* CONTINUAR JORNADA */}
      {nextModule && (
        <section className="mx-4 mt-8 mb-4 flex justify-end">
          <Link
            to="/modulo/$slug"
            params={{ slug: nextModule.slug }}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:brightness-110 active:scale-95"
          >
            Continuar Jornada — {nextModule.name}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </section>
      )}

      {/* PLAYER INTERNO */}
      {playing && youtubeId(playing.video_url) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 p-4 backdrop-blur-md"
          onClick={() => setPlaying(null)}
        >
          <div className="w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between gap-4">
              <h3 className="font-display text-lg text-foreground">{playing.title}</h3>
              <button
                onClick={() => setPlaying(null)}
                aria-label="Fechar"
                className="flex h-9 w-9 items-center justify-center rounded-full glass text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="aspect-video w-full overflow-hidden rounded-2xl border border-border bg-black shadow-elevated">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${youtubeId(playing.video_url)}?autoplay=1&rel=0&modestbranding=1`}
                title={playing.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
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
