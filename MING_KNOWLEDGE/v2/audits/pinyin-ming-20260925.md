# Pinyin Míng y ejemplos léxicos

Lote editorial autorizado; no es una transcripción atribuida al material ni revisión humana independiente.

| Colección | Registros | Pinyin de fuente conservado | Pinyin Míng | Elegibles sin pinyin | Exclusiones sin pinyin |
|---|---:|---:|---:|---:|---:|
| vocabulary | 346 | 267 | 70 | 0 | 9 |
| phrases | 643 | 202 | 434 | 0 | 7 |

## Proyección comprobada

```json
{
  "vocabulary_records": 337,
  "phrases": 635,
  "words_with_pinyin_and_spanish": 337,
  "phrases_with_pinyin_and_spanish": 635,
  "provenance_not_exposed": true,
  "fingerprint": "9605e460cdd9288df1a183575831280d3aaf919e3d60d64b7f32c4057b9f5c62"
}
```

## Caso 猫

```json
[
  {
    "phrase_id": "PH-104242c1007e283c",
    "hanzi": "一只猫",
    "pinyin": "Yì zhī māo",
    "spanish": "Un gato.",
    "relation": "direct_lexical",
    "via_vocab_id": null
  },
  {
    "phrase_id": "PH-0723abbd5ad5de02",
    "hanzi": "你有小猫吗？",
    "pinyin": "Nǐ yǒu xiǎomāo ma?",
    "spanish": "¿Tienes un gatito?",
    "relation": "editorial_compositional",
    "via_vocab_id": "v-小猫"
  },
  {
    "phrase_id": "PH-4ede4839fc13f6d9",
    "hanzi": "我有两只小猫，他们很可爱。",
    "pinyin": "Wǒ yǒu liǎng zhī xiǎomāo, tāmen hěn kě'ài.",
    "spanish": "Tengo dos gatitos; son muy tiernos.",
    "relation": "editorial_compositional",
    "via_vocab_id": "v-小猫"
  }
]
```

## Límites

- Preparado y comprobado por el modelo; no se afirma revisión humana independiente ni certificación fonética.
- La ausencia de pinyin registrado no demuestra que no esté impreso en alguna fuente. Este lote añade apoyo editorial, no una nueva auditoría literal de todas las páginas.
- No se transcriben como entradas válidas los nueve fragmentos mal segmentados ni los siete contraejemplos todavía sin pinyin. Permanecen contabilizados internamente.
- Las tres plantillas conservan su elipsis. Tener pinyin no las convierte en oraciones completas ni en respuestas resueltas.
- No se genera audio, imágenes, trazos ni contenido chino nuevo. La disponibilidad en localhost necesita integrar los cambios.
- Interno describe uso editorial; el repositorio es público y estos metadatos no son secretos. La exportación del alumno omite su procedencia.

Los datos documentales y las traducciones no se sobrescriben. Los nueve fragmentos y los ocho contraejemplos siguen fuera del catálogo público. Siete de esos contraejemplos carecen de pinyin y no se rellenan.

No se genera audio ni imágenes. Las tarjetas locales deben consumir pinyin/spanish y examplePhraseIds, o publicExamplesForVocabulary, tras integrar este cambio.
