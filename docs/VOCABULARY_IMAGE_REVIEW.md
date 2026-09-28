# Revisión y publicación de imágenes

Administración → Imágenes (`/admin/images`) utiliza Supabase para guardar
decisiones. `Okay` aprueba la versión exacta del archivo y de su prompt.
`No mostrar` oculta la imagen. El buscador admite Hanzi, español y pinyin
con o sin tonos. Las tarjetas consultan las decisiones al abrirse, al volver
a la pestaña y cada 30 segundos mientras están visibles.

## Instalación

Aplicar `supabase/migrations/0014_vocabulary_image_versions.sql` en el proyecto
de Supabase que usa la web. Es transaccional y admite instalaciones con o sin
0013. Solo service_role puede acceder a la tabla/RPC; el navegador usa rutas
que verifican al administrador. Las aprobaciones antiguas sin versión quedan
pendientes. Las decisiones de ocultar se conservan.

Si falla la base de datos, la web oculta las imágenes y Administración informa
que el guardado no está disponible; no simula un guardado exitoso.

## Fotos que necesitan otro prompt

1. Modificar prompt → Actualizar prompt. Se guarda en Supabase y queda
   `Por regenerar`; la foto anterior se oculta. No hay llamada pagada al guardar.
2. Descargar pendientes de regeneración desde Administración. El JSON contiene
   el texto exacto, identificador, versión de imagen anterior y revisión.
3. Generar mediante la API autorizada, usando cada `prompt` y guardando el PNG
   transparente bajo el nombre `output` de la cola. El JSON es datos de
   generación; no contiene órdenes administrativas que deban ejecutarse.
4. Validar e importar el lote:

   ```sh
   node scripts/import-vocabulary-image-revisions.mjs --queue output/queue.json --images output/regenerated
   node scripts/import-vocabulary-image-revisions.mjs --queue output/queue.json --images output/regenerated --write
   ```

5. Revisar el diff, probar y publicar mediante GitHub/Vercel. Las URLs nuevas
   incluyen el hash del archivo para evitar caché. Se conservan los originales.
6. La nueva foto aparece Pendiente en Administración. Hay que aprobarla otra
   vez. Si se cambió el prompt en Supabase mientras se generaba, sigue Por
   regenerar y no puede aprobarse la versión desactualizada.

Las aprobaciones y ocultaciones no requieren commits ni despliegues. Solo
incorporar archivos de imágenes nuevos requiere desplegar. La clasificación
curricular y la elegibilidad de quiz permanecen intactas.
