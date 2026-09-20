# Protocolo de incorporación de nuevas fuentes

Cuando aparezca un nuevo PDF/PPT/hoja Hanzi/examen:

1. **Registrar la fuente**
   - id estable;
   - nombre exacto;
   - tipo;
   - lección/sublección;
   - páginas;
   - SHA-256.

2. **Determinar alcance**
   - vocabulario;
   - gramática;
   - diálogos;
   - fonética;
   - Hanzi;
   - ejercicios;
   - media;
   - cultura/evaluación.

3. **Comparar contra MING_KNOWLEDGE**
   - NUEVO → añadir;
   - DUPLICADO → añadir fuente al registro existente;
   - CONFLICTO → no decidir en silencio; añadir a `unresolved.json`.

4. **Actualizar solo la lección afectada**
   No releer ni regenerar Lecciones 1–N completas si el archivo nuevo solo afecta una sección.

5. **Trazabilidad**
   Cada registro nuevo debe tener `sources`.

6. **Auditoría**
   Si el material es escaneado o visual, marcar los datos de extracción incierta.
