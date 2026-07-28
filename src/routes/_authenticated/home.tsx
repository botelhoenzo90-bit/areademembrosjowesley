import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Play, Info, Search, Flame, BookOpen, Sparkles } from "lucide-react";
import { ModuleCard, type ModuleCardData } from "@/components/ModuleCard";
import { unlockDateFrom, isLocked, countdownLabel } from "@/lib/premium-lock";

import heroImg from "@/assets/hero-welcome.jpg";
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
import j1Asset from "@/assets/jornada-1.png.asset.json";
import j2Asset from "@/assets/jornada-2.png.asset.json";
import j3Asset from "@/assets/jornada-3.png.asset.json";
import j4Asset from "@/assets/jornada-4.png.asset.json";

const JORNADA_COVERS = [j1Asset.url, j2Asset.url, j3Asset.url, j4Asset.url];

import comunidadeAsset from "@/assets/comunidade-whatsapp.jpeg.asset.json";

const COMUNIDADE_CARD: ModuleCardData = {
  slug: "comunidade-neuroconsciencia",
  name: "Comunidade Neuroconsciência",
  short_description:
    "Clique aqui e entre no grupo: aulas ao vivo de inteligência emocional, ferramentas e indicação de livros.",
  cover_url: comunidadeAsset.url,
  lessons_count: 0,
  percent: 0,
  accent_from: null,
  accent_to: null,
  href: "https://chat.whatsapp.com/HkeVK7E2sVPJiSyrUPV9MN?s=cl&p=a&ilr=0",
};



export const Route = createFileRoute("/_authenticated/home")({
  head: () => ({
    meta: [
      { title: "Home — Instituto Neuroconsciência" },
      { name: "description", content: "Sua jornada de transformação, módulos, aulas e ferramentas em um único lugar." },
    ],
  }),
  component: HomePage,
});

const COVER_BY_ORDER: Record<number, string> = { 1: m1, 2: m2, 3: m3, 4: m4, 5: m5, 6: m6 };

const QUOTES = [
  "Pequenas mudanças diárias criam grandes transformações.",
  "A consciência é o primeiro passo da liberdade.",
  "Quem domina a própria mente, domina o próprio destino.",
  "Você não precisa ser melhor que ninguém — apenas melhor que ontem.",
  "A disciplina é a ponte entre a intenção e a realização.",
  "Silêncio é onde as respostas nascem.",
  "Cada aula é um passo. Cada passo é uma nova versão.",
];

type Row = {
  id: string; slug: string; name: string; short_description: string;
  order_index: number; lessons_count: number; accent_from: string | null; accent_to: string | null;
};

function greet(name: string) {
  const h = new Date().getHours();
  if (h < 12) return `Bom dia, ${name}`;
  if (h < 18) return `Boa tarde, ${name}`;
  return `Boa noite, ${name}`;
}

function HomePage() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [modules, setModules] = useState<ModuleCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data: userRes } = await supabase.auth.getUser();
      const uid = userRes.user?.id;
      if (!uid) return;

      const [{ data: profile }, { data: mods }, { data: progress }] = await Promise.all([
        supabase.from("profiles").select("display_name, onboarded").eq("id", uid).maybeSingle(),
        supabase.from("modules").select("*").order("order_index"),
        supabase.from("user_module_progress").select("module_id, percent").eq("user_id", uid),
      ]);

      if (!profile?.onboarded) {
        navigate({ to: "/onboarding", replace: true });
        return;
      }

      setDisplayName(profile.display_name || "");

      const unlockAt = unlockDateFrom(userRes.user?.created_at);
      const premiumLocked = isLocked(unlockAt);
      const lockLabel = premiumLocked ? `Libera em ${countdownLabel(unlockAt)}` : undefined;

      const progressMap = new Map((progress ?? []).map((p) => [p.module_id, p.percent]));
      const rows = (mods ?? []) as Row[];
      setModules(
        rows.map((m) => ({
          slug: m.slug,
          name: m.name,
          short_description: m.short_description,
          cover_url: COVER_BY_ORDER[m.order_index] ?? m1,
          lessons_count: m.lessons_count,
          percent: progressMap.get(m.id) ?? 0,
          accent_from: m.accent_from,
          accent_to: m.accent_to,
          locked: m.slug === "treinamento-premium" && premiumLocked,
          lockLabel: m.slug === "treinamento-premium" ? lockLabel : undefined,
        })),
      );

      setLoading(false);
    };
    load();
  }, [navigate]);

  const quote = useMemo(() => {
    const day = new Date().getDate();
    return QUOTES[day % QUOTES.length];
  }, []);

  const inProgress = modules.filter((m) => m.percent > 0 && m.percent < 100);
  const featured = modules[0]; // "SEJA BEM-VINDOS" as default hero

  void search;


  const firstName = displayName?.split(" ")[0] ?? "";

  const overallPercent = modules.length
    ? Math.round(modules.reduce((a, m) => a + m.percent, 0) / modules.length)
    : 0;
  const completedModules = modules.filter((m) => m.percent >= 100).length;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-pulse rounded-full bg-gradient-primary" />
      </div>
    );
  }

  return (
    <main className="relative">
      {/* TOP BAR */}
      <header className="relative z-20 flex items-center justify-between px-5 pt-6">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10">
            <div className="absolute inset-0 rounded-full bg-gradient-primary" />
            <div className="absolute inset-0.5 rounded-full bg-background/70 backdrop-blur flex items-center justify-center">
              <span className="text-xs font-semibold text-gold">
                {firstName.slice(0, 1).toUpperCase() || "N"}
              </span>
            </div>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Instituto</p>
            <p className="font-display text-base leading-tight text-foreground">{greet(firstName)}</p>
          </div>
        </div>
        <div className="rounded-full glass p-2">
          <Sparkles className="h-4 w-4 text-gold" />
        </div>
      </header>

      {/* Motivational */}
      <p className="mt-3 px-5 text-sm italic text-muted-foreground animate-fade-in">
        “{quote}”
      </p>

      {/* HERO */}
      {featured && (
        <section className="relative mx-4 mt-5 overflow-hidden rounded-3xl border border-border shadow-elevated animate-scale-in">
          <div className="relative aspect-[16/10] w-full sm:aspect-[21/9]">
            <img
              src={heroImg}
              alt="Módulo em destaque"
              width={1920}
              height={1080}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" aria-hidden />
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" aria-hidden />

            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
              <span className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full glass px-3 py-1 text-[10px] uppercase tracking-widest text-gold">
                <Flame className="h-3 w-3" /> Módulo em destaque
              </span>
              <h2 className="font-display text-3xl leading-tight text-foreground sm:text-5xl">
                {featured.name}
              </h2>
              <p className="mt-2 max-w-md text-sm text-muted-foreground sm:text-base">
                {featured.short_description}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-all hover:brightness-110 active:scale-95">
                  <Play className="h-4 w-4 fill-current" /> Continuar Assistindo
                </button>
                <button className="inline-flex items-center gap-2 rounded-full glass-strong px-6 py-3 text-sm font-medium text-foreground transition-all hover:bg-surface-elevated active:scale-95">
                  <Info className="h-4 w-4" /> Ver Detalhes
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* PROGRESS STRIP */}
      <section className="mx-4 mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <ProgressStat label="Jornada Geral" value={`${overallPercent}%`} highlight />
        <ProgressStat label="Módulos concluídos" value={`${completedModules}`} />
        <ProgressStat label="Aulas finalizadas" value={"0"} />
        <ProgressStat label="Dias de evolução" value={"1"} />
      </section>

      {/* SEARCH */}
      <section className="mx-4 mt-6">
        <div className="glass flex items-center gap-3 rounded-full px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="O que deseja aprender hoje?"
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
      </section>

      {/* NOVOS CONTEÚDOS */}
      <SectionRow title="Neuro Consciência" icon={<Sparkles className="h-4 w-4 text-gold" />}>
        {modules.slice(0, 6).map((m) => (
          <ModuleCard key={`novo-${m.slug}`} data={m} />
        ))}
      </SectionRow>

      {/* CONTINUE WATCHING */}
      {inProgress.length > 0 && (
        <SectionRow title="Continuar assistindo" icon={<Play className="h-4 w-4 text-gold" />}>
          {inProgress.map((m) => (
            <ModuleCard key={m.slug} data={m} />
          ))}
        </SectionRow>
      )}


      {/* MY JOURNEY */}
      <SectionRow title="Caminho Evolutivo" icon={<BookOpen className="h-4 w-4 text-gold" />}>
        {modules.filter((m) => !m.locked).slice(0, 4).map((m, i) => (
          <ModuleCard key={m.slug} bare data={{ ...m, cover_url: JORNADA_COVERS[i] ?? m.cover_url, locked: false, lockLabel: undefined }} />
        ))}
      </SectionRow>


      <p className="mt-10 px-5 pb-4 text-center text-[10px] uppercase tracking-widest text-muted-foreground">
        Instituto Neuroconsciência
      </p>
    </main>
  );
}

function ProgressStat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl border border-border p-4 ${highlight ? "bg-gradient-primary shadow-glow" : "glass"}`}>
      <p className={`text-[10px] uppercase tracking-widest ${highlight ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{label}</p>
      <p className={`mt-1 font-display text-2xl ${highlight ? "text-primary-foreground" : "text-foreground"}`}>{value}</p>
    </div>
  );
}

function SectionRow({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <div className="mb-3 flex items-center gap-2 px-5">
        {icon}
        <h2 className="font-display text-xl text-foreground">{title}</h2>
      </div>
      <div className="scrollbar-hidden flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2">
        {children}
      </div>
    </section>
  );
}
