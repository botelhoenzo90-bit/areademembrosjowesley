import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, CheckCircle2, Play, Trophy, Sparkles, Send, ShieldCheck, Loader2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { getPassportData, updateLayerProgress, unlockNextLayer } from "@/lib/passport.functions";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { PASSPORT_GAMIFICATION_TEXTS } from "@/lib/passport-content";

export const Route = createFileRoute("/_authenticated/treinamento-premium/camada/$layerNumber")({
  component: LayerPage,
});

function youtubeId(url: string | null): string | null {
  if (!url) return null;
  // Improved regex to handle various YouTube URL formats including query parameters like ?is=...
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/)|youtu\.be\/|v=)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

function LayerPage() {
  const { layerNumber } = useParams({ from: "/_authenticated/treinamento-premium/camada/$layerNumber" });
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reflection, setReflection] = useState("");
  
  const getPassport = useServerFn(getPassportData);
  const updateProgress = useServerFn(updateLayerProgress);
  const unlockNext = useServerFn(unlockNextLayer);

  useEffect(() => {
    getPassport()
      .then(d => {
        setData(d);
        const layer = d.layers?.find((l: any) => l.layer_number === parseInt(layerNumber));
        const prog = d.progress?.find((p: any) => p.layer_id === layer?.id);
        if (prog?.reflection_content) setReflection(prog.reflection_content);
      })
      .catch(err => {
        console.error("Error in LayerPage:", err);
        toast.error("Erro ao carregar dados da camada.");
      })
      .finally(() => setLoading(false));
  }, [getPassport, layerNumber]);

  if (loading) return <div className="flex h-screen items-center justify-center bg-black"><Loader2 className="animate-spin text-gold" /></div>;

  if (!data || !data.layers) return (
    <div className="flex flex-col h-screen items-center justify-center bg-black p-6 text-center">
      <h2 className="text-xl text-white mb-4">Erro ao carregar os dados do passaporte.</h2>
      <Button onClick={() => navigate({ to: "/treinamento-premium" })}>Voltar ao Passaporte</Button>
    </div>
  );

  const currentLayer = data.layers.find((l: any) => l.layer_number === parseInt(layerNumber));
  if (!currentLayer) return (
    <div className="flex flex-col h-screen items-center justify-center bg-black p-6 text-center">
      <h2 className="text-xl text-white mb-4">Camada {layerNumber} não encontrada.</h2>
      <Button onClick={() => navigate({ to: "/treinamento-premium" })}>Voltar ao Passaporte</Button>
    </div>
  );

  const prog = data.progress.find((p: any) => p.layer_id === currentLayer.id) || { status: 'locked' };
  
  const handleCompleteLesson = async () => {
    setSaving(true);
    try {
      await updateProgress({
        data: {
          layerId: currentLayer.id,
          updates: { lesson_completed: true, status: 'in_progress', points_earned: 10 }
        }
      });
      toast.success("Aula concluída! +10 XP");
      setData(await getPassport());
    } catch (e) {
      toast.error("Erro ao salvar progresso.");
    } finally {
      setSaving(false);
    }
  };

  const handleCompleteMission = async () => {
    setSaving(true);
    try {
      await updateProgress({
        data: {
          layerId: currentLayer.id,
          updates: { mission_completed: true, points_earned: (prog.points_earned || 0) + 10 }
        }
      });
      toast.success("Missão concluída! +10 XP");
      setData(await getPassport());
    } catch (e) {
      toast.error("Erro ao salvar missão.");
    } finally {
      setSaving(false);
    }
  };

  const handleCompleteProtocol = async () => {
    if (!reflection.trim()) {
      toast.error("Por favor, registre sua experiência antes de concluir.");
      return;
    }
    setSaving(true);
    try {
      const isLastLayer = currentLayer.layer_number === 9;
      await updateProgress({
        data: {
          layerId: currentLayer.id,
          updates: { 
            protocol_completed: true, 
            reflection_content: reflection,
            status: 'completed',
            points_earned: (prog.points_earned || 0) + 30, // 10 protocol + 20 bonus for completing layer
            completed_at: new Date().toISOString()
          }
        }
      });
      
      if (!isLastLayer) {
        await unlockNext({ data: { currentLayerNumber: currentLayer.layer_number } });
      }

      // Check for badges
      const newProgress = await getPassport();
      const completedCount = newProgress.progress.filter((p: any) => p.status === 'completed' && p.layer_id !== newProgress.layers.find((l:any) => l.layer_number === 0)?.id).length;
      
      let badgeToUnlock = null;
      if (currentLayer.layer_number === 0) badgeToUnlock = newProgress.badges.find((b: any) => b.requirement_type === 'presentation');
      else if (currentLayer.layer_number === 1) badgeToUnlock = newProgress.badges.find((b: any) => b.requirement_type === 'layer_1');
      else if (completedCount === 3) badgeToUnlock = newProgress.badges.find((b: any) => b.requirement_type === 'layers_3');
      else if (completedCount === 5) badgeToUnlock = newProgress.badges.find((b: any) => b.requirement_type === 'layers_5');
      else if (completedCount === 7) badgeToUnlock = newProgress.badges.find((b: any) => b.requirement_type === 'layers_7');
      else if (completedCount === 9) badgeToUnlock = newProgress.badges.find((b: any) => b.requirement_type === 'layers_9');

      if (badgeToUnlock && !newProgress.userBadges.some((ub: any) => ub.badge_id === badgeToUnlock.id)) {
        await supabase.from('user_passport_badges').insert({ user_id: data.user.id, badge_id: badgeToUnlock.id });
        toast.success(`Nova Conquista: ${badgeToUnlock.name}!`);
      }

      toast.success("Protocolo e Camada Concluídos! +30 XP");
      navigate({ to: "/treinamento-premium" });
    } catch (e) {
      toast.error("Erro ao concluir camada.");
    } finally {
      setSaving(false);
    }
  };

  const videoId = youtubeId(currentLayer.video_url);

  return (
    <main className="min-h-screen bg-black text-foreground pb-20">
      <nav className="p-6 flex items-center justify-between border-b border-white/10 sticky top-0 bg-black/80 backdrop-blur-md z-30">
        <Button variant="ghost" onClick={() => navigate({ to: "/treinamento-premium" })}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Passaporte
        </Button>
        <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Status da Camada</p>
                <p className="text-gold font-display capitalize">{prog.status.replace('_', ' ')}</p>
            </div>
            <div className="h-10 w-10 rounded-full border border-gold/30 flex items-center justify-center bg-gold/10">
                <span className="text-gold font-bold">{prog.points_earned || 0}</span>
            </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-8">
        <header className="mb-12">
            <span className="text-gold font-display text-2xl tracking-tighter mb-2 block">CAMADA {currentLayer.layer_number}</span>
            <h1 className="text-4xl sm:text-5xl font-display mb-4">{currentLayer.name.split(' — ')[1] || currentLayer.name}</h1>
            <p className="text-xl text-muted-foreground italic font-serif">"{currentLayer.essence}"</p>
        </header>

        {/* VÍDEO / AULA */}
        <section className="mb-16">
            <h2 className="flex items-center gap-2 text-xl font-display mb-6">
                <Play className="text-gold h-5 w-5" /> AULA DE APRESENTAÇÃO
            </h2>
            <div className="aspect-video w-full rounded-3xl overflow-hidden border border-white/10 shadow-glow bg-surface">
                {videoId ? (
                    <iframe 
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title={currentLayer.name}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground p-12 text-center">
                        <Sparkles className="h-12 w-12 mb-4 opacity-20" />
                        <p className="text-lg">Conteúdo em preparação.</p>
                        <p className="text-sm">Assista à aula de abertura no Passaporte enquanto preparamos este material.</p>
                    </div>
                )}
            </div>
            
            {!prog.lesson_completed && (
                <Button className="mt-6 w-full py-6 rounded-2xl text-lg bg-gold hover:bg-gold/90 text-black font-bold" onClick={handleCompleteLesson} disabled={saving}>
                    {saving ? <Loader2 className="animate-spin" /> : "CONCLUIR AULA"}
                </Button>
            )}
            {prog.lesson_completed && (
                <div className="mt-6 p-4 rounded-2xl border border-green-500/30 bg-green-500/10 flex items-center justify-center text-green-400 gap-2">
                    <CheckCircle2 className="h-5 w-5" /> Aula Assistida e Concluída
                </div>
            )}
        </section>

        {/* GAMIFICAÇÃO / RECONHECIMENTO */}
        {prog.lesson_completed && (
            <section className="mb-16 animate-fade-in">
                <Card className="glass-strong border-gold/20 overflow-hidden">
                    <CardHeader className="bg-gold/5 border-b border-gold/10">
                        <CardTitle className="text-gold font-display flex items-center gap-2">
                            <Trophy className="h-5 w-5" /> CONQUISTA DA CAMADA
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                            {PASSPORT_GAMIFICATION_TEXTS[currentLayer.layer_number] || "Sua jornada continua..."}
                        </div>
                    </CardContent>
                </Card>
            </section>
        )}

        {/* MISSÕES & PROTOCOLOS */}
        {prog.lesson_completed && (
            <section className="mb-16 space-y-8 animate-fade-in">
                <h2 className="text-2xl font-display text-foreground border-l-4 border-gold pl-4">MISSÕES & PROTOCOLOS</h2>
                
                {/* MISSÃO */}
                <Card className="glass border-white/5">
                    <CardHeader>
                        <CardTitle className="text-lg">A MISSÃO</CardTitle>
                        <CardDescription>Uma tarefa prática para fixar o aprendizado.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-xl text-foreground bg-white/5 p-6 rounded-2xl border border-white/10">
                            {currentLayer.layer_number === 0 ? "Prepare seu ambiente e comprometa-se com a jornada." : "Observe seu comportamento e registre suas percepções."}
                        </p>
                        {!prog.mission_completed ? (
                            <Button variant="outline" className="w-full border-gold/50 text-gold hover:bg-gold/10" onClick={handleCompleteMission} disabled={saving}>
                                CONCLUIR MISSÃO
                            </Button>
                        ) : (
                            <div className="p-3 rounded-xl border border-green-500/20 bg-green-500/5 text-green-500 text-sm flex items-center gap-2 justify-center">
                                <CheckCircle2 className="h-4 w-4" /> Missão Cumprida
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* PROTOCOLO */}
                <Card className="glass border-white/5">
                    <CardHeader>
                        <CardTitle className="text-lg">PROTOCOLO DE EXECUÇÃO</CardTitle>
                        <CardDescription>O caminho da implementação real.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-white/5">
                                <h4 className="text-xs uppercase tracking-widest text-gold mb-2">O Que Fazer</h4>
                                <p className="text-sm text-muted-foreground">Registre suas descobertas após a missão e aula.</p>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5">
                                <h4 className="text-xs uppercase tracking-widest text-gold mb-2">O Que Observar</h4>
                                <p className="text-sm text-muted-foreground">Note padrões de pensamento e reações emocionais.</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-medium text-foreground">Minha Experiência (Reflexão)</label>
                            <Textarea 
                                placeholder="Descreva o que você percebeu durante esta camada..."
                                className="min-h-[150px] bg-white/5 border-white/10 focus:border-gold/50"
                                value={reflection}
                                onChange={(e) => setReflection(e.target.value)}
                                disabled={prog.protocol_completed}
                            />
                        </div>

                        {!prog.protocol_completed ? (
                            <Button className="w-full bg-surface-elevated hover:bg-surface-elevated/80 text-white" onClick={handleCompleteProtocol} disabled={saving || !prog.mission_completed}>
                                CONCLUIR PROTOCOLO & DESBLOQUEAR PRÓXIMA CAMADA
                            </Button>
                        ) : (
                            <div className="p-4 rounded-xl border border-green-500/30 bg-green-500/10 text-green-400 flex flex-col items-center gap-2">
                                <ShieldCheck className="h-8 w-8" />
                                <span className="font-bold">Protocolo Finalizado</span>
                                <span className="text-xs opacity-70">Sua jornada avança para a próxima etapa.</span>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </section>
        )}
        {/* TELA DE CONCLUSÃO FINAL (CAMADA 9) */}
        {prog.status === 'completed' && currentLayer.layer_number === 9 && (
            <section className="mt-16 text-center animate-bounce-in py-12 border-t border-gold/20">
                <h2 className="text-4xl font-display text-gold mb-4">VOCÊ ATRAVESSOU AS 9 CAMADAS</h2>
                <p className="text-xl text-muted-foreground mb-8 italic">Você não terminou uma jornada. Você começou a enxergar sua vida de outra maneira.</p>
                
                <div className="glass-strong p-8 rounded-3xl border border-gold/30 inline-block mb-8">
                    <p className="text-gold font-bold text-lg mb-2">PRÓXIMO PASSO: MAPA DA VIDA</p>
                    <p className="text-sm text-muted-foreground mb-6">Acesse a mentoria gratuita mapa da vida e descubra o caminho para remover os obstáculos que ainda te bloqueiam.</p>
                    <Button 
                        className="bg-gold text-black hover:bg-gold/90 px-8 py-6 rounded-2xl font-bold"
                        onClick={() => window.open("https://wa.me/message/YNNTLWLFBDWOP1", "_blank")}
                    >
                        ACESSE A MENTORIA GRATUITA
                    </Button>
                </div>
            </section>
        )}
      </div>
    </main>
  );
}
