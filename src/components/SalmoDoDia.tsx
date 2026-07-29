import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { getTodayPsalmStudy } from "@/lib/psalm.functions";
import {
  BookOpen, Flame, CheckCircle2, Circle, Heart, Loader2, Sparkles,
  Search, CalendarDays, Trophy, PenLine,
} from "lucide-react";

export type StudyRow = {
  id: string;
  study_date: string;
  cycle: number;
  psalm_number: number;
  title: string;
  subtitle: string;
  psalm_text: string;
  decoding: string;
  application: string;
  reflection: unknown;
  exercises: unknown;
  exercises_done: unknown;
  mission: string;
  affirmation: string;
  prayer: string;
  theme: string;
  notes: string;
  favorite: boolean;
  completed: boolean;
  completed_at: string | null;
};

const asList = (v: unknown): string[] => (Array.isArray(v) ? (v as string[]) : []);

function formatToday() {
  const now = new Date();
  const weekday = now.toLocaleDateString("pt-BR", { weekday: "long" });
  const full = now.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  const time = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return {
    weekday: weekday.charAt(0).toUpperCase() + weekday.slice(1),
    full: full.charAt(0).toUpperCase() + full.slice(1),
    time,
  };
}

function computeStreak(dates: string[]) {
  const set = new Set(dates);
  let streak = 0;
  const d = new Date();
  // allow streak to hold if today isn't completed yet
  if (!set.has(d.toISOString().slice(0, 10))) d.setDate(d.getDate() - 1);
  for (;;) {
    const key = d.toISOString().slice(0, 10);
    if (!set.has(key)) break;
    streak += 1;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

/* ==================== SALMO DO DIA ==================== */

export function SalmoDoDiaPanel() {
  const fetchToday = useServerFn(getTodayPsalmStudy);
  const [study, setStudy] = useState<StudyRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<StudyRow[]>([]);
  const [clock, setClock] = useState(formatToday());

  useEffect(() => {
    const t = setInterval(() => setClock(formatToday()), 30000);
    return () => clearInterval(t);
  }, []);

  const loadHistory = useCallback(async () => {
    const { data } = await supabase
      .from("psalm_studies")
      .select("*")
      .order("study_date", { ascending: false });
    setHistory((data ?? []) as unknown as StudyRow[]);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const row = (await fetchToday({ data: {} } as never)) as unknown as StudyRow;
        setStudy(row);
        await loadHistory();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Não foi possível carregar o estudo de hoje.");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const completedDates = history.filter((h) => h.completed).map((h) => h.study_date);
  const streak = computeStreak(completedDates);
  const doneCount = completedDates.length;
  const dayNumber = history.length || 1;

  const patch = async (patchData: Partial<StudyRow>) => {
    if (!study) return;
    setStudy({ ...study, ...patchData } as StudyRow);
    await supabase.from("psalm_studies").update(patchData as never).eq("id", study.id);
    loadHistory();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-gold" />
        <p className="text-sm">Preparando o seu Salmo do Dia...</p>
      </div>
    );
  }

  if (error || !study) {
    return (
      <div className="mt-6 rounded-2xl border border-border glass p-6 text-center text-sm text-muted-foreground">
        {error ?? "Estudo indisponível."}
      </div>
    );
  }

  const exercises = asList(study.exercises);
  const done = asList(study.exercises_done);

  const toggleExercise = (item: string) => {
    const next = done.includes(item) ? done.filter((d) => d !== item) : [...done, item];
    patch({ exercises_done: next as unknown as StudyRow["exercises_done"] });
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-5 pt-6">
      {/* DATA */}
      <header className="rounded-2xl border border-border glass p-5 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-gold">{clock.weekday}</p>
        <p className="mt-1 text-sm text-muted-foreground">{clock.full} · {clock.time}</p>
        <h2 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">Salmo do Dia</h2>
      </header>

      {/* GAMIFICAÇÃO */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat icon={<CalendarDays className="h-4 w-4" />} label="Dia" value={`${dayNumber}`} />
        <Stat icon={<BookOpen className="h-4 w-4" />} label="Salmo" value={`${study.psalm_number}`} />
        <Stat icon={<Flame className="h-4 w-4" />} label="Sequência" value={`${streak} dia${streak === 1 ? "" : "s"}`} />
        <Stat icon={<Trophy className="h-4 w-4" />} label="Concluídos" value={`${doneCount} de 150`} />
      </section>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-gradient-primary transition-all duration-700"
          style={{ width: `${Math.min(100, (doneCount / 150) * 100)}%` }}
        />
      </div>

      {/* ESTUDO */}
      <article className="overflow-hidden rounded-2xl border border-border glass">
        <div className="border-b border-border bg-gradient-to-b from-primary/10 to-transparent p-6 text-center">
          <h3 className="font-display text-3xl text-foreground">{study.title}</h3>
          <p className="mt-1 text-sm text-gold">{study.subtitle}</p>
          <div className="mt-4 flex justify-center gap-2">
            <button
              onClick={() => patch({ favorite: !study.favorite })}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-widest transition ${
                study.favorite ? "bg-gold/20 text-gold" : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${study.favorite ? "fill-current" : ""}`} />
              {study.favorite ? "Favorito" : "Salvar nos favoritos"}
            </button>
          </div>
        </div>

        <div className="space-y-7 p-6 leading-relaxed">
          <Block title="Texto do Salmo">
            <p className="whitespace-pre-line text-sm italic text-foreground/90">{study.psalm_text}</p>
          </Block>

          <Block title="Decodificação">
            <p className="whitespace-pre-line text-sm text-muted-foreground">{study.decoding}</p>
          </Block>

          <Block title="Aplicação prática">
            <p className="whitespace-pre-line text-sm text-muted-foreground">{study.application}</p>
          </Block>

          <Block title="Reflexão">
            <ul className="space-y-2">
              {asList(study.reflection).map((q, i) => (
                <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                  <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" /> {q}
                </li>
              ))}
            </ul>
          </Block>

          <Block title="Exercícios do dia">
            <ul className="space-y-2">
              {exercises.map((ex, i) => {
                const isDone = done.includes(ex);
                return (
                  <li key={i}>
                    <button
                      onClick={() => toggleExercise(ex)}
                      className="flex w-full items-start gap-3 rounded-xl border border-border/60 p-3 text-left text-sm transition hover:border-primary/50"
                    >
                      {isDone ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                      ) : (
                        <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      )}
                      <span className={isDone ? "text-foreground line-through opacity-70" : "text-muted-foreground"}>{ex}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Block>

          <div className="rounded-2xl border border-gold/30 bg-gold/5 p-5">
            <p className="text-[10px] uppercase tracking-[0.25em] text-gold">Missão do Dia</p>
            <p className="mt-2 text-sm text-foreground">{study.mission}</p>
          </div>

          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 text-center">
            <p className="text-[10px] uppercase tracking-[0.25em] text-primary-foreground/70">Afirmação do Dia</p>
            <p className="mt-2 font-display text-xl text-foreground">"{study.affirmation}"</p>
          </div>

          <Block title="Oração Final">
            <p className="whitespace-pre-line text-sm italic text-muted-foreground">{study.prayer}</p>
          </Block>

          <NotesField study={study} />

          <button
            onClick={() =>
              patch({
                completed: !study.completed,
                completed_at: study.completed ? null : new Date().toISOString(),
              })
            }
            className={`w-full rounded-full px-6 py-4 text-xs font-medium uppercase tracking-widest transition ${
              study.completed
                ? "bg-gold/20 text-gold"
                : "bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90"
            }`}
          >
            {study.completed ? "Estudo concluído ✓" : "Marcar como concluído"}
          </button>
        </div>
      </article>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border glass p-4 text-center">
      <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-gold">{icon}</div>
      <p className="mt-2 text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm text-foreground">{value}</p>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h4 className="mb-3 text-[11px] uppercase tracking-[0.25em] text-gold">{title}</h4>
      {children}
    </section>
  );
}

function NotesField({ study }: { study: StudyRow }) {
  const [value, setValue] = useState(study.notes ?? "");
  const [saved, setSaved] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => setValue(study.notes ?? ""), [study.id]);

  const onChange = (v: string) => {
    setValue(v);
    setSaved(false);
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      await supabase.from("psalm_studies").update({ notes: v }).eq("id", study.id);
      setSaved(true);
    }, 800);
  };

  return (
    <section>
      <h4 className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-gold">
        <PenLine className="h-3.5 w-3.5" /> Minhas Reflexões
      </h4>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        placeholder="Escreva livremente o que este Salmo despertou em você..."
        className="w-full resize-none rounded-xl border border-border bg-secondary/40 p-4 text-sm text-foreground outline-none transition focus:border-primary/60"
      />
      <p className="mt-1 text-right text-[10px] text-muted-foreground">
        {saved ? "Salvo automaticamente" : "Salvando..."}
      </p>
    </section>
  );
}

/* ==================== MINHA JORNADA ==================== */

export function MinhaJornadaPanel() {
  const [rows, setRows] = useState<StudyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [onlyFav, setOnlyFav] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("psalm_studies")
        .select("*")
        .order("study_date", { ascending: false });
      setRows((data ?? []) as unknown as StudyRow[]);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (onlyFav && !r.favorite) return false;
      if (!term) return true;
      return (
        String(r.psalm_number).includes(term) ||
        r.theme.toLowerCase().includes(term) ||
        r.title.toLowerCase().includes(term) ||
        r.subtitle.toLowerCase().includes(term) ||
        r.study_date.includes(term)
      );
    });
  }, [rows, q, onlyFav]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-5 w-5 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-6">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 items-center gap-2 rounded-full border border-border glass px-4 py-2.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por número do Salmo, tema ou data"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
        <button
          onClick={() => setOnlyFav((v) => !v)}
          className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs uppercase tracking-widest transition ${
            onlyFav ? "bg-gold/20 text-gold" : "glass text-muted-foreground hover:text-foreground"
          }`}
        >
          <Heart className={`h-3.5 w-3.5 ${onlyFav ? "fill-current" : ""}`} /> Favoritos
        </button>
      </div>

      {filtered.length === 0 && (
        <p className="py-16 text-center text-sm text-muted-foreground">Nenhum estudo encontrado.</p>
      )}

      {filtered.map((r) => {
        const open = openId === r.id;
        const exercises = asList(r.exercises);
        const done = asList(r.exercises_done);
        return (
          <article key={r.id} className="overflow-hidden rounded-2xl border border-border glass">
            <button
              onClick={() => setOpenId(open ? null : r.id)}
              className="flex w-full items-center gap-4 p-4 text-left"
            >
              <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/15 text-gold">
                <span className="text-[9px] uppercase">Salmo</span>
                <span className="font-display text-lg leading-none">{r.psalm_number}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-foreground">{r.subtitle || r.title}</p>
                <p className="text-[11px] text-muted-foreground">
                  {new Date(`${r.study_date}T12:00:00`).toLocaleDateString("pt-BR")} · {r.theme}
                  {r.completed ? " · concluído" : ""}
                </p>
              </div>
              {r.favorite && <Heart className="h-4 w-4 shrink-0 fill-current text-gold" />}
              {r.completed && <CheckCircle2 className="h-4 w-4 shrink-0 text-gold" />}
            </button>

            {open && (
              <div className="space-y-4 border-t border-border p-5 text-sm">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gold">Missão realizada</p>
                  <p className="mt-1 text-muted-foreground">{r.mission}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gold">Exercícios concluídos</p>
                  <p className="mt-1 text-muted-foreground">{done.length} de {exercises.length}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gold">Anotações pessoais</p>
                  <p className="mt-1 whitespace-pre-line text-muted-foreground">{r.notes || "—"}</p>
                </div>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
