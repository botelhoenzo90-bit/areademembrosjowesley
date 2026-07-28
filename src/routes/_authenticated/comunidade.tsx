import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MessageCircle, Sparkles, BookOpen, Users } from "lucide-react";
import comunidadeAsset from "@/assets/comunidade-whatsapp.jpeg.asset.json";

const COMMUNITY_URL = "https://chat.whatsapp.com/HkeVK7E2sVPJiSyrUPV9MN?s=cl&p=a&ilr=0";

export const Route = createFileRoute("/_authenticated/comunidade")({
  head: () => ({
    meta: [
      { title: "Comunidade Neuroconsciência — Instituto Neuroconsciência" },
      {
        name: "description",
        content:
          "Entre na Comunidade Neuroconsciência no WhatsApp: aulas ao vivo de inteligência emocional, ferramentas e indicação de livros.",
      },
      { property: "og:title", content: "Comunidade Neuroconsciência" },
      {
        property: "og:description",
        content: "Aulas ao vivo de inteligência emocional, ferramentas e indicação de livros.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ComunidadePage,
});

function ComunidadePage() {
  return (
    <main className="pb-24">
      <header className="flex items-center gap-3 px-5 pt-6">
        <Link
          to="/home"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full glass text-foreground transition hover:bg-surface-elevated"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Módulo</p>
          <h1 className="font-display text-2xl leading-tight text-foreground">
            Comunidade Neuroconsciência
          </h1>
        </div>
      </header>

      <section className="mx-4 mt-6">
        <a
          href={COMMUNITY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block overflow-hidden rounded-3xl border border-gold/40 shadow-elevated transition hover:brightness-110"
        >
          <img
            src={comunidadeAsset.url}
            alt="Comunidade Neuroconsciência no WhatsApp"
            className="w-full"
          />
          <span className="flex items-center justify-center gap-2 bg-gold/15 px-4 py-4 text-center text-sm font-semibold uppercase tracking-wide text-gold">
            <MessageCircle className="h-4 w-4 shrink-0" />
            CLIQUE AQUI E ACESSE A COMUNIDADE NEUROCONSCIÊNCIA (RECEBA AULAS AO VIVO DE INTELIGÊNCIA
            EMOCIONAL, FERRAMENTAS E INDICAÇÃO DE LIVROS)
          </span>
        </a>
      </section>

      <section className="mx-4 mt-6 rounded-3xl border border-border glass p-5">
        <h2 className="font-display text-xl text-foreground">O que você recebe lá dentro</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A Comunidade Neuroconsciência é o ponto de encontro dos alunos. É gratuito e o acesso é
          direto pelo WhatsApp — basta tocar na imagem acima.
        </p>
        <ul className="mt-5 space-y-4">
          <Benefit
            icon={<Sparkles className="h-4 w-4 text-gold" />}
            title="Aulas ao vivo"
            text="Encontros de inteligência emocional e neuroconsciência em tempo real."
          />
          <Benefit
            icon={<BookOpen className="h-4 w-4 text-gold" />}
            title="Ferramentas e livros"
            text="Indicação de livros, exercícios práticos e materiais de apoio."
          />
        </ul>

        <a
          href={COMMUNITY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-primary px-6 py-4 text-sm font-semibold text-primary-foreground shadow-glow transition hover:brightness-110"
        >
          <MessageCircle className="h-4 w-4" /> Entrar na comunidade agora
        </a>
      </section>
    </main>
  );
}

function Benefit({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full glass">
        {icon}
      </span>
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </li>
  );
}
