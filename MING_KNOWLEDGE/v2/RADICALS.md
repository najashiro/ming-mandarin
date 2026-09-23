# Radicales L1–L3 · dimensión curricular · v2.1.0

Base documental para Codex. No modifica la web, juegos, audio, Supabase ni progreso.
La arquitectura del corpus base se describe en `README.md` (v2.0.0); esta extensión
v2.1.0 se aplica automáticamente al consultar con `query.py`.

## Consulta sin PDF

```bash
python3 MING_KNOWLEDGE/v2/query.py --radical 讠 --limit 3
python3 MING_KNOWLEDGE/v2/query.py --hanzi 语
python3 MING_KNOWLEDGE/v2/query.py --word 汉语 --limit 3
python3 MING_KNOWLEDGE/v2/query.py --table radical_matrix --lesson 1 --limit 20
python3 MING_KNOWLEDGE/v2/query.py --table radical_assessment_items --limit 40
python3 MING_KNOWLEDGE/v2/query.py --source SRC-EXAM-B2-PARTIAL --page 1 --limit 10
python3 MING_KNOWLEDGE/v2/query.py --validate
python3 -m unittest discover -s MING_KNOWLEDGE/v2 -p 'test_*.py'
python3 MING_KNOWLEDGE/v2/query.py --export /tmp/ming-corpus-v2-1
```

Python estándar, offline, sin API pagada. `--offset` pagina los resultados.
La primera consulta reconstruye la base y añade radicales; las siguientes usan
la caché. La huella de caché incluye código y fuente de radicales. No ejecutar
`compile.py` aisladamente para obtener v2.1: es el compilador de la base v2.0.
No abrir PDF ni cadenas base64 por defecto.

## Qué se cuenta

| Elemento | Registros |
|---|---:|
| Formas de radical registradas | 38 |
| Definiciones explícitas del libro | 8 |
| Campos 部首 de hojas Hanzi conservados | 77 |
| Vínculos radical–Hanzi | 90 |
| Vínculos radical–palabra a través de Hanzi | 257 |
| Vínculos radical–enunciado por relaciones léxicas existentes | 1804 |
| Conjuntos de evaluación/práctica | 4 |
| Caracteres preguntados en esos conjuntos | 40 |
| Caracteres de la sección II del examen | 10 |

Las 38 formas no son 38 radicales formalmente enseñados por el libro. Las 77
filas no son 77 radicales únicos. Los vínculos conservan el estado documental
o de propuesta: no todos son claves oficiales ni asignaciones de diccionario.

## Tablas generadas

| Tabla | Función |
|---|---|
| `radical_catalog` | ID estable por forma exacta, nombre/significado de fuente, roles, lecciones y referencias |
| `radical_evidence` | Definiciones, campos de hoja y preguntas con procedencia y estado de la afirmación |
| `radical_hanzi_links` | Radical de cada carácter, distinguiendo fuente explícita de propuesta para ejercicio |
| `radical_word_links` | Palabra → carácter → radical; nunca un radical único atribuido a toda una palabra |
| `radical_phrase_links` | Enunciados alcanzados por los enlaces palabra–frase ya existentes |
| `radical_assessment_sets` | Consignas, familias de preguntas y puntuación impresa |
| `radical_assessment_items` | Cada carácter preguntado, página exacta y candidato de respuesta etiquetado |
| `radical_matrix` | Comparación teoría / práctica / PPT / hojas / examen, caracteres y usos |
| `radical_corrections` / `radical_notes` | Correcciones de extracción y límites explícitos |

`hanzi`, `vocabulary` y `matrix` también reciben los IDs de enlace. Se conservan
los IDs `c-…`, `v-…` y `PH-…` existentes. Los nuevos IDs de radical usan la forma
Unicode exacta, por ejemplo `RAD-U8BA0` para 讠.

## Fuente, interpretación y examen

- `named_radical_in_textbook`: definición explícita, con nombre, trazos,
  ejemplos y explicación. L1: PDF 59 / impresa 58; L2: PDF 85 / impresa 84;
  L3: PDF 21 / impresa 108.
- `worksheet_radical`: campo 部首 transcrito de una fila de hoja. Se reutilizan
  los 77 testigos de `hanzi_evidence`; no se rellenan campos antes vacíos.
- `workbook_radical_prompt` / `exam_radical_prompt`: la fuente pregunta por
  radicales. El candidato de respuesta es una anotación editorial visual o
  por cruce de fuentes, NO una respuesta impresa ni una clave docente oficial.

El cuaderno L1 usa las páginas PDF 3–4, L2 las 11–12 y L3 la 3. Se conserva la
página real de cada pareja, incluidas las que continúan en la página siguiente.
La sección II del examen usa, en ese orden:

`什、们、语、识、她、妈、饺、饭、汉、海`

Coincide con los diez caracteres del ejercicio de radicales del cuaderno L2.
El examen pide radical y significado y declara `1*10=10`. Se registran ambos
objetivos y sus diez ítems. No se copian respuestas manuscritas, nombre ni nota.
Todos los ítems indican `source_answer_key_supplied=false` y
`automatic_grading_approved=false`: una futura calificación requiere revisión.

Un nombre o significado no presente en una definición explícita queda `null`.
Por ejemplo, no se atribuyen al libro nombres de 女 o 氵 añadidos de memoria.
Eso no afirma que esos radicales carezcan de nombre/significado, sino que ese
campo no está sustentado en las definiciones extraídas. Un glosario externo o
una clave docente futura deberá añadirse como otra fuente, no sobrescribirla.

## Correcciones documentadas de la extracción anterior

1. **辶:** el libro imprime `zǒuzhīdǐ`, no `zǒuzhīpáng` (PDF 59).
2. **饣:** sus ejemplos en la tabla son `饭、饼、饿`, no `饭、饺` (PDF 85).
   `饺` continúa vinculado al cuaderno y al examen, no a esa tabla del libro.

`radicals` exporta las ocho definiciones cotejadas. `radicals_legacy_v2` conserva
la transcripción anterior y `radical_corrections` conserva el antes/después.
Los fragmentos originales de `source/` permanecen intactos.

También queda registrada 女 en L1 mediante 好/姓; un guion en una tabla previa
no probaba su ausencia. `冃` de 有 se conserva como forma de la hoja; no se
sustituye por 月. Tampoco se confunden 口/囗 ni ⺊/卜. El esquema visual de 岁 en
PPT 3.2 no se convierte en una regla de radicales: 山 procede de la hoja.

## Límites y mantenimiento

Una frase que contiene un carácter no demuestra que esa página enseñe el radical.
`counts_as_radical_teaching_evidence=false` hace explícito ese límite.
`ppt_refs=[]` significa que esta extensión no registra una definición explícita
allí; no demuestra ausencia de componentes o ilustraciones en todas las PPT.
La cobertura de Hanzi reutiliza el snapshot de código documentado en v2.0;
no verifica una pantalla de radicales ni un despliegue.

Editar `radicals-source.json` para cambios documentales y `radicals.py` para
las relaciones. Ejecutar validación y los 13 tests offline. Es validación
estructural y de regresión, no certificación lingüística externa. Si crece el
inventario, actualizar los recuentos esperados de los tests de forma justificada.
