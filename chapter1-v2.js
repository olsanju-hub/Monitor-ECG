/* Chapter 1 · second generation educational experiences.
 * The heart is an original anatomical teaching illustration, not a scan or
 * validated patient reconstruction. ECG curves are conceptual.
 * Isolated from the legacy monitor and unapproved chapters.
 */
(function(global){
"use strict";
const legacy=global.ECGChapter1;
if(!legacy) throw new Error("Load chapter1.js before chapter1-v2.js");
const oldRender=legacy.render.bind(legacy);
const steps=[
 {label:"Nodo sinoauricular",short:"Inicio del impulso",text:"El nodo sinoauricular inicia normalmente el impulso eléctrico. Su descarga aislada no produce una onda visible propia en el ECG de superficie.",ecg:"El nodo SA no genera por sí solo la onda P.",link:"sa",color:"sa"},
 {label:"Activación auricular",short:"Onda P",text:"El impulso se propaga por el miocardio de ambas aurículas. Esta despolarización es la que genera la onda P.",ecg:"Onda P: despolarización auricular.",link:"atria",color:"p"},
 {label:"Nodo auriculoventricular",short:"Retraso fisiológico",text:"La conducción se ralentiza en el nodo AV. El intervalo PR comprende también la despolarización auricular y la conducción hasta los ventrículos: no mide exclusivamente el nodo AV.",ecg:"Intervalo PR: desde el comienzo de la onda P al comienzo del QRS.",link:"av",color:"pr"},
 {label:"His, ramas y Purkinje",short:"Conducción rápida",text:"El impulso continúa por el haz de His, las ramas derecha e izquierda y las fibras de Purkinje. Esta red distribuye rápidamente la activación a los ventrículos.",ecg:"Su actividad no origina una onda superficial aislada; precede y acompaña la activación ventricular.",link:"his",color:"pr"},
 {label:"Miocardio ventricular",short:"Complejo QRS",text:"La despolarización del miocardio ventricular produce el complejo QRS. La conducción rápida facilita que sea habitualmente estrecho.",ecg:"QRS: despolarización ventricular. La repolarización auricular suele quedar oculta.",link:"qrs",color:"qrs"},
 {label:"Repolarización ventricular",short:"Onda T",text:"Tras la activación, las células ventriculares recuperan progresivamente su estado eléctrico. No se trata de un segundo recorrido por la red de conducción.",ecg:"Onda T: repolarización ventricular.",link:"t",color:"t"}
];
const v={step:0,playing:false,speed:1,open:false,mode:"learn",picked:null,questionStep:0,waveMode:"learn",waveFocus:"P",waveQuiz:0,wavePicked:null,waveDone:new Set()};
const waveSpecs={
 P:{name:"Onda P",what:"Despolarización auricular.",why:"Se produce por la activación eléctrica del miocardio de las aurículas.",region:"P"},
 PR:{name:"Intervalo PR",what:"Desde el comienzo de P hasta el comienzo del QRS.",why:"Incluye activación auricular y conducción auriculoventricular; no corresponde únicamente al nodo AV.",region:"PR"},
 QRS:{name:"Complejo QRS",what:"Despolarización ventricular.",why:"La repolarización auricular suele quedar oculta por este complejo.",region:"QRS"},
 ST:{name:"Segmento ST",what:"Desde el final del QRS hasta el comienzo de T.",why:"Su posición respecto a la línea isoeléctrica se interpreta en conjunto con las derivaciones y el contexto clínico.",region:"ST"},
 T:{name:"Onda T",what:"Repolarización ventricular.",why:"La recuperación eléctrica no representa otra contracción del corazón.",region:"T"}
};
let handle=null;
const escape=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const k=(n)=>Math.max(0,Math.min(steps.length-1,Number(n)||0));
const note=(id,ok,reason)=>{
 if(typeof global.ECG_recordVisualExercise==="function")
 global.ECG_recordVisualExercise({chapter:1,kind:"fundamentals",taskId:id,ok,reason});
};
function icon(name){return ({
 play:'<path d="m9 6 10 6-10 6z"/>',
 pause:'<rect x="7" y="5" width="3.5" height="14" rx="1"/><rect x="13.5" y="5" width="3.5" height="14" rx="1"/>',
 previous:'<path d="M5 5v14M19 6l-10 6 10 6z"/>',
 next:'<path d="M19 5v14M5 6l10 6-10 6z"/>',
 reset:'<path d="M3 11a9 9 0 1 1 2.7 6.4M3 4v7h7"/>'
 }[name]||"")}
function pictogram(n){return '<svg class="c1v-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8">'+icon(n)+'</svg>'}
function heart(){
 const active=steps[v.step].link;
 const anatomyLabels={sa:"nodo sinoauricular",atria:"activación auricular",av:"nodo auriculoventricular",his:"His, ramas y Purkinje",qrs:"activación ventricular",t:"repolarización ventricular"};
 const spots=[["sa",108,126],["atria",236,156],["av",152,191],["his",178,236],["qrs",232,274],["t",282,325]];
 const marks=spots.map(([id,x,y])=>{
  const on=id===active?" on":"";
  return '<g role="button" tabindex="0" class="c1v-signal'+on+'" data-c1v-spot="'+id+'" aria-label="Explorar '+anatomyLabels[id]+'">'+
    '<circle cx="'+x+'" cy="'+y+'" r="23" class="c1v-spot-hit" fill="transparent"/>'+
    '<circle cx="'+x+'" cy="'+y+'" r="17" class="c1v-spot-aura"/>'+
    '<circle cx="'+x+'" cy="'+y+'" r="5.5" class="c1v-spot-core"/></g>';
 }).join("");
 return '<div class="c1v-heart-canvas c1v-heart-image-mode" data-c1v-current="'+active+'" data-c1v-playing="'+v.playing+'" aria-label="Imagen anatómica con ruta eléctrica interactiva">'+
 '<div class="c1v-image-stack">'+
 '<img class="c1v-anatomy-photo" src="assets/chapter1/heart-anatomy.webp" width="357" height="373" loading="eager" decoding="async" alt="Corazón humano en corte anatómico semirrealista; vasos, aurículas, ventrículos y vías de conducción representadas con finalidad docente.">'+
 '<svg class="c1v-heart c1v-anatomy-overlay" viewBox="0 0 357 373" role="group" aria-label="Capa táctil y animada de conducción eléctrica, alineada sobre la ilustración anatómica" preserveAspectRatio="xMidYMid meet">'+
 '<defs><filter id="c1v-new-glow" x="-150%" y="-150%" width="400%" height="400%"><feGaussianBlur stdDeviation="5"/></filter></defs>'+
 '<g fill="none" stroke-linecap="round" stroke-linejoin="round" class="c1v-overlay-routes">'+
 '<path class="c1v-overlay-route c1v-overlay-atria" d="M108 126C122 138 135 161 152 191M108 126C150 112 184 126 236 156"/>'+
 '<path class="c1v-overlay-route c1v-overlay-av" d="M152 191Q161 214 178 236"/>'+
 '<path class="c1v-overlay-route c1v-overlay-his" d="M178 236Q159 266 132 298M178 236Q205 257 229 283L282 325M151 267L110 304M216 281L252 317"/>'+
 '<path class="c1v-overlay-route c1v-overlay-ventricle" d="M124 250Q138 304 173 329M221 233Q247 276 282 325"/>'+
 '<path class="c1v-overlay-route c1v-overlay-recovery" d="M143 313Q167 270 197 252M285 313Q278 264 239 239"/>'+
 '</g>'+marks+'</svg></div>'+
 '<div class="c1v-anatomy-foot">Ilustración anatómica semirrealista · Actividad eléctrica resaltada por fases · Toca una zona para explorarla</div></div>';
}
function waveCard(section){
 const chosen=section||"none";
 const segments={
 P:'M17 129H84C99 129 100 105 116 105C134 105 135 129 154 129H190',
 PR:'M154 129H284',
 QRS:'M284 129L305 141L328 34L349 171L368 129H388',
 ST:'M388 129H455',
 T:'M455 129H483C510 129 519 84 548 82C576 81 585 129 613 129H668'
 };
 const ranges={P:[83,155],PR:[83,284],QRS:[284,388],ST:[388,456],T:[484,618]};
 const focus=Object.keys(ranges).find(key=>key===chosen)||"none";
 return '<div class="c1v-trace-card" aria-label="ECG sintético ilustrativo sincronizado"><svg viewBox="0 0 686 210" class="c1v-trace" role="img" aria-label="Trazado didáctico con P, PR, QRS, ST y T; no es un registro clínico">'+
 '<defs><pattern id="c1v-paper-small" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M10 0H0V10" fill="none" stroke="#f2e1e4" stroke-width=".75"/></pattern><pattern id="c1v-paper-large" width="50" height="50" patternUnits="userSpaceOnUse"><rect width="50" height="50" fill="url(#c1v-paper-small)"/><path d="M50 0H0V50" stroke="#e3c1c9" stroke-width="1" fill="none"/></pattern></defs>'+
 '<rect width="686" height="210" rx="14" fill="#fffbfc"/><rect width="686" height="210" rx="14" fill="url(#c1v-paper-large)"/>'+
 (focus!=="none"?'<rect x="'+ranges[focus][0]+'" y="11" width="'+(ranges[focus][1]-ranges[focus][0])+'" height="159" rx="9" fill="#d4ecec" opacity=".68"/>':'')+
 Object.entries(segments).map(([id,d])=>'<path d="'+d+'" stroke="'+(chosen===id||(chosen==="PR"&&id==="P")?"#058496":"#294f64")+'" stroke-width="'+(chosen===id||(chosen==="PR"&&id==="P")?5:3.2)+'" stroke-linecap="round" stroke-linejoin="round" fill="none"/>').join("")+
 '<text x="20" y="194" fill="#607785" font-size="15">Esquema de enseñanza · no utilizar para diagnóstico</text></svg></div>';
}
function stageTools(){
 const st=steps[v.step],reduce=typeof matchMedia==="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches;
 return '<div class="c1v-surface c1v-lesson-stage"><header class="c1v-section-head"><span class="c1v-eyebrow">APRENDER · ACTIVACIÓN ELÉCTRICA</span><h2>Del impulso al registro</h2><p>Observa cómo se propaga el impulso y qué parte de ese proceso aparece en el ECG.</p></header>'+
 '<div class="c1v-stage-grid"><div class="c1v-artwork">'+
 '<div class="c1v-artbar"><span class="c1v-artbar-title">ANATOMÍA Y CONDUCCIÓN</span><span class="c1v-artbar-label">Fase '+(v.step+1)+' de 6</span></div>'+heart()+'</div>'+
 '<div class="c1v-side"><section class="c1v-explain"><div class="c1v-minihead">FASE '+(v.step+1)+' DE 6</div><h3>'+escape(st.label)+'</h3><p>'+escape(st.text)+'</p><div class="c1v-ecg-fact"><strong>En el ECG</strong><p>'+escape(st.ecg)+'</p></div></section>'+
 '<div class="c1v-player" role="group" aria-label="Controles de reproducción">'+
 '<div class="c1v-player-row"><button type="button" data-c1v-nav="prev" aria-label="Fase anterior" class="c1v-round">'+pictogram("previous")+'</button>'+
 '<button type="button" data-c1v-play="'+(!v.playing?'play':'pause')+'" class="c1v-play" aria-label="'+(v.playing?'Pausar animación':'Reproducir animación')+'">'+pictogram(v.playing?"pause":"play")+'<span>'+(v.playing?"Pausar":"Reproducir")+'</span></button>'+
 '<button type="button" data-c1v-nav="next" aria-label="Fase siguiente" class="c1v-round">'+pictogram("next")+'</button>'+
 '<button type="button" data-c1v-nav="reset" aria-label="Reiniciar secuencia" class="c1v-round">'+pictogram("reset")+'</button></div>'+
 '<div class="c1v-speed-row"><span>Velocidad</span>'+[.5,1,1.5].map(x=>'<button type="button" data-c1v-speed="'+x+'" aria-pressed="'+(v.speed===x)+'" class="'+(v.speed===x?"selected":"")+'">'+String(x).replace(".",",")+'×</button>').join("")+'</div>'+
 '<button type="button" data-c1v-steps="toggle" class="c1v-step-picker" aria-expanded="'+v.open+'">Elegir una fase <span>'+(v.open?"Cerrar −":"Abrir +")+'</span></button>'+
 (v.open?'<div class="c1v-steps-panel" role="group" aria-label="Ir a una fase">'+steps.map((s,i)=>'<button type="button" data-c1v-go="'+i+'" class="'+(v.step===i?"active":"")+'"><span class="c1v-step-index">'+(i+1)+'</span><span>'+escape(s.label)+'</span></button>').join("")+'</div>':'')+'</div></div></div>'+
 '<section class="c1v-ecg-box"><div class="c1v-ecg-title"><strong>ECG sincronizado</strong><span>'+(st.link==="sa"?"Impulso nodal":st.color==="pr"?"Conducción AV":st.color==="qrs"?"Complejo QRS":st.color==="t"?"Onda T":st.color==="p"?"Onda P":"Sin componente visible propio")+'</span></div>'+waveCard(st.color==="p"?"P":st.color==="pr"?"PR":st.color==="qrs"?"QRS":st.color==="t"?"T":"none")+'</section>'+
 '<p class="c1v-note">Las fases están ralentizadas con finalidad didáctica: la duración de la animación no representa tiempos de conducción reales.'+(reduce?" La animación automática respeta la preferencia de movimiento reducido.":"")+'</p></div>'+
 '<section class="c1v-surface c1v-check"><header><span class="c1v-eyebrow">COMPROBAR</span><h3>¿Qué registra un ECG?</h3></header><div class="c1v-answers">'+[["voltage","Diferencias de potencial eléctrico"],["mechanic","La fuerza de contracción"],["flow","El gasto cardíaco"]].map(([key,label])=>'<button type="button" data-c1v-concept="'+key+'" '+(v.picked?"disabled":"")+'>'+label+'</button>').join("")+'</div>'+
 (v.picked?'<div role="status" class="c1v-feedback '+(v.picked==="voltage"?"correct":"incorrect")+'"><strong>'+(v.picked==="voltage"?"Correcto":"No exactamente")+'</strong><p>El ECG registra diferencias de potencial en función del tiempo. La función mecánica requiere una valoración distinta.</p><button type="button" data-c1v-concept="retry">Repetir</button></div>':'')+'</section><details class="c1v-history"><summary>Breve historia del ECG</summary><p>Augustus Waller registró actividad eléctrica cardíaca humana antes de Willem Einthoven. Einthoven perfeccionó el galvanómetro de cuerda y contribuyó decisivamente al electrocardiograma moderno. Lo relevante es comprender qué mide el registro, no memorizar fechas.</p></details>';
}
function wavesTool(){
 const quiz=v.waveMode==="practice",focus=quiz?"none":v.waveFocus,spec=waveSpecs[v.waveFocus],task=Object.keys(waveSpecs)[v.waveQuiz%5];
 return '<div class="c1v-surface c1v-lesson-waves"><header class="c1v-section-head"><span class="c1v-eyebrow">APRENDER · INTERPRETAR EL TRAZADO</span><h2>Las ondas del ECG</h2><p>Reconoce qué significa cada componente antes de aprender a medirlo.</p></header>'+
 '<div class="c1v-mode" role="group" aria-label="Modo de exploración"><button data-c1v-wave-mode="learn" class="'+(!quiz?"selected":"")+'">Aprender</button><button data-c1v-wave-mode="practice" class="'+(quiz?"selected":"")+'">Practicar</button></div>'+
 '<div class="c1v-wave-frame"><div class="c1v-ecg-title"><strong>Registro eléctrico</strong><span>Derivación ilustrativa · 1 latido</span></div>'+waveCard(focus)+
 '<div class="c1v-wave-controls" role="group" aria-label="Componentes del ECG">'+Object.keys(waveSpecs).map((key,i)=>'<button type="button" data-c1v-wave="'+key+'" class="'+(!quiz&&v.waveFocus===key?"selected":"")+'">'+(quiz?"Zona "+(i+1):key)+'</button>').join("")+'</div></div>'+
 (quiz?'<div class="c1v-explain"><div class="c1v-minihead">EJERCICIO '+(v.waveQuiz+1)+' DE 5</div><h3>Identifica: '+escape(waveSpecs[task].name)+'</h3><p>Selecciona la zona correcta. En modo práctica las opciones están numeradas y la solución no aparece hasta responder.</p>'+
 (v.wavePicked?'<div role="status" class="c1v-feedback '+(v.wavePicked.ok?"correct":"incorrect")+'"><strong>'+(v.wavePicked.ok?"Correcto":"Revisa la forma y los límites")+'</strong><p>'+escape(waveSpecs[task].why)+'</p></div><button class="c1v-primary" type="button" data-c1v-wave-next="'+(v.wavePicked.ok?"next":"retry")+'">'+(v.wavePicked.ok?"Siguiente componente →":"Volver a intentar")+'</button>':'')+'</div>':
 '<div class="c1v-explain"><div class="c1v-minihead">ESTÁS EXPLORANDO</div><h3>'+escape(spec.name)+'</h3><p>'+escape(spec.what)+'</p><div class="c1v-ecg-fact"><strong>Comprender</strong><p>'+escape(spec.why)+'</p></div></div>')+'</div>'+
 '<section class="c1v-surface c1v-summary"><h3>Cómo distinguir ondas, segmentos e intervalos</h3><div class="c1v-three-facts"><div><strong>Onda</strong><span>Deflexión reconocible de la señal.</span></div><div><strong>Intervalo</strong><span>Tiempo entre dos puntos definidos; puede incluir ondas y segmentos.</span></div><div><strong>Segmento</strong><span>Tramo entre ondas o complejos.</span></div></div><p>La onda P refleja activación auricular, el QRS despolarización ventricular y la T repolarización ventricular. El intervalo PR va desde el inicio de P al inicio del QRS; el segmento ST se encuentra entre el final del QRS y el inicio de T. Una onda negativa no implica por sí sola enfermedad.</p></section>';
}
function paint(){
 const container=document.querySelector("#chapter1-v2-root");if(!container)return;
 const current=container.dataset.topic;
 const main=container.querySelector(".c1v-main");
 if(main){main.innerHTML=current==="C1.0"?stageTools():wavesTool();}
 else container.innerHTML=topicNav(current)+'<div class="c1v-main">'+(current==="C1.0"?stageTools():wavesTool())+'</div>';
}
function move(to){
 v.step=k(to);
 if(v.step===steps.length-1 && v.playing){v.playing=false;stop();}
 paint();
}
function stop(){if(handle!==null){clearInterval(handle);handle=null;}}
function autoplay(){
 stop();
 if(!v.playing)return;
 handle=setInterval(()=>{
  const el=document.querySelector("#chapter1-v2-root[data-topic='C1.0']");
  if(!el){v.playing=false;stop();return;}
  if(v.step===steps.length-1){v.playing=false;stop();paint();return;}
  move(v.step+1);
 },Math.round(2650/v.speed));
}
function spotToStep(name){return ({sa:0,atria:1,av:2,his:3,qrs:4,t:5})[name]??0}
function onTap(event){
 const el=event.target.closest("[data-c1v-nav],[data-c1v-play],[data-c1v-speed],[data-c1v-go],[data-c1v-steps],[data-c1v-concept],[data-c1v-spot],[data-c1v-wave-mode],[data-c1v-wave],[data-c1v-wave-next]");
 if(!el||!document.querySelector("#chapter1-v2-root"))return;
 if(el.hasAttribute("data-c1v-nav")){
  const nav=el.dataset.c1vNav;
  if(nav==="reset"){v.playing=false;stop();v.step=0;}
  else if(nav==="next"){v.playing=false;stop();v.step=k(v.step+1);}
  else{v.playing=false;stop();v.step=k(v.step-1);}
 }else if(el.hasAttribute("data-c1v-play")){
  v.playing=el.dataset.c1vPlay==="play";
  if(v.playing&&v.step===steps.length-1)v.step=0;
  if(v.playing)autoplay();else stop();
 }else if(el.hasAttribute("data-c1v-speed")){
  v.speed=Number(el.dataset.c1vSpeed);
  if(v.playing)autoplay();
 }else if(el.hasAttribute("data-c1v-steps")){v.open=!v.open;}
 else if(el.hasAttribute("data-c1v-go")){v.playing=false;stop();v.step=k(el.dataset.c1vGo);v.open=false;}
 else if(el.hasAttribute("data-c1v-spot")){v.playing=false;stop();v.step=spotToStep(el.dataset.c1vSpot);}
 else if(el.hasAttribute("data-c1v-concept")){
  const choice=el.dataset.c1vConcept;
  if(choice==="retry")v.picked=null;
  else if(!v.picked){v.picked=choice;note("recording",choice==="voltage","El ECG registra electricidad, no gasto cardíaco ni fuerza de contracción.");}
 }else if(el.hasAttribute("data-c1v-wave-mode")){
  v.waveMode=el.dataset.c1vWaveMode;v.waveQuiz=0;v.wavePicked=null;v.waveFocus="P";
 }else if(el.hasAttribute("data-c1v-wave")){
  const key=el.dataset.c1vWave;
  if(v.waveMode==="practice"){
   if(v.wavePicked)return;
   const correct=key===Object.keys(waveSpecs)[v.waveQuiz%5];
   v.wavePicked={ok:correct};
   if(correct){v.waveDone.add(key);if(v.waveDone.size===5)note("waves",true,"Identificados P, PR, QRS, ST y T.");}
   else note("waves",false,"Revisar "+waveSpecs[Object.keys(waveSpecs)[v.waveQuiz%5]].name);
  }else v.waveFocus=key;
 }else if(el.hasAttribute("data-c1v-wave-next")){
  if(el.dataset.c1vWaveNext==="next")v.waveQuiz=(v.waveQuiz+1)%5;
  v.wavePicked=null;
 }
 paint();
}
document.body.addEventListener("click",onTap);
document.body.addEventListener("keydown",e=>{
 if((e.key==="Enter"||e.key===" ")&&e.target.matches?.('[data-c1v-spot][role="button"]')){
  e.preventDefault();e.target.dispatchEvent(new MouseEvent("click",{bubbles:true}));
 }
});
document.addEventListener("visibilitychange",()=>{if(document.hidden){v.playing=false;stop();}});
function topicNav(topic){
 return '<nav class="c1v-topic-nav" aria-label="Lecciones del capítulo 1">'+[['C1.0','1 · Impulso'],['C1.1','2 · Ondas'],['C1.2','3 · Derivaciones']].map(([id,text])=>'<button type="button" data-topic="'+id+'" class="'+(topic===id?'active':'')+'" aria-current="'+(topic===id?'step':'false')+'">'+text+'</button>').join('')+'</nav>';
}
const bridge={...legacy};
legacy.render=function(topic){
 if(topic==="C1.0"||topic==="C1.1"){
  return '<section id="chapter1-v2-root" class="c1v-module" data-topic="'+topic+'">'+topicNav(topic)+'<div class="c1v-main">'+(topic==="C1.0"?stageTools():wavesTool())+'</div></section>';
 }
 return oldRender(topic);
};
legacy.setTopic=function(topic){
 const prev=legacy.activeTopic;bridge.setTopic(topic);
 if(topic!=="C1.0"){v.playing=false;stop();}
 if(prev!==topic){v.open=false;v.wavePicked=null;}
};
legacy.visualVersion="2.0";
global.ECGChapter1V2={steps,render:legacy.render,stop,state:v,waveSpecs};
})(window);
