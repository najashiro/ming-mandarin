# Míng · Prompts de imágenes para las tarjetas

**Abrir el catálogo completo:** [visual-production/IMAGE_PROMPTS.md](visual-production/IMAGE_PROMPTS.md).

Para Codex y scripts: [visual-production/IMAGE_PROMPTS.json](visual-production/IMAGE_PROMPTS.json).

El catálogo cubre cada entrada publicada y su decisión de imagen. Cada registro con imagen contiene el prompt completo, las restricciones del significado, las referencias auténticas necesarias y su ID de vocabulario. Las entradas sin imagen propia se conservan con `prompt_es: null` y su justificación; no se pierde vocabulario.

## Petición aplicada

- Recursos fotorrealistas recortados sobre transparencia auténtica. **La tarjeta añade el fondo**; no generar marfil, blanco, cuadrícula, botones, Hanzi, pinyin o traducción dentro de la imagen.
- Países: lugar representativo + bandera nacional. Antes de generar se deben validar las referencias reales, especialmente escudos, estrellas, trigramas y arquitectura.
- Comidas apetitosas con textura real, bebidas físicamente creíbles y animales tiernos sin caricaturizar sus proporciones.
- Profesiones: ropa apropiada, instrumentos y una acción concreta; la vestimenta sola no demuestra cargo o especialidad.
- Pronombres: quién habla, a quién y sobre quién. Clasificadores y cantidades: elementos recortados con composición exacta posterior. Palabras abstractas: escena compatible con la frase, no una respuesta visual aislada.

Las escenas son propuestas editoriales de Míng, no ilustraciones extraídas del libro. No se cambian la clasificación visual, el corpus, la web ni sus medidas. No se han generado imágenes y esta preparación no autoriza gasto de API.

## Uso sin leer todo el catálogo

```bash
python MING_KNOWLEDGE/visual-production/image_prompts.py --word 猫
python MING_KNOWLEDGE/visual-production/image_prompts.py --word 中国
python MING_KNOWLEDGE/visual-production/image_prompts.py --word 工程师
python MING_KNOWLEDGE/visual-production/image_prompts.py --word 和
python MING_KNOWLEDGE/visual-production/image_prompts.py --check
```

Documentación: [visual-production/README.md](visual-production/README.md). Conteos actuales: [visual-production/summary.json](visual-production/summary.json).
