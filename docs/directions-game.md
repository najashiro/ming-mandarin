# Una llamada, mil vueltas

Ruta: `/study/l6/games/directions` y `/study/l1-l2-l3-l4-l5-l6/games/directions`.
Entrada: catálogo de Juegos de L6 y repaso acumulado L1–L6.

Seis mapas originales Míng: biblioteca, comedor, banco, universidad, gimnasio y residencia. Los cuatro primeros usan puntos cardinales; los dos últimos, posiciones relativas al personaje. En el juego, elegir una ubicación es una señal abreviada que mueve una casilla y orienta al personaje en la dirección del desplazamiento. No se enseñan estas expresiones nominales como imperativos verbales. La flecha naranja muestra su orientación. Una orden bloqueada por un muro no cambia la orientación.

## Evidencia curricular consultada

- `MING_KNOWLEDGE/index.json`, `v2/lesson6/content.json`, `v2/lesson6/SOURCE_REVIEW.md` y la proyección `data/lesson6-public.json`.
- Libro básico L6, PDF 3–4 / impresas 164–165: mapa del campus, 校门、图书馆、食堂、银行、体育馆、右边、北边、东边、西边 y preguntas con 在哪儿.
- Libro básico L6, PDF 6–7 / impresas 167–168: conversación telefónica de orientación, 前边、后边、超市、饭馆, y «等一下，你说什么？». PDF 8 / impresa 169: 南边. PDF 14 / impresa 175: 左边.
- `data/corpus-v21-public.json`: 大学 y lenguaje de saludo/agradecimiento de las lecciones previas. El pinyin de los ocho controles se comprueba por igualdad con el corpus L6.
- El libro, el cuaderno y la presentación usan mapas distintos. Estos laberintos no reproducen ninguno ni modifican relaciones de los diálogos canónicos.

Los mapas, trampas, llamada dramatizada, recombinaciones de preguntas y recompensas son una adaptación Míng. No son una actividad ni una clave oficial del libro. No se modifica el corpus ni se afirman grabaciones originales.

## Audio y lectura asistida

La ampliación solicitada el 9 de noviembre de 2026 incluye reproducción al pulsar una dirección y controles de audio sobre todos los textos chinos: frases, nombres, edificios, mapa, pistas, historial y selector de misiones. El icono pequeño junto al hanzi y el propio texto reproducen la misma grabación. La entrada a cada mapa reproduce su pregunta. Las voces anteriores se detienen al tocar otro texto; un error ofrece reintentar sin perder la partida. El audio se inicia dentro del gesto del usuario para funcionar en iOS.

`scripts/prepare-directions-audio.mjs` obtiene las lecturas léxicas de las proyecciones L1–L6, conserva las adaptaciones de frase por separado y exporta 36 textos en `data/directions-language.json`. Se reutilizan 10 MP3 existentes; los cuatro locativos compartidos se incluyen con su manifiesto `data/directions-reused-audio.json`; los 26 faltantes se generan como recursos estáticos en `public/audio/directions/`, mediante el alcance `--scope=directions` del generador existente. No hay TTS de navegador ni generación en tiempo de ejecución. Las voces son sintéticas y se identifican en el pie del juego. `scripts/verify-directions-audio.mjs --transcribe` realiza una comprobación automática, sin afirmar revisión humana o certificación de tonos.

El interruptor **Pinyin + español** muestra u oculta ambas ayudas en todo el juego y recuerda la preferencia en `ming-directions-reading-v1`. Todos los hanzi usan el componente `Hanzi` y la fuente Noto Serif SC de Míng. La lectura usa `PinyinText`, en un tamaño menor; el español aparece debajo, aún menor y en gris. Las etiquetas del mapa son botones HTML accesibles, independientes del SVG, para permitir teclado, audio y lectura sin reducir el texto al escalar el mapa. Con lectura activada se sitúan debajo del tablero, sin cubrir al personaje ni los caminos. En móvil, los cuatro controles de movimiento permanecen en la parte inferior de la pantalla. En los niveles bloqueados puede escucharse el destino, pero no iniciarse la misión.

## Reglas y persistencia

Una señal mueve una casilla. Los agujeros consumen una vida y requieren pulsar rescate; los muros son errores recuperables sin pérdida de vida. Al caer por tercera vez se reinicia ese mapa. Los campamentos actualizan posición y orientación de rescate. Las estrellas recogidas se conservan durante los rescates, sin duplicación.

Cada mapa otorga hasta tres estrellas: llegada, recorrido sin errores/ayudas y recogida de las dos estrellas del mapa. Las ayudas no impiden avanzar. Se guarda solo la mejor puntuación por mapa en `ming-directions-v1` (localStorage), sin modificar XP, progreso curricular, ranking ni Supabase. El siguiente mapa se desbloquea al llegar. Los fallos de almacenamiento no interrumpen la sesión.

## Verificación

`tests/unit/directions-game.test.ts`: cobertura léxica, rutas seguras independientes, coleccionables antes del destino, orientaciones, colisiones, rescates, derrota, puntuación y almacenamiento inválido.

`tests/e2e/directions-game.spec.ts`: entrada desde catálogo, partida completa, caída/rescate, persistencia, bloqueo de niveles, ayuda y adaptación móvil; reproducción real desde cada control, lectura global, jerarquía tipográfica, teclado, recuperación ante fallo de audio y decodificación/señal de los 36 MP3. Se ejecuta en Chromium, Android y WebKit/iPhone; la verificación de los archivos idénticos se ejecuta una vez.
