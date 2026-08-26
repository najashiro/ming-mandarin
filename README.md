# Míng · Mandarín activo

Plataforma educativa para la Lección 1 **你最近怎么样？**. Incluye vocabulario trazable, pinyin y tonos, escucha sintética `zh-CN`, gramática, diálogos, lectura, hanzi, 28 juegos, repetición espaciada, cuaderno de errores, examen de 100 puntos y ranking voluntario.

## Arquitectura

- **Aplicación:** Next.js App Router, React, TypeScript y CSS responsive propio.
- **Publicación:** Vercel conectado al repositorio GitHub.
- **Backend:** Supabase Auth + PostgreSQL. El servidor valida la identidad, califica prácticas y exámenes y filtra todas las operaciones por usuario.
- **Contenido:** el directorio `seed/` contiene el corpus auditado. Cada registro conserva archivo y página de origen.
- **Persistencia:** dominio, estabilidad, próxima revisión, intentos, errores, examen, XP, racha, preferencias y participación voluntaria en el ranking.
- **PWA:** solo se cachean rutas educativas públicas. Las páginas de cuenta y las API nunca se almacenan en el service worker.

No existe funcionalidad de certificados ni almacenamiento de archivos. Un examen perfecto se refleja únicamente en el historial y, si el estudiante lo autoriza, en el ranking.

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

La migración canónica es `supabase/migrations/0001_lesson_1.sql`. Crea:

- perfiles vinculados a `auth.users`;
- dominio por concepto y dimensión;
- intentos de práctica y cuaderno de errores;
- sesiones e intentos de examen;
- la vista `leaderboard_public`, accesible solo desde el servidor;
- políticas RLS para que cada estudiante solo pueda leer sus registros.

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

## Acceso

- Las lecciones, juegos y ranking son públicos.
- Cuenta por correo y contraseña para progreso, errores, práctica adaptativa, examen e inscripción voluntaria en el ranking.
- `/admin/content` exige una cuenta incluida en `ADMIN_EMAILS`.

## Límites conocidos

- Los cinco PDF no incluyen audio: toda reproducción se etiqueta como voz sintética.
- El lienzo 米字格 valida conteo y ofrece guía visual; no afirma comprobar geométricamente orden y dirección de trazos.
- Conviene una revisión docente final de la naturalidad del TTS, la explicación de 很 y los nombres de radicales.
