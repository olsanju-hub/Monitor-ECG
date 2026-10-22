# Auditoría docente ECG — uso transversal de My EKG como referencia

**Alcance:** todos los capítulos (1–10), los laboratorios y el monitor de ritmos. Estado inicial: hoja de ruta investigada, no auditoría clínica completa ni copia autorizada de materiales.

## Regla editorial
My EKG (https://www.my-ekg.com) se utiliza como fuente de consulta para identificar **qué explicar, qué demostrar y qué calcular**, nunca como plantilla visual ni repositorio de código para copiar. Los textos, diagramas, fórmulas implementadas y ejercicios de ECG deben ser originales. El usuario ha comunicado que cuenta con autorización para emplearlo como referencia; eso no define por sí solo los derechos sobre imágenes de terceros o el código de la web.

Cada microlección tendrá: concepto explicado sin presuponer conocimientos; explicación causal; representación vinculada con ECG; ejemplo guiado; problema sin respuestas adelantadas; devolución formativa; aplicación clínica y límites. No declarar dominio por abrir la página, ni trasladar calculadoras sin enseñar su uso.

## Matriz de contenidos y mejoras previstas

| Capítulo | Consulta de referencia My EKG | Carencia docente en ECG actual | Herramienta original propuesta | Estado |
|---|---|---|---|---|
| 1. Historia del ECG | Principios básicos, generalidades, electrodos y derivaciones | Temas históricos breves sin comparación de registros | Triángulo de Einthoven con I+III=II y explicación paso a paso | Pendiente |
| 2. Sistema de conducción | Sistema de conducción, ciclo cardíaco, bloqueos AV | Falta vínculo profundo estructura–tiempo–morfología | Línea de tiempo sinusal/AV/His-Purkinje sincronizada con P/PR/QRS; errores de bloqueo | Pendiente |
| 3. Vectores | Derivaciones, eje eléctrico | El gráfico tiene poca transferencia al QRS de 12 derivaciones | Proyección a seis derivaciones, ángulos y controles con feedback contextual | **Trabajo parcial existente** |
| 4. Derivaciones | Derivaciones I/II/III, aVR/aVL/aVF, precordiales y derivaciones adicionales | No integra derivación, eje, territorio y polaridad | Cámara de derivaciones con seis tiras sintéticas relacionadas y ejercicios de contigüidad | Pendiente |
| 5. Electrodos | Ubicación y trucos de electrodos | Práctica anatómica aún esquemática, falta efecto ECG de inversión | Torso original con referencia de espacios, elección de electrodos y corrección dimensional | **Trabajo parcial existente** |
| 6. Ondas e intervalos | Papel ECG, ondas, intervalos, QT, calculadoras de RR/FC/QTc | Mediciones limitadas, sin adaptación de velocidad ni corrección de QT | Papel ECG medible y calculadoras didácticas de frecuencia y QTc | **Primera calculadora implementada en este bloque** |
| 7. Interpretación sistemática | Cómo leer ECG, frecuencia, ritmo, eje, SCA | Eje despachado en pocas líneas; carece de casos progresivos | **Lección integral de eje, cuadrantes, derivación II, estimación exacta I/aVF, casos**; árbol global de lectura | **Primera lección integral implementada en este bloque** |
| 8. Arritmias | FA, flutter, TSV/TV, extrasístoles, torsades | Trazados sintéticos no validados, reconocimiento aún simplificado | Casos de ritmos a ciegas, RR medible, discriminadores de QRS y ondas P | Pendiente |
| 9. Interpretación de arritmias | Cómo leer ritmos, bloqueos, taquicardia de QRS ancho | Falta árbol de decisiones con corrección de razonamiento | Triaje de estabilidad + algoritmo guiado paso a paso, con ejemplos de excepción | Pendiente |
| 10. Diagnóstico diferencial | Ondas P/Q/T/U, ST, potasio y calcio, criterios Sgarbossa, otras patologías | Explicaciones breves sin discriminación sistemática | Comparación multipatrón, criterios de voltaje, ST/QT, causas no isquémicas | Pendiente |
| Monitor | Ritmos/alteraciones de My EKG + estándares de ECG | Formas de una derivación, morfología y validez limitada | Validar ritmos contra criterios morfológicos por derivación; trazados de referencia comprobados por especialista | Pendiente de revisión clínica |

## Orden de ejecución

1. Mejorar **eje eléctrico**: conceptos, método DI/aVF/DII, cuadrantes, cálculo aproximado por voltajes y escenarios clínicos con solución explicada. Incluir ambigüedades del eje isodifásico o QRS de muy baja amplitud.
2. Integrar calculadoras educativas (frecuencia, QTc) con validación dimensional, ejemplos y explicaciones de los supuestos; no un resultado numérico aislado.
3. Revisión de medición, derivaciones y colocación de electrodos.
4. Rehacer contenido de ritmo/conducción, incluyendo bloqueos AV.
5. Revisar isquemia, diferenciales, arritmias avanzadas y simulaciones, dando prioridad a exactitud clínica.
6. Ampliar banco de casos y preguntas. Validar enseñanza y desempeño real en iPhone.
7. Revisar cada uno de los diez capítulos y cada patrón del monitor, y documentar los límites residuales antes de declarar exhaustividad.

## Referencias consultadas y pautas de contraste

- My EKG — índice de alteraciones y calculadoras: https://www.my-ekg.com/alteraciones-ekg.html
- My EKG — interpretación paso a paso: https://mail.my-ekg.com/como-leer-ekg.php
- My EKG — eje izquierdo: https://www.my-ekg.com/como-leer-ekg/desviacion-eje-izquierda.php
- My EKG — colocación de electrodos: https://www.my-ekg.com/generalidades-ekg/electrodos-ekg.php
- My EKG — criterios de Sgarbossa modificados: https://www.my-ekg.com/infarto-ekg/criterios-sgarbossa-modificados.html
- ESC 2024, fibrilación auricular: https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/atrial-fibrillation/
- ESC 2023, síndromes coronarios agudos: https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/acute-coronary-syndromes/

## Verificación y límites
Las páginas divulgativas pueden emplear simplificaciones (p. ej., PR corto **no es suficiente** para diagnosticar WPW; un ECG aislado no establece por sí solo una etiología). Los criterios clínicos que cambien guías o terapias deberán verificarse contra documentos primarios y revisión especializada, diferenciando hechos comprobados, propuestas pedagógicas y simplificaciones sintéticas. No reclamar revisión íntegra de páginas aún no consultadas.
