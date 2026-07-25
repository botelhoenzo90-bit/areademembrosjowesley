import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Gift, Lock, Plus, Sparkles, ExternalLink } from "lucide-react";
import hero from "@/assets/cover-6.png.asset.json";
import b1 from "@/assets/level-1.jpg";
import b2 from "@/assets/level-2.jpg";
import b3 from "@/assets/level-3.jpg";
import b4 from "@/assets/level-4.jpg";
import b5 from "@/assets/level-5.jpg";
import b6 from "@/assets/level-6.jpg";
import b7 from "@/assets/level-7.jpg";

export const Route = createFileRoute("/_authenticated/bonus")({
  head: () => ({
    meta: [
      { title: "Bônus Exclusivos — Instituto Neuroconsciência" },
      { name: "description", content: "Conteúdos extras exclusivos para membros do Instituto NeuroConsciência." },
      { property: "og:title", content: "Bônus Exclusivos" },
      { property: "og:description", content: "Presentes cinematográficos para acelerar sua evolução." },
    ],
  }),
  component: Page,
});

type Status = "Disponível" | "Em breve" | "Bloqueado" | "Novo" | "Atualizado";
type Bonus = { id: number; title: string; description: string; image: string; status: Status; link: string | null };

const BONUSES: Bonus[] = [
  { id: 1, title: "Bônus 1 — Aplicativo Exclusivo", description: "Ferramenta complementar para expandir sua jornada.", image: b1, status: "Novo", link: null },
  { id: 2, title: "Bônus 2 — Aplicativo Exclusivo", description: "Recurso cinematográfico de suporte à sua transformação.", image: b2, status: "Disponível", link: null },
  { id: 3, title: "Bônus 3 — Aplicativo Exclusivo", description: "Experiência premium de reforço mental.", image: b3, status: "Atualizado", link: null },
  { id: 4, title: "Bônus 4 — Aplicativo Exclusivo", description: "Conteúdo bônus reservado a membros.", image: b4, status: "Em breve", link: null },
  { id: 5, title: "Bônus 5 — Aplicativo Exclusivo", description: "Ferramenta prática para o dia a dia.", image: b5, status: "Em breve", link: null },
  { id: 6, title: "Bônus 6 — Aplicativo Exclusivo", description: "Acesso antecipado a novos recursos.", image: b6, status: "Bloqueado", link: null },
  { id: 7, title: "Bônus 7 — Aplicativo Exclusivo", description: "Presente reservado para a próxima fase da jornada.", image: b7, status: "Bloqueado", link: null },
];

const STATUS_STYLE: Record<Status, string> = {
  "Disponível": "bg-emerald-500/20 text-emerald-300",
  "Em breve": "bg-muted text-muted-foreground",
  "Bloqueado": "bg-background/60 text-muted-foreground",
  "Novo": "bg-gradient-primary text-primary-foreground shadow-glow",
  "Atualizado": "bg-gold/20 text-gold",
};

function Page() {
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    const hasNew = BONUSES.some(b => b.status === "Novo");
    if (hasNew && typeof window !== "undefined" && !sessionStorage.getItem("bonus-celebrated")) {
      setCelebrate(true);
      sessionStorage.setItem("bonus-celebrated", "1");
      setTimeout(() => setCelebrate(false), 3500);
    }
  }, []);

  return (
    <main className="relative pb-24">
      <Link to="/home" className="fixed left-4 top-4 z-30 rounded-full glass p-2 text-foreground hover:bg-surface-elevated">
        <ArrowLeft className="h-4 w-4" />
      </Link>

      {celebrate && (
        <div className="pointer-events-none fixed inset-0 z-40 flex items-start justify-center pt-32">
          <div className="animate-scale-in rounded-3xl glass-strong px-8 py-6 text-center shadow-elevated">
            <Sparkles className="mx-auto h-8 w-8 text-gold" />
            <p className="mt-2 font-display text-xl text-foreground">Novo conteúdo disponível</p>
            <p className="text-xs text-muted-foreground">para sua jornada.</p>
          </div>
        </div>
      )}

      <section className="relative h-[55vh] overflow-hidden">
        <img src={hero} alt="Bônus Exclusivos" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full glass px-3 py-1 text-[10px] uppercase tracking-widest text-gold">
            <Gift className="h-3 w-3" /> Presentes Exclusivos
          </span>
          <h1 className="font-display text-4xl leading-tight text-foreground sm:text-6xl">BÔNUS EXCLUSIVOS</h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            Como membro do Instituto NeuroConsciência você possui acesso a conteúdos extras preparados para acelerar sua evolução.
          </p>
        </div>
      </section>

      <section className="mx-4 mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {BONUSES.map(b => {
          const locked = b.status === "Bloqueado";
          return (
            <article key={b.id}
              className={`group overflow-hidden rounded-3xl border border-border glass transition-all hover:shadow-elevated ${locked ? "opacity-70" : ""}`}>
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={b.image} alt={b.title} className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${locked ? "grayscale" : ""}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <span className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-widest ${STATUS_STYLE[b.status]}`}>
                  {b.status}
                </span>
                {locked && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock className="h-8 w-8 text-foreground/60" />
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg leading-tight text-foreground">{b.title}</h3>
                <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{b.description}</p>
                <div className="mt-4 flex justify-end">
                  {locked ? (
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Em breve</span>
                  ) : b.link ? (
                    <a href={b.link} target="_blank" rel="noreferrer"
                       className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background hover:brightness-110">
                      Acessar <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <button className="inline-flex items-center gap-1 rounded-full glass px-3 py-1.5 text-[10px] text-muted-foreground">
                      <Plus className="h-3 w-3" /> Adicionar Link
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
