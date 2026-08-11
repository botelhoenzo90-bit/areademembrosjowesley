import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle2 } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export function SuccessStage() {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-xl mx-auto text-center space-y-8 py-12"
    >
      <div className="relative w-32 h-32 mx-auto">
        <div className="absolute inset-0 bg-gold/20 rounded-full animate-ping" />
        <div className="relative w-32 h-32 rounded-full bg-gold/10 flex items-center justify-center border border-gold/30">
          <Mail className="w-16 h-16 text-gold" />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-display text-gold">Carta Selada com Sucesso!</h2>
        <p className="text-xl text-muted-foreground italic leading-relaxed">
          "Hoje você plantou uma semente no futuro. Cada decisão tomada daqui em diante poderá aproximá-lo da pessoa que acabou de descrever."
        </p>
      </div>

      <div className="bg-white/5 p-8 rounded-3xl border border-white/10 text-left space-y-4">
        <div className="flex items-center gap-3 text-gold">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-bold">O que acontece agora?</span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Sua carta foi colocada em uma cápsula do tempo protegida. Você não poderá lê-la até a data de abertura que escolheu. Continue sua jornada de transformação no Instituto Neuroconsciência.
        </p>
      </div>

      <Button 
        onClick={() => navigate({ to: "/home" })}
        size="lg"
        className="bg-gold text-black hover:bg-gold/90 px-8 py-6 rounded-full text-lg font-bold w-full"
      >
        Voltar para a Home
      </Button>
    </motion.div>
  );
}
