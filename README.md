# ECG · Academia + Monitor

Aplicación educativa sin cuentas, con progreso local, integrada con un monitor docente de ritmos. Evoluciona el repositorio Monitor-ECG conservando su historial. Respaldo original: rama backup/monitor-original-2026-10-22.

## Disponible en esta primera versión
- Inicio y navegación responsive para móvil y escritorio.
- Diez capítulos y 69 microlecciones docentes originales estructuradas según el temario de Aprenda ECG en un día (2014).
- Evaluación inicial, test por capítulo, test acumulativo y examen final con banco inicial de preguntas originales.
- Explicaciones, SVG docente de conducción, vectores y electrodos precordiales; medición interactiva RR/FC sobre papel ECG.
- Monitor v2 con síntesis temporal determinista de ondas P, QRS y repolarización; pausa, velocidad, cuadrícula calibrada 25 mm/s y 10 mm/mV, marcadores QRS y retos de reconocimiento. Incluye algoritmos separados para FA, flutter, Mobitz I/II, bloqueo AV completo, ectopias, TV, torsades y FV. Sigue siendo simulación docente sin validación clínica.
- Guardado automático local; exportar/importar JSON; reiniciar capítulo o progreso completo.
- Manifest y service worker offline-first para ficheros esenciales después de la primera carga.

## Limitaciones conocidas
Versión inicial educativa, NO un curso clínicamente auditado ni un dispositivo médico. No se han comprobado de manera exhaustiva las 99 páginas del PDF. Faltan la representación validada de las 12 derivaciones, SVG anatómicos definitivos de nivel atlas, arrastre evaluable de electrodos, banco de múltiples ejercicios por concepto, revisión científica externa y pruebas completas en móviles. Los ritmos sintéticos del monitor son esquemas ilustrativos, no ECG clínicos certificados.

No se incluye el PDF completo en el repositorio público por derechos de autor.

## Ejecutar
En la carpeta del repositorio inicia un servidor HTTP estático (por ejemplo, python3 -m http.server 8080). Visita http://localhost:8080. El service worker requiere HTTPS o localhost.

## Publicar con GitHub Pages
Incluida la automatización en .github/workflows/deploy-pages.yml. En Settings > Pages, configura Build and deployment > Source: GitHub Actions. Repite la acción Publicar ECG si es necesario. Usa el enlace confirmado por GitHub después de una publicación exitosa. En iPhone Safari puedes usar Compartir > Añadir a pantalla de inicio.

## Referencias orientativas
- Sajjan M. Aprenda ECG en un Día: Un Enfoque Sistemático. Edición española 2014.
- ESC, síndrome coronario agudo 2023.
- ESC, fibrilación auricular 2024.
- Fourth Universal Definition of Myocardial Infarction, 2018.

## Próximas mejoras
Auditar todos los apartados frente al PDF, ampliar banco de ejercicios y casos, SVG de doce derivaciones con corrección clínica y prueba real del offline/PWA en dispositivos.

## Pruebas automáticas del monitor

Ejecutar: `node --test tests/ecg-engine.test.cjs`.

Se incluyen pruebas de secuenciación de aurículas/ventrículos, duraciones RR/PR, P bloqueadas, arritmias, muestrario determinista y ausencia de complejos organizados en asistolia/FV. GitHub Actions ejecuta estas pruebas antes de la publicación. Superarlas demuestra coherencia computacional de los modelos probados, **no precisión diagnóstica clínica ni equivalencia con registros de pacientes**.
