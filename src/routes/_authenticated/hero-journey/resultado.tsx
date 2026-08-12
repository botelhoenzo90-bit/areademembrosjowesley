import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, CheckCircle2, Award, 
  Target, Shield, Zap, Sparkles, Brain
} from "lucide-react";
import { getArchetypes, getDiagnosis } from "@/lib/hero-journey.functions";
import { useQuery } from "@tanstack/react-query";
import { ARCHETYPES_CONTENT } from "@/lib/hero-content";

export const Route = createFileRoute("/_authenticated/hero-journey/resultado")({
  component: ResultPage,
});

function ResultPage() {
  const { data: diagnosisData } = useQuery({
    queryKey: ['hero_journey_diagnosis'],
    queryFn: () => getDiagnosis(),
  });

  const diagnosis = diagnosisData as any;
  const predominant = diagnosis?.predominant_archetype;
  const archetype = predominant ? ARCHETYPES_CONTENT[predominant] : null;

  if (!archetype) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center">
        <div className="space-y-4">
          <Brain className="h-12 w-12 mx-auto text-muted-foreground animate-pulse" />
          <h2 className="font-display text-xl">Calculando seu Mapa...</h2>
          <p className="text-sm text-muted-foreground">Conclua a jornada dos 6 arquétipos para ver seu resultado.</p>
          <Link to="/reprogramacao-mental" className="inline-block mt-4 text-gold border-b border-gold pb-0.5">Voltar</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-background pb-24">
      <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between p-4 glass">
        <Link to="/reprogramacao-mental" className="rounded-full p-2 text-foreground hover:bg-surface-elevated">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="font-display text-lg uppercase">Seu Herói Interior</h1>
        <div className="w-8" />
      </header>

      <div className="pt-24 px-6 max-w-2xl mx-auto space-y-12">
        <section className="text-center space-y-6">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mx-auto w-32 h-32 rounded-full bg-gradient-primary flex items-center justify-center text-5xl shadow-glow"
          >
            {archetype.symbol}
          </motion.div>
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold">Arquétipo Predominante</span>
            <h2 className="font-display text-4xl uppercase tracking-tighter">{archetype.name}</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed italic px-4">
            "Suas respostas indicam uma predominância do arquétipo {archetype.name} neste momento da sua jornada."
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <ResultCard title="Sua Força" content={archetype.strength} icon={<Zap className="text-gold" />} />
          <ResultCard title="Sua Sombra" content={archetype.shadow} icon={<Shield className="text-muted-foreground" />} />
          <ResultCard title="O que você busca" content={archetype.objective} icon={<Target className="text-emerald-500" />} />
          <ResultCard title="Sua Crença Central" content={archetype.illusion} icon={<Brain className="text-purple-500" />} />
        </section>

        <section className="rounded-3xl border border-gold/20 bg-gold/5 p-8 space-y-4">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-gold" />
            <h3 className="font-display text-xl uppercase">Seu Próximo Passo</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Sua predominância no {archetype.name} indica uma fase de {archetype.phase.toLowerCase()}. 
            O seu próximo movimento consciente deve ser equilibrar sua {archetype.strength.toLowerCase()} com a percepção da sua {archetype.shadow.toLowerCase()}.
          </p>
        </section>

        <section className="space-y-6">
          <h3 className="font-display text-xl text-center uppercase tracking-tight">Mapa do Herói</h3>
          <div className="grid grid-cols-3 gap-3">
            {Object.values(ARCHETYPES_CONTENT).map((a) => {
              const isPredominant = a.id === predominant;
              return (
                <div 
                  key={a.id} 
                  className={`rounded-2xl border p-4 text-center space-y-2 transition-all ${
                    isPredominant ? 'border-gold bg-gold/10' : 'border-border glass opacity-60'
                  }`}
                >
                  <span className="text-2xl block">{a.symbol}</span>
                  <span className={`text-[9px] uppercase tracking-widest block ${isPredominant ? 'text-gold font-bold' : 'text-muted-foreground'}`}>
                    {a.name.split(' ')[1]}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <footer className="text-center space-y-4 pt-8">
           <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
             A maturidade não significa abandonar partes de quem somos. Significa desenvolver consciência suficiente para saber qual resposta a vida está pedindo de nós.
           </p>
           <button className="text-gold text-[10px] uppercase tracking-widest border border-gold/30 px-6 py-2 rounded-full hover:bg-gold/5 transition-colors">
             Refazer Diagnóstico
           </button>
        </footer>
      </div>
    </main>
  );
}

function ResultCard({ title, content, icon }: { title: string; content: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border glass p-6 space-y-3">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{title}</span>
      </div>
      <p className="text-sm text-foreground leading-snug">{content}</p>
    </div>
  );
}