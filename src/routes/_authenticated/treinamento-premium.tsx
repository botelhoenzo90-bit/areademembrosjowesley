import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Lock, CheckCircle2, Play, ChevronRight, Trophy, RefreshCw, Sparkles, MapPin } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { getPassportData, updateLayerProgress, unlockNextLayer, restartPassportJornada } from "@/lib/passport.functions";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/_authenticated/treinamento-premium")({
  component: PassaportePage,
});

function PassaportePage() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const getPassport = useServerFn(getPassportData);

  useEffect(() => {
    getPassport().then(setData).finally(() => setLoading(false));
  }, [getPassport]);

  if (loading || !data) return <div>Carregando Passaporte...</div>;

  const { layers, progress } = data;
  const completedLayers = progress.filter((p: any) => p.status === 'completed').length;
  const totalLayers = layers.length;
  const progressPercent = Math.round((completedLayers / totalLayers) * 100);

  return (
    <main className="min-h-screen bg-background pb-20">
      <header className="relative h-64 overflow-hidden bg-gradient-to-b from-surface-elevated to-background">
        <div className="absolute inset-0 bg-[url('/assets/premium-hero.jpg')] bg-cover bg-center opacity-30" />
        <div className="relative z-10 p-6">
          <Button variant="ghost" className="mb-4" onClick={() => navigate({ to: "/home" })}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
          <h1 className="font-display text-4xl text-foreground">Passaporte das 9 Camadas</h1>
          <p className="text-muted-foreground">Sua Jornada pelas 9 Camadas — Uma camada por vez.</p>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
                <span>JORNADA {progressPercent}% CONCLUÍDA</span>
                <span>{completedLayers} de {totalLayers} CAMADAS</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        </div>
      </header>

      <section className="px-6 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {layers.map((layer: any) => {
          const prog = progress.find((p: any) => p.layer_id === layer.id) || { status: 'locked' };
          const isLocked = prog.status === 'locked';

          return (
            <div key={layer.id} className={`rounded-3xl border border-border p-6 ${isLocked ? 'bg-background/50 grayscale' : 'glass-strong'}`}>
              <div className="flex justify-between items-start mb-4">
                <span className="text-gold font-display text-xl">0{layer.layer_number}</span>
                {isLocked ? <Lock className="text-muted-foreground" /> : <CheckCircle2 className="text-green-500" />}
              </div>
              <h3 className="font-display text-xl text-foreground mb-1">{layer.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{layer.essence}</p>
              
              <Button className="w-full" disabled={isLocked} onClick={() => navigate({ to: `/treinamento-premium/camada/${layer.layer_number}` })}>
                {isLocked ? 'Bloqueada' : 'Acessar'}
              </Button>
            </div>
          );
        })}
      </section>
    </main>
  );
}
