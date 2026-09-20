# Auditoría y reestructuración de Juegos Míng

## Decisión arquitectónica

El catálogo anterior tenía 31 entradas. Salvo Reto Mixto, ListenAndRecognize y escritura/revelado, las etiquetas reutilizaban un formulario por dimensión: no existían motores propios de memory, tren, serpiente o búsqueda. Radical y componentes mostraban respuestas y un enlace, no un reto. Se sustituyen por cuatro motores y se conserva Reto Mixto sin cambios.

## Inventario previo y destino

| Juego anterior | Motor / habilidad efectiva | Decisión |
| --- | --- | --- |
| Reto Mixto (`reto-mixto`) | RetoMixto + RetoMixtoVisual + lib/reto-mixto | Conservar intacto, primero |
| Flashcards (`flashcards`) | Arcade: formulario compartido / meaning | Herramientas de repaso fuera del catálogo |
| Dictado (`dictation`) | Arcade: formulario compartido / pinyin | Hanzi Lab: palabras / pinyin / audio |
| Escucha y reconoce (`listen-recognize`) | ListenAndRecognize + MP3 | Hanzi Lab: Audio / Palabras |
| Dictado Hanzi (`hanzi-dictation`) | ListenAndRecognize + MP3 | Hanzi Lab: Audio / Palabras |
| Memory Match (`memory`) | Arcade: formulario compartido / significado; no había memoria de pares | Reconocimiento visual en Escena Viva; tarjeta eliminada |
| Speed Match (`speed`) | Arcade: formulario compartido / pinyin; no había cronómetro | Recuperación en Hanzi Lab; tarjeta eliminada |
| ¿Quién es quién? (`who`) | Arcade: formulario compartido / reading | Historia Detective: personajes y evidencia |
| Estados visuales (`states`) | Arcade: formulario compartido / production | Escena Viva: ilustración del estado y producción |
| Constructor de oraciones (`sentences`) | Arcade: formulario compartido / grammar | Escena Viva: bloques táctiles |
| Tren de palabras (`train`) | Arcade: mismo formulario / grammar | Escena Viva: construcción de frases |
| Encuentra el error (`error`) | Arcade: mismo formulario / grammar | Feedback y repetición adaptativa de los cuatro motores |
| Primer encuentro (`meeting`) | Arcade: formulario compartido / production | Conversación: personajes y globos |
| ¿Cómo has estado? (`recent`) | Arcade: formulario compartido / production | Conversación: respuesta contextual |
| Escucha y selecciona (`listen-select`) | Arcade: formulario compartido / tone | Hanzi Lab: palabras / pinyin / audio |
| Verdadero o falso (`true-false`) | Arcade: formulario compartido / reading | Historia Detective: verificar frases del relato mediante evidencia |
| Dictado de palabras (`word-dictation`) | Arcade: formulario compartido / meaning | Hanzi Lab: palabras / pinyin / audio |
| Diálogo + comprensión (`dialogue`) | Arcade: formulario compartido / reading | Conversación: diálogo con audio y respuesta natural |
| Shadowing (`shadowing`) | Arcade: formulario compartido / tone | Herramientas de repaso fuera del catálogo |
| Z–C–S Radar (`zcs`) | Arcade: formulario compartido / tone | Fonética existente /lesson/1/pinyin; dictado pinyin en Hanzi Lab |
| Serpiente S (`snake`) | Arcade: formulario compartido / tone | Fonética existente /lesson/1/pinyin; dictado pinyin en Hanzi Lab |
| C aspirada (`aspiration`) | Arcade: formulario compartido / tone | Fonética existente /lesson/1/pinyin; dictado pinyin en Hanzi Lab |
| Dojo de trazos (`stroke-dojo`) | HanziArcade: HanziWriterStage | Hanzi Lab |
| Constructor de caracteres (`character-builder`) | HanziArcade: texto y enlace sin desafío | Hanzi Lab |
| Radical Lab (`radical`) | HanziArcade: texto y enlace sin desafío | Hanzi Lab |
| Hanzi Reveal (`reveal`) | HanziArcade: HanziStrokeSvg | Hanzi Lab |
| Reading Detective (`detective`) | Arcade: formulario compartido / reading | Historia Detective: relato de cuatro escenas y búsqueda de evidencia |
| Formular preguntas (`questions`) | Arcade: formulario compartido / production | Conversación: inversión respuesta → pregunta |
| Unir diálogos (`join-dialogues`) | Arcade: formulario compartido / production | Conversación: relación pregunta/respuesta |
| Sopa de caracteres (`word-search`) | Arcade: formulario compartido / meaning; no había cuadrícula | Hanzi Lab: identificación visual y revelado |
| Boss Battle (`boss`) | Arcade: formulario compartido / all | Retirado: Reto Mixto ya cubre acumulación |

## Fuentes

Se inventariaron y extrajeron los 19 PDF locales (498 páginas): los libros y cuadernos L1–L3, cuatro presentaciones curriculares, ocho fichas Hanzi, dos presentaciones de fonética y el examen. El examen escaneado se renderizó y se revisaron sus cuatro páginas; la extracción de libros escaneados no es fuente textual fiable. Se reutiliza su transcripción ya auditada en seed/curriculum.ts, seed/sentences.ts y docs/SOURCE_AUDIT_L1_L3.md. Las fichas conservan su clasificación curricular existente.

El examen prioriza: p1 dictado y radicales con significado; p1–2 discriminación gráfica; p2 emparejar diálogos; p3 preguntas y completar conversaciones; p4 traducción y comprensión con cinco preguntas. No se incorporan automáticamente ejemplos del examen que no formen parte del alcance curricular existente (por ejemplo, 比萨饼).

Los nuevos modelos guardan referencias de origen por frase y conversación. Los cuentos son montajes didácticos de cuatro frases originales del mismo alcance, sin añadir frases chinas inventadas. Se usan metadatos y recursos estáticos de data/reto-mixto.ts en lectura solamente; ese archivo no se modifica.

## Implementación

- Cinco tarjetas con identidad visual; Reto Mixto primero y mismo componente/propiedades de montaje.
- Escena Viva: conteo de personas, fotografía revelable, platos seleccionables, reconocer/construir/producir.
- Conversación: dos personajes, globos, audio y respuesta o intervención inversa; opciones, bloques o texto.
- Hanzi Lab: audio de caracteres, palabras y pinyin, significado, radical auditado, componentes auditados, revelado y escritura con HanziWriterStage existente.
- Historia Detective: cuatro escenas por historia, selección de evidencia, reconstrucción y producción vinculadas al texto.
- Flashcards reales con reverso y shadowing con 0.7×/0.85×/1×; se conserva además la página de fonética original.
- Sesiones cortas finitas con repetición diferida de errores, sin puntuación duplicada por doble clic. El nivel sube cada dos rondas acertadas y baja tras un error; selección manual disponible.
- No hay librerías nuevas, generación de voz ni modificación de fuentes, canvas o CSS de Reto Mixto.

## Analytics y progreso

Se mantienen los eventos y las tablas actuales. game_started y game_completed comparten ID de juego/alcance. exercise_completed conserva correct boolean (true/false) y codifica juego, scope, difficulty_level, modalidad y content_id en el campo persistido contentId. lib/games-session.ts proporciona un parser explícito. No se almacenan respuestas escritas por el alumno. Hanzi escribe en la API existente y usa updateLocalHanziProgress como fallback para visitantes o error de red, preservando el resto del mapa local.

## Protección de Reto Mixto

Antes del cambio: 10 pruebas de unidad aprobadas. Se registraron SHA-256 de components/RetoMixto.tsx, components/RetoMixtoVisual.tsx, data/reto-mixto.ts y lib/reto-mixto.ts. Una prueba exige igualdad byte a byte. No se editan componentes de escritura, navegación ni audio compartidos. El catálogo y el contenedor exterior son los únicos cambios alrededor de su entrada.

## Alcance de las verificaciones

Las pruebas de navegador incluyen Chromium desktop, Chromium móvil y WebKit iPhone; son emulación, no una prueba en dispositivo físico. Capturas en test-results. Los resultados finales se documentan en GAMES_DELIVERY.md.
