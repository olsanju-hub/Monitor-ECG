# Estándar de calidad de las herramientas educativas ECG

Este estándar se aplica al curso completo, no solo al eje eléctrico.

## Qué se acepta como herramienta terminada

1. **Exactitud:** la anatomía, el algoritmo o el ECG representan un fenómeno clínico correctamente identificado. Las simplificaciones se declaran expresamente. No basta que el gráfico se parezca al fenómeno.
2. **Diseño profesional:** ilustración vectorial legible, trazos y colores consistentes, etiquetas con jerarquía, buen contraste y sin estética infantil ni polígonos rudimentarios. El color codifica significado, no adorno.
3. **Función docente:** cada herramienta conecta concepto, observación, acción del usuario, comprobación y corrección razonada. Ninguna ilustración se incluye por decoración.
4. **Móvil y escritorio:** equivalencia educativa, zonas táctiles amplias, controles bajo la ilustración, zoom deliberado, sin scroll horizontal de la página ni dependencia de hover.
5. **Evaluación fiel:** las respuestas no se revelan antes del ejercicio; las coordenadas de los objetos evaluables coinciden con sus representaciones; se mide aprendizaje y no solo una pulsación.
6. **Verificación:** fórmulas y conversiones con pruebas unitarias; visualización comprobada en 375, 390, 430, 768 y 1440 px; revisión humana en Safari y PWA; contraste clínico experto antes de declarar validez diagnóstica.
7. **Fuentes:** My EKG es referencia educativa transversal; las guías y los criterios clínicos se contrastan con fuentes primarias. No se copian imágenes ni código de terceros.

## Fase visual 1 (revisión de esta PR)

- [x] Corazón por capas con cavidades y sistema de conducción seleccionable.
- [x] Tórax por capas con esternón, costillas y referencias de superficie para V1–V6.
- [x] Tira ECG con ondas acotadas a tiempos exactos del ejercicio y cuadrícula calibrada.
- [x] Se conservan puntos interactivos, examen sin pistas y escalado táctil.
- [x] Pruebas matemáticas de integridad de hitboxes y tiempos.
- [ ] Verificación manual de precisión anatómica por especialista externo.
- [ ] Revisión visual y de ergonomía en Safari de iPhone real.

## Fases pendientes

- Vector frontal: representar seis proyecciones y morfologías derivadas de un mismo vector, más casos clínicos diferenciados.
- Derivaciones: pasar de orientación abstracta a esquemas relacionables con ECG reales y territorios.
- Ondas e intervalos: curva con ampliación, cursores, calibración editable, variantes y ejemplos reales.
- Monitor: auditar uno a uno sus 30 patrones contra referencias electrocardiográficas contrastadas; eliminar cualquier patrón cuya derivación o morfología no permitan justificar el diagnóstico mostrado.
- Interpretación: casos reales de 12 derivaciones con criterios, pasos razonados y diagnóstico diferencial; no solo tiras sintéticas.
- Pedagogía: mejorar las 69 microlecciones y ampliar preguntas con casos progresivos, errores frecuentes y reevaluación.

**Estado:** primera mejora del acabado vectorial implementada, NO curso terminado ni trazados clínicamente validados.
