import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ExternalLink, Plus, Sparkles } from "lucide-react";
import hero from "@/assets/module-5.jpg";
import p1 from "@/assets/module-1.jpg";
import p2 from "@/assets/module-2.jpg";
import p3 from "@/assets/module-3.jpg";

export const Route = createFileRoute("/_authenticated/ferramentas")({
  head: () => ({
    meta: [
      { title: "Ferramentas de Crescimento — Instituto Neuroconsciência" },
      { name: "description", content: "Ferramentas premium para acelerar sua transformação." },
      { property: "og:title", content: "Ferramentas de Crescimento" },
      { property: "og:description", content: "Loja premium integrada à sua jornada." },
    ],
  }),
  component: Page,
});

type Product = {
  id: string; name: string; description: string; longText?: string;
  price: string; cta: string; link: string | null; image: string;
  category: "Aplicativos" | "Treinamentos" | "Mentorias" | "Livros" | "Ferramentas" | "Novidades";
  featured?: boolean;
};

const FILTERS = ["Todos", "Aplicativos", "Treinamentos", "Mentorias", "Livros", "Ferramentas", "Novidades"] as const;

const PRODUCTS: Product[] = [
  {
    id: "master",
    name: "INSTITUTO NEUROCONSCIÊNCIA MASTER",
    description: "Um programa avançado de desenvolvimento e reprogramação mental.",
    longText: "Desperte uma nova consciência. Transforme a forma como você vive. Uma jornada profunda de expansão da consciência para quem sente que sua vida pode e deve ser maior do que os padrões que se repetem todos os dias.",
    price: "R$ 59,90", cta: "Conhecer Agora",
    link: "https://neuroconscienciamaster.lovable.app",
    image: p1, category: "Treinamentos", featured: true,
  },
  {
    id: "renova",
    name: "APLICATIVO RENOVA MENTE",
    description: "Uma jornada cinematográfica de transformação mental, emocional e espiritual inspirada em princípios cristãos e desenvolvimento pessoal.",
    price: "R$ 10,00", cta: "Adquirir",
    link: "https://ggcheckout.app/checkout/v2/XEyAuuUoUJTPuppHcTKQ",
    image: p2, category: "Aplicativos",
  },
  {
    id: "equilibre",
    name: "APLICATIVO EQUILIBRE SUA VIDA",
    description: "Um sistema operacional de evolução pessoal baseado em constância, conhecimento, propósito e disciplina.",
    price: "R$ 10,00", cta: "Adquirir",
    link: "https://ggcheckout.app/checkout/v2/2aeuvKl7psCW1nmoFiKw",
    image: p3, category: "Aplicativos",
  },
];

function Page() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Todos");
  const filtered = filter === "Todos" ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);
  const featured = PRODUCTS.find(p => p.featured);

  return (
    <main className="relative pb-24">
      <Link to="/home" className="fixed left-4 top-4 z-30 rounded-full glass p-2 text-foreground hover:bg-surface-elevated">
        <ArrowLeft className="h-4 w-4" />
      </Link>

      <section className="relative h-[55vh] overflow-hidden">
        <img src={hero} alt="Ferramentas de Crescimento" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full glass px-3 py-1 text-[10px] uppercase tracking-widest text-gold">
            <Sparkles className="h-3 w-3" /> Loja Premium
          </span>
          <h1 className="font-display text-4xl leading-tight text-foreground sm:text-6xl">FERRAMENTAS DE CRESCIMENTO</h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            Amplie sua evolução utilizando ferramentas desenvolvidas para acelerar sua transformação.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="scrollbar-hidden mt-6 flex gap-2 overflow-x-auto px-4">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition-all ${filter === f ? "bg-foreground text-background" : "glass text-muted-foreground hover:text-foreground"}`}>
            {f}
          </button>
        ))}
      </section>

      {/* Featured */}
      {featured && filter === "Todos" && (
        <section className="mx-4 mt-6">
          <p className="mb-2 text-[10px] uppercase tracking-widest text-gold">Produto em destaque</p>
          <div className="relative overflow-hidden rounded-3xl border border-border shadow-elevated">
            <img src={featured.image} alt={featured.name} className="h-64 w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="font-display text-2xl text-foreground">{featured.name}</h3>
              <p className="mt-1 max-w-xl text-sm text-muted-foreground">{featured.description}</p>
              <div className="mt-4 flex items-center gap-4">
                <span className="font-display text-2xl text-gold">{featured.price}</span>
                <a href={featured.link!} target="_blank" rel="noreferrer"
                   className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-glow">
                  {featured.cta} <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Grid */}
      <section className="mx-4 mt-8 grid gap-5 sm:grid-cols-2">
        {filtered.map(p => (
          <article key={p.id}
            className="group overflow-hidden rounded-3xl border border-border glass transition-all active:scale-[0.98] hover:shadow-elevated">
            <div className="relative aspect-[16/10] overflow-hidden">
              <img src={p.image} alt={p.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
              <span className="absolute left-3 top-3 rounded-full bg-background/70 px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-foreground/80">
                {p.category}
              </span>
            </div>
            <div className="p-5">
              <h3 className="font-display text-lg leading-tight text-foreground">{p.name}</h3>
              <p className="mt-2 line-clamp-3 text-xs text-muted-foreground">{p.description}</p>
              {p.longText && <p className="mt-2 line-clamp-3 text-xs italic text-muted-foreground/80">"{p.longText}"</p>}
              <div className="mt-4 flex items-center justify-between">
                <span className="font-display text-xl text-gold">{p.price}</span>
                {p.link ? (
                  <a href={p.link} target="_blank" rel="noreferrer"
                     className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background hover:brightness-110">
                    {p.cta} <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <button className="inline-flex items-center gap-1 rounded-full glass px-3 py-1.5 text-[10px] text-muted-foreground">
                    <Plus className="h-3 w-3" /> Adicionar Link
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Admin placeholder */}
      <section className="mx-4 mt-8">
        <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border/70 bg-transparent p-6 text-xs uppercase tracking-widest text-muted-foreground hover:border-gold hover:text-gold">
          <Plus className="h-4 w-4" /> Adicionar Novo Produto
        </button>
      </section>
    </main>
  );
}
