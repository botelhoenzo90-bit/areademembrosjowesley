import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
import {
  Send, Plus, MessageSquare, Target, Dumbbell, ClipboardList, Sparkles,
  Loader2, Trash2, CheckCircle2, Circle, Clock,
} from "lucide-react";
import heroImg from "@/assets/cover-2.png.asset.json";

export const Route = createFileRoute("/_authenticated/centro-operacional")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Centro Operacional — Instituto Neuroconsciência" },
      { name: "description", content: "Seu Mentor de Inteligência Artificial disponível 24 horas para acelerar sua evolução." },
    ],
  }),
  component: CentroOperacional,
});

type Tab = "chat" | "missoes" | "exercicios" | "plano";

const QUICK_SUGGESTIONS = [
  "Tirar dúvidas sobre uma aula",
  "Criar um plano de ação",
  "Solicitar exercícios personalizados",
  "Receber um desafio diário",
  "Gerar metas semanais",
  "Criar uma rotina de estudos",
  "Melhorar inteligência emocional",
  "Reprogramar crenças limitantes",
  "Organizar objetivos",
  "Planejar hábitos",
];

const EXERCISE_THEMES = [
  "Inteligência emocional", "Autoconhecimento", "Comunicação", "Disciplina",
  "Ansiedade", "Organização", "Propósito", "Liderança", "Hábitos", "Foco",
];

function CentroOperacional() {
  const [tab, setTab] = useState<Tab>("chat");

  return (
    <main className="relative min-h-screen">
      {/* HERO */}
      <header className="relative h-56 overflow-hidden sm:h-72">
        <img src={heroImg} alt="Centro Operacional" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-6 sm:px-8">
          <span className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-full glass px-3 py-1 text-[10px] uppercase tracking-widest text-gold">
            <Sparkles className="h-3 w-3" /> IA Mentor
          </span>
          <h1 className="font-display text-3xl text-foreground sm:text-5xl">CENTRO OPERACIONAL</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Seu Mentor de Inteligência Artificial disponível 24 horas para acelerar sua evolução.
          </p>
        </div>
      </header>

      {/* INTRO */}
      <section className="mx-4 mt-6 rounded-2xl border border-border glass p-5 text-sm text-muted-foreground sm:mx-8">
        Aqui você possui acesso ao seu <span className="text-foreground">Centro Operacional de Consciência Expandida</span>.
        Um ambiente criado para ajudá-lo a implementar os conhecimentos da plataforma, esclarecer dúvidas, criar planos personalizados e acompanhar sua evolução de forma prática.
      </section>

      {/* TABS */}
      <nav className="sticky top-0 z-30 mt-6 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-4xl gap-1 overflow-x-auto px-3 py-3 sm:gap-2">
          <TabBtn active={tab === "chat"} onClick={() => setTab("chat")} icon={<MessageSquare className="h-4 w-4" />}>Mentor</TabBtn>
          <TabBtn active={tab === "missoes"} onClick={() => setTab("missoes")} icon={<Target className="h-4 w-4" />}>Missões</TabBtn>
          <TabBtn active={tab === "exercicios"} onClick={() => setTab("exercicios")} icon={<Dumbbell className="h-4 w-4" />}>Exercícios</TabBtn>
          <TabBtn active={tab === "plano"} onClick={() => setTab("plano")} icon={<ClipboardList className="h-4 w-4" />}>Plano de Ação</TabBtn>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-3 pb-8 sm:px-6">
        {tab === "chat" && <ChatPanel />}
        {tab === "missoes" && <MissoesPanel />}
        {tab === "exercicios" && <ExerciciosPanel />}
        {tab === "plano" && <PlanoPanel />}
      </div>
    </main>
  );
}

function TabBtn({
  active, onClick, icon, children,
}: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-medium uppercase tracking-widest transition ${
        active
          ? "bg-gradient-primary text-primary-foreground shadow-glow"
          : "glass text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon} {children}
    </button>
  );
}

/* ================= CHAT ================= */

type ConvRow = { id: string; title: string; updated_at: string };

function ChatPanel() {
  const [userId, setUserId] = useState<string | null>(null);
  const [convs, setConvs] = useState<ConvRow[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [initialMessages, setInitialMessages] = useState<UIMessage[]>([]);
  const [loadingConv, setLoadingConv] = useState(true);
  const [input, setInput] = useState("");

  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);

  const { messages, sendMessage, status, setMessages } = useChat({
    id: activeId ?? "new",
    messages: initialMessages,
    transport,
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  // load conversations
  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      const uid = u.user?.id ?? null;
      setUserId(uid);
      if (!uid) return;
      const { data } = await supabase
        .from("conversations").select("id, title, updated_at")
        .eq("user_id", uid).order("updated_at", { ascending: false });
      const rows = (data ?? []) as ConvRow[];
      setConvs(rows);
      if (rows.length > 0 && !activeId) {
        await openConversation(rows[0].id, uid);
      } else {
        setLoadingConv(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openConversation = async (id: string, uid?: string | null) => {
    setLoadingConv(true);
    const u = uid ?? userId;
    if (!u) return;
    const { data } = await supabase
      .from("chat_messages").select("id, role, content, created_at")
      .eq("conversation_id", id).order("created_at");
    const loaded: UIMessage[] = (data ?? []).map((m: any) => ({
      id: m.id,
      role: m.role as UIMessage["role"],
      parts: [{ type: "text", text: m.content }],
    }));
    setInitialMessages(loaded);
    setMessages(loaded);
    setActiveId(id);
    setLoadingConv(false);
  };

  const newConversation = async () => {
    if (!userId) return;
    const { data, error } = await supabase
      .from("conversations").insert({ user_id: userId, title: "Nova conversa" })
      .select("id, title, updated_at").single();
    if (error || !data) return;
    setConvs((c) => [data as ConvRow, ...c]);
    setInitialMessages([]);
    setMessages([]);
    setActiveId(data.id);
  };

  const deleteConversation = async (id: string) => {
    await supabase.from("conversations").delete().eq("id", id);
    setConvs((c) => c.filter((x) => x.id !== id));
    if (activeId === id) {
      setActiveId(null);
      setMessages([]);
    }
  };

  const handleSend = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || !userId) return;

    let convId = activeId;
    if (!convId) {
      const { data } = await supabase
        .from("conversations")
        .insert({ user_id: userId, title: content.slice(0, 60) })
        .select("id, title, updated_at").single();
      if (!data) return;
      convId = data.id;
      setActiveId(convId);
      setConvs((c) => [data as ConvRow, ...c]);
    } else if (messages.length === 0) {
      await supabase.from("conversations").update({ title: content.slice(0, 60), updated_at: new Date().toISOString() }).eq("id", convId);
      setConvs((c) => c.map((x) => (x.id === convId ? { ...x, title: content.slice(0, 60) } : x)));
    } else {
      await supabase.from("conversations").update({ updated_at: new Date().toISOString() }).eq("id", convId);
    }

    // persist user message
    await supabase.from("chat_messages").insert({
      conversation_id: convId, user_id: userId, role: "user", content,
    });

    setInput("");
    await sendMessage({ text: content });
  };

  // persist assistant messages once they finish streaming
  const persistedRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (status !== "ready" || !activeId || !userId) return;
    const last = messages[messages.length - 1];
    if (!last || last.role !== "assistant") return;
    if (persistedRef.current.has(last.id)) return;
    const text = last.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
    if (!text.trim()) return;
    persistedRef.current.add(last.id);
    supabase.from("chat_messages").insert({
      conversation_id: activeId, user_id: userId, role: "assistant", content: text,
    }).then();
  }, [status, messages, activeId, userId]);

  const isLoading = status === "submitted" || status === "streaming";
  const showWelcome = messages.length === 0 && !loadingConv;

  return (
    <div className="mt-6 grid gap-4 md:grid-cols-[240px_1fr]">
      {/* Sidebar */}
      <aside className="rounded-2xl border border-border glass p-3">
        <button
          onClick={newConversation}
          className="mb-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-primary px-4 py-2 text-xs font-medium uppercase tracking-widest text-primary-foreground shadow-glow"
        >
          <Plus className="h-4 w-4" /> Nova conversa
        </button>
        <div className="space-y-1 max-h-[50vh] overflow-y-auto">
          {convs.length === 0 && (
            <p className="px-2 py-4 text-center text-xs text-muted-foreground">Nenhuma conversa ainda.</p>
          )}
          {convs.map((c) => (
            <div
              key={c.id}
              className={`group flex items-center gap-2 rounded-lg px-2 py-2 text-xs transition ${
                activeId === c.id ? "bg-surface-elevated text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <button
                onClick={() => openConversation(c.id)}
                className="flex-1 truncate text-left"
              >
                {c.title || "Nova conversa"}
              </button>
              <button
                onClick={() => deleteConversation(c.id)}
                className="opacity-0 transition group-hover:opacity-100"
                aria-label="Excluir"
              >
                <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* Chat area */}
      <section className="flex min-h-[65vh] flex-col rounded-2xl border border-border bg-surface">
        <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto p-5">
          {loadingConv && (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-gold" />
            </div>
          )}

          {showWelcome && (
            <div className="animate-fade-in">
              <div className="rounded-2xl border border-border glass-strong p-5">
                <p className="text-sm leading-relaxed text-foreground">
                  Olá! 👋<br /><br />
                  Sou seu <span className="text-gold">Mentor de Inteligência Artificial</span>. Estou preparado para ajudá-lo durante toda sua jornada de desenvolvimento.
                  <br /><br />
                  Você pode fazer perguntas sobre qualquer conteúdo da plataforma ou solicitar estratégias práticas para implementar os ensinamentos em sua vida.
                </p>
              </div>
              <p className="mt-5 text-[10px] uppercase tracking-widest text-muted-foreground">Sugestões rápidas</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {QUICK_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setInput(s)}
                    className="rounded-full glass px-3 py-1.5 text-xs text-foreground transition hover:bg-surface-elevated"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => {
            const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
            const isUser = m.role === "user";
            return (
              <div key={m.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                    isUser
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground"
                  }`}
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap">{text}</p>
                  ) : (
                    <div className="prose prose-invert prose-sm max-w-none prose-headings:font-display prose-headings:text-foreground prose-strong:text-gold prose-a:text-gold">
                      <ReactMarkdown>{text}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-gold" />
                Mentor pensando...
              </div>
            </div>
          )}
        </div>

        {/* Composer */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="border-t border-border p-3"
        >
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Escreva para o seu mentor..."
              rows={1}
              className="flex-1 resize-none rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm text-foreground outline-none focus:border-gold/60"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow transition disabled:opacity-40"
              aria-label="Enviar"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

/* ================= MISSÕES ================= */

type Mission = {
  id: string; period: string; objective: string;
  steps: string[]; deadline: string | null;
  checklist: { text: string; done: boolean }[]; completed: boolean;
};

function MissoesPanel() {
  const [userId, setUserId] = useState<string | null>(null);
  const [items, setItems] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      const uid = u.user?.id ?? null;
      setUserId(uid);
      if (uid) await load(uid);
    })();
  }, []);

  const load = async (uid: string) => {
    setLoading(true);
    const { data } = await supabase
      .from("missions").select("*").eq("user_id", uid).order("created_at", { ascending: false });
    setItems((data ?? []).map((m: any) => ({
      ...m,
      steps: Array.isArray(m.steps) ? m.steps : [],
      checklist: Array.isArray(m.checklist) ? m.checklist : [],
    })));
    setLoading(false);
  };

  const generate = async (period: "daily" | "weekly" | "monthly") => {
    if (!userId) return;
    setGenerating(period);
    const prompt = `Gere uma missão ${period === "daily" ? "diária" : period === "weekly" ? "semanal" : "mensal"} de desenvolvimento pessoal. Retorne APENAS JSON válido com este formato exato:
{"objective":"string","steps":["passo 1","passo 2"],"deadline":"prazo curto em texto","checklist":["item 1","item 2","item 3"]}
Sem texto extra, sem markdown, apenas o JSON.`;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ id: crypto.randomUUID(), role: "user", parts: [{ type: "text", text: prompt }] }],
        }),
      });
      const raw = await res.text();
      const text = extractStreamText(raw);
      const json = extractJson(text);
      const parsed = JSON.parse(json);
      const { data } = await supabase.from("missions").insert({
        user_id: userId, period,
        objective: parsed.objective,
        steps: parsed.steps ?? [],
        deadline: parsed.deadline ?? null,
        checklist: (parsed.checklist ?? []).map((t: string) => ({ text: t, done: false })),
      }).select("*").single();
      if (data) setItems((i) => [{ ...(data as any), steps: data.steps || [], checklist: data.checklist || [] }, ...i]);
    } catch (e) {
      console.error("mission generation failed", e);
    } finally {
      setGenerating(null);
    }
  };

  const toggleCheck = async (m: Mission, idx: number) => {
    const newChecklist = m.checklist.map((c, i) => (i === idx ? { ...c, done: !c.done } : c));
    setItems((items) => items.map((x) => (x.id === m.id ? { ...x, checklist: newChecklist } : x)));
    await supabase.from("missions").update({ checklist: newChecklist }).eq("id", m.id);
  };

  const complete = async (m: Mission) => {
    setItems((items) => items.map((x) => (x.id === m.id ? { ...x, completed: !x.completed } : x)));
    await supabase.from("missions").update({ completed: !m.completed }).eq("id", m.id);
  };

  const del = async (id: string) => {
    setItems((items) => items.filter((x) => x.id !== id));
    await supabase.from("missions").delete().eq("id", id);
  };

  return (
    <div className="mt-6 space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        {(["daily", "weekly", "monthly"] as const).map((p) => (
          <button
            key={p}
            onClick={() => generate(p)}
            disabled={generating !== null}
            className="rounded-2xl border border-border glass p-5 text-left transition hover:border-gold/40 hover:shadow-glow disabled:opacity-50"
          >
            <p className="text-[10px] uppercase tracking-widest text-gold">Solicitar</p>
            <p className="mt-1 font-display text-lg text-foreground">
              Missão {p === "daily" ? "Diária" : p === "weekly" ? "Semanal" : "Mensal"}
            </p>
            {generating === p && <Loader2 className="mt-2 h-4 w-4 animate-spin text-gold" />}
          </button>
        ))}
      </div>

      {loading && <Loader2 className="mx-auto h-5 w-5 animate-spin text-gold" />}

      <div className="space-y-4">
        {items.map((m) => (
          <article key={m.id} className={`rounded-2xl border border-border p-5 ${m.completed ? "glass opacity-70" : "bg-surface"}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-gold">
                  {m.period === "daily" ? "Diária" : m.period === "weekly" ? "Semanal" : "Mensal"}
                </span>
                <h3 className="mt-1 font-display text-lg text-foreground">{m.objective}</h3>
                {m.deadline && (
                  <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" /> {m.deadline}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => complete(m)} className="rounded-full glass px-3 py-1.5 text-xs text-foreground">
                  {m.completed ? "Reabrir" : "Concluir"}
                </button>
                <button onClick={() => del(m.id)} aria-label="Excluir">
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            </div>
            {m.steps?.length > 0 && (
              <div className="mt-4">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Passo a passo</p>
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-foreground/90">
                  {m.steps.map((s, i) => <li key={i}>{s}</li>)}
                </ol>
              </div>
            )}
            {m.checklist?.length > 0 && (
              <div className="mt-4">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Checklist</p>
                <div className="mt-2 space-y-2">
                  {m.checklist.map((c, i) => (
                    <button key={i} onClick={() => toggleCheck(m, i)} className="flex w-full items-center gap-2 text-left text-sm text-foreground">
                      {c.done ? <CheckCircle2 className="h-4 w-4 text-gold" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
                      <span className={c.done ? "line-through text-muted-foreground" : ""}>{c.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </article>
        ))}
        {!loading && items.length === 0 && (
          <p className="rounded-2xl border border-border glass p-6 text-center text-sm text-muted-foreground">
            Solicite sua primeira missão acima. O Mentor irá criar objetivo, passo a passo, prazo e checklist personalizados.
          </p>
        )}
      </div>
    </div>
  );
}

/* ================= EXERCÍCIOS ================= */

type Exercise = {
  id: string; theme: string; title: string; content: string; completed: boolean;
};

function ExerciciosPanel() {
  const [userId, setUserId] = useState<string | null>(null);
  const [items, setItems] = useState<Exercise[]>([]);
  const [gen, setGen] = useState<string | null>(null);
  const [customTheme, setCustomTheme] = useState("");

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      const uid = u.user?.id ?? null;
      setUserId(uid);
      if (uid) {
        const { data } = await supabase.from("exercises").select("*").eq("user_id", uid).order("created_at", { ascending: false });
        setItems((data ?? []) as Exercise[]);
      }
    })();
  }, []);

  const generate = async (theme: string) => {
    if (!userId || !theme.trim()) return;
    setGen(theme);
    const prompt = `Crie um exercício prático personalizado sobre o tema "${theme}" para um aluno do Instituto Neuroconsciência. Retorne APENAS JSON válido:
{"title":"título curto","content":"instruções detalhadas em markdown com passos, tempo estimado e resultado esperado"}
Sem texto extra fora do JSON.`;
    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ id: crypto.randomUUID(), role: "user", parts: [{ type: "text", text: prompt }] }] }),
      });
      const raw = await res.text();
      const text = extractStreamText(raw);
      const parsed = JSON.parse(extractJson(text));
      const { data } = await supabase.from("exercises").insert({
        user_id: userId, theme, title: parsed.title, content: parsed.content,
      }).select("*").single();
      if (data) setItems((i) => [data as Exercise, ...i]);
      setCustomTheme("");
    } catch (e) { console.error(e); }
    finally { setGen(null); }
  };

  const toggle = async (ex: Exercise) => {
    setItems((it) => it.map((x) => x.id === ex.id ? { ...x, completed: !x.completed } : x));
    await supabase.from("exercises").update({ completed: !ex.completed }).eq("id", ex.id);
  };
  const del = async (id: string) => {
    setItems((it) => it.filter((x) => x.id !== id));
    await supabase.from("exercises").delete().eq("id", id);
  };

  return (
    <div className="mt-6 space-y-6">
      <div className="rounded-2xl border border-border glass p-5">
        <p className="text-[10px] uppercase tracking-widest text-gold">Escolha um tema</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {EXERCISE_THEMES.map((t) => (
            <button
              key={t}
              onClick={() => generate(t)}
              disabled={gen !== null}
              className="rounded-full glass px-3 py-1.5 text-xs text-foreground transition hover:bg-surface-elevated disabled:opacity-50"
            >
              {gen === t ? <Loader2 className="h-3 w-3 animate-spin" /> : t}
            </button>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <input
            value={customTheme}
            onChange={(e) => setCustomTheme(e.target.value)}
            placeholder="Ou digite outro tema..."
            className="flex-1 rounded-full border border-border bg-background/60 px-4 py-2 text-sm text-foreground outline-none focus:border-gold/60"
          />
          <button
            onClick={() => generate(customTheme)}
            disabled={!customTheme.trim() || gen !== null}
            className="rounded-full bg-gradient-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow-glow disabled:opacity-40"
          >
            Gerar
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((ex) => (
          <article key={ex.id} className={`rounded-2xl border border-border p-5 ${ex.completed ? "glass opacity-70" : "bg-surface"}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-gold">{ex.theme}</span>
                <h3 className="mt-1 font-display text-lg text-foreground">{ex.title}</h3>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggle(ex)} className="rounded-full glass px-3 py-1.5 text-xs text-foreground">
                  {ex.completed ? "Reabrir" : "Concluir"}
                </button>
                <button onClick={() => del(ex.id)}><Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" /></button>
              </div>
            </div>
            <div className="prose prose-invert prose-sm mt-3 max-w-none prose-strong:text-gold">
              <ReactMarkdown>{ex.content}</ReactMarkdown>
            </div>
          </article>
        ))}
        {items.length === 0 && (
          <p className="rounded-2xl border border-border glass p-6 text-center text-sm text-muted-foreground">
            Escolha um tema acima e o Mentor criará um exercício exclusivo para você.
          </p>
        )}
      </div>
    </div>
  );
}

/* ================= PLANO DE AÇÃO ================= */

type Plan = {
  id: string; objective: string; steps: string[]; timeline: string | null; indicators: string[];
};

function PlanoPanel() {
  const [userId, setUserId] = useState<string | null>(null);
  const [items, setItems] = useState<Plan[]>([]);
  const [objective, setObjective] = useState("");
  const [gen, setGen] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      const uid = u.user?.id ?? null;
      setUserId(uid);
      if (uid) {
        const { data } = await supabase.from("action_plans").select("*").eq("user_id", uid).order("created_at", { ascending: false });
        setItems((data ?? []).map((p: any) => ({
          ...p,
          steps: Array.isArray(p.steps) ? p.steps : [],
          indicators: Array.isArray(p.indicators) ? p.indicators : [],
        })));
      }
    })();
  }, []);

  const generate = async () => {
    if (!userId || !objective.trim()) return;
    setGen(true);
    const prompt = `Crie um plano de ação personalizado para o objetivo: "${objective}". Retorne APENAS JSON válido:
{"objective":"objetivo refinado","steps":["etapa 1","etapa 2","etapa 3","etapa 4","etapa 5"],"timeline":"cronograma resumido","indicators":["indicador 1","indicador 2","indicador 3"]}
Sem texto extra.`;
    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ id: crypto.randomUUID(), role: "user", parts: [{ type: "text", text: prompt }] }] }),
      });
      const raw = await res.text();
      const parsed = JSON.parse(extractJson(extractStreamText(raw)));
      const { data } = await supabase.from("action_plans").insert({
        user_id: userId,
        objective: parsed.objective,
        steps: parsed.steps ?? [],
        timeline: parsed.timeline ?? null,
        indicators: parsed.indicators ?? [],
      }).select("*").single();
      if (data) setItems((i) => [{ ...(data as any), steps: data.steps || [], indicators: data.indicators || [] }, ...i]);
      setObjective("");
    } catch (e) { console.error(e); }
    finally { setGen(false); }
  };

  const del = async (id: string) => {
    setItems((it) => it.filter((x) => x.id !== id));
    await supabase.from("action_plans").delete().eq("id", id);
  };

  return (
    <div className="mt-6 space-y-6">
      <div className="rounded-2xl border border-border glass p-5">
        <p className="text-[10px] uppercase tracking-widest text-gold">Novo plano</p>
        <p className="mt-1 text-sm text-muted-foreground">Descreva seu objetivo. O Mentor criará etapas, cronograma e indicadores de progresso.</p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            placeholder="Ex: Criar uma rotina matinal de alta performance"
            className="flex-1 rounded-full border border-border bg-background/60 px-4 py-3 text-sm text-foreground outline-none focus:border-gold/60"
          />
          <button
            onClick={generate}
            disabled={!objective.trim() || gen}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-5 py-3 text-xs font-medium uppercase tracking-widest text-primary-foreground shadow-glow disabled:opacity-40"
          >
            {gen ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Gerar plano
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((p) => (
          <article key={p.id} className="rounded-2xl border border-border bg-surface p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-lg text-foreground">{p.objective}</h3>
              <button onClick={() => del(p.id)}><Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" /></button>
            </div>
            {p.timeline && (
              <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" /> {p.timeline}
              </p>
            )}
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gold">Etapas</p>
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-foreground/90">
                  {p.steps.map((s, i) => <li key={i}>{s}</li>)}
                </ol>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gold">Indicadores</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground/90">
                  {p.indicators.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            </div>
            <p className="mt-4 text-[10px] uppercase tracking-widest text-muted-foreground">Revisão semanal recomendada</p>
          </article>
        ))}
        {items.length === 0 && (
          <p className="rounded-2xl border border-border glass p-6 text-center text-sm text-muted-foreground">
            Nenhum plano ainda. Descreva um objetivo acima para começar.
          </p>
        )}
      </div>
    </div>
  );
}

/* ================= helpers ================= */

// Extract text from AI SDK UI message stream (SSE-like)
function extractStreamText(raw: string): string {
  // Data lines look like:  data: {"type":"text-delta","delta":"..."}
  let out = "";
  for (const line of raw.split("\n")) {
    if (!line.startsWith("data:")) continue;
    const payload = line.slice(5).trim();
    if (!payload || payload === "[DONE]") continue;
    try {
      const j = JSON.parse(payload);
      if (typeof j.delta === "string") out += j.delta;
      else if (typeof j.textDelta === "string") out += j.textDelta;
      else if (j.type === "text" && typeof j.text === "string") out += j.text;
    } catch { /* ignore */ }
  }
  return out || raw;
}

function extractJson(s: string): string {
  const fence = s.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) return fence[1].trim();
  const start = s.indexOf("{");
  const end = s.lastIndexOf("}");
  if (start !== -1 && end !== -1) return s.slice(start, end + 1);
  return s.trim();
}
