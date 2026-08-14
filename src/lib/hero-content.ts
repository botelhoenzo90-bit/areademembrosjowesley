import { ArchetypeData } from "./hero-content";

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
    mission: "Observe durante as próximas horas uma situação em que você reage automaticamente esperando que tudo se resolva sozinho. Apenas perceba o padrão.",
    conclusionScript: `Você concluiu a exploração do Inocente. Este arquétipo é a base da nossa capacidade de confiar e ter esperança. Quando integrado de forma saudável, ele nos permite enfrentar a vida com otimismo, sem cair na negação da realidade. Você agora possui uma maior percepção de onde sua fé está depositada e como sua busca por segurança influencia suas escolhas. Lembre-se: a verdadeira segurança não vem da ausência de problemas, mas da confiança interna de que você tem os recursos para lidar com eles.`
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
    mission: "Identifique um momento hoje em que você se sentiu 'de fora' ou incompreendido. Observe se houve um exagero na percepção de isolamento.",
    conclusionScript: `A exploração do Órfão revelou suas feridas de abandono e sua incrível resiliência. Este arquétipo nos ensina que a dor é parte da experiência humana, mas não define quem somos. Ao reconhecer sua vulnerabilidade, você abre espaço para uma empatia genuína consigo mesmo e com os outros. O realismo do Órfão é o que nos protege de expectativas irreais, permitindo-nos construir relacionamentos baseados na verdade, não em ilusões de perfeição.`
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
    mission: "Observe uma situação em que você reage agressivamente ou com extrema exigência. Apenas perceba o padrão de combate.",
    conclusionScript: `O Guerreiro em você é a força que impulsiona a mudança e estabelece limites. Ao concluir esta etapa, você entende que a verdadeira coragem não é a ausência de medo, mas a ação disciplinada apesar dele. A força do Guerreiro, quando bem direcionada, protege o que é sagrado e constrói um legado. Cuidado apenas para não transformar toda a vida em um campo de batalha; saiba quando baixar a guarda e quando empunhar a espada.`
  },
  altruista: {
    id: "altruista",
    name: "O Altruísta",
    subtitle: "A compaixão e o cuidado",
    symbol: "❤️",
    phase: "Desenvolvimento",
    essence: "Generosidade e Cuidado",
    objective: "Ajudar os outros e tornar o mundo melhor.",
    strength: "Empatia profunda e capacidade de sacrifício.",
    need: "Sentir-se útil e amado através do servir.",
    shadow: "Martírio e controle através da culpa.",
    illusion: "A crença de que posso e devo salvar a todos.",
    question: "Como posso servir melhor?",
    categories: {
      thoughts: ["Os outros vêm primeiro.", "Eu sei o que é melhor para você.", "Se eu não fizer, ninguém fará."],
      emotions: ["Compaixão", "Culpa por descansar", "Medo do egoísmo"],
      behaviors: ["Cuidar", "Ensinar", "Assumir responsabilidades alheias"],
      relationships: ["Provedor", "Salvador", "Possessivo"],
      decisions: ["Baseadas no bem-estar alheio", "Auto-sacrifício", "Empáticas"],
      identity: ["Aquele que cuida", "O doador"]
    },
    selfPerceptionQuestions: [
      {
        question: "Como você se sente quando diz 'no' a alguém?",
        options: [
          { label: "Extremamente culpado.", score: 3 },
          { label: "Desconfortável, mas necessário.", score: 2 },
          { label: "Tranquilo, se for o meu limite.", score: 1 }
        ]
      }
    ],
    reflectionQuestion: "Onde você está se anulando para atender às necessidades dos outros?",
    mission: "Identifique hoje um momento em que você sentiu o impulso de 'salvar' alguém de um desconforto. Tente apenas observar o impulso sem agir.",
    conclusionScript: `O Altruísta nos ensina o valor da compaixão e do serviço. Ao integrar este arquétipo, você descobre que o cuidado genuíno começa com o auto-cuidado. Não é possível dar o que não se tem. Sua generosidade é um dom, mas ela deve ser sustentável. A verdadeira ajuda é aquela que empodera o outro a caminhar com as próprias pernas, não aquela que o torna dependente do seu sacrifício.`
  },
  nomade: {
    id: "nomade",
    name: "O Nômade",
    subtitle: "A busca pela identidade e autonomia",
    symbol: "🧭",
    phase: "Integração",
    essence: "Autonomia e Busca",
    objective: "Encontrar a própria verdade e ser autêntico.",
    strength: "Curiosidade, independência e coragem de ser diferente.",
    need: "Liberdade e exploração.",
    shadow: "Isolamento e incapacidade de compromisso.",
    illusion: "A crença de que a grama do vizinho é sempre mais verde.",
    question: "Quem sou eu além das expectativas?",
    categories: {
      thoughts: ["Preciso sair daqui.", "Existe algo mais lá fora.", "Não pertenço a este lugar."],
      emotions: ["Inquietude", "Desejo de liberdade", "Medo de ser enclausurado"],
      behaviors: ["Viajar", "Mudar de carreira", "Questionar autoridades"],
      relationships: ["Busca por espaço", "Dificuldade de entrega", "Independência"],
      decisions: ["Baseadas na liberdade", "Impulsivas", "Exploratórias"],
      identity: ["O buscador", "O aventureiro"]
    },
    selfPerceptionQuestions: [
      {
        question: "Qual sua reação diante da rotina?",
        options: [
          { label: "Sinto-me sufocado e quero fugir.", score: 3 },
          { label: "Tento encontrar formas de inovar.", score: 2 },
          { label: "Aceito como parte necessária da vida.", score: 1 }
        ]
      }
    ],
    reflectionQuestion: "De quais 'prisões' mentais ou sociais você sente vontade de escapar?",
    mission: "Hoje, faça algo de uma forma completamente diferente do seu habitual. Observe o sentimento de liberdade ou estranhamento.",
    conclusionScript: `O Nômade em você é o eterno buscador da verdade. Esta etapa da jornada mostrou sua necessidade de autonomia e autenticidade. O Nômade nos empurra para fora da zona de conforto, permitindo que descubramos quem somos longe das pressões externas. A busca nunca termina, mas agora você sabe que a jornada em si é o destino. Use sua liberdade para construir sua própria casa interna, não para fugir de si mesmo.`
  },
  mago: {
    id: "mago",
    name: "O Mago",
    subtitle: "A transformação e poder pessoal",
    symbol: "🔮",
    phase: "Integração",
    essence: "Transformação e Sabedoria",
    objective: "Transformar a realidade através da consciência.",
    strength: "Visão, intuição e capacidade de manifestação.",
    need: "Viver em alinhamento com as leis universais.",
    shadow: "Manipulação e arrogância espiritual.",
    illusion: "A crença de que posso controlar tudo com a mente.",
    question: "Como posso cocriar minha realidade?",
    categories: {
      thoughts: ["Como em cima, assim embaixo.", "Eu crio minha própria experiência.", "Tudo é energia."],
      emotions: ["Empoderamento", "Serenidade", "Conexão com o Todo"],
      behaviors: ["Meditação", "Alinhamento de intenção", "Observação consciente"],
      relationships: ["Catalisador", "Inspirador", "Mestre/Aprendiz"],
      decisions: ["Baseadas na intuição", "Alinhadas com o propósito", "Conscientes"],
      identity: ["Aquele que transforma", "O visionário"]
    },
    selfPerceptionQuestions: [
      {
        question: "Como você enxerga as 'coincidências' da vida?",
        options: [
          { label: "Como sinais e sincronicidades.", score: 3 },
          { label: "Como eventos curiosos, mas aleatórios.", score: 2 },
          { label: "Não acredito em coincidências.", score: 1 }
        ]
      }
    ],
    reflectionQuestion: "Qual aspecto da sua vida você sente que está pronto para ser transmutado?",
    mission: "Pratique a 'observação do observador' hoje. Tente perceber quem é que está percebendo seus pensamentos.",
    conclusionScript: `O Mago é o ápice da integração. Você aprendeu que a realidade externa é um reflexo do seu estado interno. O poder do Mago não é o controle, mas o alinhamento. Ao mudar sua percepção, você muda seu mundo. A magia acontece na intersecção entre a intenção clara e a entrega confiante. Você é o alquimista da sua própria vida; use sua sabedoria para transformar chumbo em ouro, dor em aprendizado e medo em amor.`
  }
};
