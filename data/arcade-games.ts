export const arcadeGames = [
  { id: 'reto-mixto', name: 'Reto Mixto', description: 'Todo en uno.', kind: 'mixed', skill: 'Desafío acumulativo', cover: '/images/games/covers/reto-mixto.webp' },
  { id: 'vocabulario-mix', name: 'Vocabulario Mix', description: 'Recuerda, revela y autoevalúa.', kind: 'vocabulary', skill: 'Recuerdo autoevaluado', cover: '/images/games/covers/vocabulario-mix.webp' },
  { id: 'hora', name: '¿Qué hora es?', description: '现在几点？', kind: 'time', skill: 'Escucha y construye la hora', cover: '/images/games/covers/que-hora-es.webp' },
  { id: 'escena-viva', name: 'Escena Viva', description: 'Observa, construye y responde.', kind: 'scene', skill: 'Vocabulario y estructuras', cover: null },
  { id: 'conversacion', name: 'Conversación', description: 'Habla con personajes y completa diálogos.', kind: 'conversation', skill: 'Interacción y preguntas', cover: null },
  { id: 'hanzi-lab', name: 'Hanzi Lab', description: 'Escucha, reconoce, construye y escribe.', kind: 'hanzi', skill: 'Sonido, forma y escritura', cover: null },
  { id: 'historia-detective', name: 'Historia Detective', description: 'Lee, investiga y encuentra la respuesta.', kind: 'story', skill: 'Lectura y evidencia', cover: null },
] as const;
export const ARCADE_GAME_COUNT = arcadeGames.length;
