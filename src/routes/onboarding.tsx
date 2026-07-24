import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowRight, Sparkles, TrendingUp, Compass } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
  },
  head: () => ({
    meta: [
      { title: "Bem-vindo — Instituto Neuroconsciência" },
      { name: "description", content: "Sua jornada de transformação começa agora." },
    ],
  }),
  component: OnboardingFlow,
});

const slides = [
  {
    icon: Sparkles,
    title: "Bem-vindo à sua nova jornada.",
    text: "Você não entrou em um curso. Você entrou em um ecossistema completo de transformação mental, emocional e comportamental.",
    cta: "Continuar",
  },
  {
    icon: TrendingUp,
    title: "Sua evolução será acompanhada.",
    text: "Cada aula concluída, cada módulo estudado e cada desafio realizado contribuirá para sua jornada de crescimento.",
    cta: "Continuar",
  },
  {
    icon: Compass,
    title: "Construa uma nova versão de si mesmo.",
    text: "Através do conhecimento, prática e consciência você desenvolverá uma mentalidade mais forte, equilibrada e alinhada ao seu propósito.",
    cta: "Começar Jornada",
  },
] as const;

function OnboardingFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [phase, setPhase] = useState<"slides" | "name">("slides");

  const next = () => {
    if (step < slides.length - 1) setStep(step + 1);
    else setPhase("name");
  };

  const saveName = async () => {
    if (!name.trim()) { toast.error("Digite como quer ser chamado"); return; }
    setSavingName(true);
    try {
      const { data: sess } = await supabase.auth.getUser();
      const uid = sess.user?.id;
      if (!uid) throw new Error("Sessão expirada");
      const { error } = await supabase
        .from("profiles")
        .upsert({ id: uid, display_name: name.trim(), onboarded: true });
      if (error) throw error;
      toast.success(`Boas-vindas, ${name.trim()}.`);
      navigate({ to: "/home", replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha ao salvar");
    } finally {
      setSavingName(false);
    }
  };

  const current = slides[step];
  const Icon = current.icon;

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero" aria-hidden />
      <div className="absolute inset-0 bg-vignette" aria-hidden />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" aria-hidden />

      {phase === "slides" ? (
        <section key={step} className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center animate-fade-in">
          <div className="relative mb-10">
            <div className="absolute inset-0 rounded-full bg-gradient-primary blur-2xl opacity-70" aria-hidden />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full glass-strong shadow-glow">
              <Icon className="h-10 w-10 text-gold" />
            </div>
          </div>

          <h1 className="max-w-lg font-display text-4xl leading-tight text-foreground sm:text-5xl">
            {current.title}
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">{current.text}</p>

          <div className="mt-10 flex items-center gap-2">
            {slides.map((_, i) => (
              <span
                key={i}
                className={`h-1 rounded-full transition-all ${i === step ? "w-8 bg-gold" : "w-2 bg-border"}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="group mt-10 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-8 py-3.5 text-sm font-medium text-primary-foreground shadow-glow transition-all hover:brightness-110 active:scale-[0.98]"
          >
            {current.cta}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </section>
      ) : (
        <section className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center animate-fade-in">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-[11px] uppercase tracking-widest text-muted-foreground">
            <Sparkles className="h-3 w-3 text-gold" /> Última etapa
          </div>
          <h1 className="max-w-md font-display text-4xl leading-tight sm:text-5xl">
            Como gostaria de ser chamado?
          </h1>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Usaremos esse nome em toda sua jornada dentro do Instituto.
          </p>

          <div className="mt-10 w-full max-w-sm">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveName()}
              placeholder="Seu nome"
              className="w-full rounded-2xl border border-border bg-surface/60 px-5 py-4 text-center font-display text-2xl tracking-wide text-foreground outline-none backdrop-blur-xl transition-all placeholder:text-muted-foreground/60 focus:border-primary/60 focus:shadow-glow"
            />
            <button
              onClick={saveName}
              disabled={savingName}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-primary px-8 py-3.5 text-sm font-medium text-primary-foreground shadow-glow transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
            >
              {savingName ? "Salvando..." : "Entrar no Instituto"}
              {!savingName && <ArrowRight className="h-4 w-4" />}
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
