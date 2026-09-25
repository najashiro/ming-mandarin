# Auditoría del corpus: tablas y hojas Hanzi

Fecha del cotejo visual: 2026-09-25

Alcance: las seis tablas de **生词 / Palabras nuevas** y las tres de **补充词语 / Palabras suplementarias** de L1–L3. Se excluye la numeración independiente de la introducción fonética.

Resultado: **9 tablas, 147 entradas numeradas y 12 subentradas explícitas: 159 registros verificados.**

| Tabla | Lección | Numeradas | Subentradas | Total | Páginas PDF | Páginas impresas |
|---|---:|---:|---:|---:|---|---|
| TB-L1-T1-NEW | 1 | 14 | 2 | 16 | 46 | 45 |
| TB-L1-T2-NEW | 1 | 14 | 0 | 14 | 48 | 47 |
| TB-L1-SUPPLEMENTARY | 1 | 7 | 0 | 7 | 54 | 53 |
| TB-L2-T1-NEW | 2 | 19 | 3 | 22 | 66, 67 | 65, 66 |
| TB-L2-T2-NEW | 2 | 19 | 2 | 21 | 70, 71 | 69, 70 |
| TB-L2-SUPPLEMENTARY | 2 | 17 | 0 | 17 | 77, 78 | 76, 77 |
| TB-L3-T1-NEW | 3 | 21 | 1 | 22 | 3, 4 | 90, 91 |
| TB-L3-T2-NEW | 3 | 18 | 4 | 22 | 6, 7 | 93, 94 |
| TB-L3-SUPPLEMENTARY | 3 | 18 | 0 | 18 | 15, 16 | 102, 103 |

## Hojas Hanzi

**9 archivos y 229 apariciones de caracteres**, conservando repeticiones y página. No son 229 caracteres únicos.

太: SRC-HANZI-01-3, página PDF 2, fila 4, tài, 4 trazos. El identificador de esta hoja no sustituye la unidad curricular 1.2 del motor.

## Pinyin recuperado de las fuentes

Se completaron los siguientes testigos con pinyin visible en la página original. Las variantes y las transcripciones de otras fuentes no se sobrescriben.

- 我家有五口人。 — Wǒ jiā yǒu wǔ kǒu rén. — SRC-PPT-03-1, PDF 13.
- 你有弟弟吗？ — Nǐ yǒu dìdi ma? — SRC-PPT-03-1, PDF 13.
- 我没有弟弟，我有一个哥哥。 — Wǒ méiyǒu dìdi, wǒ yǒu yíge gēge. — SRC-PPT-03-1, PDF 13.
- 大家好！我姓马，叫马大为，是美国人。 — Dàjiā hǎo! Wǒ xìng Mǎ, jiào Mǎ Dàwéi, shì Měiguórén. — SRC-BOOK-03, PDF 19.
- 我们家一共有五口人，爸爸、妈妈、哥哥和我，还有约翰（John）。 — Wǒmen jiā yígòng yǒu wǔ kǒu rén, bàba, māma, gēge hé wǒ, hái yǒu Yuēhàn. — SRC-BOOK-03, PDF 19.
- 约翰是我的狗，今年两岁。 — Yuēhàn shì wǒ de gǒu, jīnnián liǎng suì. — SRC-BOOK-03, PDF 19.
- 我爸爸是律师，我妈妈是工程师，我哥哥是经理。 — Wǒ bàba shì lǜshī, wǒ māma shì gōngchéngshī, wǒ gēge shì jīnglǐ. — SRC-BOOK-03, PDF 19.
- 我的老师是陈老师，我们都很喜欢她。 — Wǒ de lǎoshī shì Chén lǎoshī, wǒmen dōu hěn xǐhuan tā. — SRC-BOOK-03, PDF 19.
- 我有三个中国朋友，王小云、宋华和陆雨平。 — Wǒ yǒu sān ge Zhōngguó péngyou, Wáng Xiǎoyún, Sòng Huá hé Lù Yǔpíng. — SRC-BOOK-03, PDF 19.

## Límites que siguen abiertos

El corpus tiene 346 entradas de vocabulario, de las cuales 267 tienen pinyin seleccionado; y 643 enunciados, de los cuales 202 tienen alguna transcripción de pinyin registrada y 53 alguna traducción española de fuente registrada.

**Esto no certifica que todos los enunciados tengan pinyin/traducción ni que funcionen sus audios, imágenes o fichas en producción.** No se generan ni inventan campos para ocultar estos límites.

La clasificación de una lista es independiente de la naturaleza léxica: un nombre propio puede pertenecer a Palabras nuevas. Una aparición posterior no equivale a introducción curricular.

La tabla impresa de 马马虎虎 dice **Adj.**, no Adv.; se registra ese dato sin reinterpretar el original.

La proyección pública conserva relaciones lección–rol–tipo de lista y evidencia documental Hanzi, pero excluye páginas, nombres de PDF, notas y referencias internas.

## Reproducir

```bash
python MING_KNOWLEDGE/v2/query.py --validate
python scripts/export-corpus-v21.py --check
python MING_KNOWLEDGE/v2/audit_source_tables.py --check
python -m unittest discover -s MING_KNOWLEDGE/v2 -p 'test_*.py'
```
