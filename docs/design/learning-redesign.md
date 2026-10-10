# Míng: experiencia de aprendizaje L1–L4

Base: `main` en `d864a8f`, corpus aprobado 2.2.0. Se conserva el contenido,
las relaciones, los IDs, el audio y las fichas de vocabulario existentes.

La portada concentra el acceso a las cuatro lecciones, la práctica por habilidad
y los juegos. `/course` organiza las lecciones y los repasos acumulativos;
`/practice` permite elegir alcance antes de entrar a una actividad. Cada ruta
de lección propone un orden de estudio y mantiene acceso a todos sus recursos,
incluidos radicales, lecturas y ejercicios de L4. Las cantidades de vocabulario
proceden del mismo adaptador que las fichas del alumno.

La última sección visitada se recuerda solo en este navegador. No representa
dominio, finalización ni progreso académico. La lectura/escritura de localStorage
tolera navegadores que lo bloquean y acepta únicamente rutas curriculares conocidas.

Se retiraron de la portada la ruta duplicada de doce módulos, las estadísticas
de infraestructura, la jerga de SRS y el ranking como objetivo principal. Las
funciones originales siguen accesibles desde sus rutas y el pie de página.

## Identidad visual

Papel cálido `#f7f5ef`, jade oscuro `#1a4233`, terracota `#ac4e34` y superficies
salvia, durazno, arena y gris verdoso. Tipografía editorial en títulos, interfaz
con fuentes del sistema y fuente Hanzi existente. CSS específico en
`app/learning.css`, sin modificar la geometría aprobada de vocabulario.

Navegación inferior de cinco destinos en móvil, selector compacto de lección
que conserva la actividad, estado activo, áreas táctiles
de al menos 44 px, zona segura de iPhone, enlace para saltar al contenido,
foco visible y compatibilidad con movimiento reducido.

## Ilustración de portada

- Archivo publicado: `public/images/ming-study.webp` (1536 × 1024).
- Generación: herramienta integrada imagegen; sin llamadas TTS nuevas.
- Revisión: inspección visual por el agente, aceptada para uso decorativo.
- Derivado: WebP calidad 84. No se usa como evidencia curricular ni pregunta.
- Textos, botones y pronunciación se presentan con HTML y audio existentes.

Prompt de generación:

> Use case: illustration-story. Create a polished editorial illustration for the
> hero of Míng, an adult beginner Mandarin learning web app. Wide landscape 3:2
> composition, quiet contemporary East Asian study corner in a restrained
> mid-century gouache and paper-cut style, tactile subtle paper grain,
> sophisticated and welcoming, not childish clipart, not photorealistic. A large
> round terracotta sun in a pale warm cream sky, a sculptural dark forest-jade
> pine branch framing upper right, distant soft sage mountains seen through a
> circular window, an open blank ivory notebook and one slender calligraphy brush
> on a terracotta desk at bottom, a small jade ceramic cup. A little red-orange
> bird resting on the window ledge adds warmth. Deliberate bold silhouettes,
> harmonious negative space, soft dusty sage green, deep forest green #193d35,
> muted vermilion #c86143, warm paper #f7f5ef. No text, no letters, no Chinese
> glyphs, no watermarks, no UI, no borders. This is a decorative companion image
> for a learning dashboard; full-bleed composition filling the image with all key
> elements inside the central 85 percent, careful aesthetically balanced flat
> editorial art.

## Comprobación

`tests/e2e/learning-design.spec.ts` cubre navegación, selección de L4, retorno a
la ruta, continuidad local, destinos inválidos, almacenamiento bloqueado,
teclado y desbordamiento entre 320 y 1440 px. Las suites existentes comprueban
diálogos, audio, imágenes y regresiones de las lecciones.

Validación de esta entrega (9 de octubre de 2026):

- Corpus 2.2.0: `query.py --validate`, sin errores y con consulta global L1–L4.
- `pnpm lint`, `pnpm typecheck`, `pnpm test` (284 pruebas) y `pnpm build` correctos.
- 66 pruebas de navegador sobre compilación de producción: diseño, diálogos,
  escritura Hanzi y L4 en Chromium, Android y WebKit iPhone. Todas correctas.
- 2 pruebas adicionales de navegación pública, correctas en escritorio y móvil.
- Revisión visual a 320, 390, 768 y 1440 px; sin desbordamiento horizontal.
- `graphify update .` actualizado mediante AST, sin llamadas de pago.

Los enlaces de navegación y las páginas de exploración desactivan la precarga
especulativa de Next.js. Cada actividad se solicita al abrirla; esto evita
descargas innecesarias y cancelaciones de solicitudes en Safari móvil.
