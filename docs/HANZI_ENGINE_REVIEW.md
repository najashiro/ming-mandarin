# Revisión del motor Hanzi · 2026-11-10

La revisión anterior solo había ampliado el selector de lecciones. No comprobaba la cobertura de pronunciaciones ni la búsqueda de fichas de consulta.

Esta corrección audita las **378 fichas existentes**: 295 objetivos de escritura y 83 referencias. Conserva los IDs y las unidades curriculares. El buscador incluye referencias como 边 (biān), admite pinyin o Hanzi y mantiene la consulta después de recargar. Los enlaces directos no requieren conocer el parámetro interno `content=supplementary`. Cada lección permite desplegar otros caracteres presentes en sus textos.

Las referencias pueden estudiarse y practicarse sin sumarse al progreso de escritura del curso. Las palabras y frases proceden de las proyecciones públicas; la inclusión de un carácter en una palabra solo proporciona contexto. No convierte la traducción del compuesto en definición del carácter, ni crea un objetivo curricular.

Se generaron los 78 audios expresamente autorizados por el usuario con `gpt-4o-mini-tts`, voz Marin. Se conservan las grabaciones previas. La selección usa texto y pinyin exactos: 边 biān aislado no usa la grabación de bian neutro. Tres archivos inicialmente casi silenciosos se regeneraron antes de publicar. Los 378 MP3 del catálogo pasan decodificación, duración y señal. Esta verificación técnica no certifica una revisión fonética humana independiente.

Se completaron los nombres de trazos de las 83 referencias con el mismo origen técnico ya usado por el proyecto, `cnchar-order@3.2.6`, cotejado con el número de trazos de los assets locales. La licencia se conserva en `public/licenses/CNCHAR_ORDER_MIT.txt`.

## Límites documentales encontrados

La auditoría del texto completo identifica **111 glifos adicionales sin ficha individual en el catálogo**. Sus palabras/frases sí están documentadas, pero no tienen lecturas aisladas registradas en la tabla Hanzi documental consultada. La lista y hasta tres contextos por glifo quedan en `hanzi-engine-audit.json`, campo `glyphsWithoutCharacterRecord`. No se inventan lecturas o glosas ni se afirma que las 378 fichas cubran todos los caracteres presentes en cualquier ejemplo del corpus.

Nueve objetivos (`其耳虫皿尸足舌矢竹`) carecen de un ejemplo léxico en las proyecciones seleccionadas. Mantienen su ficha, pinyin, significado, audio y trazos; la interfaz explica que se estudian como forma básica en lugar de mostrar un ejemplo inventado.

## Verificación reproducible

```sh
HANZI_AUDIT_OUTPUT=docs/hanzi-engine-audit.json pnpm exec vitest run tests/unit/hanzi-engine.test.ts
node scripts/verify-hanzi-audio.mjs --catalog
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm exec playwright test tests/e2e/hanzi-layout.spec.ts tests/e2e/hanzi-complete.spec.ts
```

`hanzi-complete.spec.ts` comprueba acceso a 边, reproducción real de 左/边, consulta sin progreso curricular, contextos disponibles aunque falle la carga de trazos y las 378 fichas con reproducción en Chromium. Los casos de regresión se ejecutan también en Android e iPhone. Los hashes, duración y señal están en `hanzi-audio-review.json` y `hanzi-catalog-audio-review.json`.

Resultados locales: lint, tipos y compilación correctos; 414 pruebas unitarias y 39 casos de regresión de navegador aprobados. La auditoría adicional de las 378 fichas también pasó, incluyendo reproducción de su archivo correspondiente. Las comprobaciones móviles usan emulación de Android y WebKit/iPhone; no constituyen una prueba en el teléfono físico del usuario.
