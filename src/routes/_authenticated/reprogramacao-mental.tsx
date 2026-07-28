import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Play, Clock, Sparkles, Flame, ChevronRight } from "lucide-react";
import heroAsset from "@/assets/cover-4.png.asset.json";
const hero = heroAsset.url;
import s1 from "@/assets/level-1.jpg";

export const Route = createFileRoute("/_authenticated/reprogramacao-mental")({
  head: () => ({
    meta: [
      { title: "Reprogramação Mental — Instituto Neuroconsciência" },
      { name: "description", content: "Ative seu Herói Interior e substitua padrões limitantes por uma nova identidade mental." },
      { property: "og:title", content: "Reprogramação Mental" },
      { property: "og:description", content: "Sessões imersivas de transformação profunda." },
    ],
  }),
  component: Page,
});

function youtubeId(url?: string | null): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

type Session = {
  slug: string; title: string; description: string; duration: number;
  cover: string; link?: string | null; status: "disponivel" | "em-breve";
};

const SESSIONS: Session[] = [
  { slug: "heroi-interior", title: "HERÓI INTERIOR", description: "Experiência guiada de fortalecimento emocional, redução da procrastinação e nova mentalidade consciente.", duration: 45, cover: s1, link: "https://youtu.be/Ql3H9jAvDrY", status: "disponivel" },
  { slug: "hipnose-guiada", title: "Hipnose Guiada", description: "Indução profunda para reprogramar padrões limitantes no subconsciente.", duration: 25, cover: s2, status: "em-breve" },
  { slug: "dominio-emocoes", title: "Domínio das Emoções", description: "Reconheça, nomeie e transmute emoções antes que elas conduzam suas decisões.", duration: 20, cover: s3, status: "em-breve" },
  { slug: "autocontrole-avancado", title: "Autocontrole Avançado", description: "Treine sua janela de escolha entre estímulo e resposta.", duration: 22, cover: s4, status: "em-breve" },
  { slug: "gestao-conflitos", title: "Gestão de Conflitos", description: "Resolva tensões com clareza mental e maturidade emocional.", duration: 18, cover: s5, status: "em-breve" },
  { slug: "comunicacao-consciente", title: "Comunicação Consciente", description: "Fale com verdade, escute com presença.", duration: 20, cover: s6, status: "em-breve" },
  { slug: "lideranca-exemplo", title: "Liderança pelo Exemplo", description: "Torne-se referência através de ações coerentes com sua nova identidade.", duration: 24, cover: s1, status: "em-breve" },
];

function Page() {
  const [scrollY, setScrollY] = useState(0);
  const [immersive, setImmersive] = useState<Session | null>(null);
  const [completed, setCompleted] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {};
    try { return JSON.parse(localStorage.getItem("rm-completed") ?? "{}"); } catch { return {}; }
  });

  useEffect(() => {
    const on = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const done = SESSIONS.filter(s => completed[s.slug]).length;
  const percent = Math.round((done / SESSIONS.length) * 100);
  const totalMin = SESSIONS.reduce((a, s) => a + s.duration, 0);

  const complete = (slug: string) => {
    const next = { ...completed, [slug]: true };
    setCompleted(next);
    localStorage.setItem("rm-completed", JSON.stringify(next));
  };

  if (immersive) {
    return (
      <div className="fixed inset-0 z-50 bg-background/98 backdrop-blur-xl">
        <div className="mx-auto flex h-full max-w-4xl flex-col p-6">
          <button onClick={() => setImmersive(null)} className="self-start text-sm text-muted-foreground hover:text-foreground">
            ← Sair da sessão
          </button>
          <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
            {youtubeId(immersive.link) ? (
              <div className="w-full overflow-hidden rounded-2xl border border-border bg-black">
                <iframe
                  className="aspect-video w-full"
                  src={`https://www.youtube-nocookie.com/embed/${youtubeId(immersive.link)}?autoplay=1&rel=0&modestbranding=1`}
                  title={immersive.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="animate-pulse-glow flex h-24 w-24 items-center justify-center rounded-full bg-gradient-primary">
                <Sparkles className="h-10 w-10 text-primary-foreground" />
              </div>
            )}
            <h2 className="font-display text-4xl text-foreground">{immersive.title}</h2>
            <p className="max-w-lg text-muted-foreground">{immersive.description}</p>
            {!immersive.link && (
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Conteúdo em breve</p>
            )}
            <button onClick={() => { complete(immersive.slug); setImmersive(null); }} className="rounded-full glass-strong px-6 py-3 text-sm text-foreground">
              Concluir Sessão
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="relative pb-24">
      <Link to="/home" className="fixed left-4 top-4 z-30 rounded-full glass p-2 text-foreground hover:bg-surface-elevated">
        <ArrowLeft className="h-4 w-4" />
      </Link>

      <section className="relative h-[70vh] overflow-hidden">
        <img src={hero} alt="Reprogramação Mental" className="absolute inset-0 h-full w-full object-cover"
             style={{ transform: `translateY(${scrollY * 0.35}px) scale(1.1)` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full glass px-3 py-1 text-[10px] uppercase tracking-widest text-gold">
            <Flame className="h-3 w-3" /> Módulo Imersivo
          </span>
          <h1 className="font-display text-4xl leading-tight text-foreground sm:text-6xl">REPROGRAMAÇÃO MENTAL</h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            Ative seu Herói Interior e substitua padrões limitantes por uma nova identidade mental.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {totalMin} min</span>
            <span>{done}/{SESSIONS.length} sessões</span>
            <span>{percent}% concluído</span>
          </div>
          <div className="mt-3 h-1 w-full max-w-md rounded-full bg-surface-elevated">
            <div className="h-full rounded-full bg-gradient-gold" style={{ width: `${percent}%` }} />
          </div>
          <button onClick={() => setImmersive(SESSIONS[0])} className="mt-5 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:brightness-110">
            <Play className="h-4 w-4 fill-current" /> Iniciar Sessão
          </button>
        </div>
      </section>

      {/* Protocolo Principal */}
      <section className="mx-4 mt-8">
        <p className="mb-3 text-[10px] uppercase tracking-widest text-gold">Protocolo Principal</p>
        <div className="relative overflow-hidden rounded-3xl border border-border shadow-elevated">
          <img src={SESSIONS[0].cover} alt="Herói Interior" className="h-56 w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute bottom-0 p-6">
            <h3 className="font-display text-2xl text-foreground">HERÓI INTERIOR</h3>
            <p className="mt-1 max-w-lg text-sm text-muted-foreground">{SESSIONS[0].description}</p>
            <button onClick={() => setImmersive(SESSIONS[0])} className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-glow">
              <Play className="h-3.5 w-3.5 fill-current" /> Iniciar Protocolo
            </button>
          </div>
        </div>
      </section>

      {/* Sessões */}
      <section className="mx-4 mt-10">
        <h2 className="mb-4 font-display text-2xl text-foreground">Sessões</h2>
        <div className="space-y-3">
          {SESSIONS.slice(1).map((s, i) => (
            <div key={s.slug} className="group flex gap-4 rounded-2xl border border-border glass p-3 transition-all hover:shadow-elevated">
              <div className="relative h-24 w-40 flex-shrink-0 overflow-hidden rounded-xl">
                <img src={s.cover} alt={s.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <span className="absolute left-2 top-2 rounded-full bg-background/70 px-2 py-0.5 text-[10px] font-medium text-foreground">
                  Ep. {i + 2}
                </span>
              </div>
              <div className="flex flex-1 flex-col justify-between py-1">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-lg text-foreground">{s.title}</h3>
                    {completed[s.slug] && <CheckCircle2 className="h-4 w-4 text-gold" />}
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{s.description}</p>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" /> {s.duration} min
                  </span>
                  <div className="flex items-center gap-2">
                    {!s.link && (
                      <button className="inline-flex items-center gap-1 rounded-full glass px-2.5 py-1 text-[10px] text-muted-foreground">
                        <Plus className="h-3 w-3" /> Adicionar Link
                      </button>
                    )}
                    <button onClick={() => setImmersive(s)} className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-[11px] font-medium text-background hover:brightness-110">
                      <Play className="h-3 w-3 fill-current" /> Assistir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Evolução */}
      <section className="mx-4 mt-10 rounded-3xl border border-border glass p-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-gold" />
          <h2 className="font-display text-xl text-foreground">Sua Evolução</h2>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Sessões concluídas" value={String(done)} />
          <Stat label="Dias consecutivos" value="1" />
          <Stat label="Tempo acumulado" value={`${done * 20}min`} />
          <Stat label="Próxima sessão" value={SESSIONS.find(s => !completed[s.slug])?.title.slice(0, 12) ?? "—"} />
        </div>
        <Link to="/home" className="mt-6 inline-flex items-center gap-1.5 text-sm text-gold hover:opacity-80">
          Continuar Jornada <ChevronRight className="h-4 w-4" />
        </Link>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface-elevated/40 p-4">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-xl text-foreground">{value}</p>
    </div>
  );
}
