export type ArchetypeData = {
  id: string;
  name: string;
  subtitle: string;
  symbol: string;
  phase: string;
  essence: string;
  objective: string;
  strength: string;
  need: string;
  shadow: string;
  illusion: string;
  question: string;
  categories: {
    thoughts: string[];
    emotions: string[];
    behaviors: string[];
    relationships: string[];
    decisions: string[];
    identity: string[];
  };
  selfPerceptionQuestions: {
    question: string;
    options: { label: string; score: number }[];
  }[];
  reflectionQuestion: string;
  mission: string;
};

export const ARCHETYPES_CONTENT: Record<string, ArchetypeData> = {
  inocente: {
    id: "inocente",
    name: "O Inocente",
    subtitle: "A busca pela segurança e otimismo",
    symbol: "☀️",
    phase: "Segurança",
    essence: "Fé e Otimismo",
    objective: "Ser feliz e permanecer em segurança.",
    strength: "Esperança inabalável e simplicidade.",
    need: "Ser aceito e protegido.",
    shadow: "Negação e repressão de sentimentos negativos.",
    illusion: "A crença de que a vida deve ser sempre perfeita.",
    question: "Onde eu deposito minha fé?",
    categories: {
      thoughts: ["Tudo vai dar certo no final.", "As pessoas são essencialmente boas.", "Existe um plano maior."],
      emotions: ["Paz", "Confiança", "Medo de ser abandonado"],
      behaviors: ["Seguir regras", "Evitar conflitos", "Ser prestativo"],
      relationships: ["Dependência", "Busca por figuras protetoras", "Lealdade"],
      decisions: ["Baseadas na segurança", "Evita riscos", "Prefere o conhecido"],
      identity: ["Aquele que confia", "A criança interior ativa"]
    },
    selfPerceptionQuestions: [
      {
        question: "Quando algo sai do seu controle, qual reação mais se aproxima de você?",
        options: [
          { label: "Confio que tudo vai se resolver.", score: 3 },
          { label: "Procuro alguém para me ajudar.", score: 2 },
          { label: "Fico paralisado pelo medo.", score: 1 }
        ]
      }
    ],
    reflectionQuestion: "Onde esse padrão de busca por segurança aparece atualmente na sua vida?",
    mission: "Observe durante as próximas horas uma situação em que você reage automaticamente esperando que tudo se resolva sozinho. Apenas perceba o padrão."
  },
  orfao: {
    id: "orfao",
    name: "O Órfão",
    subtitle: "A jornada da vulnerabilidade e realismo",
    symbol: "🩹",
    phase: "Segurança",
    essence: "Realismo e Empatia",
    objective: "Recuperar a segurança e pertencer.",
    strength: "Resiliência e compreensão da dor alheia.",
    need: "Ser ouvido e compreendido.",
    shadow: "Vitimismo e cinismo.",
    illusion: "A crença de que estamos sozinhos contra o mundo.",
    question: "Onde eu me sinto excluído?",
    categories: {
      thoughts: ["Ninguém realmente me entende.", "A vida é dura e injusta.", "Preciso me proteger."],
      emotions: ["Solidão", "Desconfiança", "Anseio por pertencimento"],
      behaviors: ["Retraimento", "Queixa constante", "Busca por justiça"],
      relationships: ["Medo da traição", "Teste constante de lealdade", "Desejo de fusão"],
      decisions: ["Baseadas na sobrevivência", "Ceticismo", "Cautela extrema"],
      identity: ["Aquele que sobrevive", "O realista"]
    },
    selfPerceptionQuestions: [
      {
        question: "Como você lida com a sensação de injustiça?",
        options: [
          { label: "Sinto que sou sempre o alvo.", score: 3 },
          { label: "Tento me defender sozinho.", score: 2 },
          { label: "Busco aliados que entendam minha dor.", score: 1 }
        ]
      }
    ],
    reflectionQuestion: "Em quais áreas da vida você se sente desamparado ou injustiçado?",
    mission: "Identifique um momento hoje em que você se sentiu 'de fora' ou incompreendido. Observe se houve um exagero na percepção de isolamento."
  },
  guerreiro: {
    id: "guerreiro",
    name: "O Guerreiro",
    subtitle: "A força da ação e coragem",
    symbol: "⚔️",
    phase: "Desenvolvimento",
    essence: "Disciplina e Coragem",
    objective: "Vencer, proteger e impactar.",
    strength: "Foco, determinação e limites claros.",
    need: "Ser eficiente e competente.",
    shadow: "Agressividade e medo da fraqueza.",
    illusion: "A crença de que tudo é uma batalha a ser vencida.",
    question: "Pelo que vale a pena lutar?",
    categories: {
      thoughts: ["Eu consigo resolver isso.", "Fraqueza é inaceitável.", "Preciso estar no controle."],
      emotions: ["Raiva motivadora", "Orgulho", "Ansiedade por desempenho"],
      behaviors: ["Ação rápida", "Competição", "Estabelecimento de limites"],
      relationships: ["Protetor", "Dominante", "Exigente"],
      decisions: ["Racionais", "Focadas em resultados", "Pragmáticas"],
      identity: ["Aquele que faz", "O protetor"]
    },
    selfPerceptionQuestions: [
      {
        question: "Qual sua reação imediata diante de um obstáculo?",
        options: [
          { label: "Atacar e vencer o problema.", score: 3 },
          { label: "Planejar a melhor estratégia de combate.", score: 2 },
          { label: "Sentir que precisa provar seu valor.", score: 1 }
        ]
      }
    ],
    reflectionQuestion: "Onde você está gastando energia excessiva tentando 'lutar' contra a realidade?",
    mission: "Observe uma situação em que você reage agressivamente ou com extrema exigência. Apenas perceba o padrão de combate."
  }
};
