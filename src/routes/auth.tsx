import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Entrar — Instituto Neuroconsciência" },
      { name: "description", content: "Acesse sua jornada de evolução no Instituto Neuroconsciência." },
    ],
  }),
  component: AuthPage,
});

type Mode = "login" | "signup" | "reset";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [keep, setKeep] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/home", replace: true });
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Bem-vindo de volta.");
      navigate({ to: "/home", replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha ao entrar");
    } finally {
      setBusy(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { toast.error("As senhas não conferem"); return; }
    if (password.length < 6) { toast.error("A senha precisa ter ao menos 6 caracteres"); return; }
    setBusy(true);
    try {
      const redirectUrl = `${window.location.origin}/onboarding`;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: { display_name: name },
        },
      });
      if (error) throw error;
      toast.success("Conta criada. Vamos começar sua jornada.");
      navigate({ to: "/onboarding", replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha ao criar conta");
    } finally {
      setBusy(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast.success("Enviamos um link de recuperação para seu email.");
      setMode("login");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha ao enviar email");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="absolute inset-0 bg-gradient-hero" aria-hidden />
      <div className="absolute inset-0 bg-vignette" aria-hidden />
      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-primary/25 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-accent/40 blur-3xl" aria-hidden />

      <div className="relative z-10 w-full max-w-md animate-scale-in">
        <Link to="/" className="mb-8 flex flex-col items-center gap-3">
          <div className="relative h-14 w-14">
            <div className="absolute inset-0 rounded-full bg-gradient-primary shadow-glow" />
            <div className="absolute inset-1.5 rounded-full bg-background/80 backdrop-blur flex items-center justify-center">
              <span className="font-display text-lg text-gold">IN</span>
            </div>
          </div>
          <div className="text-center">
            <p className="font-display text-xl leading-tight">INSTITUTO NEUROCONSCIÊNCIA</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              Transformando Mentes. Expandindo Consciências.
            </p>
          </div>
        </Link>

        <div className="glass-strong rounded-2xl p-8 shadow-elevated">
          <h1 className="font-display text-3xl text-foreground">
            {mode === "login" && "Bem-vindo de volta"}
            {mode === "signup" && "Comece sua jornada"}
            {mode === "reset" && "Recuperar acesso"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "login" && "Continue de onde parou."}
            {mode === "signup" && "Uma nova versão de você começa agora."}
            {mode === "reset" && "Enviaremos um link para redefinir sua senha."}
          </p>

          <form
            onSubmit={mode === "login" ? handleLogin : mode === "signup" ? handleSignup : handleReset}
            className="mt-6 space-y-4"
          >
            {mode === "signup" && (
              <Field icon={<User className="h-4 w-4" />} label="Nome">
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  placeholder="Como devemos te chamar?"
                />
              </Field>
            )}

            <Field icon={<Mail className="h-4 w-4" />} label="Email">
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="voce@email.com"
              />
            </Field>

            {mode !== "reset" && (
              <Field icon={<Lock className="h-4 w-4" />} label="Senha">
                <input
                  type={showPw ? "text" : "password"}
                  required
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Alternar senha"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </Field>
            )}

            {mode === "signup" && (
              <Field icon={<Lock className="h-4 w-4" />} label="Confirmar senha">
                <input
                  type={showPw ? "text" : "password"}
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="input-field"
                  placeholder="••••••••"
                />
              </Field>
            )}

            {mode === "login" && (
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-muted-foreground cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={keep}
                    onChange={(e) => setKeep(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-border bg-transparent accent-[color:var(--primary)]"
                  />
                  Continuar conectado
                </label>
                <button
                  type="button"
                  onClick={() => setMode("reset")}
                  className="text-muted-foreground hover:text-gold transition-colors"
                >
                  Esqueceu a senha?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-primary py-3.5 text-sm font-medium text-primary-foreground shadow-glow transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
            >
              {busy ? "Aguarde..." : mode === "login" ? "Entrar" : mode === "signup" ? "Criar Conta" : "Enviar link"}
              {!busy && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "login" && (
              <>
                Ainda não faz parte?{" "}
                <button onClick={() => setMode("signup")} className="text-gold hover:underline">
                  Criar conta
                </button>
              </>
            )}
            {mode === "signup" && (
              <>
                Já tem conta?{" "}
                <button onClick={() => setMode("login")} className="text-gold hover:underline">
                  Entrar
                </button>
              </>
            )}
            {mode === "reset" && (
              <button onClick={() => setMode("login")} className="text-gold hover:underline">
                Voltar para entrar
              </button>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-muted-foreground">
          Ao continuar, você entra em um ecossistema completo de transformação.
        </p>
      </div>

      <style>{`
        .input-field {
          width: 100%;
          background: color-mix(in oklab, var(--surface) 60%, transparent);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          padding: 0.75rem 0.9rem 0.75rem 2.4rem;
          font-size: 0.9rem;
          color: var(--foreground);
          outline: none;
          transition: border-color .2s, box-shadow .2s, background .2s;
        }
        .input-field::placeholder { color: color-mix(in oklab, var(--muted-foreground) 80%, transparent); }
        .input-field:focus { border-color: color-mix(in oklab, var(--primary) 60%, transparent); box-shadow: 0 0 0 3px color-mix(in oklab, var(--primary) 20%, transparent); }
      `}</style>
    </main>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>
        {children}
      </div>
    </label>
  );
}
