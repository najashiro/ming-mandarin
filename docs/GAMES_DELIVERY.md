# Juegos Míng · revisión de octubre de 2026

El catálogo actual conserva **cinco juegos**: Reto Mixto, Vocabulario Mix, ¿Qué hora es?, Conversación y Hanzi Lab. La evaluación y las razones de retirada están en [GAMES_AUDIT.md](GAMES_AUDIT.md).

## Cambios aplicados

| Experiencia | Resultado |
| --- | --- |
| Reto Mixto, Vocabulario Mix y ¿Qué hora es? | Motores, datos, recursos y reglas sin cambios. Se conservan las tarjetas, enlaces y controles de compartir. |
| Escena Viva e Historia Detective | Retirados del catálogo y del montaje de Arcade. El código histórico y los identificadores se conservan; no se elimina progreso. |
| Conversación | Siete misiones con los diez turnos ya aprobados: presentación, reencuentro, nacionalidad, apellido, saludo a la clase, familia y hermanas. Papel, objetivo y datos explícitos; secuencias coherentes y respuestas alternativas ya documentadas. |
| Hanzi Lab | Cinco modalidades: Palabras, Audio, Significado, Radical y Escritura. Revelado y Componentes salen del juego puntuado; el laboratorio académico sigue accesible. |

Las misiones separan personajes y situaciones: la familia de cuatro personas no se combina con el diálogo de dos hermanas. La ayuda en español se muestra al solicitarla y conserva su marca si se cambia de nivel. Los resultados distinguen el primer intento, los repasos, los aciertos con ayuda y los elementos pendientes. Las misiones son práctica guiada de modelos; no califican conversación libre ni pronunciación.

Hanzi utiliza etiquetas neutrales en el audio oculto y la escritura de memoria; evita opciones auditivas homófonas y equivalencias de significado detectables. Incluye contexto semántico para el dictado de homófonos, acepta pinyin con tonos marcados o numéricos y conserva la corrección ante errores de audio. La escritura aplica el mismo criterio de éxito que el progreso existente, registra duración y ayudas, y distingue guía y memoria. La identificación de radicales no se contabiliza como dominio del carácter completo.

## Alcance curricular y compatibilidad

Conversación utiliza exclusivamente material existente de las lecciones 1–3. No aparece al elegir solo L4; en el repaso general se indica su cobertura. No se añaden frases chinas, claves curriculares, audio generado ni servicios de pago.

Las rutas de los juegos protegidos, los IDs curriculares y la persistencia anterior se mantienen. No hay migraciones ni cambios de RLS. El único ajuste al motor compartido de escritura permite proporcionar una etiqueta accesible opcional y conserva el valor predeterminado anterior.

## Verificación

- 302 pruebas unitarias aprobadas, incluidos los nuevos casos de misiones, distractores, tonos, etiquetas y registro de escritura.
- ESLint, TypeScript y compilación de Next.js aprobados.
- 62 pruebas de navegador aprobadas en Chrome y WebKit con iPhone emulado: catálogo, foco, lecciones, ayudas, turnos, repasos, escritura real, audio, Vocabulario Mix, hora y enlaces de Reto Mixto. Las pruebas de compartir se ajustaron para usar el origen configurado en lugar de asumir localhost.
- Revisión visual de catálogo y Conversación en móvil, con controles táctiles y sin desbordamiento horizontal.

Una prueba histórica adicional de `public.spec.ts` que exige una imagen como primera ronda de Reto Mixto falla en este entorno: sin imágenes aprobadas recibidas del backend, el motor existente inicia una pregunta de audio. El motor y sus datos permanecen intactos; la ronda con imagen publicada queda sin verificar localmente.

Se valida la aplicación local como visitante y el fallback de progreso Hanzi. No hay credenciales locales de Supabase: la sincronización remota autenticada no forma parte de esta comprobación. Los cambios están en `codex/ming-games-quality`; no se han publicado ni desplegado.
