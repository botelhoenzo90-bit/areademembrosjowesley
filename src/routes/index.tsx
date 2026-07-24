import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 bg-hero-glow" aria-hidden />
      <div className="relative mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-24 text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Pronto para começar
        </span>

        <h1 className="font-display text-6xl leading-[1.05] tracking-tight text-foreground sm:text-7xl">
          Sua próxima ideia
          <br />
          <em className="text-primary">começa aqui.</em>
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Descreva o que você quer construir no chat — uma landing page, um app,
          um dashboard — e veja tomar forma em tempo real.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <div className="rounded-lg border border-border bg-background px-4 py-2 text-sm text-muted-foreground shadow-sm">
            "Faça uma landing page para minha cafeteria"
          </div>
          <div className="rounded-lg border border-border bg-background px-4 py-2 text-sm text-muted-foreground shadow-sm">
            "Dashboard de tarefas com login"
          </div>
        </div>

        <div className="mt-16 flex items-center gap-6 text-xs uppercase tracking-widest text-muted-foreground">
          <span>Rápido</span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span>Bonito</span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span>Seu</span>
        </div>
      </div>
    </main>
  );
}
