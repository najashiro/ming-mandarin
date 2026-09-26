> Informe de la integración previa. Para la partición y búsqueda actuales, ver [VOCABULARY_EXCLUSIVE_GLOBAL.md](VOCABULARY_EXCLUSIVE_GLOBAL.md).

# Sincronización local de Vocabulario con el corpus auditado

Fecha: 25-09-2026. Rama: `feat/vocabulary-active-mix`. Vista local: http://localhost:3100/study/l1/vocabulary (puerto 3100).

## Protección e integración

- Checkpoint local: `4dc8c1e` — `chore: checkpoint vocabulary work before corpus sync`.
- Merge local: `a5b068d` — integra `origin/main` **d6352ddfb6498286a0991f198279ac093883e466** en esta rama. Verificado con `git merge-base --is-ancestor`.
- Se encontró un `index.lock` vacío sin procesos Git activos. Se conservó como `index.lock.pre-corpus-sync`, sin eliminarlo.
- `.codex/` quedó fuera del checkpoint y no fue modificado.
- No se cambió a main, no se hizo stash/reset/clean, push, merge a main, despliegue, generación pagada ni modificación de secretos.

Conflictos resueltos individualmente:

1. `scripts/export-corpus-v21.py`: exportador auditado de main; se retira el enriquecimiento antiguo que enviaba procedencias.
2. `data/corpus-v21-public.json`: regenerado mediante ese exportador; coincide con main y supera `--check`. No se editó manualmente.
3. `tests/unit/corpus-v21.test.ts`: se conservan las pruebas auditadas, la simulación de audio ausente y las comprobaciones locales de clips publicados.

La interfaz de Vocabulario/Mix no tuvo conflictos. Las adaptaciones posteriores al merge se dejan visibles sin commit adicional.

## Autoridad curricular y comportamiento

`lib/vocabulary.ts` selecciona sobre el MISMO `curriculumLink`: lección, rol y tipo de lista. `lib/corpus-v21.ts` también deriva la pertenencia léxica de esos vínculos. `lessons`/`roles` agregados ya no deciden clasificaciones de Vocabulario. Se retiró la lógica paralela de `scripts/vocabulary_projection.py`; queda un aviso de compatibilidad, con el original protegido en el checkpoint.

- Nuevas: `list_type == new_vocabulary`, incluidos nombres propios y subentradas impresas.
- Suplementarias: `list_type == supplementary_vocabulary` en la lección seleccionada.
- Textos/ejercicios: roles documentados `phrase_context`, `workbook_context`, `worksheet_sequence`, `numeral_in_context`.
- Básico: Nuevas más `core_review` y `workbook_context`, que conservan el repaso central y la práctica existente.
- Hard: Básico, Suplementarias, contexto y extensiones explícitas de clase. No depende del largo de la palabra ni de que proceda de una PPT.
- Repaso acumulado: unión por ID de los vínculos pertinentes; no duplica entradas ni aplana los vínculos.

La interfaz conserva **solo Lección 1, 2 y 3**, búsqueda y estrella de favoritos. No se reintroducen los filtros retirados; las categorías se verifican en el adaptador. Básico/Hard se elige al configurar una nueva sesión Mix. Las sesiones ya iniciadas conservan nivel, cola y progreso.

Conteos derivados de los datos, no constantes de negocio:

| Alcance | Nuevas | Suplementarias | Contexto | Básico | Hard |
|---|---:|---:|---:|---:|---:|
| l1 | 30 | 7 | 62 | 30 | 64 |
| l2 | 43 | 17 | 101 | 43 | 127 |
| l3 | 44 | 18 | 129 | 49 | 151 |
| l1-l2 | 73 | 24 | 126 | 73 | 152 |
| l1-l2-l3 | 117 | 42 | 171 | 122 | 213 |

## Regresiones obligatorias

| Caso | Resultado |
|---|---|
| 马马虎虎 | L1 suplementaria; no nueva; mǎmǎhūhū. El maestro conserva Adj. |
| 中国 | L2 suplementaria y L3 nueva simultáneamente; L2 no se convierte en nueva por el vínculo L3. |
| 太 | La evidencia sigue en SRC-HANZI-01-3, PDF 2, fila 4, tài, 4 trazos. La unidad runtime sigue siendo 1.2. |
| 宠物 | L3 contextual/cuaderno, no nueva ni suplementaria. Las seis variantes de búsqueda funcionan. |
| 约翰 | Yuēhàn / John; nombre contextual de L3, con ejemplos de lectura y pinyin recuperado. No se inventan audio ni fichas para 约/翰. |

## Ejemplos, pinyin y privacidad de la vista

Los ejemplos se derivan de `phrases.vocabIds` y vínculos de tipo positivo, sin búsqueda por substring ni listas manuales. Se prioriza pinyin y traducción presentes; los campos null se omiten. No se publica una premisa o transformación como respuesta correcta. Cada frase aparece una vez por ID.

Las nueve recuperaciones verificadas llegan desde el corpus:

- 我家有五口人。
- 你有弟弟吗？
- 我没有弟弟，我有一个哥哥。
- 大家好！我姓马，叫马大为，是美国人。
- 我们家一共有五口人，爸爸、妈妈、哥哥和我，还有约翰（John）。
- 约翰是我的狗，今年两岁。
- 我爸爸是律师，我妈妈是工程师，我哥哥是经理。
- 我的老师是陈老师，我们都很喜欢她。
- 我有三个中国朋友，王小云、宋华和陆雨平。

Las tarjetas y el JSON léxico/ejemplos no contienen fuentes, páginas, nombres PDF ni SRC-*. La trazabilidad completa permanece en MING_KNOWLEDGE. No se consultaron PDF. No se muestran «pinyin pendiente», «ficha pendiente» ni «audio pendiente».

## Recursos reales

- Audio: 55 palabras y 120 frases con pinyin documentado sin clip coincidente; todos están enumerados en [vocabulary-coverage.json](vocabulary-coverage.json) (`audioMissing`) y [vocabulary-resources.json](vocabulary-resources.json). Se cotejan texto, lectura, registro de disponibilidad y archivo. No se infiere disponibilidad por el corpus. Las frases sin pinyin documental no se cuentan como listas para generar.
- 224 recursos texto/lectura del catálogo enlazados a archivos disponibles. El verificador independiente decodificó **434/434 MP3 disponibles** sin fallos de señal; no certifica pronunciación mediante escucha editorial.
- Imágenes: 14 existentes reutilizadas, cero IDs huérfanos y cero archivos aprobados perdidos. Faltan las dos del piloto: 宠物 y 女儿. 203 entradas publicadas no tienen imagen asignada; la lista no implica que cada palabra necesite una imagen.
- Hanzi: 62 glifos usados por el vocabulario no tienen destino runtime válido; lista completa en `missingHanzi`/`hanziMissingByWord`. Además, 16 glifos del corpus con evidencia de escritura carecen de destino runtime. Son conjuntos distintos. El resolver exige destino curricular/suplementario y asset declarado disponible; las pruebas comprueban los archivos. La palabra permanece aunque alguno de sus caracteres no tenga enlace.
- IDs `v-<hanzi>`, clave `ming-vocabulary-v1:<usuario>`, favoritos, caras, progreso y sesiones anteriores se conservan. La prueba de sesión anterior al cambio recupera la respuesta y añade exactamente una evaluación.

## Interfaz verificada

Reverso con fondo distinto, audio junto al chino cuando existe, sin procedencia ni escritura redundante. Mix elimina instrucciones repetidas y deja una ayuda plegable. A 390 × 844 la respuesta y las dos acciones principales quedan antes de la barra inferior, sin scroll inicial. Hanzi se abre desde los caracteres resolubles.

[Captura Mix Chromium](vocabulary-captures/chromium-390-audited-mix.png) · [Captura Mix WebKit](vocabulary-captures/webkit-390-audited-mix.png).

## Validación

- `python MING_KNOWLEDGE/v2/query.py --validate`: OK.
- `python MING_KNOWLEDGE/v2/audit_source_tables.py --check`: OK.
- `python scripts/export-corpus-v21.py --check`: OK, exportación idéntica al main auditado.
- `python -m unittest discover -s MING_KNOWLEDGE/v2 -p 'test_*.py'`: 30/30.
- `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`: OK; 205 pruebas unitarias. Se usó `--config.verifyDepsBeforeRun=false` con las dependencias bloqueadas ya instaladas.
- Navegadores: 30/30 pruebas específicas en Chromium y WebKit, incluidos audio/error/paro, búsqueda, IME, favoritos, ejemplos, Hanzi, sesiones antiguas, cinco anchos, texto al 200 % y movimiento reducido.
- Regresión compartida Hanzi/Juegos: 26 casos verificados (24 pasaron inicialmente; las 2 variantes del test de audio pasaron al actualizar el selector obsoleto `.unavailable` por el estado accesible de error/reintento). No se cambió el comportamiento de Juegos para satisfacer esa prueba.
- Comprobación de señal de audio: 434/434.
- Lint focalizado final y `git diff --check`: OK.
- WebKit automatizado es Windows, no un iPhone físico. Los tests de recuperación/paro de audio simulan reproducción por la limitación de códec de ese host; la decodificación real se verifica en Chromium.

## Archivos de la integración

Comparados con el checkpoint previo, además de las capturas y el presente informe:

```text
.github/corpus-requests/audit-20260925.json
.github/workflows/corpus-source-audit.yml
MING_KNOWLEDGE/AGENTS.md
MING_KNOWLEDGE/v2/SOURCE_AUDIT.md
MING_KNOWLEDGE/v2/audit_source_tables.py
MING_KNOWLEDGE/v2/audits/source-tables-20260925.json
MING_KNOWLEDGE/v2/audits/source-tables-20260925.md
MING_KNOWLEDGE/v2/index.json
MING_KNOWLEDGE/v2/query.py
MING_KNOWLEDGE/v2/source-tables.json
MING_KNOWLEDGE/v2/source_audit.py
MING_KNOWLEDGE/v2/test_source_audit.py
components/SpeakButton.tsx
components/vocabulary/ActiveVocabulary.tsx
components/vocabulary/VocabularyCard.tsx
components/vocabulary/VocabularyMix.tsx
components/vocabulary/vocabulary.css
data/corpus-v21-public.json
docs/vocabulary-captures/chromium-1280-catalog-overview.png
docs/vocabulary-captures/chromium-1280-mix.png
docs/vocabulary-captures/chromium-1280-reverse.png
docs/vocabulary-captures/chromium-320-mix.png
docs/vocabulary-captures/chromium-320-reverse.png
docs/vocabulary-captures/chromium-375-mix.png
docs/vocabulary-captures/chromium-375-reverse.png
docs/vocabulary-captures/chromium-390-catalog-overview.png
docs/vocabulary-captures/chromium-390-mix.png
docs/vocabulary-captures/chromium-390-reverse.png
docs/vocabulary-captures/chromium-430-mix.png
docs/vocabulary-captures/chromium-430-reverse.png
docs/vocabulary-captures/webkit-1280-mix.png
docs/vocabulary-captures/webkit-1280-reverse.png
docs/vocabulary-captures/webkit-320-mix.png
docs/vocabulary-captures/webkit-320-reverse.png
docs/vocabulary-captures/webkit-375-mix.png
docs/vocabulary-captures/webkit-375-reverse.png
docs/vocabulary-captures/webkit-390-mix.png
docs/vocabulary-captures/webkit-390-reverse.png
docs/vocabulary-captures/webkit-430-mix.png
docs/vocabulary-captures/webkit-430-reverse.png
docs/vocabulary-coverage.json
docs/vocabulary-resources.json
lib/corpus-v21.ts
lib/hanzi/navigation.ts
lib/vocabulary.ts
scripts/export-corpus-v21.py
scripts/report-vocabulary.mjs
scripts/vocabulary-resources.mjs
scripts/vocabulary_projection.py
tests/e2e/games.spec.ts
tests/e2e/vocabulary.spec.ts
tests/unit/corpus-v21.test.ts
tests/unit/vocabulary.test.ts
```

Los principales cambios de adaptación son `lib/vocabulary.ts`, `lib/corpus-v21.ts`, `lib/hanzi/navigation.ts`, los componentes de Vocabulario/Mix, `SpeakButton`, los informes offline y las pruebas. El maestro documental y exportador incorporados de main no se deformaron para acomodar la UI.

## Estado Git final y diff resumido

Rama `feat/vocabulary-active-mix`, HEAD `a5b068d`. No hay conflictos pendientes. `.codex/` ya estaba sin seguimiento antes de empezar. Las adaptaciones se dejan sin commit para revisión.

- Adaptación posterior al merge (archivos rastreados): `40 files changed, 3341 insertions(+), 1260 deletions(-)`.
- Integración completa respecto al checkpoint (archivos rastreados): `55 files changed, 33544 insertions(+), 102581 deletions(-)`.
- Los archivos nuevos sin seguimiento se enumeran debajo; las estadísticas Git anteriores no los incluyen.

```text
 M components/SpeakButton.tsx
 M components/vocabulary/ActiveVocabulary.tsx
 M components/vocabulary/VocabularyCard.tsx
 M components/vocabulary/VocabularyMix.tsx
 M components/vocabulary/vocabulary.css
 M docs/VOCABULARY_ACTIVE_MIX.md
 M docs/vocabulary-captures/README.md
 M docs/vocabulary-captures/chromium-1280-catalog-overview.png
 M docs/vocabulary-captures/chromium-1280-mix.png
 M docs/vocabulary-captures/chromium-1280-reverse.png
 M docs/vocabulary-captures/chromium-320-mix.png
 M docs/vocabulary-captures/chromium-320-reverse.png
 M docs/vocabulary-captures/chromium-375-mix.png
 M docs/vocabulary-captures/chromium-375-reverse.png
 M docs/vocabulary-captures/chromium-390-catalog-overview.png
 M docs/vocabulary-captures/chromium-390-mix.png
 M docs/vocabulary-captures/chromium-390-reverse.png
 M docs/vocabulary-captures/chromium-430-mix.png
 M docs/vocabulary-captures/chromium-430-reverse.png
 M docs/vocabulary-captures/webkit-1280-mix.png
 M docs/vocabulary-captures/webkit-1280-reverse.png
 M docs/vocabulary-captures/webkit-320-mix.png
 M docs/vocabulary-captures/webkit-320-reverse.png
 M docs/vocabulary-captures/webkit-375-mix.png
 M docs/vocabulary-captures/webkit-375-reverse.png
 M docs/vocabulary-captures/webkit-390-mix.png
 M docs/vocabulary-captures/webkit-390-reverse.png
 M docs/vocabulary-captures/webkit-430-mix.png
 M docs/vocabulary-captures/webkit-430-reverse.png
 M docs/vocabulary-coverage.json
 M docs/vocabulary-resources.json
 M lib/corpus-v21.ts
 M lib/hanzi/navigation.ts
 M lib/vocabulary.ts
 M scripts/report-vocabulary.mjs
 M scripts/vocabulary-resources.mjs
 M scripts/vocabulary_projection.py
 M tests/e2e/games.spec.ts
 M tests/e2e/vocabulary.spec.ts
 M tests/unit/vocabulary.test.ts
?? .codex/
?? docs/VOCABULARY_CORPUS_SYNC.md
?? docs/vocabulary-captures/chromium-390-audited-mix.png
?? docs/vocabulary-captures/webkit-390-audited-mix.png
?? scripts/load-vocabulary.mjs
```

El nuevo `scripts/load-vocabulary.mjs` reutiliza el adaptador real en los informes offline; no introduce otra clasificación. Las capturas nuevas comprueban Mix a 390 × 844.
