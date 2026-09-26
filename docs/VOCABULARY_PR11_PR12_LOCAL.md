# Integración local del corpus PR #11 y diseño PR #12

Fecha local: 25 de septiembre de 2026. Rama: `feat/vocabulary-active-mix`.

## Integración y conservación

- Checkpoint antes de integrar: `c34075d`.
- Merge local de `origin/main`: `f5796af`.
- Contiene `db292dbdb055c1b505938ae691f4d6a8bb720bca` (PR #11) y
  `757f172717be1f7803654ba12b1708cad735e16f` (PR #12).
- Único conflicto: línea de entrada de `MING_KNOWLEDGE/AGENTS.md`. Se conservaron
  las nuevas referencias a traducciones y pinyin de main, junto al estándar visual.
- La implementación local de Vocabulario/Mix se conservó. No se hizo reset,
  clean, force push, merge a main ni despliegue de esta interfaz. `.codex/` ajeno
  al trabajo quedó sin tocar.

## Consumo de datos

`lib/vocabulary.ts::examplesForWord` usa `publicExamplesForVocabulary(word.id)`
para resolver `examplePhraseIds` en el orden público. No descubre ejemplos por
substring, no los limita por lección y no modifica `phrase.vocabIds`.
El mismo adaptador alimenta el catálogo y `VocabularyExample` en Mix.

Los componentes consumen únicamente `pinyin` y `spanish` resueltos. La exportación
pública permanece idéntica a main: 337 entradas y 635 frases, todas con ambos
campos completos. No se regeneraron lecturas, traducciones ni corpus.

La selección curricular existente produce L1 **85**, L2 **126**, L3 **116**,
Acumulado **327**, sin duplicados. Otras diez entradas publicadas conservan
su clasificación fuera del catálogo elegible. La ampliación respecto al
checkpoint anterior proviene del apoyo lingüístico ahora disponible; no se
modificó la regla de exclusividad. 中国 sigue en L2 y 马马虎虎 en L1.

猫, L3, muestra `māo` / `gato` y recorre:

1. 一只猫 — Yì zhī māo — Un gato.
2. 你有小猫吗？ — Nǐ yǒu xiǎomāo ma? — ¿Tienes un gatito?
3. 我有两只小猫，他们很可爱。 — Wǒ yǒu liǎng zhī xiǎomāo, tāmen hěn kě'ài. — Tengo dos gatitos; son muy tiernos.

Los dos últimos son relaciones pedagógicas de 猫 con 小猫; sus `vocabIds`
originales siguen conteniendo 小猫 y no 猫. Los tres ejemplos vuelven al primero
al completar el ciclo. 真 permanece en L2 y tiene once ejemplos globales,
incluidos 真厉害！ y 这张照片真漂亮！ de L2/L3. La primera frase es ahora 真好,
según el orden autorizado por el helper público; la UI no reordena el corpus.
No aparecen avisos de pinyin/traducción pendiente ni procedencia editorial en
las tarjetas. Búsqueda global, favoritos y progreso se conservan.

## Aplicación del estándar visual

`lib/vocabulary-style.ts` convierte los parámetros de
`MING_KNOWLEDGE/design/vocabulary-style.json` en variables CSS compartidas por
catálogo y Mix. No hay una segunda copia manual de tamaños o paleta.

- Ficha entera con `aspect-ratio: 1.61803398875`, ancho máximo 400 px.
- Medición a viewport 390: 362 × 223.71875 px, razón 1.61810.
- Una columna móvil; sin foto también se conserva la geometría por defecto.
- Español 0.8rem, tenue; pinyin 1rem; Hanzi protagonista.
- Audio circular salvia de 44 px y controles de favorito/giro en las esquinas.
- Reverso salvia, palabra atenuada, frase grande con palabra resaltada en naranja.
- Foco, teclado, áreas táctiles, reducción de movimiento y crecimiento vertical
  para texto largo/al 200 %. La proporción no se impone recortando texto.
- Controles de evaluación y despliegue de ejemplos de Mix fuera de su superficie
  áurea. Sesiones y respuestas reveladas de Mix mantienen su persistencia previa.
- El catálogo vuelve al anverso con filtros, búsqueda, paginación y recarga.

**Límite fotográfico explícito:** el adjunto prohíbe generar imágenes.
Se reutilizan los 14 recursos ya aprobados, con el cuadrado completo alineado a
la derecha y un degradado CSS lateral suave; no se recortan ni se editan los
archivos. No se usa la maqueta como asset. Los fondos chinos difuminados del
PR #12 requieren nuevas fotografías y quedan pendientes de un encargo que
permita generarlas. Esta implementación aplica geometría, jerarquía e
interacción, pero no afirma haber completado esa dirección fotográfica.

## Archivos principales

- `components/vocabulary/ActiveVocabulary.tsx`: tokens del estándar.
- `components/vocabulary/VocabularyCard.tsx`: anverso/reverso, iconos y ejemplos.
- `components/vocabulary/VocabularyPhoto.tsx`: presentación de los assets actuales.
- `components/vocabulary/VocabularyMix.tsx`: superficie y controles separados.
- `components/vocabulary/vocabulary.css`: layout responsive y estilo compartido.
- `lib/vocabulary.ts`: ejemplos pedagógicos mediante helper de main.
- `lib/vocabulary-style.ts`: parámetros aprobados conectados con CSS.
- `scripts/load-vocabulary.mjs`: informes consumen también el helper real.
- `scripts/report-vocabulary.mjs`: nota corregida de cobertura pública.
- `tests/unit/vocabulary.test.ts`, `tests/e2e/vocabulary.spec.ts`: regresiones.
- `docs/vocabulary-coverage.json`, `docs/vocabulary-resources.json` y
  `docs/vocabulary-partition-examples.json`: informes locales actualizados.
- `docs/vocabulary-captures/pr12/`: capturas reales de navegador; no imágenes
  generadas para uso como assets.

## Verificación

Pasaron las cuatro comprobaciones pedidas del corpus: `query.py --validate`,
`pinyin_ming.py --check`, `translations_ming.py --check` y
`export-corpus-v21.py --check`. Los JSON fuente/exportados no se editaron.

Pasaron lint, typecheck, 229 pruebas unitarias y build de producción local.
En navegador pasaron 60 casos: 46 de regresión existente actualizada y 14 nuevos,
en Chromium y WebKit. Incluyen 猫 en catálogo/Mix a 390 y 1280 px, 真 global,
búsqueda de 中国/马马虎虎, favoritos, audio, recarga, fallo de imagen, controles
44 px, proporción de ficha completa a 320/390/768/1280 y texto al 200 %.
Las capturas de layout también cubren 375 y 430 px.

No se generó audio ni imágenes, no se leyeron secretos y no hubo llamadas
pagadas. La auditoría de recursos se ejecutó únicamente en modo `dry-run`.

URL local: http://localhost:3100/study/l3/vocabulary

## Traslado de Vocabulario Mix a Juegos

El catálogo ya no muestra los botones Explorar y Vocabulario Mix. La tarjeta
de Juegos abre `/study/[scope]/games/vocabulary-mix`, con selector de lección
y enlace para volver a Juegos. Los enlaces antiguos `vocabulary?mode=mix`
redirigen a esta ruta conservando búsqueda y filtro de favoritos. Se reutilizan
las mismas claves de almacenamiento para mantener sesiones y progreso.
