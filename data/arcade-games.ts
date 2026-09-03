import type { Exercise } from '@/data/types';

export type ArcadeGame = { id: string; name: string; description: string; dimension?: Exercise['dimension'] | 'all'; kind?: 'listen' | 'hanzi-listen' | 'hanzi'; hanziIndex?: 19 | 20 | 21 | 22 };

export const arcadeGames: ArcadeGame[] = [
  { id:'flashcards',name:'Flashcards',description:'Recupera hanzi, pinyin, audio y significado.',dimension:'meaning' },
  { id:'dictation',name:'Dictado',description:'Escribe el pinyin con su marca tonal.',dimension:'pinyin' },
  { id:'listen-recognize',name:'Escucha y reconoce',description:'Identifica el hanzi únicamente por su sonido.',kind:'listen' },
  { id:'hanzi-dictation',name:'Dictado Hanzi',description:'Escucha una lectura y elige el carácter correcto.',kind:'hanzi-listen' },
  { id:'memory',name:'Memory Match',description:'Forma parejas entre representaciones.',dimension:'meaning' },
  { id:'speed',name:'Speed Match',description:'Responde tantas tarjetas como puedas.',dimension:'pinyin' },
  { id:'who',name:'¿Quién es quién?',description:'Investiga a los personajes del diálogo.',dimension:'reading' },
  { id:'states',name:'Estados visuales',description:'Construye frases sobre estados.',dimension:'production' },
  { id:'sentences',name:'Constructor de oraciones',description:'Ordena los bloques con precisión.',dimension:'grammar' },
  { id:'train',name:'Tren de palabras',description:'Haz salir el tren con el orden correcto.',dimension:'grammar' },
  { id:'error',name:'Encuentra el error',description:'Corrige una estructura de la lección.',dimension:'grammar' },
  { id:'meeting',name:'Primer encuentro',description:'Completa una presentación.',dimension:'production' },
  { id:'recent',name:'¿Cómo has estado?',description:'Elige una respuesta natural.',dimension:'production' },
  { id:'listen-select',name:'Escucha y selecciona',description:'Identifica lo que oyes.',dimension:'tone' },
  { id:'true-false',name:'Verdadero o falso',description:'Comprueba una afirmación auditiva.',dimension:'reading' },
  { id:'word-dictation',name:'Dictado de palabras',description:'Recupera el hanzi por su sonido.',dimension:'meaning' },
  { id:'dialogue',name:'Diálogo + comprensión',description:'Escucha y localiza un hecho.',dimension:'reading' },
  { id:'shadowing',name:'Shadowing',description:'Escucha a 0.7×, 0.85× o 1× y repite.',dimension:'tone' },
  { id:'zcs',name:'Z–C–S Radar',description:'Distingue las tres iniciales.',dimension:'tone' },
  { id:'snake',name:'Serpiente S',description:'Sigue solamente las sílabas con s.',dimension:'tone' },
  { id:'aspiration',name:'C aspirada',description:'Reconoce la expulsión de aire.',dimension:'tone' },
  { id:'stroke-dojo',name:'Dojo de trazos',description:'Cuenta trazos de caracteres.',kind:'hanzi',hanziIndex:19 },
  { id:'character-builder',name:'Constructor de caracteres',description:'Une componentes respaldados.',kind:'hanzi',hanziIndex:20 },
  { id:'radical',name:'Radical Lab',description:'Identifica radicales y componentes.',kind:'hanzi',hanziIndex:21 },
  { id:'reveal',name:'Hanzi Reveal',description:'Adivina el carácter pronto.',kind:'hanzi',hanziIndex:22 },
  { id:'detective',name:'Reading Detective',description:'Encuentra la evidencia del texto.',dimension:'reading' },
  { id:'questions',name:'Formular preguntas',description:'Crea la pregunta para la respuesta.',dimension:'production' },
  { id:'join-dialogues',name:'Unir diálogos',description:'Empareja pregunta y respuesta.',dimension:'production' },
  { id:'word-search',name:'Sopa de caracteres',description:'Localiza palabras estudiadas.',dimension:'meaning' },
  { id:'boss',name:'Boss Battle',description:'Diez retos mezclados; un error no reinicia.',dimension:'all' },
];

export const ARCADE_GAME_COUNT = arcadeGames.length;
