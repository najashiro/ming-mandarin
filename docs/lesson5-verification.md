# Verificación de la actualización L5

El alumno entra en la lección 5 desde Inicio o Lecciones, consulta una tarjeta, escucha su MP3, revela una frase relacionada y abre sus caracteres en el motor Hanzi. También puede leer los dos diálogos, practicar las fechas y continuar en las lecciones anteriores.

## Evidencia local

- 322 pruebas unitarias aprobadas, incluidas seis pruebas integrales L5: autoridad del libro, cobertura de módulos, enlaces léxicos, resolución Hanzi de todos los glifos, audio, imágenes, conversación y exámenes.
- 164 pruebas documentales históricas aprobadas; las exportaciones 2.1 y 2.2 siguen siendo reproducibles.
- Proyección L5 reproducible y validada mediante `query.py --lesson 5 --validate`.
- ESLint y TypeScript aprobados; compilación de producción aprobada.
- 9 pruebas de navegador L5 aprobadas en Chromium, móvil Android y WebKit/iPhone. Comprueban diez secciones, 27 turnos, cuatro lecturas, 29 actividades, ausencia de desbordamiento, reproducción real de MP3, carga de imagen, reverso de tarjeta, apertura Hanzi en pestaña nueva y juegos de cumpleaños/conversación.
- 255 MP3 decodificados en Chromium: duración mínima 0.2 s y RMS mínimo 0.002. Cuatro clips sin señal suficiente se regeneraron antes de publicarlos. No se afirma revisión fonética humana de cada audio.
- 30 WebP de 1618 × 1000 con alfa real, esquinas transparentes, hashes y revisión visual del modelo. Ocho encuadres iniciales se sustituyeron por figuras completas. No se afirma revisión humana independiente.

- 18 pruebas adicionales de regresión L4 aprobadas en Chromium, móvil y WebKit/iPhone, incluidos recorridos hacia L1–L3.

## Límites de la evidencia

Las pruebas visuales locales simulan la respuesta del endpoint de imágenes con el catálogo aprobado. La aplicación conserva la consulta administrativa de Supabase: ante indisponibilidad devuelve cero imágenes, para no republicar fotos ocultadas por el administrador. La publicación remota requiere comprobar ese endpoint en el despliegue real. La grabación original de los ejercicios de escucha no fue entregada; el TTS nuevo es audio de estudio, no un sustituto presentado como grabación original.

No se modificaron esquema, RLS ni datos personales. La clave API permanece local y no es necesaria para servir los recursos generados.
