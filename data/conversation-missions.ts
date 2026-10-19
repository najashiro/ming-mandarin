import type { CurriculumScope } from './types';
import { cleanChinese, gamesContent, type ConversationChallenge } from './games-curriculum';

type MissionTurn = {
  conversationId: string;
  task: string;
  feedback: string;
  distractorSentenceIds: string[];
};

type MissionDefinition = {
  id: string;
  lesson: 1 | 2 | 3;
  title: string;
  role: string;
  partner: string;
  objective: string;
  facts: string[];
  turns: MissionTurn[];
};

// Role cards are pedagogical framing in Spanish. All Chinese, readings and
// accepted responses resolve from the existing curriculum, without new keys.
export const conversationMissionDefinitions: MissionDefinition[] = [
  {
    id: 'presentacion', lesson: 1, title: 'Tu primera presentación',
    role: 'Ma Dawei', partner: 'Un nuevo compañero',
    objective: 'Saludar, presentarte y devolver una expresión de cortesía.',
    facts: ['Nombre: Ma Dawei.', 'Hablas con una sola persona que acabas de conocer.'],
    turns: [
      { conversationId: 'rm-conv-l1-hello', task: 'Devuelve el saludo con un saludo.', feedback: 'Responde al saludo antes de presentarte. En este turno hablas con una sola persona.', distractorSentenceIds: ['s-please-enter', 's-thanks'] },
      { conversationId: 'rm-conv-l1-name', task: 'Preséntate con el nombre de tu papel.', feedback: 'Te preguntan cómo te llamas. Usa el nombre Ma Dawei y el modelo con 叫 del diálogo.', distractorSentenceIds: ['s-surname', 's-good-you'] },
      { conversationId: 'rm-conv-l1-meet', task: 'Devuelve la cortesía: a ti también te alegra conocerle.', feedback: 'El modelo añade 也 para expresar «también» y devolver la cortesía de tu compañero.', distractorSentenceIds: ['s-busy', 's-please-sit'] },
    ],
  },
  {
    id: 'reencuentro', lesson: 1, title: 'Un reencuentro',
    role: 'Un estudiante que se encuentra bien', partner: 'Un compañero conocido',
    objective: 'Responder a una pregunta sobre cómo estás.',
    facts: ['Estado de ánimo: te encuentras bien.'],
    turns: [{ conversationId: 'rm-conv-l1-recent', task: 'Cuenta cómo estás; puedes devolver la pregunta.', feedback: 'La respuesta debe describir tu estado. El modelo completo usa 呢 para devolver la pregunta; también se admite la respuesta breve del diálogo.', distractorSentenceIds: ['s-busy', 's-he-too-good'] }],
  },
  {
    id: 'nacionalidad', lesson: 2, title: 'De dónde eres',
    role: 'Un estudiante estadounidense', partner: 'Un compañero de clase',
    objective: 'Responder sobre tu nacionalidad.',
    facts: ['País de origen: Estados Unidos.'],
    turns: [{ conversationId: 'rm-conv-l2-country', task: 'Indica la nacionalidad de tu papel.', feedback: 'La pregunta pide el país de origen. Distingue nacionalidad, lugar de estudio y lugar de origen de los padres.', distractorSentenceIds: ['s-l2-study', 's-l2-parents'] }],
  },
  {
    id: 'apellido', lesson: 2, title: 'Una presentación cortés',
    role: 'Song Hua', partner: 'Una persona que se presenta con cortesía',
    objective: 'Responder a una pregunta cortés sobre tu apellido.',
    facts: ['Apellido: Song.', 'Nombre completo: Song Hua.'],
    turns: [{ conversationId: 'rm-conv-l2-surname', task: 'Da tu apellido; puedes añadir tu nombre.', feedback: '贵姓 pregunta por el apellido. El modelo usa 姓; la versión breve con el apellido también es válida.', distractorSentenceIds: ['s-l2-american', 's-l2-study'] }],
  },
  {
    id: 'saludo-clase', lesson: 2, title: 'Saluda a tu clase',
    role: 'El profesor Chen', partner: 'Un grupo de estudiantes',
    objective: 'Responder a un saludo dirigido al profesor.',
    facts: ['Te saluda un grupo, no una sola persona.'],
    turns: [{ conversationId: 'rm-conv-l2-morning', task: 'Devuelve el saludo a todo el grupo.', feedback: 'Hablas a varios estudiantes. El modelo usa 你们 para dirigirse al grupo.', distractorSentenceIds: ['s-l2-morning', 's-l2-introduce'] }],
  },
  {
    id: 'familia', lesson: 3, title: 'Habla de tu familia',
    role: 'Un estudiante que presenta a su familia', partner: 'Un compañero de clase',
    objective: 'Contar cuántas personas hay en tu familia y explicar la profesión de tu padre.',
    facts: ['Personas en la familia: 4.', 'Profesión del padre: médico.'],
    turns: [
      { conversationId: 'rm-conv-l3-family', task: 'Responde cuántas personas hay en tu familia.', feedback: 'La pregunta pide el tamaño de la familia. Usa los datos de tu papel; el modelo emplea 口 como clasificador familiar.', distractorSentenceIds: ['s-l3-six', 's-l3-two-sisters'] },
      { conversationId: 'rm-conv-l3-work', task: 'Explica a qué se dedica tu padre.', feedback: 'La pregunta pide una profesión. El modelo relaciona al padre con su profesión mediante 是.', distractorSentenceIds: ['s-l3-four', 's-l3-no-sister'] },
    ],
  },
  {
    id: 'hermanas', lesson: 3, title: 'Tus hermanas',
    role: 'Un estudiante con dos hermanas mayores', partner: 'Un compañero que pregunta por tu familia',
    objective: 'Añadir información sobre tus hermanas.',
    facts: ['Hermanas mayores: 2.'],
    turns: [{ conversationId: 'rm-conv-l3-sisters', task: 'Añade qué hermanas tienes.', feedback: 'El modelo expresa posesión con 有 y la cantidad con 两个. 姐姐 se refiere a una hermana mayor.', distractorSentenceIds: ['s-l3-no-sister', 's-l3-four'] }],
  },
];

export function isConversationResponseAccepted(challenge: ConversationChallenge, answer: string) {
  const normalized = cleanChinese(answer);
  return [challenge.answer.hanzi, ...challenge.acceptedResponses].some(value => cleanChinese(value) === normalized);
}

export function conversationMissionsForScope(scope: CurriculumScope) {
  const content = gamesContent(scope);
  return conversationMissionDefinitions.filter(mission => content.definition.lessonIds.includes(mission.lesson)).flatMap(mission => {
    const turns = mission.turns.flatMap(turn => {
      const challenge = content.conversations.find(item => item.id === turn.conversationId);
      if (!challenge) return [];
      const distractors = turn.distractorSentenceIds.flatMap(id => {
        const sentence = content.sentences.find(item => item.id === id);
        return sentence && !isConversationResponseAccepted(challenge, sentence.hanzi) ? [sentence.hanzi] : [];
      });
      return [{ ...turn, challenge, choices: [...new Set([challenge.answer.hanzi, ...distractors])] }];
    });
    // Do not publish an incomplete sequence if its source dialogue is absent.
    return turns.length === mission.turns.length ? [{ ...mission, turns }] : [];
  });
}

export type ConversationMission = ReturnType<typeof conversationMissionsForScope>[number];
