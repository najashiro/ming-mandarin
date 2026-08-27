# Míng · Mandarín activo

Plataforma educativa para la Lección 1 **你最近怎么样？**. Incluye vocabulario trazable, pinyin y tonos, clips de pronunciación en mandarín, gramática, diálogos, lectura, hanzi, 28 juegos, repetición espaciada, cuaderno de errores, examen de 100 puntos y ranking voluntario.

## Arquitectura

- **Aplicación:** Next.js App Router, React, TypeScript y CSS responsive propio.
- **Publicación:** Vercel conectado al repositorio GitHub.
- **Backend:** Supabase Auth + PostgreSQL. El servidor valida la identidad, califica prácticas y exámenes y filtra todas las operaciones por usuario.
- **Contenido:** el directorio `seed/` contiene el corpus auditado. Cada registro conserva archivo y página de origen.
- **Persistencia:** dominio, estabilidad, próxima revisión, intentos, errores, examen, XP, racha, preferencias y participación voluntaria en el ranking.
- **PWA:** solo se cachean rutas educativas públicas. Las páginas de cuenta y las API nunca se almacenan en el service worker.

No existe funcionalidad de certificados ni almacenamiento de archivos. Un examen perfecto se refleja únicamente en el historial y, si el estudiante lo autoriza, en el ranking.

Los estudiantes eligen un nombre una sola vez. Supabase crea una sesión anónima persistente en ese navegador, sin correo ni contraseña. Si se borran las cookies o se cambia de dispositivo, esa identidad anónima no puede recuperarse.

## Variables de entorno

Copia `.env.example` como `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_EMAILS=najashiro@gmail.com
```

`SUPABASE_SECRET_KEY` es exclusivamente de servidor y nunca debe usar el prefijo `NEXT_PUBLIC_`. La integración oficial Supabase–Vercel puede sincronizar estas variables sin copiarlas al repositorio.

## Base de datos

Las migraciones canónicas son `supabase/migrations/0001_lesson_1.sql` y
`supabase/migrations/0002_hanzi_lab.sql`. Crean:

- perfiles vinculados a `auth.users`;
- dominio por concepto y dimensión;
- intentos de práctica y cuaderno de errores;
- sesiones e intentos de examen;
- la vista `leaderboard_public`, accesible solo desde el servidor;
- políticas RLS para que cada estudiante solo pueda leer sus registros.
- resúmenes de intentos Hanzi sin coordenadas ni trayectorias del estudiante.

No se insertan estudiantes, notas ni posiciones ficticias.

## Ejecución local

1. Instala Node.js 22.13 o posterior.
2. Ejecuta `npm install`.
3. Crea `.env.local` con las variables anteriores.
4. Aplica la migración al proyecto Supabase.
5. Ejecuta `npm run dev` y abre `http://localhost:3000`.

## Validación

- `npm test`: pinyin, repetición espaciada, calificación de examen, corpus y empates del ranking.
- `npm run test:e2e`: navegación pública, arcade, audio y protección de las funciones persistentes.
- `npm run typecheck`: TypeScript estricto.
- `npm run lint`: ESLint.
- `npm run build`: compilación de producción de Next.js.

## Laboratorio Hanzi

La ruta `/lesson/1/hanzi` usa Hanzi Writer con una selección local de
`hanzi-writer-data`. Incluye cuatro pestañas reutilizables —Aprender,
Componentes, Trazos y Practicar—, cuadrícula 米字格, animación con velocidad y
pausa, respuesta SVG con números/puntos/flechas, paso a paso, despiece
acumulativo y evaluación de orden y dirección con ayudas progresivas.

Los datos gráficos se cargan por carácter desde `public/hanzi-data/`; no se usa
una CDN externa. Para volver a generarlos después de actualizar el inventario o
las dependencias, ajusta la lista auditada de `scripts/sync-hanzi-data.mjs` y
ejecuta `npm run hanzi:sync`. El script también conserva las copias de licencia.
Consulta `THIRD_PARTY_NOTICES.md` para atribución y condiciones.

Supabase persiste únicamente el resumen: carácter, modo, dimensión, resultado,
aciertos, errores, ayudas y duración. Nunca se guardan coordenadas de escritura.
Sin sesión, el navegador conserva un resumen local y ofrece elegir un nombre
para sincronizar el progreso.

## Audio de pronunciación

El repaso fonético reproduce MP3 estáticos y usa hanzi —no letras pinyin— como
entrada de pronunciación. Si un archivo falla, el navegador solo puede usar una
voz configurada explícitamente como china; nunca selecciona una voz inglesa.

Los clips se generan una sola vez con la API de voz de OpenAI y después se
publican desde `public/audio/pinyin/`:

1. Configura `OPENAI_API_KEY` de forma temporal en la terminal o crea el archivo
   ignorado `.env.audio.local` con una línea `OPENAI_API_KEY=...`. No copies la
   clave al código, GitHub, el navegador ni una variable `NEXT_PUBLIC_`.
2. Ejecuta `npm run audio:generate`.
3. Ejecuta `npm run audio:verify` y revisa auditivamente los nueve MP3 antes de
   publicarlos. Para regenerarlos, usa `npm run audio:generate -- --force`.
   Para reemplazar solo uno, añade `--only=identificador-del-clip`.

El generador usa `gpt-4o-mini-tts` con la voz `marin`; puedes elegir otra voz
mediante `OPENAI_TTS_VOICE`. La interfaz identifica claramente el audio como voz
generada por IA.

## Acceso

- Las lecciones, juegos y ranking son públicos.
- Perfil por nombre con sesión anónima persistente para progreso, errores, práctica adaptativa, examen e inscripción voluntaria en el ranking.
- `/admin/content` exige una cuenta incluida en `ADMIN_EMAILS`.

## Límites conocidos

- Los cinco PDF no incluyen audio: los clips complementarios se etiquetan como voz generada por IA y requieren revisión docente antes de cada publicación.
- La evaluación Hanzi tolera pequeñas diferencias caligráficas, pero exige el orden y la dirección de trazo configurados por el conjunto técnico.
- Conviene una revisión docente final de la naturalidad del TTS, la explicación de 很 y los nombres de radicales.
