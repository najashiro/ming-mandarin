# Instrucciones Míng para agentes de código

## Fuente curricular

Antes de modificar vocabulario, Hanzi, gramática, diálogos, ejercicios, juegos o exámenes:

1. Leer `MING_KNOWLEDGE/index.json`.
2. Leer `MING_KNOWLEDGE/lessons/lesson-XX.json` de la lección afectada.
3. Consultar solo los archivos necesarios dentro de `MING_KNOWLEDGE/data/`.

## PDF originales

NO releer todos los PDF por defecto.

Consultar un PDF original únicamente si:
- `data/unresolved.json` indica que el dato está pendiente;
- falta el dato solicitado;
- existe contradicción entre registros;
- el usuario pide una verificación literal contra la fuente.

## No inventar currículo

No añadir vocabulario, Hanzi, reglas o ejercicios como si fueran del curso si no están
respaldados por `MING_KNOWLEDGE` o por una fuente original explícitamente revisada.

## Conflictos

Si una fuente contradice al corpus:
- no sobrescribir silenciosamente;
- registrar la discrepancia;
- conservar procedencia;
- priorizar la fuente original correspondiente.

## Cambios

Al añadir material nuevo:
- actualizar `sources/sources.json`;
- actualizar solo las lecciones afectadas;
- añadir/actualizar registros de `data/`;
- actualizar `data/source-map.json`;
- añadir una nota en `docs/CHANGELOG.md`;
- no reconstruir todo el corpus si no es necesario.
