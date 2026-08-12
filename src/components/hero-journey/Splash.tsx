import { motion } from "framer-motion";

interface SplashProps {
  userName: string;
  onStart: () => void;
}

export function Splash({ userName, onStart }: SplashProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background p-6 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl space-y-8"
      >
        <div className="space-y-4">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-[10px] uppercase tracking-[0.3em] text-gold"
          >
            Instituto NeuroConsciência
          </motion.span>
          <h1 className="font-display text-5xl text-foreground sm:text-7xl">
            SUA JORNADA <br /> COMEÇA AQUI
          </h1>
          <p className="text-xl text-muted-foreground">
            Olá, {userName}. Sua jornada começa agora.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="space-y-6 text-sm leading-relaxed text-muted-foreground/80"
        >
          <p>
            Existem padrões dentro de você que podem estar conduzindo suas escolhas sem que você perceba.
          </p>
          <p>
            Ao longo da vida, desenvolvemos diferentes formas de enxergar o mundo, lidar com dificuldades, buscar segurança, proteger pessoas, lutar pelo que queremos, procurar nosso propósito e transformar nossa realidade.
          </p>
          <p>
            Nesta jornada, você vai explorar seis arquétipos. Não para descobrir quem você "é". Mas para descobrir qual padrão parece estar conduzindo sua vida agora.
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2 }}
          onClick={onStart}
          className="rounded-full bg-foreground px-12 py-4 text-sm font-medium text-background transition-all hover:scale-105 active:scale-95"
        >
          COMEÇAR JORNADA
        </motion.button>
      </motion.div>
    </div>
  );
}
