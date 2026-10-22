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
Se mantiene la publicación ya existente del repositorio mediante GitHub Pages (fuente: rama main). La aplicación se actualiza mediante el servicio automático de Pages. Verifica el despliegue efectivo en Actions > pages build and deployment. No activar un segundo despliegue paralelo en GitHub Actions. En iPhone Safari puedes usar Compartir > Añadir a pantalla de inicio.

## Referencias orientativas
- Sajjan M. Aprenda ECG en un Día: Un Enfoque Sistemático. Edición española 2014.
- ESC, síndrome coronario agudo 2023.
- ESC, fibrilación auricular 2024.
- Fourth Universal Definition of Myocardial Infarction, 2018.

## Próximas mejoras
Auditar todos los apartados frente al PDF, ampliar banco de ejercicios y casos, SVG de doce derivaciones con corrección clínica y prueba real del offline/PWA en dispositivos.

## Pruebas automáticas del monitor

Ejecutar: `node --test tests/ecg-engine.test.cjs`.

Se incluyen pruebas de secuenciación de aurículas/ventrículos, duraciones RR/PR, P bloqueadas, arritmias, muestrario determinista y ausencia de complejos organizados en asistolia/FV. GitHub Actions ejecuta estas pruebas de manera independiente en el workflow Validar ECG. El resultado se debe consultar junto al despliegue; la configuración actual de Pages no bloquea automáticamente una publicación si fallan. Superarlas demuestra coherencia computacional de los modelos probados, **no precisión diagnóstica clínica ni equivalencia con registros de pacientes**.

## Referencia docente transversal: My EKG

Se ha incorporado la web https://www.my-ekg.com como referencia formativa para **los diez capítulos y el monitor**, no solo para el eje eléctrico. Consulta el mapa original de auditoría y propuestas en [docs/auditoria-docente-my-ekg.md](docs/auditoria-docente-my-ekg.md). El usuario ha confirmado autorización para consultarla como referencia: eso no implica reutilizar código o imágenes de terceros sin examinar sus derechos.

Esta primera entrega crea una explicación paso a paso del eje del QRS (I/aVF/II y seis casos con voltajes sintéticos) y calculadoras didácticas propias de frecuencia y QTc, con pruebas automáticas. La auditoría del resto de los temas y de todos los trazados está **programada, no finalizada**.

Las fuentes educativas se contrastan con guías y estándares clínicos cuando proceda; no se convierten simplificaciones de una web en criterios diagnósticos vinculantes. Especialmente, las recomendaciones ESC 2024 para FA utilizan CHA2DS2-VA y las ESC 2023 para SCA requieren interpretación del ECG junto con clínica, reevaluación y biomarcadores.
