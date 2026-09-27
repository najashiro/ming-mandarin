# Agentes · Producción visual de vocabulario

El usuario autorizó preparar este catálogo de prompts, no ejecutar generación. Lee `README.md` y `prompt-policy.json` antes de usarlo.

- `IMAGE_PROMPTS.json` y `.md` son derivados; no editarlos a mano. Las decisiones explícitas se mantienen en los archivos `recipes-*.tsv`, la política común y `reference-requirements.json`.
- Conservar los IDs, el chino, el pinyin, el español y `visual_ming` del corpus. Los prompts no se exportan al navegador y no son evidencia documental del libro.
- Generar solo sujetos/escenas con canal alfa cuando se autorice: fondo de tarjeta y controles son responsabilidad de la web. La referencia del usuario NO autoriza copiar favoritos, giro, marfil o texto dentro del recurso.
- En `none`, no inventar una imagen. En `phrase_context`, seleccionar una frase compatible; las imágenes no definen la palabra aislada. En `visual_grammar`, composición de cantidades, referencias y texto de forma determinista.
- Validar referencias auténticas para cualquier monumento y bandera mencionados, también en escenas de procedencia personal. `reference-requirements.json` conserva esta necesidad por ID; las referencias aún no están suministradas ni verificadas. No inferir nacionalidad de apariencia. Una ocupación exige contexto, no solo ropa.
- Las escenas son editoriales y usan personas ficticias. No reconstruir identidades de personajes nombrados ni presentar retratos generados como fuentes auténticas.
- `production_unit_id` compartida permite reutilizar una receta visual idéntica tras revisión; no crea sinonimia ni fusiona progreso.
- Ningún `image_quiz_candidate` implica recurso existente, aprobado o habilitado. Todos los recursos necesitan control real de alfa, anatomía, semántica, referencias y respuestas equivalentes.
- No generar imágenes, llamar API, usar secretos, publicar o modificar UI al compilar. `--write` solo actualiza tres archivos de texto derivados.
- Ejecutar `python MING_KNOWLEDGE/visual-production/image_prompts.py --check` y sus pruebas. Mantener las comprobaciones del corpus y aplicación antes de fusionar.
