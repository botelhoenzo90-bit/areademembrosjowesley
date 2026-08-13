import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { RealityToday } from "@/components/future-letter/RealityToday";
import { FutureIdentity } from "@/components/future-letter/FutureIdentity";
import { TimeLineStep } from "@/components/future-letter/TimeLineStep";
import { LetterEditor } from "@/components/future-letter/LetterEditor";
import { SuccessStage } from "@/components/future-letter/SuccessStage";
import { saveFutureLetter } from "@/lib/future-letter.functions";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/carta-futuro")({
  component: CartaFuturoPage,
});

type Stage = "intro" | "reality" | "identity" | "timeline" | "editor" | "success";

function CartaFuturoPage() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<Stage>("intro");
  const [data, setData] = useState<any>({
    reality_today: "",
    future_identity: "",
    content: "",
    unlock_date: "",
    title: "Minha Carta para o Futuro"
  });
  const [isSaving, setIsSaving] = useState(false);

  const saveLetterFn = useServerFn(saveFutureLetter);

  const handleNext = (newData: any) => {
    const updatedData = { ...data, ...newData };
    setData(updatedData);
    
    if (stage === "intro") setStage("reality");
    else if (stage === "reality") setStage("identity");
    else if (stage === "identity") setStage("timeline");
    else if (stage === "timeline") setStage("editor");
    else if (stage === "editor") handleFinalSave(updatedData);
  };

  const handleBack = () => {
    if (stage === "reality") setStage("intro");
    else if (stage === "identity") setStage("reality");
    else if (stage === "timeline") setStage("identity");
    else if (stage === "editor") setStage("timeline");
  };

  const handleFinalSave = async (finalData: any) => {
    setIsSaving(true);
    try {
      await saveLetterFn({ data: finalData });
      setStage("success");
    } catch (error) {
      console.error("Erro ao salvar carta:", error);
      toast.error("Não foi possível selar sua carta. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-foreground p-6 md:p-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {stage !== "success" && (
          <Button 
            variant="ghost" 
            className="mb-8 hover:bg-white/10 text-white" 
            onClick={stage === "intro" ? () => navigate({ to: "/home" }) : handleBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> {stage === "intro" ? "Voltar" : "Anterior"}
          </Button>
        )}

        {stage === "intro" && (
          <div className="text-center space-y-8 animate-fade-in py-8">
            <h1 className="font-display text-4xl md:text-7xl text-gold">Carta para o Meu Eu do Futuro</h1>
            
            {/* Video Aula Section */}
            <div className="max-w-3xl mx-auto overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-2xl">
              <div className="aspect-video w-full">
                <iframe
                  src="https://www.youtube.com/embed/QxHaglQfv48"
                  title="Aula: Carta para o Eu do Futuro"
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-6 text-left">
                <h3 className="text-xl font-bold text-foreground">Assista à aula antes de começar</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Entenda a profundidade deste exercício e como ele pode reprogramar sua percepção de futuro.
                </p>
              </div>
            </div>

            <p className="text-xl md:text-2xl text-muted-foreground italic max-w-2xl mx-auto leading-relaxed">
              "Toda transformação começa quando você decide conversar com a pessoa que deseja se tornar."
            </p>
            
            <div className="bg-white/5 p-10 rounded-[32px] border border-white/10 text-left space-y-6 max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground">Sua jornada começa aqui</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
                <p>
                  A maioria das pessoas vive reagindo ao presente. Pessoas conscientes vivem guiadas pela visão do futuro.
                </p>
                <p>
                  Escrever para o próprio futuro fortalece seu compromisso com a mudança, organiza os pensamentos 
                  e aumenta a clareza sobre quem você deseja se tornar.
                </p>
                <p className="text-gold/80 italic">
                  Esta carta ficará guardada como um marco eterno da sua transformação.
                </p>
              </div>
            </div>

            <Button 
              onClick={() => setStage("reality")}
              size="lg" 
              className="bg-gold text-black hover:bg-gold/90 px-12 py-8 rounded-full text-xl font-bold shadow-glow transition-all hover:scale-105"
            >
              Começar Minha Carta
            </Button>
          </div>
        )}

        {stage === "reality" && <RealityToday onNext={handleNext} initialData={data.reality_today} />}
        {stage === "identity" && <FutureIdentity onNext={handleNext} onBack={handleBack} initialData={data.future_identity} />}
        {stage === "timeline" && <TimeLineStep onNext={handleNext} onBack={handleBack} />}
        {stage === "editor" && (
          isSaving ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <Loader2 className="w-12 h-12 text-gold animate-spin" />
              <p className="text-lg text-muted-foreground">Selando sua cápsula do tempo...</p>
            </div>
          ) : (
            <LetterEditor onNext={handleNext} onBack={handleBack} initialData={data.content} />
          )
        )}
        {stage === "success" && <SuccessStage />}
      </div>
    </main>
  );
}
