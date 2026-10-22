/* ECG visual labs: model of educational interactions, without DOM.
 * Measurements in seconds, positions in SVG viewBox coordinates.
 * Geometry simplified for teaching, not patient-specific anatomy.
 */
(function(root){
"use strict";
const LEADS=Object.freeze({I:0,II:60,III:120,aVR:-150,aVL:-30,aVF:90});
const ELECTRODES=Object.freeze({
 V1:{x:322,y:230,text:"Cuarto espacio intercostal, borde esternal derecho."},
 V2:{x:373,y:230,text:"Cuarto espacio intercostal, borde esternal izquierdo."},
 V3:{x:413,y:255,text:"A mitad de camino entre V2 y V4."},
 V4:{x:453,y:280,text:"Quinto espacio intercostal, línea medioclavicular izquierda."},
 V5:{x:505,y:280,text:"Línea axilar anterior izquierda, a la altura horizontal de V4."},
 V6:{x:557,y:280,text:"Línea axilar media izquierda, a la altura horizontal de V4."}
});
const PLACEMENT_ORDER=["V1","V2","V4","V3","V5","V6"];
const CONDUCTION=[
 {id:"sa",title:"Nodo sinoauricular",short:"Nodo SA",x:260,y:144,ecg:"Inicio del impulso; comienza despolarización auricular y onda P.",task:"¿Qué estructura inicia normalmente el ritmo sinusal?"},
 {id:"atria",title:"Miocardio auricular",short:"Aurículas",x:310,y:174,ecg:"La propagación auricular constituye la onda P.",task:"¿Qué tejido genera principalmente la onda P?"},
 {id:"av",title:"Nodo auriculoventricular",short:"Nodo AV",x:351,y:218,ecg:"Conducción lenta; contribuye decisivamente al intervalo PR.",task:"¿Qué nodo explica el retraso fisiológico antes del QRS?"},
 {id:"his",title:"Haz de His",short:"His",x:352,y:268,ecg:"Conduce el impulso hacia las ramas ventriculares.",task:"¿Qué haz lleva el impulso desde el nodo AV a las ramas?"},
 {id:"branches",title:"Ramas derecha e izquierda",short:"Ramas",x:371,y:301,ecg:"Distribuyen el impulso a ambos ventrículos.",task:"¿Qué estructuras pueden producir BRD o BRI si se bloquean?"},
 {id:"purkinje",title:"Red de Purkinje",short:"Purkinje",x:436,y:344,ecg:"Rápida activación ventricular coordinada; relacionada con el QRS.",task:"¿Qué red especializada sincroniza la despolarización ventricular?"}
];
const MEASURE_TASKS=[
 {id:"RR",label:"Intervalo RR",hint:"Toca dos picos R consecutivos.",points:[.544,1.344],seconds:.8,chapter:6},
 {id:"PR",label:"Intervalo PR",hint:"Toca el inicio de la onda P y luego el comienzo del QRS.",points:[.34,.50],seconds:.16,chapter:6},
 {id:"QRS",label:"Duración QRS",hint:"Toca el inicio y el final del complejo QRS.",points:[.50,.59],seconds:.09,chapter:6},
 {id:"QT",label:"Intervalo QT",hint:"Toca el inicio del QRS y el final de T.",points:[.50,.92],seconds:.42,chapter:6}
];
function projection(angle,lead){
 if(!Object.prototype.hasOwnProperty.call(LEADS,lead))throw Error("Derivación inválida");
 return Math.cos((angle-LEADS[lead])*Math.PI/180);
}
function polarity(angle,lead,threshold=.15){
 const v=projection(angle,lead);return v>threshold?"positive":v< -threshold?"negative":"isoelectric";
}
function gradePlacement(key,x,y,tolerance=37){
 const p=ELECTRODES[key];if(!p)throw Error("Electrodo no reconocido");
 const dx=x-p.x,dy=y-p.y,dist=Math.hypot(dx,dy);
 const horizontal=Math.abs(dx)>tolerance?(dx>0?"demasiado lateral hacia la izquierda de la imagen":"demasiado medial o hacia la derecha de la imagen"):null;
 const vertical=Math.abs(dy)>tolerance?(dy>0?"demasiado bajo":"demasiado alto"):null;
 return {ok:dist<=tolerance,distance:dist,reason:dist<=tolerance?"Posición adecuada para "+key+". "+p.text:
   "Revisa "+key+": "+[vertical,horizontal].filter(Boolean).join(" y ")+". Referencia: "+p.text};
}
function measurementGrade(id,first,second,tolerance=.055){
 const t=MEASURE_TASKS.find(t=>t.id===id);if(!t)throw Error("Medición no reconocida");
 const ordered=[first,second], expected=t.points;
 const errors=ordered.map((x,i)=>Math.abs(x-expected[i]));
 const measured=second-first;
 return {ok:measured>0&&errors.every(x=>x<=tolerance),errors,measured,expected:t.seconds,
  reason:measured<=0?"La segunda marca debe seguir a la primera.":
   errors.every(x=>x<=tolerance)?t.label+": "+Math.round(measured*1000)+" ms, correctamente localizado.":
   "La medida fue "+Math.round(measured*1000)+" ms; revisa dónde comienza y termina "+t.label+". No basta con acertar la duración si los marcadores señalan otras ondas."};
}
function svgClientPoint(svg,clientX,clientY){
 // DOM/SVG CTM accounts for letterboxing, transformations and layout scaling.
 if(svg&&typeof svg.createSVGPoint==="function"&&typeof svg.getScreenCTM==="function"){
  const m=svg.getScreenCTM();
  if(m){const p=svg.createSVGPoint();p.x=clientX;p.y=clientY;const v=p.matrixTransform(m.inverse());return {x:v.x,y:v.y};}
 }
 // Fallback for supported browsers where CTM is unavailable.
 const rect=svg.getBoundingClientRect(),vb=svg.viewBox.baseVal;
 const scale=Math.min(rect.width/vb.width,rect.height/vb.height);
 const marginX=(rect.width-vb.width*scale)/2,marginY=(rect.height-vb.height*scale)/2;
 return {x:(clientX-rect.left-marginX)/scale+vb.x,y:(clientY-rect.top-marginY)/scale+vb.y};
}
root.ECGVisualCore=Object.freeze({LEADS,ELECTRODES,PLACEMENT_ORDER,CONDUCTION,MEASURE_TASKS,projection,polarity,gradePlacement,measurementGrade,svgClientPoint});
})(typeof window==="undefined"?globalThis:window);