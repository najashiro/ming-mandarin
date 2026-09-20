export const arcadeGames = [
  { id: 'reto-mixto', name: 'Reto Mixto', description: 'Todo en uno.', kind: 'mixed', skill: 'Desafío acumulativo' },
  { id: 'escena-viva', name: 'Escena Viva', description: 'Observa, construye y responde.', kind: 'scene', skill: 'Vocabulario y estructuras' },
  { id: 'conversacion', name: 'Conversación', description: 'Habla con personajes y completa diálogos.', kind: 'conversation', skill: 'Interacción y preguntas' },
  { id: 'hanzi-lab', name: 'Hanzi Lab', description: 'Escucha, reconoce, construye y escribe.', kind: 'hanzi', skill: 'Sonido, forma y escritura' },
  { id: 'historia-detective', name: 'Historia Detective', description: 'Lee, investiga y encuentra la respuesta.', kind: 'story', skill: 'Lectura y evidencia' },
] as const;
export const ARCADE_GAME_COUNT = arcadeGames.length;
