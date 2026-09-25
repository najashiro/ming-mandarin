# Vocabulario activo y Vocabulario Mix — entrega local

Base: `af286b5` de `origin/main`. Rama: `feat/vocabulary-active-mix`.
Fecha: 25-09-2026. Sin commit, push, merge ni despliegue.

## Auditoría y decisiones verificadas

- El worktree estaba separado de una rama, en `5aa9fd3`, 23 commits detrás del remoto. `git fetch origin` confirmó la diferencia; no había commits locales exclusivos ni modificaciones de archivos de la aplicación. Se conservó `.codex/` sin seguimiento. La rama nueva parte del remoto actualizado; no se modificó el checkout principal.
- `scripts/export-corpus-v21.py` publicaba listas independientes de lecciones y roles. Se perdía la función de cada aparición, y la página reducía las entradas a cuatro campos. El exportador ahora conserva fuente, página, lección, función, evidencia, lectura/glosa documental y localizador de ejercicio cuando es inequívoco.
- El buscador anterior usaba `toLowerCase().includes()`: no admitía pinyin sin tonos, separado o numérico. Favoritos y traducciones ocultas solo existían en memoria.
- El generador curricular anterior recorría principalmente los `seed` y Reto Mixto, no todas las entradas publicadas del corpus. `宠物` no tiene clip solicitado ni archivo publicado. No se solucionó falsamente registrando una URL inexistente.
- `SpeakButton` podía parecer funcional sin recurso y no explicaba un fallo. Ahora distingue ausencia, carga, reproducción, parada y error recuperable; mantiene una sola reproducción y libera el recurso al desmontar. Los consumidores que no solicitan modo compacto conservan su texto.
- La prueba de almacenamiento bloqueado reprodujo un fallo previo de analítica que interrumpía la página. Analítica y cola PWA toleran ese bloqueo; Vocabulario continúa en memoria e informa que no puede guardar.
- Hipótesis no reproducidas: caché antigua de producción, corrupción de audios publicados, fallos en Safari físico. No se inspeccionó ni modificó producción.

## Catálogo y semántica

Se consultaron `MING_KNOWLEDGE/index.json`, el índice/README v2 y sus tablas verificadas; no se reprocesaron PDF. `query.py --validate` pasó. El exportador conserva los originales, sus variantes y los identificadores existentes.

`lib/vocabulary.ts` es la selección común para Explorar y Mix. Nuevas significa evidencia `core_textbook`, no la menor lección de una lista. Contexto agrupa apariciones documentadas. Repaso une las lecciones del alcance, sin duplicar IDs. Básico incluye vocabulario central, repaso y contexto de libro/cuaderno; Hard añade ampliaciones documentadas. La interfaz simplificada ofrece únicamente Lección 1, Lección 2 y Lección 3, con el vocabulario de repaso ampliado del corpus auditado; búsqueda y estrella de favoritos se combinan dentro de la lección. Los antiguos parámetros de selección, procedencia y nivel se ignoran y se eliminan al interactuar. Las funciones de clasificación se conservan para auditoría. El contenido de una sesión empezada no cambia al ajustar filtros.

| Alcance | Nuevas | Contexto (Hard) | Repaso Básico | Repaso Hard | Clasificación pendiente |
|---|---:|---:|---:|---:|---:|
| L1 | 26 | 56 | 38 | 59 | 6 |
| L2 | 38 | 99 | 72 | 127 | 6 |
| L3 | 41 | 129 | 118 | 151 | 1 |
| L1+L2 | 64 | 119 | 85 | 148 | 11 |
| L1+L2+L3 | 105 | 164 | 146 | 209 | 8 |

Hay 217 entradas publicadas con pinyin y español documentados: 209 en el conjunto de repaso y 8 pendientes de clasificación conservadas en los datos de auditoría. La interfaz simplificada ya no expone el selector de clasificación pendiente. El estado pendiente se calcula por alcance, por eso no se suman las columnas entre lecciones. Los 129 registros restantes del registro fuente de 346 carecen de los campos necesarios para una tarjeta completa; no se rellenaron automáticamente. Tampoco se convirtieron caracteres integrantes ni fonética introductoria en vocabulario nuevo.

El caso `宠物 — chǒngwù — mascota` queda en Básico L3/contexto, no en Nuevas. Testigo `SRC-WB-03`, PDF 9, impresa 27, `write-14`, pregunta 4. La oración documentada es `你们家有宠物吗？`, sin la glosa española. Su pinyin y traducción completa no constan en el testigo y siguen pendientes. La pista de contexto añade una consigna editorial Míng con la glosa «mascota», evitando presentar una respuesta única a la pregunta abierta del libro.

## Interfaz y repaso

- Búsqueda local ordenada por coincidencia exacta, prefijo y parcial; distingue ü/u y admite v/u:, tonos numéricos, apóstrofos y espacios. Sugerencias con teclado, composición IME, Enter/Escape y foco en la tarjeta; paginación de 24 entradas.
- Tarjetas compactas con traducción visible, favoritos y reverso de fondo verde claro. Se retiran los desplegables de procedencia y escritura; los caracteres siguen enlazados y el audio se coloca junto a la palabra y a la oración china. Las fuentes se conservan en los datos auditados. Cada acción tiene su propio control. La cara oculta se desmonta y no conserva controles accesibles.
- Hanzi reutiliza `LinkedChineseText`, `resolveHanziGlyph` y el foco del motor existente. En esta sección abre pestaña nueva con enlaces seguros. 宠 y 物 tienen consultas suplementarias explícitas, lecturas contextualizadas en 宠物 y trazos de `hanzi-writer-data@2.0.1`; no reciben radicales inventados ni progreso curricular de escritura.
- Mix se abre desde Vocabulario o el registro de Juegos, en el mismo componente. Los accesos acumulados se muestran en la última lección incluida (L1+L2 → Lección 2; L1+L2+L3 → Lección 3). Pista → respuesta → «Lo sé / No lo sé», sin alternativas, micrófono, cronómetro ni evaluación de pronunciación.
- Pistas Hanzi, imagen, contexto o mezcla. Solo se usan imágenes/contextos revisados; si faltan, se indica Hanzi. Actualmente hay una consigna contextual revisada, la de 宠物. Las restantes quedan fuera de ese tipo de práctica.
- Sesiones de 5/10/20/30/50, pausa y reanudación. IDs estables y eventos por sesión/posición evitan evaluaciones duplicadas. Progreso separado por entrada/tipo. Un fallo se reintroduce después de otras tarjetas, máximo dos intentos por palabra; con pocas tarjetas la sesión termina con pendientes.
- Calendario inicial configurable en `REVIEW_DAYS`: 1, 3, 7, 14 y 30 días; fallo a 10 minutos. Es una regla de producto, no una fórmula validada científicamente. Las estadísticas distinguen palabras únicas, intentos, respuestas autoevaluadas y pendientes.
- Almacenamiento local versionado, separado por `userId` o invitado, tolerante a corrupción y bloqueo. Incluye favoritos, cara, preferencia, sesión, estado revelado y calendario. No hay sincronización entre dispositivos ni migraciones de backend. Filtros y página se conservan en la URL; la pestaña original conserva su posición al abrir Hanzi.

## Cobertura y pendientes

Datos reproducibles: [vocabulary-coverage.json](vocabulary-coverage.json), [vocabulary-resources.json](vocabulary-resources.json).

Sobre las 209 entradas de repaso Hard total:

- 158 tienen algún ejemplo documental dentro del alcance; 38 tienen al menos uno con pinyin y español documentados. Los campos ausentes se anuncian explícitamente.
- 159 tienen audio de palabra con lectura coincidente. En las 217 entradas consultables, son 162 disponibles y 55 pendientes.
- 167 tienen destino válido para todos sus caracteres. El informe enumera los 62 glifos sin destino del catálogo total; no se fabricaron enlaces.
- Piloto visual de 16 entradas: 14 imágenes existentes revisadas visualmente y reutilizadas; 2 pendientes (`宠物`, `女儿`). `面条` y `果汁` tenían imágenes heredadas, pero no entradas completas en la proyección publicada: se excluyeron del piloto sin inventar fichas. Las imágenes WebP existentes son pequeñas, se cargan de forma diferida y tienen dimensiones reservadas. No se generaron imágenes nuevas ni se copiaron escaneos privados.

Inventario de recursos del catálogo completo: 389 claves texto/lectura, 221 disponibles y 168 no solicitadas (55 palabras y 113 oraciones). Las oraciones sin pinyin documental necesitan revisión antes de solicitar audio y no se cuentan como listas para generar. `你好` tiene dos lecturas registradas (`nǐhǎo`, `níhǎo`); la selección de palabras ahora incluye la lectura para evitar sobrescrituras silenciosas. Un archivo legado no registrado, `l2-h-1d59ea7cbb.mp3`, queda inventariado sin aprobarlo automáticamente.

Se decodificaron los 425 MP3 declarados disponibles de mandarín y los 9 de fonética: **434/434 con señal válida**. [Informe de señal](vocabulary-audio-signal.json). No se certificó su pronunciación mediante escucha editorial. Chromium reprodujo clips en las comprobaciones locales. WebKit automatizado en Windows devolvió `NotSupportedError` para MP3 incluso declarando soporte del formato; la recuperación/paro y exclusión mutua se verifican con audio simulado en ambos motores. No se afirmó reproducción nativa satisfactoria en WebKit ni una prueba física en iPhone.

## Recursos y gasto

El planificador consume exactamente el catálogo exportado, conserva las asociaciones de entradas que comparten clip y reutiliza audios existentes. Por defecto no realiza llamadas, no escribe manifiestos y no lee claves. Ejemplos:

```powershell
$env:PYTHONUTF8='1'
python scripts/export-corpus-v21.py
node scripts/vocabulary-resources.mjs --report=docs/vocabulary-resources.json
node scripts/vocabulary-resources.mjs --ids=v-宠物 --limit=1
node scripts/report-vocabulary.mjs
node scripts/verify-vocabulary-audio.mjs --all-available
node scripts/sync-vocabulary-hanzi.mjs
```

La configuración de voz conserva OpenAI / `gpt-4o-mini-tts` / `marin` / MP3 y las instrucciones del generador existente. No se estimó coste monetario porque no se verificó una tarifa vigente ni la duración de un lote. Antes de generar se requiere revisar la documentación oficial y obtener autorización con IDs, cantidad y límite de gasto. El ejecutor exige `--execute --authorized --ids=... --limit=... --max-budget-usd=... --reserve-per-clip-usd=...`; este último es una reserva conservadora aprobada por el usuario, no una medición de facturación ni un límite de cuenta del proveedor. No se ejecutó ese modo.

El checkpoint persiste cada solicitud antes de enviarla; una respuesta incierta nunca se reintenta automáticamente. Un archivo existente no se sobrescribe. Los nuevos clips quedan pendientes de revisión antes de incorporarse al manifiesto de disponibilidad. El límite se aplica a reservas acumuladas del checkpoint; los parámetros forman parte de la clave de generación. Las dos imágenes pendientes solo tienen especificación editorial: su proveedor/modelo y coste deben acordarse antes de generarlas.

## Validación y revisión local

Se instalaron las versiones de `pnpm-lock.yaml`, sin actualizar dependencias. En este entorno el wrapper pnpm intentaba reinstalar antes de cada script; `--config.verifyDepsBeforeRun=false` ejecuta sobre la instalación congelada, y también se usaron directamente los ejecutables locales para diagnósticos.

Comandos ejecutados:

```powershell
pnpm install --frozen-lockfile
pnpm --config.verifyDepsBeforeRun=false typecheck
pnpm --config.verifyDepsBeforeRun=false lint
pnpm --config.verifyDepsBeforeRun=false test
pnpm --config.verifyDepsBeforeRun=false build
node node_modules/typescript/bin/tsc --noEmit
node node_modules/eslint/bin/eslint.js . --ignore-pattern .next
node node_modules/vitest/vitest.mjs run
node node_modules/@playwright/test/cli.js test --config=playwright.vocabulary.config.ts
```

La instalación/compilación iniciales necesitaron acceso de red autorizado; la fuente Noto Serif SC se mantiene sin modificaciones. Se corrigieron expectativas previas de pruebas: solicitud de audio ya completada en main, clip de diálogo ya disponible, hashes sensibles a CRLF en Windows y comparación textual del manifiesto de horas. Se conservaron las verificaciones de contenido/hashes normalizados, se verificó igualdad semántica del manifiesto y se añadió la séptima entrada de Juegos esperada.

Las pruebas nuevas cubren evidencia, filtros, búsqueda, ü, alcance vacío, IME, foco, favoritos, recarga/revelado/pausa, eventos idempotentes, límite de reintentos, almacenamiento bloqueado, errores de audio, reproducción exclusiva, enlaces Hanzi y acceso desde Juegos. Pruebas de diseño en Chromium y WebKit: 320, 375, 390, 430 y 1280 px, movimiento reducido y texto al 200 %. Capturas reales en [vocabulary-captures](vocabulary-captures/README.md).

Servidor de revisión: **http://localhost:3100/study/l3/vocabulary**. Para reiniciarlo:

```powershell
pnpm --config.verifyDepsBeforeRun=false start --port 3100
```

También se puede usar `node node_modules/next/dist/bin/next start -p 3100`. Para desarrollo: `pnpm --config.verifyDepsBeforeRun=false dev --port 3100`. No detener un servidor ajeno que ya ocupe el puerto.

## Archivos y reutilización

- Catálogo: `scripts/export-corpus-v21.py`, `scripts/vocabulary_projection.py`, `data/corpus-v21-public.json`, `lib/vocabulary.ts`.
- Experiencia: `components/vocabulary/*`, ruta `app/study/[scope]/vocabulary/page.tsx`, redirección de la ruta histórica y entrada en `data/arcade-games.ts`/`components/Arcade.tsx`.
- Progreso: `lib/vocabulary-review.ts`, `lib/vocabulary-storage.ts`, hook de almacenamiento local.
- Recursos: manifiestos `data/vocabulary-media.json`, `data/vocabulary-hanzi.json`, scripts de planificación/informes/validación, dos archivos de trazos y actualización del manifiesto Hanzi.
- Reutilizados/adaptados: `SpeakButton`, `PinyinText`, `Hanzi`, `LinkedChineseText`, resolutor/foco Hanzi, alcances curriculares, `getCurrentUser`, registro de Juegos y recursos WebP existentes. Protección mínima en analítica/PWA para que almacenamiento bloqueado no derribe la página.
- Pruebas unitarias y de navegador; informes/capturas en `docs/`.

No se modificaron los archivos del motor de Reto Mixto, claves, permisos, facturación ni producción.
## Resultado final de las comprobaciones

- Typecheck: correcto, sin errores.
- Lint: correcto, sin errores ni advertencias en la pasada final.
- Vitest completo: **198/198 pruebas**, 18 archivos.
- Navegador Vocabulario: **24/24**, Chromium y WebKit.
- Regresión seleccionada de Juegos/Hanzi: **6/6**, ambos motores (hub a 390 px, foco directo y enlace de Reto Mixto conservando partida).
- Build de producción local: correcto.
- Exportación del corpus repetida: hash idéntico.
- Decodificación/señal: **434/434** recursos publicados; sin llamadas pagadas.
- `git diff --check`: correcto.

La regresión adicional encontró otra expectativa previa obsoleta: Reto Mixto ya resolvía 作 a `/study/l3/hanzi`, mientras la prueba esperaba la ruta acumulada. Se actualizó la expectativa exacta a L3 y se verificó que el glifo queda enfocado y la partida se conserva, sin modificar el motor del juego.

La prueba de regresión seleccionada se ejecutó con una configuración temporal que hereda `playwright.vocabulary.config.ts`, apunta a `games.spec.ts` y `hanzi-focus.spec.ts` y usa el mismo puerto 3100. No se ejecutó toda la batería E2E histórica de cuentas/backend; se ejecutaron completas las pruebas unitarias y las nuevas de Vocabulario.
