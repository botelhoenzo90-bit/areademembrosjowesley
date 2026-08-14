export type ArchetypeQuiz = {
  question: string;
  options: { label: string; score: number }[];
};

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
  mentorship: string;
  quiz: ArchetypeQuiz[];
  categories: {
    thoughts: string[];
    emotions: string[];
    behaviors: string[];
    relationships: string[];
    decisions: string[];
    identity: string[];
  };
  gamificationText: string;
  selfPerceptionQuestions: {
    question: string;
    options: { label: string; score: number }[];
  }[];
  reflectionQuestion: string;
  mission: string;
  conclusionScript: string;
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
    mentorship: "O Inocente é o primeiro arquétipo da jornada, representando o estado de pureza e confiança. Em sua essência, ele busca a felicidade e a segurança através do otimismo. Quando esse arquétipo domina, a pessoa tende a ver o mundo como um lugar bom e seguro. No entanto, o desafio do Inocente é aprender que a vida tem dores e imperfeições. A negação desses aspectos pode levar à imaturidade. Cultivar o Inocente significa manter a capacidade de se encantar, mesmo diante das adversidades. É sobre encontrar o equilíbrio entre a fé inabalável e a clareza sobre a realidade.",
    quiz: [
      { question: "Você se sente protegido quando está em ambientes familiares?", options: [{ label: "Sim, totalmente", score: 3 }, { label: "Às vezes", score: 2 }, { label: "Nunca", score: 1 }] },
      { question: "Você acredita que as pessoas são boas por natureza?", options: [{ label: "Sempre", score: 3 }, { label: "Depende", score: 2 }, { label: "Dificilmente", score: 1 }] },
      { question: "Você evita conflitos a todo custo?", options: [{ label: "Sim", score: 3 }, { label: "Às vezes", score: 2 }, { label: "Não", score: 1 }] },
      { question: "Você gosta de seguir regras estabelecidas?", options: [{ label: "Sempre", score: 3 }, { label: "Quando necessário", score: 2 }, { label: "Quase nunca", score: 1 }] },
      { question: "Você se sente feliz apenas sendo quem é?", options: [{ label: "Sim", score: 3 }, { label: "Às vezes", score: 2 }, { label: "Nunca", score: 1 }] }
    ],
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
    gamificationText: "Parabéns por concluir a exploração do Inocente! Você acaba de dar o primeiro passo para resgatar a clareza sobre suas bases de segurança. O Inocente não é sobre ingenuidade, mas sobre a capacidade humana de manter a esperança ativa mesmo em tempos de incerteza. Ao identificar onde você deposita sua fé, você começa a diferenciar o otimismo saudável da negação paralisante. Este é um marco fundamental: sem a confiança básica do Inocente, a jornada do herói sequer começaria. Continue avançando para entender como a quebra dessa inocência nos prepara para o realismo necessário da vida adulta.",
    conclusionScript: `Você concluiu a exploração do Inocente. O Inocente em você é a base de onde brota a esperança e a capacidade de ver beleza no mundo. Honre essa parte de si, pois ela é o que lhe permite recomeçar sempre que necessário, com um coração aberto e fé no amanhã.`
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
    mentorship: "O Órfão é o arquétipo que surge quando a inocência é perdida. Ele é o realista, aquele que reconhece que o mundo pode ser cruel e que nem tudo é perfeito. A jornada do Órfão é de aceitação da vulnerabilidade. É aprender a viver com as cicatrizes e encontrar conexão através da empatia. O risco do Órfão é o vitimismo, a crença de que o mundo lhe deve algo. Ao transmutar essa dor, o Órfão se torna extremamente empático e resiliente, sendo capaz de entender o sofrimento dos outros e oferecer um apoio autêntico.",
    quiz: [
      { question: "Você sente que a vida foi injusta com você?", options: [{ label: "Frequentemente", score: 3 }, { label: "Às vezes", score: 2 }, { label: "Nunca", score: 1 }] },
      { question: "Você prefere estar sozinho a ser decepcionado?", options: [{ label: "Sim", score: 3 }, { label: "Às vezes", score: 2 }, { label: "Não", score: 1 }] },
      { question: "Você compreende facilmente a dor alheia?", options: [{ label: "Sim", score: 3 }, { label: "Às vezes", score: 2 }, { label: "Não", score: 1 }] },
      { question: "Você se sente parte de algum grupo?", options: [{ label: "Sempre", score: 1 }, { label: "Às vezes", score: 2 }, { label: "Nunca", score: 3 }] },
      { question: "Você protege seus sentimentos?", options: [{ label: "Sempre", score: 3 }, { label: "Às vezes", score: 2 }, { label: "Não", score: 1 }] }
    ],
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
    gamificationText: "A jornada pelo arquétipo do Órfão é, talvez, uma das mais desafiadoras e curativas. Ao encarar sua vulnerabilidade e as feridas de exclusão, você transmuta a dor em resiliência. O Órfão nos ensina o valor do realismo: o mundo não é perfeito, e as pessoas falham. Mas é justamente nessa imperfeição que encontramos a verdadeira conexão humana. Sua conclusão aqui indica que você está pronto para abandonar o papel de vítima e assumir a responsabilidade por sua própria proteção e pertencimento. O próximo passo exige força, e você acabou de forjar a armadura necessária.",
    conclusionScript: `A exploração do Órfão revelou suas feridas de abandono. Você aprendeu que a vulnerabilidade é, na verdade, sua maior porta para a conexão real com os outros. Ao aceitar suas feridas, você deixa de ser refém do passado e se torna o guardião resiliente da sua própria história.`
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
    mentorship: "O Guerreiro é a energia da ação. É o arquétipo que estabelece limites, foca no objetivo e tem coragem para enfrentar desafios. O Guerreiro entende que para realizar qualquer coisa, é preciso disciplina e determinação. O perigo é tornar-se agressivo demais ou ver a vida como uma guerra constante. O Guerreiro maduro sabe que sua força serve para proteger o que é valioso, e não para dominar. Ele integra a força física com a clareza de propósito, tornando-se um defensor da justiça e um realizador de mudanças concretas.",
    quiz: [
      { question: "Você se sente motivado por desafios?", options: [{ label: "Sempre", score: 3 }, { label: "Às vezes", score: 2 }, { label: "Não", score: 1 }] },
      { question: "Você estabelece limites claros para os outros?", options: [{ label: "Sempre", score: 3 }, { label: "Às vezes", score: 2 }, { label: "Nunca", score: 1 }] },
      { question: "Você se sente desconfortável com a passividade?", options: [{ label: "Sim", score: 3 }, { label: "Às vezes", score: 2 }, { label: "Não", score: 1 }] },
      { question: "Você prioriza resultados sobre processos?", options: [{ label: "Sempre", score: 3 }, { label: "Às vezes", score: 2 }, { label: "Nunca", score: 1 }] },
      { question: "Você se sente capaz de enfrentar o que for?", options: [{ label: "Sim", score: 3 }, { label: "Às vezes", score: 2 }, { label: "Dificilmente", score: 1 }] }
    ],
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
    gamificationText: "O Guerreiro despertou em você! Esta etapa marca sua transição da sobrevivência para a ação deliberada. Disciplina e coragem são agora suas ferramentas aliadas. Você explorou como seus limites são fundamentais para proteger seus valores e alcançar seus objetivos. O Guerreiro integrado não luta contra moinhos de vento, mas protege o que é sagrado. Ao concluir esta fase, você ganha a clareza de que sua força não precisa ser destrutiva para ser eficaz. Prepare-se, pois o poder agora será temperado pela compaixão na próxima etapa da sua evolução.",
    conclusionScript: `O Guerreiro em você é a força que impulsiona a mudança. Você descobriu que a verdadeira coragem não é a ausência de medo, mas a capacidade de agir com propósito a despeito dele. Use sua força para construir, proteger e realizar, tornando-se o herói das suas próprias conquistas.`
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
    mentorship: "O Altruísta é o arquétipo do cuidado e da compaixão. Ele encontra sentido em servir e ajudar os outros. O Altruísta tem uma enorme capacidade de empatia, mas seu grande desafio é aprender a equilibrar o dar com o cuidar de si mesmo. Sem esse equilíbrio, o Altruísta cai no martírio, onde se anula e espera que os outros reconheçam seu sacrifício, o que pode gerar culpa e ressentimento. Quando maduro, ele entende que o verdadeiro altruísmo começa com o amor próprio, permitindo que o cuidado flua naturalmente, sem cobranças ou dependência.",
    quiz: [
      { question: "Você prioriza as necessidades dos outros?", options: [{ label: "Sempre", score: 3 }, { label: "Às vezes", score: 2 }, { label: "Nunca", score: 1 }] },
      { question: "Você sente culpa ao tirar tempo para si mesmo?", options: [{ label: "Sim", score: 3 }, { label: "Às vezes", score: 2 }, { label: "Nunca", score: 1 }] },
      { question: "Você sente gratificação ao ajudar alguém?", options: [{ label: "Sempre", score: 3 }, { label: "Às vezes", score: 2 }, { label: "Dificilmente", score: 1 }] },
      { question: "Você sente responsabilidade pelo bem-estar alheio?", options: [{ label: "Sim", score: 3 }, { label: "Às vezes", score: 2 }, { label: "Não", score: 1 }] },
      { question: "Você tem dificuldade em dizer 'não'?", options: [{ label: "Sim", score: 3 }, { label: "Às vezes", score: 2 }, { label: "Não", score: 1 }] }
    ],
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
        question: "Como você se sente quando diz 'não' a alguém?",
        options: [
          { label: "Extremamente culpado.", score: 3 },
          { label: "Desconfortável, mas necessário.", score: 2 },
          { label: "Tranquilo, se for o meu limite.", score: 1 }
        ]
      }
    ],
    reflectionQuestion: "Onde você está se anulando para atender às necessidades dos outros?",
    mission: "Identifique hoje um momento em que você sentiu o impulso de 'salvar' alguém de um desconforto. Tente apenas observar o impulso sem agir.",
    gamificationText: "A exploração do Altruísta foi concluída, e com ela, o florescer da sua compaixão consciente. Servir aos outros é um ato nobre, mas você aprendeu o segredo vital: o auto-cuidado é o combustível do altruísmo sustentável. Se você se anula para salvar o mundo, logo não restará nada de você para oferecer. Integrar este arquétipo significa transitar do martírio para a generosidade empoderada. Você agora possui a sabedoria para saber quando cuidar e quando deixar que o outro trilhe seu próprio caminho de aprendizado. Sua jornada de desenvolvimento entra agora na fase de busca pela própria essência.",
    conclusionScript: `O Altruísta nos ensina o valor da compaixão e do serviço. Você descobriu que a generosidade mais potente é aquela que transborda de uma alma preenchida. Ao cuidar de si mesmo com a mesma dedicação que cuida dos outros, você se torna uma fonte inesgotável de amor e apoio consciente.`
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
    mentorship: "O Nômade é o arquétipo da busca. Ele deseja explorar o world e a si mesmo, em busca de liberdade e da sua própria verdade. É aquele que não aceita padrões prontos e busca encontrar seu próprio caminho. A inquietação do Nômade é o que o move para frente. O desafio é não se perder na busca infinita, fugindo de responsabilidades. O Nômade maduro entende que a liberdade real não é apenas geográfica, mas mental. Ele aprende a ser fiel a quem é, sem precisar de aprovação externa ou pertencer a estruturas limitantes.",
    quiz: [
      { question: "Você sente necessidade constante de mudar algo na sua vida?", options: [{ label: "Sim", score: 3 }, { label: "Às vezes", score: 2 }, { label: "Nunca", score: 1 }] },
      { question: "Você valoriza a sua independência acima de tudo?", options: [{ label: "Sim", score: 3 }, { label: "Às vezes", score: 2 }, { label: "Não", score: 1 }] },
      { question: "Você questiona as normas sociais?", options: [{ label: "Sempre", score: 3 }, { label: "Às vezes", score: 2 }, { label: "Dificilmente", score: 1 }] },
      { question: "Você se sente confortável na incerteza?", options: [{ label: "Sim", score: 3 }, { label: "Às vezes", score: 2 }, { label: "Não", score: 1 }] },
      { question: "Você busca experiências novas?", options: [{ label: "Sempre", score: 3 }, { label: "Às vezes", score: 2 }, { label: "Nunca", score: 1 }] }
    ],
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
    gamificationText: "O Buscador em você encontrou um novo horizonte! Ao concluir o arquétipo do Nômade, você validou sua necessidade intrínseca de autonomia e autenticidade. Escapar das 'prisões' mentais e expectativas alheias não é um ato de rebeldia, mas de fidelidade à própria alma. O Nômade nos ensina que a jornada é constante e que a liberdade real começa dentro de nós. Você está agora mais próximo de quem realmente é, despido de máscaras sociais impostas. A busca externa se volta agora para dentro, onde a verdadeira transformação mágica está prestes a acontecer.",
    conclusionScript: `O Nômade em você é o eterno buscador da verdade. Você aprendeu que a verdadeira liberdade não é fugir, mas ser capaz de permanecer fiel à sua essência em qualquer lugar. Ao abraçar sua autenticidade, você se torna o guia da sua própria expedição pela vida.`
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
    mentorship: "O Mago é o arquétipo da transformação profunda. Ele compreende que o mundo externo é um reflexo do estado interno. Sua força não está na manipulação das coisas, mas na clareza da visão e no alinhamento com as leis da vida. O Mago sabe que a consciência muda a realidade. O risco do Mago é a arrogância, acreditar que é superior ou que pode controlar o destino. Quando maduro, ele é um catalisador de mudanças, alguém que traz sabedoria e transformação para sua vida e para o ambiente à sua volta, agindo em sintonia com o fluxo da existência.",
    quiz: [
      { question: "Você acredita que suas escolhas criam sua realidade?", options: [{ label: "Sim, plenamente", score: 3 }, { label: "Às vezes", score: 2 }, { label: "Não acredito", score: 1 }] },
      { question: "Você confia na sua intuição?", options: [{ label: "Sempre", score: 3 }, { label: "Às vezes", score: 2 }, { label: "Nunca", score: 1 }] },
      { question: "Você sente conexão com algo maior?", options: [{ label: "Sempre", score: 3 }, { label: "Às vezes", score: 2 }, { label: "Nunca", score: 1 }] },
      { question: "Você busca entender os padrões invisíveis da vida?", options: [{ label: "Sempre", score: 3 }, { label: "Às vezes", score: 2 }, { label: "Nunca", score: 1 }] },
      { question: "Você se sente capaz de transmutar seus desafios?", options: [{ label: "Sim", score: 3 }, { label: "Às vezes", score: 2 }, { label: "Não", score: 1 }] }
    ],
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
    gamificationText: "O Mago concluiu sua obra! Você atingiu o ápice da integração arquétipica. Aprender que a realidade é cocriada por sua consciência é o maior poder que um herói pode deter. O Mago não manipula as circunstâncias, ele alinha seu estado interno para que a magia da vida flua sem obstruções. Ao transmutar dor em aprendizado e medo em amor, você se torna o alquimista do seu destino. Toda a sua jornada até aqui preparou você para este momento de plena consciência. Você não é mais apenas um passageiro da sua vida, mas o seu arquiteto consciente.",
    conclusionScript: `O Mago é o ápice da integração. Você aprendeu que a realidade externa é um reflexo do seu estado interno. O poder do Mago não é o controle, mas o alinhamento. Ao mudar sua percepção, você muda seu mundo. A magia acontece na intersecção entre a intenção clara e a entrega confiante. Você é o alquimista da sua própria vida; use sua sabedoria para transformar chumbo em ouro, dor em aprendizado e medo em amor.`
  }
};