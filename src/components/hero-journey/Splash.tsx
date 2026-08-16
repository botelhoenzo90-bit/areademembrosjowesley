import { motion } from "framer-motion";

interface SplashProps {
  userName: string;
  onStart: () => void;
}

export function Splash({ userName, onStart }: SplashProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#080808] p-6 text-center overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-2xl space-y-10 py-12"
      >
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mx-auto w-16 h-1 border-t-2 border-gold/30"
          />
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="block text-[10px] uppercase tracking-[0.4em] text-gold font-medium"
          >
            Instituto NeuroConsciência
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="font-display text-5xl text-foreground sm:text-7xl leading-[1.1] tracking-tighter uppercase"
          >
            SUA JORNADA <br /> <span className="text-gold/90">COMEÇA AQUI</span>
          </h1 >
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-xl text-muted-foreground font-light"
          >
            Olá, <span className="text-foreground font-medium">{userName}</span>. Sua jornada de autoconhecimento começa agora.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="space-y-6 text-base leading-relaxed text-muted-foreground/80 font-light max-w-xl mx-auto"
        >
          <p className="border-l-2 border-gold/20 pl-6 text-left">
            "Existem padrões dentro de você que podem estar conduzindo suas escolhas sem que você perceba."
          </p>
          <p className="text-left pl-6">
            Ao longo da vida, desenvolvemos diferentes formas de enxergar o mundo, lidar com dificuldades, buscar segurança, proteger pessoas, lutar pelo que queremos, procurar nosso propósito e transformar nossa realidade.
          </p>
          <p className="text-left pl-6">
            Nesta jornada, você vai explorar seis arquétipos fundamentais. Não para descobrir quem você "é", mas para descobrir qual padrão parece estar conduzindo sua vida agora.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2 }}
          className="pt-4"
        >
          <button
            onClick={onStart}
            className="group relative inline-flex items-center justify-center rounded-full bg-foreground px-16 py-5 text-sm font-bold text-background transition-all hover:scale-105 active:scale-95 shadow-glow shadow-gold/10"
          >
            <span className="relative z-10 tracking-[0.2em] uppercase">COMEÇAR JORNADA</span>
            <div className="absolute inset-0 rounded-full bg-gold opacity-0 group-hover:opacity-10 transition-opacity" />
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
