import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowLeft, ArrowRight, Award, BarChart3, BookOpen, Brain, Briefcase, Check, Dumbbell, Flame, Gem,
  Goal, Heart, Loader2, Lock, MessageCircle, RotateCcw, ShieldCheck, Sparkles, Target, Trophy,
  Users, Volume2, VolumeX, Wallet, Zap,
} from "lucide-react";
import desbloqueieCover from "@/assets/desbloqueie-cover.png.asset.json";
import n1 from "@/assets/nivel-1.jpg.asset.json";
import n2 from "@/assets/nivel-2.jpg.asset.json";
import n3 from "@/assets/nivel-3.jpg.asset.json";
import n4 from "@/assets/nivel-4.jpg.asset.json";
import n5 from "@/assets/nivel-5.jpg.asset.json";
import n6 from "@/assets/nivel-6.jpg.asset.json";
import n7 from "@/assets/nivel-7.jpg.asset.json";
import { powerQuestions, type PowerQuestion } from "@/lib/power-questions";
import {
  generateGoalPlan, generateLevelDiagnosis, generateProcrastinationProtocol,
  loadPowerState, resetPowerState, savePowerState,
} from "@/lib/power-journey.functions";

export const Route = createFileRoute("/_authenticated/desbloqueie-poder")({
  head: () => ({
    meta: [
      { title: "Os 7 Níveis da Vida — Instituto Neuroconsciência" },
      { name: "description", content: "Protocolo Desbloqueie o Poder da Sua Mente: diagnóstico, consciência, missão, ação e evolução em 7 níveis." },
      { property: "og:title", content: "Os 7 Níveis da Vida — Desbloqueie o Poder da Sua Mente" },
      { property: "og:description", content: "Do diagnóstico à sua missão diária. 7 níveis, 70 perguntas e um plano de ação personalizado." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DesbloqueiePoder,
});

type Level = { id: number; name: string; title: string; question: string; icon: any; accent: string; banner: string; areas: string[] };
type Plan = { change: string; action: string; when: string; first: string; track: string };
type MissionRec = { text: string; done: boolean; plan?: Plan; savedAt?: string };
type Meta = { id: string; horizon: string; goal: string; result: string; steps: string[]; priorities: string[]; actions: string[]; obstacles: string[]; strategy: string; first: string; indicator: string; done: boolean; createdAt: string };
type Protocol = { id: string; at: string; input: string; text: string };
type SavedState = {
  answers: Record<string, number>; completed: number[]; scores: Record<number, number>;
  diagnoses: Record<number, string>; missions: Record<number, MissionRec>;
  metas: Meta[]; protocols: Protocol[]; points: number; sound: boolean; startedAt: string; lastAt: string;
};

const levels: Level[] = [
  { id: 1, name: "MENTAL", title: "Alimente a mente que conduz sua vida", question: "O que você está colocando dentro da sua mente que está construindo a pessoa que você está se tornando?", icon: Brain, accent: "from-cyan-500/30 to-blue-600/10", banner: n1.url, areas: ["informações", "livros", "músicas", "vídeos", "conversas", "aprendizado", "pensamentos", "ambiente mental"] },
  { id: 2, name: "ESPIRITUAL", title: "Encontre aquilo que dá sentido à sua caminhada", question: "O que existe dentro de você que continua de pé quando as circunstâncias tentam derrubar você?", icon: Sparkles, accent: "from-violet-500/30 to-fuchsia-600/10", banner: n2.url, areas: ["significado", "valores", "propósito", "fé", "conexão", "gratidão", "esperança", "serviço"] },
  { id: 3, name: "MATERIAL / FÍSICO", title: "Cuide do corpo que sustenta sua jornada", question: "Se seu corpo é o veículo da sua jornada, como você tem tratado esse veículo?", icon: Dumbbell, accent: "from-emerald-500/30 to-teal-600/10", banner: n3.url, areas: ["alimentação", "movimento", "descanso", "autocuidado", "hábitos físicos", "disposição"] },
  { id: 4, name: "EMOCIONAL", title: "Aprenda a viver suas emoções sem ser governado por elas", question: "Você está vivendo suas emoções ou permitindo que suas emoções decidam sua vida?", icon: Heart, accent: "from-rose-500/30 to-orange-600/10", banner: n4.url, areas: ["consciência emocional", "impulsividade", "autorregulação", "equilíbrio", "comunicação", "respostas diante das dificuldades"] },
  { id: 5, name: "FAMILIAR", title: "Fortaleça os vínculos que fazem parte da sua história", question: "As pessoas que você ama estão recebendo apenas sua presença física ou também sua presença emocional?", icon: Users, accent: "from-amber-500/30 to-yellow-600/10", banner: n5.url, areas: ["presença", "diálogo", "respeito", "cuidado", "limites", "conflitos", "qualidade dos relacionamentos"] },
  { id: 6, name: "FINANCEIRO", title: "Transforme dinheiro em ferramenta, não em fonte de desordem", question: "Você está conduzindo seu dinheiro ou suas decisões financeiras estão conduzindo você?", icon: Wallet, accent: "from-lime-500/30 to-emerald-600/10", banner: n6.url, areas: ["organização", "gastos", "planejamento", "poupança", "investimento", "responsabilidade financeira"] },
  { id: 7, name: "PROFISSIONAL", title: "Construa uma vida profissional que tenha significado", question: "O trabalho que você realiza hoje está construindo a vida profissional que deseja viver amanhã?", icon: Briefcase, accent: "from-blue-500/30 to-indigo-600/10", banner: n7.url, areas: ["satisfação", "competência", "desenvolvimento", "propósito", "contribuição", "planejamento", "direção profissional"] },
];

function blankState(): SavedState {
  return { answers: {}, completed: [], scores: {}, diagnoses: {}, missions: {}, metas: [], protocols: [], points: 0, sound: true, startedAt: new Date().toISOString(), lastAt: new Date().toISOString() };
}

function playTone(enabled: boolean, kind: "click" | "select" | "win" | "unlock" = "click") {
  if (!enabled) return;
  try {
    const C = window.AudioContext || (window as any).webkitAudioContext;
    const c = new C();
    const seq = kind === "win" ? [523, 659, 784, 1046] : kind === "unlock" ? [440, 660] : [kind === "select" ? 440 : 300];
    seq.forEach((f, i) => {
      const o = c.createOscillator(), g = c.createGain();
      o.connect(g); g.connect(c.destination);
      o.type = "sine"; o.frequency.value = f;
      const t = c.currentTime + i * 0.11;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(kind === "win" ? 0.09 : 0.03, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
      o.start(t); o.stop(t + 0.25);
    });
  } catch { /* áudio indisponível */ }
}

function Confetti({ run }: { run: boolean }) {
  const pieces = useMemo(() => Array.from({ length: 70 }, (_, i) => ({
    id: i, left: Math.random() * 100, delay: Math.random() * 0.9, dur: 2.4 + Math.random() * 1.8,
    size: 6 + Math.random() * 8, rot: Math.random() * 360,
    color: ["#3B82F6", "#D4AF37", "#8B5CF6", "#22D3EE", "#F472B6"][i % 5],
  })), [run]);
  if (!run) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-[70] overflow-hidden" aria-hidden>
      <style>{`@keyframes cfall{0%{transform:translateY(-12vh) rotate(0deg);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}`}</style>
      {pieces.map((p) => (
        <span key={p.id} style={{ position: "absolute", left: `${p.left}%`, top: 0, width: p.size, height: p.size * 0.5, background: p.color, transform: `rotate(${p.rot}deg)`, borderRadius: 2, animation: `cfall ${p.dur}s linear ${p.delay}s forwards` }} />
      ))}
    </div>
  );
}

function DesbloqueiePoder() {
  const load = useServerFn(loadPowerState);
  const save = useServerFn(savePowerState);
  const wipe = useServerFn(resetPowerState);
  const diagFn = useServerFn(generateLevelDiagnosis);
  const protoFn = useServerFn(generateProcrastinationProtocol);
  const goalFn = useServerFn(generateGoalPlan);

  const [name, setName] = useState("");
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<SavedState>(blankState());
  const [screen, setScreen] = useState<"home" | "quiz" | "result" | "mission" | "mentor" | "meta" | "evolution" | "premium">("home");
  const [level, setLevel] = useState(1);
  const [qi, setQi] = useState(0);
  const [busy, setBusy] = useState("");
  const [confetti, setConfetti] = useState(false);
  const [mentorInput, setMentorInput] = useState("");
  const [mentorReply, setMentorReply] = useState("");
  const [metaGoal, setMetaGoal] = useState("");
  const [horizon, setHorizon] = useState("1 mês");
  const [showReset, setShowReset] = useState(false);
  const [toast, setToast] = useState("");
  const dirty = useRef(false);

  const lvl = levels[level - 1];
  const qLevel = useMemo(() => powerQuestions.filter((q) => q.level === level), [level]);
  const current: PowerQuestion | undefined = qLevel[qi];
  const completed = state.completed.length;
  const pct = Math.round((completed / 7) * 100);
  const nextLevel = Math.min(7, completed + 1);

  useEffect(() => {
    (async () => {
      try {
        const res = await load({ data: {} } as any);
        if (res?.name) setName(res.name);
        if (res?.state && Object.keys(res.state).length) setState({ ...blankState(), ...(res.state as SavedState) });
      } catch { /* segue com estado local */ }
      setReady(true);
    })();
  }, [load]);

  const persist = useCallback((next: SavedState) => {
    setState(next);
    dirty.current = true;
    save({ data: { state: { ...next, lastAt: new Date().toISOString() } } } as any).catch(() => setToast("Não foi possível sincronizar agora — tentaremos novamente."));
  }, [save]);

  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(""), 5000); return () => clearTimeout(t); } }, [toast]);

  const go = (s: typeof screen) => { setScreen(s); playTone(state.sound); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const begin = (n: number) => { setLevel(n); setQi(0); setScreen("quiz"); playTone(state.sound, "unlock"); window.scrollTo({ top: 0 }); };

  const finishLevel = async (answers: Record<string, number>) => {
    const vals = qLevel.map((q) => answers[q.id] || 0);
    const score = vals.reduce((a, b) => a + b, 0);
    setBusy("Gerando seu diagnóstico personalizado...");
    setScreen("result");
    let diagnosis = "", mission = "";
    try {
      const res = await diagFn({
        data: {
          name: name || "Você", levelId: lvl.id, levelName: lvl.name, levelTitle: lvl.title,
          centralQuestion: lvl.question, areas: lvl.areas, score,
          answers: qLevel.map((q) => ({ q: q.text, a: q.options[(answers[q.id] || 1) - 1] })),
        },
      } as any);
      diagnosis = res.diagnosis; mission = res.mission;
    } catch {
      diagnosis = "Não foi possível gerar o diagnóstico agora. Suas respostas foram salvas — tente novamente em instantes.";
      mission = "Escolha uma única ação ligada a este nível e execute-a nas próximas 24 horas.";
    }
    setBusy("");
    persist({
      ...state, answers,
      completed: Array.from(new Set([...state.completed, level])),
      scores: { ...state.scores, [level]: score },
      diagnoses: { ...state.diagnoses, [level]: diagnosis },
      missions: { ...state.missions, [level]: { text: mission, done: false } },
      points: state.points + 10 + vals.length,
    });
    setConfetti(true); playTone(state.sound, "win");
    setTimeout(() => setConfetti(false), 4200);
  };

  const choose = (score: number) => {
    if (!current) return;
    playTone(state.sound, "select");
    const answers = { ...state.answers, [current.id]: score };
    if (qi < 9) { setState((s) => ({ ...s, answers })); setQi(qi + 1); }
    else void finishLevel(answers);
  };

  const savePlan = (plan: Plan) => {
    const rec = state.missions[level] || { text: plan.action, done: false };
    persist({ ...state, missions: { ...state.missions, [level]: { ...rec, plan, done: true, savedAt: new Date().toISOString() } }, points: state.points + 20 });
    setToast("Missão concluída e registrada no seu histórico.");
    playTone(state.sound, "win"); go("home");
  };

  const buildMeta = async () => {
    if (!metaGoal.trim()) { setToast("Escreva a meta que deseja alcançar."); return; }
    setBusy("Construindo seu plano de meta...");
    let plan: any = null;
    try { plan = (await goalFn({ data: { name: name || "Você", goal: metaGoal, horizon } } as any)).plan; } catch { /* usa fallback abaixo */ }
    setBusy("");
    const meta: Meta = {
      id: crypto.randomUUID(), horizon, goal: metaGoal, createdAt: new Date().toISOString(), done: false,
      result: plan?.result ?? `Resultado observável para "${metaGoal}" em ${horizon}.`,
      steps: plan?.steps ?? ["Definir o resultado", "Escolher prioridades", "Executar a primeira ação", "Revisar"],
      priorities: plan?.priorities ?? ["Clareza", "Consistência", "Acompanhamento"],
      actions: plan?.actions ?? ["Executar a primeira ação"],
      obstacles: plan?.obstacles ?? ["Falta de tempo", "Distrações"],
      strategy: plan?.strategy ?? "Ações pequenas, agendadas e registradas.",
      first: plan?.first ?? "Defina o primeiro passo e o horário.",
      indicator: plan?.indicator ?? "Uma evidência registrada por ciclo.",
    };
    persist({ ...state, metas: [meta, ...state.metas], points: state.points + 15 });
    setMetaGoal(""); setToast("Meta criada e salva."); playTone(state.sound, "win");
  };

  const askMentor = async () => {
    if (mentorInput.trim().length < 10) { setToast("Descreva com mais detalhes o que você está adiando."); return; }
    setBusy("Analisando e montando seu protocolo...");
    setMentorReply("");
    let text = "";
    try { text = (await protoFn({ data: { name: name || "Você", text: mentorInput } } as any)).protocol; }
    catch { text = "Não foi possível gerar o protocolo agora. Tente novamente em instantes."; }
    setBusy(""); setMentorReply(text);
    persist({ ...state, protocols: [{ id: crypto.randomUUID(), at: new Date().toISOString(), input: mentorInput, text }, ...state.protocols], points: state.points + 10 });
    playTone(state.sound, "win");
  };

  const doReset = async () => {
    try { await wipe({ data: {} } as any); } catch { /* ignora */ }
    setState(blankState()); setShowReset(false); setScreen("home"); setQi(0); setLevel(1);
    setToast("Jornada reiniciada.");
  };

  const currentMission = state.missions[nextLevel] || state.missions[completed] || state.missions[level];

  if (!ready) {
    return <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground"><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Carregando sua jornada...</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Confetti run={confetti} />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_15%_10%,hsl(var(--primary)/.14),transparent_32%),radial-gradient(circle_at_85%_30%,hsl(var(--gold)/.08),transparent_28%)]" />
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <a href="/home" className="flex items-center gap-2 text-sm font-medium"><ArrowLeft className="h-4 w-4" /><span className="hidden sm:inline">Área de membros</span></a>
          <nav className="hidden flex-wrap items-center gap-4 text-[10px] uppercase tracking-[.16em] text-muted-foreground md:flex">
            <button onClick={() => go("home")}>Início</button>
            <button onClick={() => go("mission")}>Missão atual</button>
            <button onClick={() => go("meta")}>Metas</button>
            <button onClick={() => go("mentor")}>Anti-procrastinação</button>
            <button onClick={() => go("evolution")}>Minha evolução</button>
            <button onClick={() => go("premium")}>Premium</button>
          </nav>
          <button onClick={() => { const s = !state.sound; persist({ ...state, sound: s }); playTone(s, "select"); }} className="glass rounded-full p-2" aria-label="Ligar ou desligar som">
            {state.sound ? <Volume2 className="h-4 w-4 text-gold" /> : <VolumeX className="h-4 w-4" />}
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto px-4 pb-2 text-[10px] uppercase tracking-[.16em] text-muted-foreground md:hidden">
          {(["home", "mission", "meta", "mentor", "evolution", "premium"] as const).map((s) => (
            <button key={s} onClick={() => go(s)} className={`whitespace-nowrap rounded-full border px-3 py-1 ${screen === s ? "border-primary/50 text-primary" : "border-border"}`}>
              {{ home: "Início", mission: "Missão", meta: "Metas", mentor: "Anti-procrast.", evolution: "Evolução", premium: "Premium" }[s]}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:py-10">
        {toast && <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full border border-primary/30 bg-surface px-5 py-3 text-sm shadow-elevated">{toast}<button onClick={() => setToast("")} className="ml-3 text-muted-foreground">×</button></div>}
        {busy && <div className="fixed inset-0 z-[65] flex flex-col items-center justify-center gap-4 bg-black/75 p-6 text-center backdrop-blur-sm"><Loader2 className="h-8 w-8 animate-spin text-primary" /><p className="text-sm text-white/80">{busy}</p></div>}

        {screen === "home" && (
          <>
            <section className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-gradient-to-br from-slate-950 via-blue-950/70 to-background shadow-elevated">
              <div className="grid items-stretch lg:grid-cols-[1.05fr_.95fr]">
                <div className="relative z-10 p-7 sm:p-10 lg:p-12">
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[.2em] text-primary"><Sparkles className="h-3.5 w-3.5" /> Protocolo premium</div>
                  <h1 className="max-w-2xl font-display text-4xl leading-[.98] sm:text-6xl">DESBLOQUEIE O PODER <span className="text-primary">DA SUA MENTE</span></h1>
                  <p className="mt-4 max-w-xl text-lg text-white/75">7 níveis. 7 áreas da vida. <span className="text-white">Uma única vida para cuidar.</span></p>
                  <p className="mt-2 text-sm text-white/60">Olá{name ? `, ${name}` : ""}. Do diagnóstico à sua missão diária.</p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <button onClick={() => begin(nextLevel)} className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 shadow-glow">{completed ? "Continuar jornada" : "Começar diagnóstico"}<ArrowRight className="h-4 w-4" /></button>
                    <button onClick={() => go("evolution")} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm text-white/80">Ver meu progresso</button>
                  </div>
                </div>
                <div className="relative min-h-[320px] overflow-hidden">
                  <img src={desbloqueieCover.url} alt="Protocolo Desbloqueie o Poder da Sua Mente" className="absolute inset-0 h-full w-full object-cover object-top" />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-transparent lg:bg-gradient-to-l lg:from-transparent lg:to-slate-950/60" />
                </div>
              </div>
            </section>

            <section className="mt-5 grid gap-3 sm:grid-cols-4">
              <Stat icon={<Trophy />} label="Progresso geral" value={`${pct}%`} />
              <Stat icon={<Award />} label="Níveis concluídos" value={`${completed}/7`} />
              <Stat icon={<Zap />} label="Minha pontuação" value={String(state.points)} />
              <Stat icon={<Flame />} label="Sequência" value={completed ? `${completed} nível${completed > 1 ? "s" : ""}` : "Comece hoje"} />
            </section>

            <section className="mt-8">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div><p className="text-[10px] uppercase tracking-[.2em] text-primary">Meu progresso</p><h2 className="mt-1 font-display text-3xl">Nível 1 → Nível 7</h2></div>
                <span className="text-sm text-muted-foreground">{completed}/7 níveis concluídos</span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5"><div className="h-full bg-gradient-primary transition-all duration-700" style={{ width: `${pct}%` }} /></div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {levels.map((l, i) => {
                  const done = state.completed.includes(l.id);
                  const locked = i > 0 && !state.completed.includes(i);
                  const Icon = l.icon;
                  return (
                    <button key={l.id} disabled={locked} onClick={() => begin(l.id)} className={`group relative overflow-hidden rounded-3xl border text-left transition ${done ? "border-primary/50" : "border-border"} ${locked ? "cursor-not-allowed opacity-60" : "hover:-translate-y-1 hover:border-primary/50"}`}>
                      <img src={l.banner} alt={`Banner do nível ${l.id} — ${l.name}`} loading="lazy" width={1280} height={720} className="h-40 w-full object-cover transition duration-700 group-hover:scale-105" />
                      <div className={`absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent`} />
                      <div className="relative -mt-16 p-5">
                        <div className="flex items-center justify-between">
                          <span className="rounded-full bg-black/50 px-2 py-1 text-[10px] font-bold tracking-widest text-white/80">NÍVEL 0{l.id}</span>
                          {done ? <Check className="h-4 w-4 text-primary" /> : locked ? <Lock className="h-4 w-4 text-muted-foreground" /> : <Icon className="h-4 w-4 text-primary" />}
                        </div>
                        <p className="mt-3 font-display text-xl">{l.name}</p>
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{l.title}</p>
                        {done && <p className="mt-2 text-[11px] text-primary">Concluído · {state.scores[l.id] ?? 0}/30 pontos</p>}
                        {locked && <p className="mt-2 text-[11px] text-muted-foreground">Conclua o nível {i} para desbloquear</p>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="mt-10 grid gap-4 lg:grid-cols-3">
              <ActionCard icon={<Target />} title="Missão atual" text={currentMission?.text || "Conclua um nível para receber sua primeira missão personalizada."} button="Ver missão" onClick={() => go("mission")} />
              <ActionCard icon={<Goal />} title="Construtor de metas" text="Meta → resultado → etapas → ações → prazos → acompanhamento." button="Criar meta" onClick={() => go("meta")} />
              <ActionCard icon={<Brain />} title="Anti-procrastinação" text="Pare de adiar. Descreva o que está evitando e receba um protocolo de execução." button="Abrir mentor" onClick={() => go("mentor")} />
            </section>

            <section className="mt-10 rounded-3xl border border-border bg-surface p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-primary/10 p-3"><ShieldCheck className="h-6 w-6 text-primary" /></div>
                <div>
                  <h3 className="font-display text-xl sm:text-2xl">DIAGNOSTICAR → COMPREENDER → PERCEBER → ESCOLHER → AGIR → REGISTRAR → EVOLUIR</h3>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">Você não precisa transformar sua vida inteira hoje. Precisa descobrir qual nível merece sua atenção e dar o próximo passo. Este conteúdo é destinado à autopercepção e ao desenvolvimento pessoal e não substitui acompanhamento profissional.</p>
                </div>
              </div>
            </section>
          </>
        )}

        {screen === "quiz" && current && (
          <Quiz name={name} level={lvl} qi={qi} current={current} onBack={() => go("home")} onChoose={choose} onPrev={() => qi > 0 && setQi(qi - 1)} />
        )}

        {screen === "result" && (
          <Result name={name} level={lvl} diagnostic={state.diagnoses[level] || ""} score={state.scores[level] ?? 0} onContinue={() => go("mission")} onHome={() => go("home")} />
        )}

        {screen === "mission" && (
          <Mission name={name} level={levels[(state.missions[level] ? level : nextLevel) - 1]} mission={state.missions[level] || currentMission} onSave={savePlan} onHome={() => go("home")} />
        )}

        {screen === "mentor" && (
          <Mentor name={name} value={mentorInput} setValue={setMentorInput} reply={mentorReply} history={state.protocols} onAsk={askMentor} onHome={() => go("home")} />
        )}

        {screen === "meta" && (
          <MetaBuilder goal={metaGoal} setGoal={setMetaGoal} horizon={horizon} setHorizon={setHorizon} metas={state.metas} onBuild={buildMeta}
            onToggle={(id) => persist({ ...state, metas: state.metas.map((m) => (m.id === id ? { ...m, done: !m.done } : m)), points: state.points + 10 })} />
        )}

        {screen === "evolution" && <Evolution name={name} state={state} onReset={() => setShowReset(true)} />}
        {screen === "premium" && <Premium />}
      </main>

      {showReset && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-elevated">
            <h3 className="font-display text-2xl">Reiniciar jornada?</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Isso apagará seu progresso, respostas, missões, metas, pontuação e histórico. Deseja realmente começar novamente?</p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setShowReset(false)} className="flex-1 rounded-full border border-border px-4 py-3">Cancelar</button>
              <button onClick={doReset} className="flex-1 rounded-full bg-destructive px-4 py-3 text-white">Reiniciar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ icon, label, value }: { icon: any; label: string; value: string }) {
  return <div className="rounded-2xl border border-border bg-surface p-4"><div className="flex items-center gap-2 text-primary">{icon}<span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span></div><p className="mt-2 font-display text-2xl">{value}</p></div>;
}

function ActionCard({ icon, title, text, button, onClick }: { icon: any; title: string; text: string; button: string; onClick: () => void }) {
  return (
    <div className="rounded-3xl border border-border bg-surface p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">{icon}</div>
      <h3 className="mt-4 font-display text-xl">{title}</h3>
      <p className="mt-2 min-h-[52px] text-sm leading-6 text-muted-foreground">{text}</p>
      <button onClick={onClick} className="mt-5 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold hover:border-primary/50">{button}<ArrowRight className="h-3.5 w-3.5" /></button>
    </div>
  );
}

function Quiz({ name, level, qi, current, onBack, onChoose, onPrev }: { name: string; level: Level; qi: number; current: PowerQuestion; onBack: () => void; onChoose: (s: number) => void; onPrev: () => void }) {
  const Icon = level.icon;
  return (
    <section className="mx-auto max-w-3xl">
      <button onClick={onBack} className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft className="h-4 w-4" /> Voltar</button>
      <div className="overflow-hidden rounded-[2rem] border border-border">
        <div className="relative h-40 sm:h-52">
          <img src={level.banner} alt={`Nível ${level.id} — ${level.name}`} loading="lazy" width={1280} height={720} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute bottom-4 left-5"><p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-primary"><Icon className="h-4 w-4" /> Nível {level.id} — {level.name}</p><p className="text-sm text-white/80">{level.title}</p></div>
        </div>
        <div className={`bg-gradient-to-br ${level.accent} p-6 sm:p-10`}>
          <div className="flex items-center justify-between text-xs text-muted-foreground"><span>NÍVEL {level.id} — PERGUNTA {qi + 1}/10</span><span>{Math.round(((qi + 1) / 10) * 100)}%</span></div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-primary transition-all duration-500" style={{ width: `${((qi + 1) / 10) * 100}%` }} /></div>
          {name && <p className="mt-8 text-sm uppercase tracking-widest text-muted-foreground">Olá, {name}</p>}
          <h1 className="mt-2 font-display text-2xl leading-tight sm:text-4xl">{current.text}</h1>
          <div className="mt-8 space-y-3">
            {current.options.map((o, i) => (
              <button key={i} onClick={() => onChoose(i + 1)} className="group flex w-full items-center gap-4 rounded-2xl border border-border bg-background/60 p-4 text-left transition hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/5 sm:p-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-sm font-semibold group-hover:border-primary group-hover:text-primary">{String.fromCharCode(65 + i)}</span>
                <span className="whitespace-normal text-sm leading-6">{o}</span>
                <ArrowRight className="ml-auto hidden h-4 w-4 opacity-40 group-hover:opacity-100 sm:block" />
              </button>
            ))}
          </div>
          {qi > 0 && <button onClick={onPrev} className="mt-6 text-xs text-muted-foreground underline">Voltar uma pergunta</button>}
        </div>
      </div>
      <p className="mt-5 text-center text-[11px] text-muted-foreground">Diagnóstico de autopercepção e desenvolvimento — sem finalidade clínica.</p>
    </section>
  );
}

function Result({ name, level, diagnostic, score, onContinue, onHome }: { name: string; level: Level; diagnostic: string; score: number; onContinue: () => void; onHome: () => void }) {
  return (
    <section className="mx-auto max-w-4xl">
      <div className="relative overflow-hidden rounded-[2rem] border border-primary/30 p-7 text-center sm:p-12">
        <img src={level.banner} alt="" aria-hidden loading="lazy" width={1280} height={720} className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background" />
        <div className="relative">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-primary/40 bg-primary/10 shadow-glow"><Trophy className="h-9 w-9 text-primary" /></div>
          <p className="mt-5 text-[10px] uppercase tracking-[.25em] text-primary">Parabéns{name ? `, ${name}` : ""}!</p>
          <h1 className="mt-2 font-display text-4xl">Nível {level.id} concluído</h1>
          <p className="mt-2 text-muted-foreground">{level.name} · {score}/30 pontos</p>
          <div className="mx-auto mt-8 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
            <Stat icon={<Award />} label="Nível" value={`${level.id}/7`} />
            <Stat icon={<BarChart3 />} label="Pontuação" value={`${score}/30`} />
            <Stat icon={<Sparkles />} label="Próxima etapa" value={level.id < 7 ? `Nível ${level.id + 1}` : "Conclusão"} />
          </div>
        </div>
      </div>
      <div className="mt-5 rounded-3xl border border-border bg-surface p-6">
        <h2 className="font-display text-2xl">Seu diagnóstico</h2>
        <div className="mt-4 max-h-[520px] overflow-auto whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{diagnostic}</div>
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button onClick={onContinue} className="h-auto flex-1 whitespace-normal rounded-full bg-primary px-6 py-4 text-center font-semibold text-primary-foreground shadow-glow">Continuar jornada — ver minha missão</button>
        <button onClick={onHome} className="h-auto whitespace-normal rounded-full border border-border px-6 py-4">Voltar ao início</button>
      </div>
    </section>
  );
}

function Mission({ name, level, mission, onSave, onHome }: { name: string; level: Level; mission?: MissionRec; onSave: (p: Plan) => void; onHome: () => void }) {
  const [p, setP] = useState<Plan>(mission?.plan || { change: "", action: mission?.text || "", when: "Hoje", first: "", track: "" });
  useEffect(() => { if (mission?.plan) setP(mission.plan); else if (mission?.text) setP((x) => ({ ...x, action: x.action || mission.text })); }, [mission]);
  return (
    <section className="mx-auto max-w-3xl">
      <button onClick={onHome} className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft className="h-4 w-4" /> Início</button>
      <div className="rounded-[2rem] border border-primary/30 bg-surface p-6 sm:p-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[10px] uppercase tracking-widest text-primary"><Target className="h-3.5 w-3.5" /> Minha missão</div>
        <h1 className="mt-5 font-display text-3xl sm:text-4xl">{name ? `${name}, transforme consciência em ação.` : "Transforme consciência em ação."}</h1>
        <p className="mt-3 text-muted-foreground">Nível {level.id} — {level.name}</p>
        {mission?.text ? (
          <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-5"><p className="text-[10px] uppercase tracking-widest text-primary">Missão personalizada</p><p className="mt-3 whitespace-pre-wrap text-base leading-7">{mission.text}</p></div>
        ) : (
          <p className="mt-8 rounded-2xl border border-border p-5 text-sm text-muted-foreground">Conclua um nível para receber sua missão personalizada.</p>
        )}
        <p className="mt-8 text-[10px] uppercase tracking-widest text-primary">Plano de ação</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {([["change", "O que preciso mudar?"], ["action", "O que vou fazer?"], ["when", "Quando vou fazer?"], ["first", "Qual será meu primeiro passo?"], ["track", "Como vou acompanhar?"]] as const).map(([k, l]) => (
            <label key={k} className="text-xs font-semibold text-muted-foreground">{l}
              <textarea value={(p as any)[k]} onChange={(e) => setP({ ...p, [k]: e.target.value })} rows={k === "action" ? 3 : 2} className="mt-2 w-full resize-none rounded-2xl border border-border bg-background p-3 text-sm text-foreground outline-none focus:border-primary" />
            </label>
          ))}
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button onClick={() => onSave(p)} className="h-auto flex-1 whitespace-normal rounded-full bg-primary px-6 py-4 text-center font-semibold text-primary-foreground shadow-glow">{mission?.done ? "Atualizar missão" : "Marcar missão como concluída"}</button>
          <button onClick={onHome} className="h-auto whitespace-normal rounded-full border border-border px-6 py-4">Depois</button>
        </div>
      </div>
    </section>
  );
}

function Mentor({ name, value, setValue, reply, history, onAsk, onHome }: { name: string; value: string; setValue: (v: string) => void; reply: string; history: Protocol[]; onAsk: () => void; onHome: () => void }) {
  return (
    <section className="mx-auto max-w-3xl">
      <button onClick={onHome} className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft className="h-4 w-4" /> Início</button>
      <div className="rounded-[2rem] border border-border bg-surface p-6 sm:p-10">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-primary/10 p-3 text-primary"><MessageCircle /></div>
          <div><p className="text-[10px] uppercase tracking-widest text-primary">Anti-procrastinação</p><h1 className="font-display text-2xl sm:text-3xl">Pare de adiar. Comece a agir.</h1></div>
        </div>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">{name ? `${name}, descreva` : "Descreva"} com o máximo de detalhes o que você está evitando, há quanto tempo, por que precisa fazer, o que sente quando pensa em começar e o que já tentou fazer.</p>
        <textarea value={value} onChange={(e) => setValue(e.target.value)} placeholder="O que você está procrastinando?" rows={7} className="mt-6 w-full rounded-2xl border border-border bg-background p-4 text-sm outline-none focus:border-primary" />
        <button onClick={onAsk} className="mt-4 h-auto w-full whitespace-normal rounded-full bg-primary px-6 py-4 font-semibold text-primary-foreground shadow-glow">Gerar protocolo de execução</button>
        {reply && <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-5"><p className="whitespace-pre-wrap text-sm leading-7">{reply}</p></div>}
        {history.length > 0 && (
          <div className="mt-8">
            <p className="text-[10px] uppercase tracking-widest text-primary">Histórico de protocolos</p>
            <div className="mt-3 space-y-3">
              {history.slice(0, 5).map((h) => (
                <details key={h.id} className="rounded-2xl border border-border p-4">
                  <summary className="cursor-pointer text-sm">{new Date(h.at).toLocaleString("pt-BR")} — {h.input.slice(0, 60)}...</summary>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{h.text}</p>
                </details>
              ))}
            </div>
          </div>
        )}
        <p className="mt-6 text-center text-xs italic text-muted-foreground">Agora não pense em terminar tudo. Execute o primeiro passo.</p>
        <p className="mt-4 text-[10px] text-muted-foreground">Conteúdo educativo de autopercepção e desenvolvimento pessoal; não substitui acompanhamento profissional.</p>
      </div>
    </section>
  );
}

function MetaBuilder({ goal, setGoal, horizon, setHorizon, metas, onBuild, onToggle }: { goal: string; setGoal: (v: string) => void; horizon: string; setHorizon: (v: string) => void; metas: Meta[]; onBuild: () => void; onToggle: (id: string) => void }) {
  return (
    <section className="mx-auto max-w-4xl">
      <div className="rounded-[2rem] border border-border bg-surface p-6 sm:p-10">
        <p className="text-[10px] uppercase tracking-widest text-primary">Construtor de metas</p>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl">Meta → Resultado → Etapas → Ações → Prazos</h1>
        <div className="mt-7 grid gap-4 sm:grid-cols-[1fr_180px]">
          <textarea value={goal} onChange={(e) => setGoal(e.target.value)} rows={4} placeholder="Qual é a meta que você deseja alcançar?" className="rounded-2xl border border-border bg-background p-4 text-sm outline-none focus:border-primary" />
          <select value={horizon} onChange={(e) => setHorizon(e.target.value)} className="h-fit rounded-2xl border border-border bg-background p-4 text-sm">
            {["Hoje", "1 semana", "1 mês", "3 meses", "6 meses", "1 ano"].map((h) => <option key={h}>{h}</option>)}
          </select>
        </div>
        <button onClick={onBuild} className="mt-4 h-auto whitespace-normal rounded-full bg-primary px-6 py-4 font-semibold text-primary-foreground shadow-glow">Gerar plano e salvar meta</button>
      </div>
      <div className="mt-6 space-y-4">
        {metas.length === 0 && <p className="rounded-3xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">Nenhuma meta criada ainda. Sua primeira meta aparecerá aqui.</p>}
        {metas.map((m) => (
          <article key={m.id} className="rounded-3xl border border-border bg-surface p-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] uppercase tracking-widest text-primary">{m.horizon}</span>
                <h2 className="mt-3 font-display text-2xl">{m.goal}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{m.result}</p>
              </div>
              <button onClick={() => onToggle(m.id)} className={`h-auto shrink-0 whitespace-normal rounded-full px-4 py-2 text-xs font-semibold ${m.done ? "bg-primary text-primary-foreground" : "border border-border"}`}>{m.done ? "Concluída" : "Marcar concluída"}</button>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <InfoBox title="Etapas" items={m.steps} />
              <InfoBox title="Ações" items={m.actions} />
              <InfoBox title="Prioridades" items={m.priorities} />
              <InfoBox title="Obstáculos" items={m.obstacles} />
              <InfoBox title="Estratégia" items={[m.strategy]} />
              <InfoBox title="Primeira ação e indicador" items={[m.first, m.indicator]} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function InfoBox({ title, items }: { title: string; items: string[] }) {
  return <div className="rounded-2xl border border-border/70 p-4"><p className="text-[10px] uppercase tracking-widest text-primary">{title}</p><ul className="mt-2 space-y-1 text-sm text-muted-foreground">{items.map((x, i) => <li key={i}>• {x}</li>)}</ul></div>;
}

function Evolution({ name, state, onReset }: { name: string; state: SavedState; onReset: () => void }) {
  const missionsDone = Object.values(state.missions).filter((m) => m.done).length;
  return (
    <section className="mx-auto max-w-5xl">
      <div className="rounded-[2rem] border border-border bg-surface p-6 sm:p-10">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><p className="text-[10px] uppercase tracking-widest text-primary">Minha evolução</p><h1 className="mt-2 font-display text-3xl sm:text-4xl">{name ? `Sua jornada, ${name}.` : "Sua jornada."}</h1></div>
          <button onClick={onReset} className="inline-flex items-center gap-2 rounded-full border border-destructive/30 px-4 py-2 text-xs text-destructive"><RotateCcw className="h-3.5 w-3.5" /> Reiniciar jornada</button>
        </div>
        <div className="mt-8 h-3 overflow-hidden rounded-full bg-white/5"><div className="h-full bg-gradient-primary transition-all" style={{ width: `${(state.completed.length / 7) * 100}%` }} /></div>
        <div className="mt-3 flex justify-between text-xs text-muted-foreground"><span>{state.completed.length}/7 níveis concluídos</span><span>{state.points} pontos</span></div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Stat icon={<Award />} label="Níveis" value={`${state.completed.length}/7`} />
          <Stat icon={<Target />} label="Missões concluídas" value={`${missionsDone}/${Object.keys(state.missions).length || 0}`} />
          <Stat icon={<Goal />} label="Metas" value={String(state.metas.length)} />
          <Stat icon={<BookOpen />} label="Protocolos" value={String(state.protocols.length)} />
          <Stat icon={<Zap />} label="Pontuação" value={String(state.points)} />
        </div>
        <div className="mt-8 rounded-3xl border border-border p-5">
          <p className="text-[10px] uppercase tracking-widest text-primary">Linha do tempo</p>
          <div className="mt-4 space-y-4">
            {levels.map((l) => {
              const done = state.completed.includes(l.id);
              const mission = state.missions[l.id];
              return (
                <div key={l.id} className="flex gap-4">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${done ? "bg-primary text-primary-foreground" : "bg-white/5 text-muted-foreground"}`}>{done ? <Check className="h-4 w-4" /> : l.id}</div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">Nível {l.id} — {l.name}</p>
                    <p className="text-xs text-muted-foreground">{done ? `Concluído · ${state.scores[l.id] ?? 0}/30 pontos` : "Aguardando sua jornada"}</p>
                    {mission?.text && <p className="mt-1 text-xs text-muted-foreground">Missão: {mission.text}{mission.done ? " ✓ concluída" : ""}</p>}
                    {state.diagnoses[l.id] && <details className="mt-2"><summary className="cursor-pointer text-xs text-primary">Ver diagnóstico</summary><p className="mt-2 whitespace-pre-wrap text-xs leading-6 text-muted-foreground">{state.diagnoses[l.id]}</p></details>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {state.metas.length > 0 && (
          <div className="mt-6 rounded-3xl border border-border p-5">
            <p className="text-[10px] uppercase tracking-widest text-primary">Metas registradas</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">{state.metas.map((m) => <li key={m.id}>• [{m.horizon}] {m.goal} {m.done ? "✓" : ""}</li>)}</ul>
          </div>
        )}
      </div>
    </section>
  );
}

function Premium() {
  const items = ["Aulas dos 7 Níveis da Vida", "7 Aplicativos Interativos de Desenvolvimento Pessoal", "Central de Comando", "Robô Decodificador de Livros", "Mapa da Vida", "Formação Prática em PNL", "Mais Esperto que o Diabo — Mentoria NeuroLeitura", "Desbloqueie o Poder da Sua Mente — Mentoria baseada em princípios dos ensinamentos de Jesus"];
  return (
    <section className="mx-auto max-w-4xl">
      <div className="rounded-[2rem] border border-primary/30 bg-gradient-to-br from-slate-950 via-blue-950/60 to-background p-7 sm:p-12">
        <div className="flex items-center gap-3"><Gem className="text-primary" /><span className="text-[10px] uppercase tracking-[.25em] text-primary">Área de membros premium 🔐</span></div>
        <h1 className="mt-5 font-display text-3xl sm:text-4xl">Sua próxima etapa de desenvolvimento está aqui.</h1>
        <p className="mt-4 text-muted-foreground">Para ativar sua área premium, entre em contato pelo WhatsApp e envie o e-mail utilizado na compra.</p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">{items.map((x, i) => <div key={i} className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm"><Check className="h-4 w-4 shrink-0 text-primary" />{x}</div>)}</div>
        <a href="https://wa.me/message/YNNTLWLFBDWOP1" target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-4 font-semibold text-primary-foreground shadow-glow"><MessageCircle className="h-4 w-4" /> Ativar área premium</a>
      </div>
    </section>
  );
}
