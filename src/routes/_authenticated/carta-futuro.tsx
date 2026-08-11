import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_authenticated/carta-futuro")({
  component: CartaFuturoPage,
});

function CartaFuturoPage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-black text-foreground p-6 md:p-12">
        <Button variant="ghost" className="mb-8 hover:bg-white/10 text-white" onClick={() => navigate({ to: "/home" })}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>

        <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
            <h1 className="font-display text-4xl md:text-6xl text-gold">Carta para o Meu Eu do Futuro</h1>
            <p className="text-xl text-muted-foreground italic">
                "Toda transformação começa quando você decide conversar com a pessoa que deseja se tornar."
            </p>
            
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10 text-left space-y-4">
                <h2 className="text-xl font-bold text-foreground">Sua jornada começa aqui</h2>
                <p className="text-muted-foreground leading-relaxed">
                    A maioria das pessoas vive reagindo ao presente. Pessoas conscientes vivem guiadas pela visão do futuro.
                    Escrever para o próprio futuro fortalece seu compromisso com a mudança, organiza os pensamentos 
                    e aumenta a clareza sobre quem você deseja se tornar.
                </p>
            </div>

            <Button size="lg" className="bg-gold text-black hover:bg-gold/90 px-8 py-6 rounded-full text-lg font-bold">
                Começar Minha Carta
            </Button>
        </div>
    </main>
  );
}
