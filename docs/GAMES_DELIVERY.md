# Entrega: cinco experiencias de Juegos Míng

## Resultado

Juegos Míng presenta cinco experiencias principales, en este orden: **Reto Mixto**, **Escena Viva**, **Conversación**, **Hanzi Lab** e **Historia Detective**. Cada una tiene una mecánica distinta. Las herramientas Flashcards y Shadowing siguen accesibles fuera del catálogo de juegos. El inventario previo, los duplicados y su destino se detallan en [GAMES_AUDIT.md](GAMES_AUDIT.md).

| Experiencia | Mecánica y progresión | Habilidad vinculada al examen |
| --- | --- | --- |
| Reto Mixto | Desafío acumulativo original | Repaso integrado |
| Escena Viva | Escena, elementos seleccionables, bloques y producción | Vocabulario contextual, estructuras y producción escrita |
| Conversación | Personajes, globos, respuesta e inversión de pregunta | Completar diálogos, pregunta/respuesta y formular preguntas |
| Hanzi Lab | Audio, significado, radical, componentes, trazos revelados y escritura | Dictado, Hanzi, radicales, componentes y discriminación |
| Historia Detective | Cuatro escenas de lectura, personajes y búsqueda de evidencia | Comprensión lectora con preguntas y producción |

Reconocer, Construir y Producir son niveles internos. Las sesiones evitan repetir inmediatamente una ronda cuando existe un conjunto suficiente y vuelven a presentar más adelante los errores. El contenido se selecciona según el alcance curricular de la URL.

## Juegos retirados y capacidades conservadas

Se retiraron como **tarjetas independientes** las 30 entradas anteriores distintas de Reto Mixto. Esto incluye Memory Match, Speed Match, ¿Quién es quién?, Estados visuales, Constructor de oraciones, Tren de palabras, Encuentra el error, Primer encuentro, ¿Cómo has estado?, Verdadero o falso, Dictado de palabras, Diálogo + comprensión, los tres juegos Z–C–S, Dojo de trazos, Constructor de caracteres, Radical Lab, Hanzi Reveal, Reading Detective, Formular preguntas, Unir diálogos, Sopa de caracteres y Boss Battle. El [inventario completo con los 31 nombres, habilidad, motor y destino](GAMES_AUDIT.md#inventario-previo-y-destino) incluye también Dictado, Escucha y reconoce, Dictado Hanzi y Escucha y selecciona.

- Reconocimiento visual, estados, familias, comida y construcción de frases → Escena Viva.
- Respuestas naturales, diálogos, inversión pregunta/respuesta → Conversación.
- Audio, pinyin, dictado, radicales, componentes, revelado y trazos → Hanzi Lab, reutilizando los motores originales de audio y escritura.
- Comprensión, personajes, verdadero/falso y localización de evidencia → Historia Detective.
- Flashcards → herramienta de repaso; Shadowing → herramienta de escucha/pronunciación. La página de fonética original sigue disponible.
- Boss Battle → retirado; Reto Mixto conserva el desafío acumulativo.

## Corpus y protección curricular

Se revisaron los 19 PDF locales (498 páginas) de libros/cuadernos L1–L3, presentaciones 1.1/2.1/2.2/3.1, ocho unidades Hanzi, materiales de fonética y el **Examen Parcial Básico 2 Instituto Confucio**. Se inspeccionaron visualmente sus cuatro páginas. El examen guio la selección de dictado, radicales, componentes, diálogos, formación de preguntas y lectura. Los textos chinos de las nuevas rondas provienen de frases y diálogos ya auditados en `seed/curriculum.ts`, `seed/sentences.ts` y `data/reto-mixto.ts`, con referencia interna a la fuente; no se importó vocabulario ajeno al alcance. Las mini-historias enlazan cuatro frases del corpus autorizado.

## Archivos

**Creados:** `data/games-curriculum.ts`; `lib/games-session.ts`, `lib/games-hanzi-progress.ts`; `components/games/games.css`, `StudyTools.tsx`, `shared/AnswerBlocks.tsx`, `shared/GameFeedback.tsx`, `shared/GameSession.tsx`, `live-scene/SceneCard.tsx`, `live-scene/LiveSceneGame.tsx`, `conversation/ConversationGame.tsx`, `hanzi-lab/WordListening.tsx`, `hanzi-lab/HanziLabGame.tsx`, `story-detective/StoryDetective.tsx`; `tests/unit/games.test.ts`, `tests/e2e/games.spec.ts`, `tests/fixtures/reto-mixto-baseline.json`; `docs/GAMES_AUDIT.md`, este informe y cinco capturas en `docs/games-mobile/`.

**Modificados:** `README.md`, `app/globals.css`, `app/lesson/1/games/page.tsx`, `app/study/[scope]/games/page.tsx`, `components/Arcade.tsx`, `data/arcade-games.ts`, `playwright.config.ts`, `tests/e2e/public.spec.ts`.

**Eliminado:** `components/hanzi/HanziArcade.tsx`, reemplazado por Hanzi Lab. No se alteraron tablas ni datos persistidos de Hanzi.

## Analytics, progreso y audio

Se mantienen `game_started`, `game_completed` y `exercise_completed` con acierto/error. El identificador del ejercicio codifica juego, alcance, nivel, modalidad y contenido, de modo que se puedan analizar fallos por estructura y Hanzi. La escritura Hanzi guarda el progreso con la API existente y con el respaldo local disponible para visitantes o caídas de red. El audio usa recursos existentes, se activa tras gesto del alumno y admite rechazo de reproducción en Safari sin interrumpir la ronda.

## Verificación

La comprobación previa a la reestructuración aprobó las 10 pruebas de unidad de Reto Mixto. Una nueva prueba compara SHA-256 de sus cuatro archivos centrales con la referencia inicial. Las pruebas de navegador incluyen el flujo original de escritura y navegación Hanzi de Reto Mixto, además de las cinco experiencias, touch, audio y tamaños 320, 375, 390 y 430 px. La verificación en WebKit es emulada; queda pendiente una comprobación en iPhone físico.

| Comprobación | Resultado final |
| --- | --- |
| `npm run lint` | Aprobado, sin errores ni advertencias |
| `npm run typecheck` | Aprobado |
| `npm test` | 147/147 aprobadas (11 archivos) |
| `npm run build` | Aprobado; 44 páginas estáticas generadas |
| `node scripts/run-e2e.mjs games.spec.ts reto-share.spec.ts hanzi-writing.spec.ts public.spec.ts --workers=2` | 85 aprobadas, 4 omitidas por condiciones existentes de la suite; Chromium, móvil y WebKit |

## Capturas móviles

Capturas reales de WebKit emulado a 390 px: [Juegos](games-mobile/hub-390.png), [Escena Viva](games-mobile/escena-viva-390.png), [Conversación](games-mobile/conversacion-390.png), [Hanzi Lab](games-mobile/hanzi-lab-390.png), [Historia Detective](games-mobile/historia-detective-390.png). También se verificaron 320, 375 y 430 px. El catálogo muestra cinco tarjetas grandes; Escena Viva ofrece escena y elementos táctiles; Conversación muestra personajes y globos; Hanzi Lab centra el carácter y sus modos; Historia Detective dispone paneles de historia y evidencia. No hay desbordamiento horizontal en los tamaños probados y los controles táctiles relevantes alcanzan aproximadamente 44 px.

**Reto Mixto no fue modificado funcionalmente.** Sus archivos centrales, canvas, reglas, audio, preguntas, puntuación y pruebas originales se conservan.
