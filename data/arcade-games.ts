export const arcadeGames = [
  { id: 'direcciones', name: 'Una llamada, mil vueltas', description: 'Tu amigo se ha perdido. Guíalo en chino por seis laberintos, esquiva agujeros y encuentra su destino.', kind: 'directions', skill: 'Direcciones · Lección 06', cover: '/images/games/covers/directions.svg' },
  { id: 'reto-mixto', name: 'Reto Mixto', description: 'Relaciona imágenes, sonidos y palabras. Revisa tus errores al terminar.', kind: 'mixed', skill: 'Repaso de habilidades', cover: '/images/games/covers/reto-mixto.webp' },
  { id: 'vocabulario-mix', name: 'Vocabulario Mix', description: 'Recuerda una palabra antes de revelarla y decide si necesitas volver a practicarla.', kind: 'vocabulary', skill: 'Memoria y vocabulario', cover: '/images/games/covers/vocabulario-mix.webp' },
  { id: 'hora', name: '¿Qué hora es?', description: 'Lee el reloj y construye la hora en chino. Empieza sin cronómetro.', kind: 'time', skill: 'Práctica de horarios', cover: '/images/games/covers/que-hora-es.webp' },
  { id: 'conversacion', name: 'Conversación', description: 'Asume un papel y completa el diálogo en una misión guiada. Practica con opciones, bloques o de memoria.', kind: 'conversation', skill: 'Roles y comunicación', cover: null },
  { id: 'hanzi-lab', name: 'Hanzi Lab', description: 'Escucha, reconoce y escribe caracteres. Revisa tus errores y distingue la práctica guiada del recuerdo.', kind: 'hanzi', skill: 'Caracteres y escritura', cover: null },
  { id: 'cumpleanos', name: 'Organiza el cumpleaños', description: 'Practica fechas, regalos y felicitaciones. Reconoce, construye y recuerda las frases de la lección 5.', kind: 'birthday', skill: 'Fechas y comunicación', cover: null },
  { id: 'escondites', name: '¿Dónde se escondió?', description: 'Sigue pistas en chino, encuentra animales y llega a 100 puntos. Dos intentos, cuatro amigos y un jardín por explorar.', kind: 'hide-and-seek', skill: 'Ubicaciones · Lección 06', cover: '/images/games/covers/escondites.svg' },
] as const;
export const ARCADE_GAME_COUNT = arcadeGames.length;
