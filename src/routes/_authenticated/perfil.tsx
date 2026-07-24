import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  LogOut, User, Settings, Heart, Trophy, Flame, Clock, BookOpen,
  Target, Award, Sparkles, ChevronRight, Bell, Calendar, Search,
  Zap, Star, Shield, Compass, Crown, Lightbulb, Users, Download,
  Moon, Sun, Globe, Lock, PlaySquare, LayoutGrid, History as HistoryIcon,
  Check, Circle,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/perfil")({
  head: () => ({
    meta: [
      { title: "Perfil — Instituto Neuroconsciência" },
      { name: "description", content: "Sua evolução, conquistas, missões, biblioteca e configurações em um só lugar." },
    ],
  }),
  component: ProfilePage,
});

type Tab = "evolucao" | "conquistas" | "missoes" | "biblioteca" | "config";

const LEVELS = [
  { name: "Iniciante", min: 0 },
  { name: "Explorador", min: 100 },
  { name: "Aprendiz", min: 300 },
  { name: "Praticante", min: 700 },
  { name: "Construtor", min: 1400 },
  { name: "Transformador", min: 2400 },
  { name: "Mentor", min: 3800 },
  { name: "Visionário", min: 5600 },
  { name: "Mestre da Consciência", min: 8000 },
];

const SEALS = [
  { name: "Constância", icon: Flame },
  { name: "Coragem", icon: Shield },
  { name: "Disciplina", icon: Target },
  { name: "Resiliência", icon: Zap },
  { name: "Sabedoria", icon: Lightbulb },
  { name: "Liderança", icon: Crown },
  { name: "Propósito", icon: Compass },
  { name: "Inteligência Emocional", icon: Star },
];

const ACHIEVEMENTS = [
  { id: "primeiro-passo", name: "Primeiro passo", desc: "Você iniciou sua jornada.", need: (s: Stats) => s.xp > 0 },
  { id: "primeira-aula", name: "Primeira aula concluída", desc: "Concluiu sua primeira aula.", need: (s: Stats) => s.lessons >= 1 },
  { id: "primeiro-modulo", name: "Primeiro módulo concluído", desc: "Finalizou um módulo completo.", need: (s: Stats) => s.modulesDone >= 1 },
  { id: "7dias", name: "7 dias consecutivos", desc: "Uma semana de disciplina.", need: (s: Stats) => s.streak >= 7 },
  { id: "30dias", name: "30 dias consecutivos", desc: "Um mês de constância.", need: (s: Stats) => s.streak >= 30 },
  { id: "100h", name: "100 horas estudadas", desc: "Cem horas de imersão.", need: (s: Stats) => s.minutes >= 6000 },
  { id: "mente-disciplinada", name: "Mente disciplinada", desc: "Concluiu 10 workshops.", need: (s: Stats) => s.workshops >= 10 },
  { id: "consciencia", name: "Consciência expandida", desc: "50% da jornada.", need: (s: Stats) => s.overall >= 50 },
  { id: "nova-identidade", name: "Nova identidade", desc: "Jornada 100% concluída.", need: (s: Stats) => s.overall >= 100 },
  { id: "dedicado", name: "Aluno dedicado", desc: "Concluiu 25 aulas.", need: (s: Stats) => s.lessons >= 25 },
  { id: "explorador", name: "Explorador", desc: "Visitou todos os módulos.", need: (s: Stats) => s.modulesVisited >= 6 },
  { id: "visionario", name: "Visionário", desc: "Chegou ao nível Visionário.", need: (s: Stats) => s.xp >= 5600 },
  { id: "habitos", name: "Construtor de hábitos", desc: "14 dias consecutivos.", need: (s: Stats) => s.streak >= 14 },
  { id: "lider", name: "Líder consciente", desc: "Concluiu 3 módulos.", need: (s: Stats) => s.modulesDone >= 3 },
  { id: "mentoria", name: "Mentoria concluída", desc: "Finalizou uma temporada premium.", need: (s: Stats) => s.levelsDone >= 1 },
];

type Stats = {
  xp: number; streak: number; longestStreak: number; minutes: number;
  lessons: number; workshops: number; modulesDone: number; modulesVisited: number;
  levelsDone: number; overall: number; lastActivity: string;
  firstAccess: string;
};

type Mission = { id: string; period: "diaria" | "semanal" | "mensal"; title: string; desc: string; xp: number; goal: number };
const MISSIONS: Mission[] = [
  { id: "m-d1", period: "diaria", title: "Assista 1 aula hoje", desc: "Manter o ritmo diário.", xp: 20, goal: 1 },
  { id: "m-d2", period: "diaria", title: "Reflita por 5 minutos", desc: "Registre uma reflexão consciente.", xp: 10, goal: 1 },
  { id: "m-s1", period: "semanal", title: "Conclua 5 aulas na semana", desc: "Ampliar o volume semanal.", xp: 80, goal: 5 },
  { id: "m-s2", period: "semanal", title: "Complete 1 workshop premium", desc: "Um passo na jornada premium.", xp: 100, goal: 1 },
  { id: "m-m1", period: "mensal", title: "Conclua 1 módulo completo", desc: "Consolidar um módulo inteiro.", xp: 250, goal: 1 },
  { id: "m-m2", period: "mensal", title: "20 dias de acesso no mês", desc: "Consistência mensal.", xp: 300, goal: 20 },
];

const CHALLENGES = [
  { id: "c7", name: "7 dias de leitura", desc: "Ler 15 min por dia durante 7 dias.", days: 7 },
  { id: "c21", name: "21 dias de disciplina", desc: "Rituais diários por 21 dias.", days: 21 },
  { id: "c30", name: "30 dias de evolução", desc: "Assista 1 aula por dia durante 30 dias.", days: 30 },
  { id: "c90", name: "90 dias de transformação", desc: "Jornada intensiva de 90 dias.", days: 90 },
];

const NOTIFICATIONS = [
  { icon: Flame, text: "Continue sua jornada — você está próximo do próximo nível." },
  { icon: Sparkles, text: "Novo bônus disponível para desbloquear." },
  { icon: Bell, text: "Missão diária te aguarda hoje." },
  { icon: Trophy, text: "Parabéns pela sequência ativa." },
];

function levelFrom(xp: number) {
  let idx = 0;
  for (let i = 0; i < LEVELS.length; i++) if (xp >= LEVELS[i].min) idx = i;
  const cur = LEVELS[idx];
  const next = LEVELS[idx + 1];
  const span = next ? next.min - cur.min : 1;
  const inLvl = Math.min(1, (xp - cur.min) / span);
  return { idx, cur, next, percent: Math.round(inLvl * 100) };
}

function ProfilePage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("evolucao");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [modules, setModules] = useState<Array<{ id: string; name: string; slug: string; percent: number }>>([]);
  const [missionDone, setMissionDone] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {};
    try { return JSON.parse(localStorage.getItem("missions-done") ?? "{}"); } catch { return {}; }
  });
  const [favorites] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem("favorites") ?? "[]"); } catch { return []; }
  });
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [notifOn, setNotifOn] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      setEmail(u.user?.email ?? "");
      const uid = u.user?.id;
      const createdAt = u.user?.created_at ?? new Date().toISOString();

      if (!uid) return;
      const [{ data: p }, { data: mods }, { data: mp }, { data: lp }, { data: wp }, { data: levels }] = await Promise.all([
        supabase.from("profiles").select("display_name, avatar_url").eq("id", uid).maybeSingle(),
        supabase.from("modules").select("id, name, slug"),
        supabase.from("user_module_progress").select("module_id, percent").eq("user_id", uid),
        supabase.from("user_lesson_progress").select("lesson_id, completed_at").eq("user_id", uid),
        supabase.from("user_workshop_progress").select("workshop_id, completed_at").eq("user_id", uid),
        supabase.from("user_level_progress").select("level_id, completed_at").eq("user_id", uid),
      ]);

      setName(p?.display_name ?? "");
      setAvatar(p?.avatar_url ?? null);

      const modMap = new Map((mp ?? []).map(m => [m.module_id, m.percent]));
      const modList = (mods ?? []).map((m: any) => ({
        id: m.id, name: m.name, slug: m.slug, percent: modMap.get(m.id) ?? 0,
      }));
      setModules(modList);

      const lessons = (lp ?? []).filter((l: any) => l.completed_at).length;
      const workshops = (wp ?? []).filter((w: any) => w.completed_at).length;
      const modulesDone = modList.filter(m => m.percent >= 100).length;
      const modulesVisited = modList.filter(m => m.percent > 0).length;
      const levelsDone = (levels ?? []).filter((l: any) => l.completed_at).length;
      const overall = modList.length
        ? Math.round(modList.reduce((a, m) => a + m.percent, 0) / modList.length)
        : 0;
      const xp = lessons * 20 + workshops * 50 + modulesDone * 250 + levelsDone * 500;
      const streak = Number(localStorage.getItem("streak") ?? "1");
      const longest = Number(localStorage.getItem("longest-streak") ?? String(streak));
      const minutes = lessons * 12 + workshops * 25;
      const lastActivity = localStorage.getItem("last-activity") ?? new Date().toISOString();

      setStats({
        xp, streak, longestStreak: Math.max(longest, streak), minutes,
        lessons, workshops, modulesDone, modulesVisited, levelsDone, overall,
        lastActivity, firstAccess: createdAt,
      });
    })();
  }, []);

  const level = useMemo(() => levelFrom(stats?.xp ?? 0), [stats?.xp]);
  const firstName = (name || email).split(/[\s@]/)[0] || "Aluno";

  const toggleMission = (id: string) => {
    const next = { ...missionDone, [id]: !missionDone[id] };
    setMissionDone(next);
    localStorage.setItem("missions-done", JSON.stringify(next));
    if (next[id]) toast.success("Missão concluída! +XP", { icon: "✨" });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Até breve.");
    navigate({ to: "/auth", replace: true });
  };

  if (!stats) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-pulse rounded-full bg-gradient-primary" />
      </main>
    );
  }

  const unlockedAch = ACHIEVEMENTS.filter(a => a.need(stats));

  return (
    <main className="relative pb-28">
      {/* HEADER */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-60" aria-hidden />
        <div className="relative z-10 px-5 pt-10">
          <div className="flex items-start gap-4">
            <div className="relative h-20 w-20 shrink-0">
              <div className="absolute inset-0 rounded-full bg-gradient-primary shadow-glow" />
              <div className="absolute inset-0.5 flex items-center justify-center rounded-full bg-background">
                {avatar ? (
                  <img src={avatar} alt={name} className="h-full w-full rounded-full object-cover" />
                ) : (
                  <span className="font-display text-2xl text-gold">
                    {firstName.slice(0, 1).toUpperCase()}
                  </span>
                )}
              </div>
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-gold px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-background">
                Nv {level.idx + 1}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase tracking-widest text-gold">{level.cur.name}</p>
              <h1 className="font-display text-3xl leading-tight text-foreground">{name || firstName}</h1>
              <p className="mt-1 text-xs italic text-muted-foreground">
                "Continue evoluindo. Cada pequena ação fortalece sua jornada."
              </p>
              <div className="mt-3">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
                  <span>{stats.xp} XP</span>
                  <span>{level.next ? `${level.next.min - stats.xp} p/ ${level.next.name}` : "Máximo"}</span>
                </div>
                <div className="mt-1 h-1.5 w-full rounded-full bg-surface-elevated">
                  <div className="h-full rounded-full bg-gradient-gold" style={{ width: `${level.percent}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Header stats */}
          <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-6">
            <HeaderStat icon={Flame} label="Sequência" value={`${stats.streak}d`} />
            <HeaderStat icon={Clock} label="Estudo" value={`${Math.round(stats.minutes / 60)}h`} />
            <HeaderStat icon={PlaySquare} label="Aulas" value={String(stats.lessons)} />
            <HeaderStat icon={BookOpen} label="Workshops" value={String(stats.workshops)} />
            <HeaderStat icon={LayoutGrid} label="Módulos" value={String(stats.modulesDone)} />
            <HeaderStat icon={Trophy} label="Conquistas" value={String(unlockedAch.length)} />
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <section className="mx-4 mt-6">
        <div className="glass flex items-center gap-3 rounded-full px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar aulas, módulos, ferramentas, bônus…"
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            aria-label="Buscar conteúdo"
          />
        </div>
      </section>

      {/* TABS */}
      <nav className="scrollbar-hidden mx-4 mt-6 flex gap-2 overflow-x-auto" role="tablist">
        {([
          ["evolucao", "Evolução"],
          ["conquistas", "Conquistas"],
          ["missoes", "Missões"],
          ["biblioteca", "Biblioteca"],
          ["config", "Configurações"],
        ] as [Tab, string][]).map(([id, label]) => (
          <button key={id} role="tab" aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition-all ${tab === id ? "bg-foreground text-background" : "glass text-muted-foreground hover:text-foreground"}`}>
            {label}
          </button>
        ))}
      </nav>

      {/* PANELS */}
      <div className="mx-4 mt-6">
        {tab === "evolucao" && <EvolutionPanel stats={stats} level={level} modules={modules} />}
        {tab === "conquistas" && <AchievementsPanel stats={stats} />}
        {tab === "missoes" && <MissionsPanel done={missionDone} toggle={toggleMission} />}
        {tab === "biblioteca" && <LibraryPanel modules={modules} favorites={favorites} />}
        {tab === "config" && (
          <SettingsPanel
            name={name} email={email} theme={theme} setTheme={setTheme}
            notifOn={notifOn} setNotifOn={setNotifOn} onSignOut={signOut}
          />
        )}
      </div>
    </main>
  );
}

function HeaderStat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="glass rounded-2xl border border-border p-3">
      <Icon className="h-3.5 w-3.5 text-gold" />
      <p className="mt-1 font-display text-lg leading-none text-foreground">{value}</p>
      <p className="mt-1 text-[9px] uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  );
}

/* ---------- EVOLUÇÃO ---------- */
function EvolutionPanel({ stats, level, modules }: any) {
  const nextGoal = modules.find((m: any) => m.percent > 0 && m.percent < 100)
    ?? modules.find((m: any) => m.percent === 0);
  const lastDate = new Date(stats.lastActivity).toLocaleDateString("pt-BR");
  const firstDate = new Date(stats.firstAccess).toLocaleDateString("pt-BR");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Overall */}
      <section className="glass rounded-3xl border border-border p-6 shadow-elevated">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gold">Minha Evolução</p>
            <h2 className="font-display text-2xl text-foreground">{stats.overall}% concluído</h2>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Nível</p>
            <p className="font-display text-xl text-foreground">{level.cur.name}</p>
          </div>
        </div>
        <div className="mt-4 h-2 w-full rounded-full bg-surface-elevated">
          <div className="h-full rounded-full bg-gradient-primary" style={{ width: `${stats.overall}%` }} />
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MiniStat label="Horas" value={`${Math.round(stats.minutes / 60)}h`} />
          <MiniStat label="Sequência" value={`${stats.streak}d`} />
          <MiniStat label="Maior seq." value={`${stats.longestStreak}d`} />
          <MiniStat label="Última atividade" value={lastDate} />
        </div>
        {nextGoal && (
          <div className="mt-5 flex items-center justify-between rounded-2xl bg-surface-elevated/40 p-3">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Próximo objetivo</p>
              <p className="text-sm text-foreground">{nextGoal.name}</p>
            </div>
            <Link to="/modulo/$slug" params={{ slug: nextGoal.slug }}
              className="inline-flex items-center gap-1 rounded-full bg-foreground px-3 py-1.5 text-[11px] font-medium text-background hover:brightness-110">
              Continuar <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        )}
      </section>

      {/* Selos */}
      <section>
        <h3 className="mb-3 flex items-center gap-2 font-display text-lg text-foreground">
          <Award className="h-4 w-4 text-gold" /> Selos
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {SEALS.map((s, i) => {
            const unlocked = i < Math.min(SEALS.length, Math.floor(stats.xp / 300));
            const Icon = s.icon;
            return (
              <div key={s.name} className={`flex flex-col items-center rounded-2xl border border-border p-3 text-center ${unlocked ? "glass shadow-glow" : "opacity-40"}`}>
                <Icon className={`h-6 w-6 ${unlocked ? "text-gold" : "text-muted-foreground"}`} />
                <p className="mt-1.5 text-[10px] leading-tight text-foreground">{s.name}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Timeline */}
      <section>
        <h3 className="mb-3 flex items-center gap-2 font-display text-lg text-foreground">
          <HistoryIcon className="h-4 w-4 text-gold" /> Linha do tempo
        </h3>
        <div className="space-y-3 border-l border-border pl-4">
          <TimelineItem date={firstDate} title="Primeiro acesso" desc="Início da sua jornada." />
          {stats.lessons > 0 && <TimelineItem date={lastDate} title={`${stats.lessons} aulas concluídas`} desc="Consistência em ação." />}
          {stats.workshops > 0 && <TimelineItem date={lastDate} title={`${stats.workshops} workshops premium`} desc="Aprofundamento avançado." />}
          {stats.modulesDone > 0 && <TimelineItem date={lastDate} title={`${stats.modulesDone} módulos concluídos`} desc="Etapas dominadas." />}
          {stats.levelsDone > 0 && <TimelineItem date={lastDate} title={`${stats.levelsDone} temporadas premium`} desc="Você concluiu uma jornada inteira." />}
        </div>
      </section>

      {/* Notificações */}
      <section>
        <h3 className="mb-3 flex items-center gap-2 font-display text-lg text-foreground">
          <Bell className="h-4 w-4 text-gold" /> Notificações
        </h3>
        <div className="space-y-2">
          {NOTIFICATIONS.map((n, i) => (
            <div key={i} className="glass flex items-center gap-3 rounded-2xl p-3">
              <n.icon className="h-4 w-4 text-gold" />
              <p className="text-xs text-foreground">{n.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Calendário / Eventos */}
      <section className="grid gap-3 sm:grid-cols-2">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gold" />
            <h4 className="font-display text-lg text-foreground">Calendário</h4>
          </div>
          <div className="mt-3 grid grid-cols-7 gap-1">
            {Array.from({ length: 28 }).map((_, i) => {
              const active = i % 3 === 0 || i < stats.streak;
              return (
                <div key={i} className={`h-6 rounded-md ${active ? "bg-gradient-gold" : "bg-surface-elevated/50"}`} />
              );
            })}
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground">Dias estudados nas últimas 4 semanas.</p>
        </div>
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gold" />
            <h4 className="font-display text-lg text-foreground">Próximos eventos</h4>
          </div>
          <ul className="mt-3 space-y-2 text-xs text-foreground">
            <li className="flex justify-between"><span>Live semanal</span><span className="text-muted-foreground">Em breve</span></li>
            <li className="flex justify-between"><span>Mentoria em grupo</span><span className="text-muted-foreground">Em breve</span></li>
            <li className="flex justify-between"><span>Novo workshop</span><span className="text-muted-foreground">Em breve</span></li>
          </ul>
        </div>
      </section>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface-elevated/40 p-3">
      <p className="text-[9px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-lg text-foreground">{value}</p>
    </div>
  );
}

function TimelineItem({ date, title, desc }: { date: string; title: string; desc: string }) {
  return (
    <div className="relative">
      <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-gold shadow-glow" />
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{date}</p>
      <p className="text-sm text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground">{desc}</p>
    </div>
  );
}

/* ---------- CONQUISTAS ---------- */
function AchievementsPanel({ stats }: { stats: Stats }) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass rounded-3xl p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-gold" />
            <p className="font-display text-lg text-foreground">Conquistas</p>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            {ACHIEVEMENTS.filter(a => a.need(stats)).length}/{ACHIEVEMENTS.length}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {ACHIEVEMENTS.map(a => {
          const unlocked = a.need(stats);
          return (
            <div key={a.id} className={`rounded-2xl border border-border p-4 text-center transition-all ${unlocked ? "glass shadow-elevated" : "opacity-50"}`}>
              <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${unlocked ? "bg-gradient-primary shadow-glow" : "bg-surface-elevated"}`}>
                <Trophy className={`h-6 w-6 ${unlocked ? "text-primary-foreground" : "text-muted-foreground"}`} />
              </div>
              <p className="mt-3 font-display text-sm leading-tight text-foreground">{a.name}</p>
              <p className="mt-1 text-[10px] text-muted-foreground">{a.desc}</p>
              <p className="mt-2 text-[9px] uppercase tracking-widest text-gold">
                {unlocked ? "Desbloqueada" : "Bloqueada"}
              </p>
            </div>
          );
        })}
      </div>

      {/* Desafios */}
      <section>
        <h3 className="mb-3 flex items-center gap-2 font-display text-lg text-foreground">
          <Zap className="h-4 w-4 text-gold" /> Desafios
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {CHALLENGES.map(c => (
            <div key={c.id} className="glass rounded-2xl p-4">
              <p className="font-display text-base text-foreground">{c.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{c.desc}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest text-gold">{c.days} dias</span>
                <button className="rounded-full bg-foreground px-3 py-1.5 text-[11px] font-medium text-background">Iniciar</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ---------- MISSÕES ---------- */
function MissionsPanel({ done, toggle }: { done: Record<string, boolean>; toggle: (id: string) => void }) {
  const groups: [Mission["period"], string][] = [
    ["diaria", "Missão diária"], ["semanal", "Missão semanal"], ["mensal", "Missão mensal"],
  ];
  return (
    <div className="space-y-6 animate-fade-in">
      {groups.map(([p, label]) => (
        <section key={p}>
          <h3 className="mb-3 flex items-center gap-2 font-display text-lg text-foreground">
            <Target className="h-4 w-4 text-gold" /> {label}
          </h3>
          <div className="space-y-3">
            {MISSIONS.filter(m => m.period === p).map(m => {
              const complete = !!done[m.id];
              return (
                <div key={m.id} className={`glass rounded-2xl border border-border p-4 ${complete ? "opacity-70" : ""}`}>
                  <div className="flex items-start gap-3">
                    <button onClick={() => toggle(m.id)} aria-label={complete ? "Desmarcar missão" : "Concluir missão"}
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${complete ? "border-gold bg-gold text-background" : "border-border text-muted-foreground"}`}>
                      {complete ? <Check className="h-3.5 w-3.5" /> : <Circle className="h-3 w-3" />}
                    </button>
                    <div className="flex-1">
                      <p className={`font-display text-base text-foreground ${complete ? "line-through" : ""}`}>{m.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{m.desc}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-widest text-gold">+{m.xp} XP</span>
                        <button onClick={() => toggle(m.id)}
                          className="rounded-full bg-foreground px-3 py-1.5 text-[11px] font-medium text-background hover:brightness-110">
                          {complete ? "Refazer" : "Concluir"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

/* ---------- BIBLIOTECA ---------- */
function LibraryPanel({ modules, favorites }: { modules: any[]; favorites: string[] }) {
  const started = modules.filter(m => m.percent > 0);
  const filters = ["Mais recentes", "Mais assistidos", "Favoritos", "Concluídos", "Em andamento", "Recomendados"];
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="scrollbar-hidden flex gap-2 overflow-x-auto">
        {filters.map(f => (
          <button key={f} className="glass whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] text-muted-foreground hover:text-foreground">
            {f}
          </button>
        ))}
      </div>

      <section>
        <h3 className="mb-3 flex items-center gap-2 font-display text-lg text-foreground">
          <BookOpen className="h-4 w-4 text-gold" /> Módulos iniciados
        </h3>
        {started.length === 0 ? (
          <p className="glass rounded-2xl p-4 text-xs text-muted-foreground">
            Você ainda não iniciou nenhum módulo. Comece pela Home.
          </p>
        ) : (
          <div className="space-y-2">
            {started.map(m => (
              <Link key={m.slug} to="/modulo/$slug" params={{ slug: m.slug }}
                className="glass flex items-center justify-between rounded-2xl p-3 hover:bg-surface-elevated">
                <div>
                  <p className="font-display text-sm text-foreground">{m.name}</p>
                  <p className="text-[10px] text-muted-foreground">{m.percent}% concluído</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="mb-3 flex items-center gap-2 font-display text-lg text-foreground">
          <Heart className="h-4 w-4 text-gold" /> Favoritos
        </h3>
        {favorites.length === 0 ? (
          <p className="glass rounded-2xl p-4 text-xs text-muted-foreground">
            Toque no coração em qualquer aula, módulo, ferramenta ou bônus para favoritar.
          </p>
        ) : (
          <ul className="glass rounded-2xl p-4 text-sm text-foreground">
            {favorites.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
        )}
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <QuickCard icon={Sparkles} title="Recomendado" desc="Próxima aula sugerida com base na sua evolução." to="/home" />
        <QuickCard icon={HistoryIcon} title="Histórico" desc="Últimos acessos e vídeos assistidos." to="/home" />
        <QuickCard icon={Download} title="Download" desc="Em breve — assista offline." />
      </section>
    </div>
  );
}

function QuickCard({ icon: Icon, title, desc, to }: any) {
  const inner = (
    <div className="glass h-full rounded-2xl p-4 transition-all hover:shadow-elevated">
      <Icon className="h-5 w-5 text-gold" />
      <p className="mt-2 font-display text-base text-foreground">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
    </div>
  );
  return to ? <Link to={to}>{inner}</Link> : inner;
}

/* ---------- CONFIGURAÇÕES ---------- */
function SettingsPanel({ name, email, theme, setTheme, notifOn, setNotifOn, onSignOut }: any) {
  return (
    <div className="space-y-4 animate-fade-in">
      <section className="glass rounded-3xl p-5">
        <h3 className="mb-4 flex items-center gap-2 font-display text-lg text-foreground">
          <User className="h-4 w-4 text-gold" /> Conta
        </h3>
        <Field label="Nome" value={name} />
        <Field label="Email" value={email} />
        <Field label="Senha" value="••••••••" action="Alterar" />
      </section>

      <section className="glass rounded-3xl p-5">
        <h3 className="mb-4 flex items-center gap-2 font-display text-lg text-foreground">
          <Settings className="h-4 w-4 text-gold" /> Preferências
        </h3>
        <ToggleRow icon={theme === "dark" ? Moon : Sun} label="Modo escuro"
          on={theme === "dark"} onChange={(v: boolean) => setTheme(v ? "dark" : "light")} />
        <ToggleRow icon={Bell} label="Notificações" on={notifOn} onChange={setNotifOn} />
        <SelectRow icon={Globe} label="Idioma" value="Português (BR)" />
        <SelectRow icon={Lock} label="Privacidade" value="Perfil privado" />
      </section>

      <section className="glass rounded-3xl p-5">
        <h3 className="mb-4 flex items-center gap-2 font-display text-lg text-foreground">
          <Sparkles className="h-4 w-4 text-gold" /> Acessibilidade
        </h3>
        <SelectRow label="Tamanho do texto" value="Padrão" />
        <SelectRow label="Contraste" value="Elevado" />
        <SelectRow label="Legendas" value="Ativadas" />
        <SelectRow label="Velocidade do vídeo" value="1x" />
      </section>

      <button
        onClick={onSignOut}
        className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-surface px-6 py-3.5 text-sm text-foreground transition-colors hover:bg-surface-elevated">
        <LogOut className="h-4 w-4" /> Sair
      </button>

      <p className="pt-4 text-center text-[10px] uppercase tracking-widest text-muted-foreground">
        Painel administrativo disponível apenas para administradores.
      </p>
    </div>
  );
}

function Field({ label, value, action }: { label: string; value: string; action?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/50 py-3 last:border-0">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className="text-sm text-foreground">{value || "—"}</p>
      </div>
      {action && (
        <button className="rounded-full glass px-3 py-1.5 text-[11px] text-foreground">{action}</button>
      )}
    </div>
  );
}

function ToggleRow({ icon: Icon, label, on, onChange }: { icon: any; label: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between border-b border-border/50 py-3 last:border-0">
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-gold" />
        <span className="text-sm text-foreground">{label}</span>
      </div>
      <button onClick={() => onChange(!on)} aria-pressed={on} aria-label={label}
        className={`relative h-6 w-11 rounded-full transition-colors ${on ? "bg-gradient-primary" : "bg-surface-elevated"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-background transition-all ${on ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </div>
  );
}

function SelectRow({ icon: Icon, label, value }: { icon?: any; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/50 py-3 last:border-0">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="h-4 w-4 text-gold" />}
        <span className="text-sm text-foreground">{label}</span>
      </div>
      <span className="text-xs text-muted-foreground">{value}</span>
    </div>
  );
}
