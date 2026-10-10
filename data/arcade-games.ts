export const arcadeGames = [
  { id: 'reto-mixto', name: 'Reto Mixto', description: 'Relaciona imágenes, sonidos y palabras. Revisa tus errores al terminar.', kind: 'mixed', skill: 'Repaso de habilidades', cover: '/images/games/covers/reto-mixto.webp' },
  { id: 'vocabulario-mix', name: 'Vocabulario Mix', description: 'Recuerda una palabra antes de revelarla y decide si necesitas volver a practicarla.', kind: 'vocabulary', skill: 'Memoria y vocabulario', cover: '/images/games/covers/vocabulario-mix.webp' },
  { id: 'hora', name: '¿Qué hora es?', description: 'Lee el reloj y construye la hora en chino. Empieza sin cronómetro.', kind: 'time', skill: 'Práctica de horarios', cover: '/images/games/covers/que-hora-es.webp' },
  { id: 'panda-quest', name: 'Panda Quest', description: 'Abre camino en chino y ayuda al panda a volver a casa.', kind: 'quest', skill: 'Aventura acumulativa · Lecciones 1–4', cover: null },
  { id: 'escena-viva', name: 'Escena Viva', description: 'Observa una situación y elige, construye o escribe la frase que la describe.', kind: 'scene', skill: 'Frases en contexto', cover: null },
  { id: 'conversacion', name: 'Conversación', description: 'Escucha una pregunta y completa el diálogo con la respuesta adecuada.', kind: 'conversation', skill: 'Comprensión y respuesta', cover: null },
  { id: 'hanzi-lab', name: 'Hanzi Lab', description: 'Relaciona sonido y carácter. Explora sus partes y practica sus trazos.', kind: 'hanzi', skill: 'Caracteres y escritura', cover: null },
  { id: 'historia-detective', name: 'Historia Detective', description: 'Lee las escenas y encuentra la frase que contiene la información que buscas.', kind: 'story', skill: 'Comprensión lectora', cover: null },
] as const;
export const ARCADE_GAME_COUNT = arcadeGames.length;
