import { createFileRoute } from "@tanstack/react-router";
import { Wrench } from "lucide-react";

export const Route = createFileRoute("/_authenticated/ferramentas")({
  head: () => ({ meta: [{ title: "Ferramentas — Instituto Neuroconsciência" }] }),
  component: () => (
    <main className="relative min-h-screen">
      <div className="absolute inset-0 bg-gradient-hero" aria-hidden />
      <div className="relative z-10 mx-auto max-w-xl px-6 pt-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
          <Wrench className="h-7 w-7 text-primary-foreground" />
        </div>
        <h1 className="mt-6 font-display text-4xl text-foreground">Ferramentas</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Meditações, protocolos, journaling e frameworks aplicáveis todos os dias.
        </p>
        <p className="mt-8 text-[11px] uppercase tracking-widest text-muted-foreground">Em breve</p>
      </div>
    </main>
  ),
});
