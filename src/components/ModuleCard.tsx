import { Play, CheckCircle2, Lock } from "lucide-react";
import { Link } from "@tanstack/react-router";

export type ModuleCardData = {
  slug: string;
  name: string;
  short_description: string;
  cover_url: string;
  lessons_count: number;
  percent: number;
  accent_from?: string | null;
  accent_to?: string | null;
  locked?: boolean;
  lockLabel?: string;
};

export function ModuleCard({ data, bare }: { data: ModuleCardData; bare?: boolean }) {
  const status =
    data.locked ? "Bloqueado" :
    data.percent >= 100 ? "Concluído" : data.percent > 0 ? "Em andamento" : "Novo";

  const cardClass =
    "group relative w-64 shrink-0 overflow-hidden rounded-2xl border border-border bg-surface text-left shadow-elevated transition-all duration-300 hover:-translate-y-1 hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-primary/50";

  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    data.locked ? (
      <div className={`${cardClass} cursor-not-allowed`} aria-disabled>{children}</div>
    ) : (
      <Link to="/modulo/$slug" params={{ slug: data.slug }} className={cardClass}>{children}</Link>
    );

  return (
    <Wrapper>

      <div className="relative aspect-[3/4] w-full overflow-hidden">
        <img
          src={data.cover_url}
          alt={data.name}
          loading="lazy"
          width={512}
          height={680}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {!bare && <div className="absolute inset-0 bg-card-fade" aria-hidden />}
        {!bare && (
          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
            <span className="rounded-full glass px-2.5 py-1 text-[10px] uppercase tracking-wider text-foreground/80">
              {status}
            </span>
            {data.percent >= 100 && (
              <CheckCircle2 className="h-5 w-5 text-gold drop-shadow" />
            )}
          </div>
        )}
        {!bare && (
          <div className="absolute inset-x-0 bottom-0 p-4">
            <h3 className="font-display text-lg leading-tight text-foreground drop-shadow">
              {data.name}
            </h3>
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
              {data.short_description}
            </p>
            <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>{data.lessons_count} aulas</span>
              <span>{data.percent}%</span>
            </div>
            <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--gold)] transition-all"
                style={{ width: `${data.percent}%` }}
              />
            </div>
          </div>
        )}

        {data.locked ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/65 backdrop-blur-[3px]">
            <span className="flex h-12 w-12 items-center justify-center rounded-full glass-strong">
              <Lock className="h-5 w-5 text-gold" />
            </span>
            {data.lockLabel && (
              <span className="rounded-full glass px-3 py-1 text-[10px] uppercase tracking-widest text-foreground/85">
                {data.lockLabel}
              </span>
            )}
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
              <Play className="h-5 w-5 fill-current text-primary-foreground" />
            </span>
          </div>
        )}
      </div>
    </Wrapper>

  );
}
