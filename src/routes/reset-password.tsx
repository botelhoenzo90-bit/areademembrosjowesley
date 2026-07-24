import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowRight, Eye, EyeOff, Lock } from "lucide-react";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Redefinir senha — Instituto Neuroconsciência" },
      { name: "description", content: "Crie uma nova senha para acessar sua área de membros." },
      { property: "og:title", content: "Redefinir senha — Instituto Neuroconsciência" },
      { property: "og:description", content: "Crie uma nova senha para acessar sua área de membros." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  const hasRecoveryToken = useMemo(() => {
    if (typeof window === "undefined") return false;
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const search = new URLSearchParams(window.location.search);
    return hash.get("type") === "recovery" || search.get("type") === "recovery";
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setReady(Boolean(data.session));
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) { toast.error("Digite uma senha"); return; }
    if (password !== confirm) { toast.error("As senhas não conferem"); return; }
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Senha atualizada. Entre com sua nova senha.");
      await supabase.auth.signOut();
      navigate({ to: "/auth", replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha ao redefinir senha");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="absolute inset-0 bg-gradient-hero" aria-hidden />
      <div className="absolute inset-0 bg-vignette" aria-hidden />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" aria-hidden />

      <section className="relative z-10 w-full max-w-md animate-scale-in glass-strong rounded-2xl p-8 shadow-elevated">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
          <Lock className="h-6 w-6 text-primary-foreground" />
        </div>
        <h1 className="font-display text-3xl text-foreground">Criar nova senha</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {hasRecoveryToken || ready
            ? "Digite uma nova senha para recuperar seu acesso."
            : "Abra esta página pelo link enviado ao seu email para redefinir a senha."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">Nova senha</span>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type={showPw ? "text" : "password"}
                required
                autoComplete="new-password"
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
            </div>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">Confirmar senha</span>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type={showPw ? "text" : "password"}
                required
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="input-field"
                placeholder="••••••••"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={busy || (!hasRecoveryToken && !ready)}
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-primary py-3.5 text-sm font-medium text-primary-foreground shadow-glow transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
          >
            {busy ? "Salvando..." : "Salvar nova senha"}
            {!busy && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate({ to: "/auth", replace: true })}
          className="mt-6 w-full text-center text-sm text-gold hover:underline"
        >
          Voltar para entrar
        </button>
      </section>

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