import { createFileRoute } from "@tanstack/react-router";
import { Compass } from "lucide-react";

export const Route = createFileRoute("/_authenticated/centro-operacional")({
  head: () => ({ meta: [{ title: "Centro Operacional — Instituto Neuroconsciência" }] }),
  component: () => (
    <main className="relative min-h-screen">
      <div className="absolute inset-0 bg-gradient-hero" aria-hidden />
      <div className="relative z-10 mx-auto max-w-xl px-6 pt-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
          <Compass className="h-7 w-7 text-primary-foreground" />
        </div>
        <h1 className="mt-6 font-display text-4xl text-foreground">Centro Operacional</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          A base estratégica da sua evolução — rituais, metas, indicadores e disciplinas de alto nível.
        </p>
        <p className="mt-8 text-[11px] uppercase tracking-widest text-muted-foreground">Em breve</p>
      </div>
    </main>
  ),
});
