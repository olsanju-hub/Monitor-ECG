/* ECG Academia — contenido docente ORIGINAL. Fuente temática:
 * Aprenda ECG en un día (2014), capítulos 1–10. No reproduce texto del libro.
 * Valores y criterios clínicos actualizados requieren revisión editorial humana.
 */
(function(){
const C = [
["Historia del ECG", [
["Einthoven y el registro eléctrico","Willem Einthoven hizo posible registrar la actividad cardíaca con un galvanómetro de cuerda. El ECG actual conserva la idea de medir diferencias de potencial en superficie.","La máquina registra voltaje frente al tiempo; no registra la contracción mecánica."],
["P, Q, R, S y T","La nomenclatura PQRST describe deflexiones sucesivas del trazado. La letra no identifica por sí sola una enfermedad.","P auricular, QRS ventricular, T repolarización ventricular."],
["Triángulo de Einthoven","Las derivaciones I, II y III observan la actividad en el plano frontal mediante diferencias de potencial de las extremidades.","Ley de Einthoven: II = I + III, con la misma convención de signos."]
]],
["Fisiología del sistema de conducción", [
["Nodo sinusal y automatismo","El nodo sinoauricular inicia normalmente el ritmo. Los marcapasos subsidiarios pueden asumir el control con frecuencias habitualmente más lentas.","Un ritmo de escape no siempre indica que el nodo sinusal esté completamente inactivo."],
["Activación auricular","La propagación desde la aurícula derecha hacia la izquierda produce la onda P. La dirección global condiciona su polaridad en cada derivación.","La P sinusal suele ser positiva en II y negativa en aVR."],
["Nodo AV: retraso fisiológico","La conducción a través del nodo AV demora el impulso antes de activar el sistema His–Purkinje y permite el llenado ventricular.","El intervalo PR engloba la conducción auricular y AV."],
["Haz de His y ramas","El haz de His se divide en las ramas derecha e izquierda. Una conducción intraventricular lenta puede ensanchar el QRS.","BRD y BRI requieren criterios morfológicos, no solo QRS ancho."],
["Fibras de Purkinje","La red de Purkinje sincroniza la activación ventricular. El paso célula a célula es mucho más lento que el sistema especializado.","La activación normal produce QRS relativamente estrechos."],
["Secuencia de despolarización ventricular","La activación inicia en el septo, se propaga por ventrículos y finaliza en regiones basales. El vector resultante cambia durante el QRS.","No confundir la activación eléctrica con el flujo sanguíneo."]
]],
["Fundamentos del ECG", [
["Vector eléctrico","Cada derivación registra la proyección de los vectores eléctricos sobre su eje. La misma actividad puede verse positiva en una derivación y negativa en otra.","Vector que se dirige al polo positivo: deflexión generalmente positiva."],
["Suma de vectores","Las fuerzas simultáneas se suman vectorialmente. Las componentes opuestas se cancelan parcial o totalmente.","El ECG superficial es una representación macroscópica de actividad celular."],
["Deflexión bifásica","Si la activación transcurre aproximadamente perpendicular al eje de una derivación, pueden aparecer complejos equipásicos.","Un complejo casi isodifásico ayuda a estimar el eje perpendicular."],
["Tiempo y amplitud","El eje horizontal representa segundos y el vertical representa milivoltios. Para medir correctamente es indispensable conocer velocidad y calibración.","No deduzcas duración por la anchura de la onda sin comprobar la velocidad."]
]],
["Derivaciones del ECG", [
["Derivaciones I, II, III","Son bipolares: I = brazo izquierdo – brazo derecho; II = pierna izquierda – brazo derecho; III = pierna izquierda – brazo izquierdo.","En un ECG de 12 derivaciones hay 10 electrodos, no 12."],
["aVR, aVL y aVF","Son derivaciones aumentadas de extremidades que exploran el plano frontal con diferentes orientaciones.","aVR suele mostrar P y QRS predominantemente negativos en el ECG sinusal típico."],
["Precordiales V1–V6","Observan el plano horizontal: V1–V2 región septal/derecha, V3–V4 anterior y V5–V6 lateral.","Las correspondencias territoriales son aproximadas, no cartografías exactas."],
["Sistema hexaxial","Las seis derivaciones frontales son observadores distintos de un mismo fenómeno: I 0°, II +60°, III +120°, aVF +90°, aVL −30° y aVR −150°. Una fuerza eléctrica hacia el polo positivo produce deflexión neta positiva y una fuerza perpendicular tiende a producir un QRS equipásico. Por ejemplo, un vector dirigido a +60° da máxima proyección positiva en II, también positiva en I y aVF, y negativa en aVR.","Aprende el método de los cuadrantes en la lección Eje eléctrico (capítulo 7); úsalo junto a ejemplos, no memorices solo ángulos."],
["Territorios y contigüidad","II, III y aVF miran la cara inferior; I y aVL la lateral alta. Las alteraciones de ST se interpretan en derivaciones anatómicamente relacionadas.","Correlaciona derivaciones con clínica; no atribuyas con certeza la arteria culpable solo por un patrón."]
]],
["Colocación de electrodos", [
["Extremidades","RA y LA corresponden a los miembros superiores; RL es referencia y LL a la pierna izquierda. La colocación debe seguir un protocolo reproducible.","La inversión de electrodos puede simular patología o alterar el eje."],
["V1 y V2","V1 se coloca en el cuarto espacio intercostal, borde esternal derecho; V2 en el cuarto espacio, borde esternal izquierdo.","La colocación demasiado alta de V1–V2 altera P y QRS."],
["V3 y V4","V4: quinto espacio intercostal, línea medioclavicular izquierda; V3 queda a mitad de camino entre V2 y V4.","Colocar V4 antes de V3 evita errores de altura."],
["V5 y V6","V5: línea axilar anterior izquierda; V6: línea axilar media izquierda, ambos al nivel horizontal de V4.","No desplaces V5–V6 hacia abajo siguiendo costillas."],
["Verificación antes de interpretar","Corrobora calibración, velocidad, artefactos y posible inversión de cables antes de adjudicar hallazgos a enfermedad.","Un ECG técnicamente incorrecto puede producir diagnósticos falsos."]
]],
["Morfología normal del ECG", [
["Papel y calibración","A 25 mm/s un cuadrito de 1 mm representa 0,04 s y 5 mm 0,20 s. A 10 mm/mV, 1 mm vertical representa 0,1 mV.","La calibración puede cambiar; compruébala siempre."],
["Onda P y PR","P = despolarización auricular; el intervalo PR se mide desde inicio de P hasta inicio del QRS. PR habitual 120–200 ms.","No confundir intervalo PR con segmento PR."],
["Complejo QRS","Q es la primera deflexión negativa antes de R; R es la primera positiva; S es la negativa posterior. QS carece de onda R positiva.","La duración QRS habitual en adultos es inferior a 120 ms."],
["ST y T","El ST empieza al final del QRS y la onda T refleja repolarización ventricular. El punto J marca la unión QRS-ST.","ST o T anormales no equivalen automáticamente a infarto."],
["Progresión de R","Normalmente R crece en amplitud de V1 hacia V5 y la transición R/S suele ocurrir alrededor de V3–V4.","La mala progresión de R tiene múltiples causas, incluyendo mala colocación."],
["Medición de QT y QTc","Mide el QT desde el comienzo del QRS hasta el final de la onda T, preferiblemente en una derivación con final de T bien identificable. Con QT 400 ms y FC 75 lpm, RR = 0,80 s; Bazett estima QTc aproximadamente 447 ms y Fridericia aproximadamente 431 ms. Comprueba la técnica, la onda U, los fármacos y los electrolitos antes de interpretar un valor anormal.","No diagnostiques síndrome de QT largo solo por un número calculado. Bazett puede sobrecorregir cuando la frecuencia es alta y subcorregir cuando es baja."]
]],
["Interpretación sistemática", [
["Control técnico y aVR","Antes de interpretar: velocidad, ganancia, artefacto, identificación, calidad de derivaciones y aVR. Alteraciones globales inesperadas obligan a verificar electrodos.","Nunca etiquetes un ECG como patológico sin verificar técnica."],
["Frecuencia regular e irregular","Antes de calcular, observa si los intervalos RR son constantes. A 25 mm/s un cuadro grande representa 0,20 s: con cuatro cuadros grandes entre dos R, RR = 0,80 s y FC = 75 lpm (300/4). Si el ritmo es irregular, cuenta los complejos en un periodo conocido, por ejemplo seis segundos, y comunica que la cifra es una estimación; no uses un RR aislado para representar todo el ritmo.","La velocidad del papel modifica el número de cuadros por segundo. Cambiar de 25 a 50 mm/s sin ajustar la fórmula duplica el error de cálculo."],
["Ritmo sinusal","Busca ondas P sinusales, relación P-QRS, PR consistente y valoración de regularidad. El origen del ritmo no se deduce solo de la FC.","P positiva en II y negativa en aVR orienta a origen sinusal."],
["Eje eléctrico","El eje medio del QRS es la dirección resultante de la despolarización ventricular proyectada sobre el plano frontal. Para estimarlo observa el voltaje neto del QRS en I y aVF, identifica el cuadrante y, cuando I sea positiva y aVF negativa, consulta II: si II es positiva el eje puede ser normal entre −30° y 0°; si es negativa orienta a desviación izquierda. Después relaciona el resultado con la morfología, la técnica del ECG, el ritmo y el contexto clínico. Practica con seis casos y la calculadora de voltajes.","Un eje normal adulto suele estar entre −30° y +90°. Una desviación del eje orienta, pero no diagnostica por sí sola hipertrofia, hemibloqueo ni infarto."],
["Crecimiento auricular y onda P","P alta y puntiaguda puede sugerir alteración auricular derecha; P ancha y morfología terminal negativa en V1, izquierda. Ninguna sustituye imagen.","‘P mitrale’ y ‘P pulmonale’ son términos históricos y no diagnósticos etiológicos."],
["PR corto y bloqueos AV","PR corto puede tener distintas causas. PR prolongado con cada P conducida es BAV de 1.º grado; Wenckebach alarga PR hasta P bloqueada; Mobitz II mantiene PR estable con pérdidas.","BAV 2:1 no puede clasificarse automáticamente como Mobitz I o II."],
["Bloqueo AV completo","Las ondas P y los QRS siguen ritmos independientes; el foco de escape determina frecuencia y anchura del QRS.","La bradicardia y síntomas de hipoperfusión aumentan urgencia."],
["QRS, Q y repolarización","Valora duración, morfología, voltajes, ondas Q y cambios de ST/T comparando derivaciones contiguas y patrones previos.","Q patológica o T negativa aisladas no confirman necrosis ni isquemia."],
["SCA e IAM: criterios actuales","La elevación en punto J de derivaciones contiguas depende de derivación, edad y sexo. En V2–V3: varones <40 ≥2,5 mm, ≥40 ≥2 mm; mujeres ≥1,5 mm; en otras derivaciones ≥1 mm, en contexto apropiado.","La sospecha clínica puede ser alta con ECG inicial no diagnóstico; confirmar IAM requiere clínica y biomarcadores."],
["Territorios y cambios recíprocos","Patrón inferior en II/III/aVF, anterior V1–V4, lateral I/aVL/V5–V6; cambios recíprocos pueden respaldar sospecha. El IAM posterior puede manifestarse con depresión ST V1–V3.","Considera derivaciones posteriores V7–V9 y derechas cuando estén indicadas."],
["Hipertrofia y sobrecarga ventricular","Voltajes (Sokolow-Lyon y Cornell) y repolarización pueden sugerir HVI. HVD puede producir R dominante en V1 y sobrecarga derecha; la sensibilidad del ECG es limitada.","No diagnosticar hipertrofia solo con voltaje aislado."],
["BRD, BRI y hemibloqueos","BRD suele mostrar patrón terminal en V1 y S ancha en I/V6; BRI muestra QRS ancho y morfología lateral característica; fasciculares afectan el eje con contexto.","BRI no implica siempre desviación izquierda del eje; en SCA con BRI considerar criterios específicos."]
]],
["Arritmias", [
["Enfoque electrocardiográfico","Primero identificar estabilidad clínica, regularidad y frecuencia; después anchura QRS, onda P y relación AV.","Taquicardia de QRS ancho exige considerar TV hasta valoración experta."],
["Extrasístoles auriculares","Latido precoz con P distinta de la sinusal, habitualmente QRS estrecho salvo aberrancia; la pausa posterior puede ser no completamente compensadora.","La P prematura puede superponerse a la T previa."],
["Extrasístoles ventriculares","Complejo ventricular prematuro usualmente ancho y con repolarización discordante. Puede ser uni/multiforme, bigeminado o interpolado.","No todas las EV presentan una pausa compensadora completa."],
["Ritmo de la unión","Puede mostrar P retrógrada antes, dentro o después de QRS; frecuencia de escape de unión habitualmente 40–60 lpm.","La ubicación de P ayuda a inferir el origen."],
["Pausas sinusales y bloqueos SA","La ausencia temporal de actividad auricular exige analizar relación con ciclo PP; una pausa múltiplo de PP orienta a bloqueo SA de salida.","No definir paro sinusal únicamente por un umbral arbitrario de 1,5 segundos."],
["Ritmos de escape","Aparecen tras fallo o lentitud del marcapasos dominante: auricular, unión o ventricular, con diferentes características de P y QRS.","Un escape ventricular puede producir complejos anchos y frecuencia lenta."],
["Ritmos sinusales anormales","Bradicardia sinusal <60 lpm, taquicardia sinusal >100 lpm; arritmia sinusal respiratoria varía RR con ventilación manteniendo P sinusal.","La frecuencia sola no establece la etiología."],
["Taquicardias supraventriculares","AVNRT y AVRT son mecanismos de reentrada; taquicardia auricular nace de foco auricular. QRS habitualmente estrecho, aunque puede haber aberrancia.","Inicio súbito y P retrograda ayudan, pero no bastan para diagnóstico mecanístico."],
["Fibrilación auricular","Ausencia de P sinusales organizadas y respuesta ventricular irregularmente irregular, con excepciones por conducción/estimulación.","Requiere documentación ECG; no deducir FA solo de palpitaciones."],
["Flutter auricular","Actividad auricular regular (frecuentemente ~300/min) en ondas F; conducción 2:1 puede generar FC ventricular ~150/min.","Un ritmo regular a 150 lpm exige considerar flutter 2:1."],
["Taquicardia ventricular","QRS ancho con origen ventricular; disociación AV, capturas y fusiones favorecen TV. Puede ser monomórfica o polimórfica.","Una taquicardia regular de QRS ancho no debe presumirse supraventricular."],
["Torsades de pointes","TV polimórfica característica, asociada a prolongación QT; morfología y amplitud oscilan alrededor de la línea de base.","No toda TV polimórfica es torsades si el QT previo no está prolongado."],
["Fibrilación ventricular","Actividad ventricular caótica sin complejos organizados ni bombeo eficaz; en paciente sin pulso constituye emergencia.","No confundir artefactos con FV ni demorar ayuda en contexto real."],
["Ritmo idioventricular","Escape ventricular lento, con formas aceleradas en determinadas situaciones como reperfusión; QRS ancho.","Clasifica frecuencia y contexto; no equiparar todo ritmo ancho lento a TV."],
["Preexcitación: WPW","PR corto, onda delta y QRS ensanchado definen patrón de preexcitación; síndrome añade taquiarritmia clínica. La vía accesoria altera la conducción.","Distingue patrón WPW de síndrome WPW; FA preexcitada es de alto riesgo."]
]],
["Interpretación de arritmias", [
["Estabilidad primero","En contexto clínico, valorar estado hemodinámico, consciencia, perfusión y dolor torácico antes de clasificar electrocardiográficamente.","El tratamiento urgente depende de la situación clínica, no solo de la etiqueta del ritmo."],
["Frecuencia y regularidad","Bradi/taqui, regular o irregular constituyen el primer nivel del árbol diagnóstico. Evalúa intervalos PP, RR y regularidad real.","Flutter variable y extrasístoles pueden alterar regularidad."],
["Anchura del QRS","QRS estrecho suele implicar activación supraventricular normal; ancho puede reflejar origen ventricular, aberrancia, preexcitación o fármacos/electrolitos.","La morfología debe interpretarse con el contexto."],
["Relación P–QRS","Busca P, su polaridad, conducción 1:1, AV disociada o ondas de flutter. P oculta no significa necesariamente ausencia auricular.","P y QRS independientes sugieren bloqueo completo o disociación."],
["Algoritmo integrador","Combina estabilidad, FC, regularidad, QRS y P para generar un diferencial, no un diagnóstico único sin contexto.","Ante una taquicardia de QRS ancho y duda, prioriza valoración urgente."]
]],
["Diagnóstico diferencial", [
["Alteraciones de onda P","P alta, ancha, invertida, variable o ausente puede relacionarse con alteraciones auriculares, origen no sinusal, FA o superposición.","Un hallazgo de P no diagnostica una valvulopatía concreta."],
["PR corto, largo o variable","PR corto: preexcitación o conducción rápida/unión; largo: BAV 1º; variable: Wenckebach, disociación u otros mecanismos.","Diferencia un PR realmente variable de una P de morfología cambiante."],
["Onda Q y progresión R","Q puede ser fisiológica o patológica según amplitud, duración y territorio. Mala progresión R puede deberse a infarto previo, anatomía o error de electrodos.","Las derivaciones aisladas no determinan lesión miocárdica."],
["Voltajes y QRS ancho","Bajo voltaje puede asociarse a obesidad, derrame, enfisema y otras causas. QRS ancho tiene diferencial entre BRI/BRD, EV/TV, preexcitación, fármacos y electrolitos.","Revisa primero calibración y artefactos."],
["Elevación de ST","Diferencial: SCA, pericarditis, repolarización precoz, aneurisma, hipertrofia y alteraciones de conducción. Valora distribución, morfología y clínica.","El trazado aislado nunca reemplaza evaluación clínica."],
["Depresión de ST y onda T","Depresión ST, T altas o invertidas pueden representar isquemia, sobrecarga, electrolitos, fármacos y variantes. Compara con ECG previos.","Una T invertida no demuestra por sí sola isquemia aguda."],
["Onda U y potasio","Onda U prominente puede aparecer en hipopotasemia o bradicardia; T altas puntiagudas sugieren hiperpotasemia según contexto.","La ausencia de cambios típicos no descarta una alteración electrolítica."],
["QT prolongado y corto","QTc prolongado puede ser congénito o adquirido (fármacos, hipocalcemia, hipopotasemia). QT corto orienta, entre otras causas, a hipercalcemia.","Mide QT, corrige por frecuencia y considera QTc >500 ms como señal de riesgo."]
]]
];
const Q = [
[1,0,"¿Qué registraba el galvanómetro desarrollado por Einthoven?","Diferencias de potencial eléctrico","Fracción de eyección","Presión auricular","Flujo coronario"],
[1,1,"¿Qué representa principalmente la onda P?","Despolarización auricular","Despolarización ventricular","Repolarización ventricular","Cierre aórtico"],
[1,2,"¿Qué relación cumple la ley de Einthoven?","II = I + III","I = II + III","aVR = I + II","III = I + II"],
[2,0,"¿Qué estructura suele ser el marcapasos dominante?","Nodo sinoauricular","Haz de His","Fibras de Purkinje","Rama derecha"],
[2,1,"¿Qué orientación suele tener la P sinusal en II?","Positiva","Siempre negativa","Siempre bifásica","Ausente"],
[2,2,"¿Qué refleja el retraso nodal AV en el ECG?","Parte del intervalo PR","Duración de QTc","Amplitud de T","Onda U"],
[2,3,"¿Qué sistema distribuye el impulso hacia ambas ramas?","Haz de His","Seno coronario","Válvula mitral","Arteria descendente anterior"],
[2,4,"¿Qué ocurre con la activación ventricular si se propaga célula a célula?","Se enlentece","Se vuelve instantánea","No altera QRS","Produce P sinusal"],
[2,5,"¿Qué parte del corazón activa primero el QRS normalmente?","Tabique interventricular","Aurícula derecha","Nodo sinusal","Vena cava"],
[3,0,"Si el vector se dirige al polo positivo, ¿qué deflexión se espera?","Predominantemente positiva","Siempre negativa","Siempre una onda U","Ninguna"],
[3,1,"¿Cómo se combinan fuerzas eléctricas simultáneas?","Por suma vectorial","Por suma de frecuencias","Por producto de los intervalos","Por división de voltajes"],
[3,2,"¿Cuándo puede resultar un QRS equipásico?","Vector aproximadamente perpendicular a la derivación","Vector exactamente paralelo al polo positivo","Ausencia universal de conducción","Bloqueo AV completo obligado"],
[3,3,"¿Qué representa el eje horizontal del ECG?","Tiempo","Milivoltios","Presión arterial","Frecuencia"],
[4,0,"¿Qué potenciales compara la derivación I?","Brazo izquierdo menos brazo derecho","Pierna izquierda menos brazo izquierdo","Pierna derecha menos izquierdo","V1 menos V6"],
[4,1,"¿Cuál es el ángulo hexaxial de aVF?","+90°","0°","−30°","+180°"],
[4,2,"¿Qué derivaciones son precordiales?","V1 a V6","I, II y III","aVR y aVL","II, III y aVF"],
[4,3,"¿Qué derivación tiene un eje de −30°?","aVL","aVF","III","II"],
[4,4,"¿Qué grupo explora típicamente la cara inferior?","II, III y aVF","V1, V2 y V3","aVR y V1","I y aVL"],
[5,0,"¿Qué electrodo de extremidades es referencia?","RL","LL","LA","RA"],
[5,1,"¿Dónde colocarías V1?","Cuarto EIC junto a esternón derecho","Segundo EIC línea medioclavicular","Quinto EIC línea axilar media","Cuarto EIC línea axilar anterior"],
[5,2,"¿Qué electrodo debes colocar antes de situar V3?","V4","V6","aVR","RL"],
[5,3,"¿Dónde colocarías V6?","Línea axilar media al nivel de V4","Cuarto EIC borde esternal","Línea medio clavicular a nivel V2","Sobre clavícula izquierda"],
[5,4,"¿Qué harías ante un eje inesperado y aVR positivo?","Verificar colocación de electrodos","Diagnosticar IAM sin más","Ignorar la calibración","Cambiar la velocidad sin repetir ECG"],
[6,0,"A 25 mm/s, ¿cuánto representa un cuadro pequeño horizontal?","40 ms","20 ms","200 ms","100 ms"],
[6,1,"¿Desde dónde hasta dónde se mide el intervalo PR?","Inicio P a inicio QRS","Fin P a fin QRS","Inicio QRS a fin T","R a siguiente R"],
[6,2,"¿Cómo se denomina una deflexión negativa posterior a R?","S","Q","P","U"],
[6,3,"¿Qué marca el punto J?","Final QRS e inicio ST","Inicio P","Pico de T","Final QTc"],
[6,4,"¿Dónde suele estar la transición R/S normal?","V3–V4","aVR","V6 exclusivamente","II–III"],
[6,5,"¿Para qué se corrige el QT por frecuencia?","Comparar repolarización con RR variable","Calcular voltaje de QRS","Medir eje de P","Determinar presión arterial"],
[7,0,"¿Qué dato técnico debe revisarse antes de interpretar amplitudes?","Ganancia/calibración","IMC del paciente","Unidades de troponina","Eje de la radiografía"],
[7,1,"En ritmo regular a 25 mm/s y 4 cuadros grandes RR, ¿cuál es FC aproximada?","75 lpm","60 lpm","100 lpm","150 lpm"],
[7,2,"¿Qué combinación orienta a origen sinusal?","P positiva en II y negativa en aVR","Ausencia de P con RR irregular","QRS ancho sin P","Ondas F en sierra"],
[7,3,"¿Qué derivación ayuda a distinguir eje −30° a 0°?","II","aVR","V2","V5"],
[7,4,"¿Qué hallazgo sugiere alteración auricular izquierda?","P ancha con componente terminal negativo en V1","P siempre ausente","QT corto","Onda delta"],
[7,5,"¿Qué define Mobitz I?","Prolongación progresiva de PR seguida de P no conducida","PR fijo con todas las P conducidas","Disociación AV completa obligada","QRS ancho aislado"],
[7,6,"¿Qué caracteriza al bloqueo AV completo?","Disociación entre P y QRS","PR constante con conducción 1:1","Ausencia de P en todos los casos","Solo taquicardia auricular"],
[7,7,"¿Una T invertida aislada confirma isquemia?","No; requiere contexto y diferencial","Sí, siempre","Solo si está en aVR","Sí, sin ECG previos"],
[7,8,"Varón de 35 años: ¿qué umbral ST se usa en V2–V3 para criterios habituales, sin HVI/BRI?","≥2,5 mm","≥1 mm","≥1,5 mm","≥0,5 mm"],
[7,9,"¿Qué derivaciones adicionales pueden ayudar ante IAM posterior sospechado?","V7–V9","aVR únicamente","V3R–V4R únicamente","DII únicamente"],
[7,10,"¿Qué limitación tienen los criterios de voltaje para HVI?","Sensibilidad limitada","Son diagnóstico definitivo","Excluyen HVI si negativos","No dependen del paciente"],
[7,11,"¿Cuál es falsa respecto al BRI?","Siempre implica eje izquierdo","Altera repolarización","Puede dificultar interpretación de ST","Tiene patrón morfológico característico"],
[8,0,"Ante una taquicardia con QRS ancho, ¿qué diagnóstico debe considerarse prioritariamente?","Taquicardia ventricular","Ritmo sinusal obligado","Siempre flutter","Hipertrofia ventricular aislada"],
[8,1,"¿Qué dato sugiere extrasístole auricular?","P prematura de distinta morfología","QRS siempre >200 ms","Ausencia obligatoria de P","RR idénticos y sin latidos precoces"],
[8,2,"¿Qué afirmación sobre la pausa tras extrasístole ventricular es correcta?","Puede no ser completamente compensadora","Siempre es exactamente doble RR","Nunca existe","Siempre sigue asistolia"],
[8,3,"¿Dónde puede aparecer la P retrógrada en un ritmo de unión?","Antes, dentro o después del QRS","Solo inmediatamente después de T","Siempre en aVR únicamente","Nunca puede verse"],
[8,4,"¿Qué sugiere pausa múltiplo del intervalo PP?","Posible bloqueo sinoauricular de salida","Fibrilación ventricular","Taquicardia auricular","WPW"],
[8,5,"¿Qué QRS es más frecuente en escape ventricular?","Ancho","Siempre estrecho","Inexistente","Solo de morfología QS en I"],
[8,6,"¿Qué caracteriza a la arritmia sinusal respiratoria?","Variación cíclica del RR con P sinusales","Ausencia total de ondas P","Disociación AV","Ondas F de flutter"],
[8,7,"¿Qué mecanismos son comunes en AVNRT/AVRT?","Reentrada","Despolarización atrial ausente","Fibrilación ventricular continua","Bloqueo SA exclusivo"],
[8,8,"¿Qué hallazgo favorece fibrilación auricular?","RR irregularmente irregular sin P organizada","RR perfectamente regular con P 1:1","Ondas P monomorfas estables","QRS ancho obligado"],
[8,9,"Flutter auricular ~300/min con conducción 2:1: ¿FC ventricular aproximada?","150 lpm","60 lpm","300 lpm","75 lpm"],
[8,10,"¿Qué hallazgo apoya TV frente a TSV con aberrancia?","Latidos de captura o fusión","P positivas en cada QRS","QRS estrechos","PR siempre 160 ms"],
[8,11,"¿Qué condición suele acompañar torsades de pointes?","QT prolongado previamente","PR corto aislado","Ondas P altas","Bajo voltaje aislado"],
[8,12,"¿Qué define fibrilación ventricular?","Actividad ventricular caótica sin complejos organizados","Flutter con 4:1","Taquicardia sinusal 120 lpm","QRS estrecho con P"],
[8,13,"¿Qué caracteriza el ritmo idioventricular?","Origen ventricular con complejos usualmente anchos","Siempre onda delta","Origen sinusal y QRS fino","Conducción 1:1 obligatoria"],
[8,14,"¿Qué diferencia patrón de WPW de síndrome de WPW?","Síndrome implica taquiarritmia clínica asociada a preexcitación","Son diagnósticos idénticos siempre","Patrón nunca tiene delta","Síndrome excluye vía accesoria"],
[9,0,"¿Qué se evalúa primero ante arritmia en un paciente real?","Estabilidad y perfusión","Solo eje QRS","Únicamente QTc","La derivación aVR exclusivamente"],
[9,1,"¿Qué variables ayudan a orientar una taquicardia?","Regularidad y frecuencia","Solo altura de T","Solo amplitud de P","Únicamente eje de T"],
[9,2,"¿Cuál es una causa posible de QRS ancho?","Bloqueo de rama","Sinusitis","Anemia aislada siempre","Hiperglucemia aislada siempre"],
[9,3,"¿Qué indica disociación AV?","Aurículas y ventrículos con activación independiente","P seguida de QRS siempre","Frecuencia fija 150","QT siempre corto"],
[9,4,"¿Qué debe dar un algoritmo ECG responsable?","Diagnóstico diferencial contextualizado","Certidumbre absoluta con un solo criterio","Tratamiento idéntico para todas las taquicardias","Diagnóstico sin mirar estabilidad"],
[10,0,"¿Puede P ancha diagnosticar por sí sola estenosis mitral?","No","Sí, siempre","Solo con frecuencia >100","Solo en aVR"],
[10,1,"¿Qué explica PR corto con onda delta?","Preexcitación ventricular","Bloqueo AV 1º","Fibrilación ventricular","Flutter 4:1"],
[10,2,"¿Qué debe descartarse ante mala progresión de R?","Mala colocación de precordiales","Solo hipocalcemia","Siempre bradicardia","Solo hipertensión"],
[10,3,"¿Qué debes comprobar antes de interpretar bajo voltaje?","Calibración del ECG","Solo frecuencia","Solo eje auricular","Solo RR"],
[10,4,"¿Qué causa no coronaria puede elevar ST?","Pericarditis aguda","Hipopotasemia siempre","Bloqueo AV 1º aislado","Pausa sinusal"],
[10,5,"¿Qué afirmación sobre T invertida es válida?","Tiene un diagnóstico diferencial amplio","Confirma IAM en cualquier derivación","Siempre indica hiperpotasemia","Obliga a TV"],
[10,6,"¿Qué hallazgo se asocia frecuentemente a hipopotasemia?","Onda U prominente","Onda delta exclusiva","QRS siempre estrecho sin T","Flutter obligatorio"],
[10,7,"¿Qué QTc debe considerarse una señal de especial riesgo?","Superior a 500 ms","Inferior a 300 ms en todos","Siempre 400 ms","Un PR de 160 ms"]
];
window.ECG_CURRICULUM = C.map((c,i)=>({number:i+1,title:c[0],topics:c[1].map((t,j)=>({id:"C"+(i+1)+"."+j,title:t[0],explanation:t[1],takeaway:t[2],chapter:i+1}))}));
window.ECG_QUESTIONS = Q.map((q,i)=>({id:"Q"+(i+1),chapter:q[0],topic:"C"+q[0]+"."+q[1],question:q[2],choices:[q[3],q[4],q[5],q[6]],correct:0,reason:C[q[0]-1][1][q[1]][2]}));
})();