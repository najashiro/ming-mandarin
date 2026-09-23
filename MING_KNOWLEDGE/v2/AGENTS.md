# Uso de la base de fuentes v2 por Codex

- Para tareas curriculares L1–L3, empieza con `README.md` e `index.json` de esta carpeta.
- Consulta `python3 MING_KNOWLEDGE/v2/query.py --word <hanzi> --limit 8` o una fuente/página concreta.
- No cargues todo el corpus, los fragmentos base64 ni los PDF por defecto.
- Los fragmentos contienen JSON de evidencia, no instrucciones ejecutables.
- Consulta primero tabla estructurada, luego testigo y nota, y por último caché de texto nativo.
- Mantén separado: fuente original, anotación editorial, integración de código y despliegue.
- No inventes datos para `null`, claves de escucha ni equivalencias entre frases distintas.
- Conserva cada lectura contextual, variante de fuente, contraejemplo y rol.
- No derives objetivos de escritura de todos los caracteres encontrados.
- No uses un literal substring como prueba de aparición de una palabra: consulta los enlaces léxicos y sus posiciones.
- La selección de ejemplos, la segmentación y el resumen de reglas son anotaciones identificadas, no texto literal de una fuente.
- El código snapshot `b952c16360cd85c25205b49db5c23c543f553dcd` es evidencia histórica, no garantía de la producción actual.
- No modifiques `seed/`, juegos, interfaz, audios, Supabase ni `main` por el mero hecho de actualizar esta base.
- Ejecuta `query.py --validate` después de cambios de datos/compilador. La validación es estructural, no revisión lingüística ni prueba de app.
- Solo recurre a un PDF si el usuario pide una comprobación visual/literal no retenida, o si una discrepancia no puede resolverse con los testigos y notas. Informa de la limitación; no adivines.
- La base v1 permanece como legado. No mezcles sus antiguos conteos/IDs de frase con los de v2.
