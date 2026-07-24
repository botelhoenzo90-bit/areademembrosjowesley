import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  ssr: false,
  component: SplashScreen,
});

function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const { data } = await supabase.auth.getSession();
      // Minimum splash duration for cinematic effect.
      await new Promise((r) => setTimeout(r, 1600));
      if (cancelled) return;
      if (data.session) navigate({ to: "/home", replace: true });
      else navigate({ to: "/auth", replace: true });
    };
    run();
    return () => { cancelled = true; };
  }, [navigate]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-hero" aria-hidden />
      <div className="absolute inset-0 bg-vignette" aria-hidden />

      {/* Ambient orbs */}
      <div className="pointer-events-none absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-pulse-glow" aria-hidden />
      <div className="pointer-events-none absolute -right-40 bottom-1/4 h-96 w-96 rounded-full bg-accent/40 blur-3xl" aria-hidden />

      <div className="relative z-10 flex flex-col items-center text-center px-6 animate-fade-in-slow">
        {/* Logo mark */}
        <div className="relative mb-8 h-24 w-24">
          <div className="absolute inset-0 rounded-full bg-gradient-primary shadow-glow animate-pulse-glow" />
          <div className="absolute inset-2 rounded-full bg-background/70 backdrop-blur-xl flex items-center justify-center">
            <span className="font-display text-3xl text-gold">IN</span>
          </div>
        </div>

        <h1 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
          INSTITUTO
          <br />
          <span className="text-gold">NEUROCONSCIÊNCIA</span>
        </h1>

        <p className="mt-6 max-w-xs text-sm uppercase tracking-[0.28em] text-muted-foreground">
          Transformando Mentes.
          <br />
          Expandindo Consciências.
        </p>
      </div>
    </main>
  );
}
