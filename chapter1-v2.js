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
 const p=steps[v.step],active=p.link;
 const glow=(id,x,y)=>{
  const selected=(active===id||(id==="atria"&&active==="sa"))?" on":"";
  return '<g class="c1v-signal'+selected+'" data-c1v-spot="'+id+'" role="button" tabindex="0" aria-label="Explorar '+({sa:"nodo sinoauricular",atria:"activación auricular",av:"nodo auriculoventricular",his:"haz de His y fibras de Purkinje",qrs:"activación ventricular",t:"repolarización ventricular"}[id])+'"><circle class="c1v-spot-hit" cx="'+x+'" cy="'+y+'" r="39" fill="transparent"/><circle class="c1v-spot-aura" cx="'+x+'" cy="'+y+'" r="22"/><circle class="c1v-spot-core" cx="'+x+'" cy="'+y+'" r="8"/></g>';
 };
 return '<div class="c1v-heart-canvas" data-c1v-current="'+active+'" data-c1v-playing="'+v.playing+'" aria-label="Modelo anatómico original en corte con conducción eléctrica resaltada">'+
 '<svg class="c1v-heart" viewBox="0 0 520 590" role="img" aria-label="Ilustración anatómica docente de aurículas y ventrículos, grandes vasos y sistema de conducción. No representa tiempos fisiológicos a escala.">'+
 '<defs>'+
 '<radialGradient id="c1v-halo"><stop stop-color="#f1f9f6"/><stop offset="1" stop-color="#f7fbfa"/></radialGradient>'+
 '<linearGradient id="c1v-wall" x1="0" y1="0" x2=".95" y2="1"><stop stop-color="#f6b7a7"/><stop offset=".4" stop-color="#bc5b61"/><stop offset=".75" stop-color="#a04351"/><stop offset="1" stop-color="#692e44"/></linearGradient>'+
 '<linearGradient id="c1v-muscle" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f7ad9b"/><stop offset=".4" stop-color="#b74b59"/><stop offset=".8" stop-color="#802c47"/><stop offset="1" stop-color="#54223a"/></linearGradient>'+
 '<linearGradient id="c1v-cavity" x1="0" y1="0" x2=".95" y2="1"><stop stop-color="#552d44"/><stop offset=".5" stop-color="#8b3a51"/><stop offset="1" stop-color="#b45465"/></linearGradient>'+
 '<linearGradient id="c1v-vein" x1="0" x2="1"><stop stop-color="#123f66"/><stop offset=".4" stop-color="#358bb2"/><stop offset="1" stop-color="#143a62"/></linearGradient>'+
 '<linearGradient id="c1v-artery" x1="0" x2="1"><stop stop-color="#7b344c"/><stop offset=".5" stop-color="#ec8d7b"/><stop offset="1" stop-color="#953550"/></linearGradient>'+
 '<linearGradient id="c1v-septum" x1="0" x2="1"><stop stop-color="#e99183"/><stop offset=".5" stop-color="#f4c3a5"/><stop offset="1" stop-color="#9c4d5b"/></linearGradient>'+
 '<filter id="c1v-depth" x="-30%" y="-30%" width="170%" height="170%"><feGaussianBlur stdDeviation="10"/></filter>'+
 '<filter id="c1v-pulse" x="-170%" y="-170%" width="450%" height="450%"><feGaussianBlur stdDeviation="5"/></filter>'+
 '<clipPath id="c1v-inside"><path d="M90 205C94 155 139 116 209 128C260 123 273 143 291 153C347 114 412 145 441 199C468 244 462 329 428 398C390 476 315 533 261 564C216 549 115 495 80 420C36 341 51 257 90 205Z"/></clipPath>'+
 '</defs>'+
 '<rect x="0" y="0" width="520" height="590" rx="20" fill="url(#c1v-halo)"/>'+
 '<ellipse cx="270" cy="355" rx="193" ry="206" fill="#193c4b" opacity=".10" filter="url(#c1v-depth)"/>'+
 /* vessels behind chambers */
 '<path d="M155 185L148 18Q149 1 164 2Q180 3 181 18L180 183" fill="url(#c1v-vein)" stroke="#1e5e83" stroke-width="5"/>'+
 '<path d="M363 190C370 115 369 42 361 16C358 5 367 1 377 3L398 13C411 33 402 93 403 172" fill="url(#c1v-artery)" stroke="#9f4b56" stroke-width="5"/>'+
 '<path d="M291 169C279 90 292 42 317 45C365 50 347 106 350 163" fill="none" stroke="#246a8c" stroke-width="48" stroke-linecap="round"/>'+
 '<path d="M291 169C279 90 292 42 317 45C365 50 347 106 350 163" fill="none" stroke="#76b9c7" stroke-width="14" stroke-linecap="round" opacity=".7"/>'+
 '<path d="M394 217C459 186 484 177 489 148" fill="none" stroke="#3d9fb0" stroke-width="32" stroke-linecap="round"/>'+
 /* muscle contour */
 '<path d="M90 205C94 155 139 116 209 128C260 123 273 143 291 153C347 114 412 145 441 199C468 244 462 329 428 398C390 476 315 533 261 564C216 549 115 495 80 420C36 341 51 257 90 205Z" fill="url(#c1v-wall)" stroke="#823e55" stroke-width="7"/>'+
 '<g clip-path="url(#c1v-inside)">'+
 '<path d="M100 195C94 170 160 147 203 170C231 186 245 226 240 285C225 310 203 315 166 303C114 278 91 246 100 195Z" fill="url(#c1v-cavity)" stroke="#f9b9a1" stroke-width="12"/>'+
 '<path d="M308 195C329 165 366 160 397 186C431 212 429 262 400 291C371 316 317 309 288 280C276 256 286 224 308 195Z" fill="url(#c1v-cavity)" stroke="#f1b4a4" stroke-width="13"/>'+
 '<path d="M116 320C152 294 198 313 243 349C257 397 269 466 250 531C206 517 149 474 115 420C97 381 94 343 116 320Z" fill="url(#c1v-muscle)" stroke="#fac0a2" stroke-width="15"/>'+
 '<path d="M305 323C348 296 410 316 430 348C445 403 364 503 286 547C269 480 268 372 305 323Z" fill="url(#c1v-muscle)" stroke="#ffcab0" stroke-width="17"/>'+
 '<path d="M246 311C262 330 274 356 280 401L275 548" fill="none" stroke="url(#c1v-septum)" stroke-width="20" stroke-linecap="round"/>'+
 '<path d="M240 308C249 321 258 331 271 337C285 329 291 315 306 309" fill="none" stroke="#ffe1bf" stroke-width="12" stroke-linecap="round"/>'+
 '<path d="M235 320L251 362M308 325L285 362" stroke="#edc5ad" stroke-width="6" opacity=".92"/>'+
 /* trabeculae and textures */
 '<g fill="none" stroke="#f3a08d" stroke-width="4" opacity=".6">'+
 '<path d="M126 366Q176 359 235 420M126 389Q181 389 239 457M143 432Q184 418 226 477M315 381Q374 355 421 383M302 415Q358 401 408 418M302 454Q345 445 375 468"/>'+
 '</g><g stroke="#ffd1b3" stroke-width="3" opacity=".58" fill="none">'+
 '<path d="M142 224Q166 188 208 223M327 236Q358 205 387 241M171 334Q201 344 235 393M321 356Q359 335 408 364"/>'+
 '</g></g>'+
 '<path d="M90 205C94 155 139 116 209 128C260 123 273 143 291 153C347 114 412 145 441 199" fill="none" stroke="#ffd8b8" stroke-width="3" opacity=".8"/>'+
 /* specialized conduction */
 '<g class="c1v-traces" fill="none" stroke-linecap="round" stroke-linejoin="round">'+
 '<path class="c1v-route c1v-route-atria" d="M139 192Q177 185 218 216L249 283M139 192Q184 147 257 178Q314 196 356 223" />'+
 '<path class="c1v-route c1v-route-av" d="M249 282L267 314L273 351" />'+
 '<path class="c1v-route c1v-route-vent" d="M273 350Q256 383 224 407L157 485M273 350Q294 374 325 410L381 482M224 407L203 456M325 410L335 466M243 390L235 470M305 394L305 485" />'+
 '<path class="c1v-route c1v-route-fine" d="M157 485l-28-30M157 485l24-44M182 447l-14-53M203 456l-36 20M224 407l-41-29M381 482l31-54M381 482l-32-30M345 446l39-22M335 466l-41 25M305 485l31-16" />'+
 '</g>'+
 '<g class="c1v-atrial-glow"><path d="M109 204Q119 155 186 164Q226 190 230 263" fill="none" stroke="#fff0a6" stroke-width="7" stroke-linecap="round"/><path d="M319 198Q369 177 395 217L406 262" fill="none" stroke="#fff0a6" stroke-width="7" stroke-linecap="round"/></g>'+
 '<g class="c1v-ventricle-glow"><path d="M134 354Q183 325 236 418L241 505M322 354Q371 328 408 368Q370 468 298 523" fill="none" stroke="#ffe18a" stroke-width="9" stroke-linecap="round"/></g>'+
 glow("sa",139,192)+glow("atria",184,235)+glow("av",249,283)+glow("his",271,363)+glow("qrs",351,417)+glow("t",348,475)+
 '</svg><div class="c1v-anatomy-foot">Modelo anatómico ilustrativo · Selecciona una zona o utiliza las fases</div></div>';
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
 const ranges={P:[83,155],PR:[154,284],QRS:[284,388],ST:[388,456],T:[484,618]};
 const focus=Object.keys(ranges).find(key=>key===chosen)||"none";
 return '<div class="c1v-trace-card" aria-label="ECG sintético ilustrativo sincronizado"><svg viewBox="0 0 686 210" class="c1v-trace" role="img" aria-label="Trazado didáctico con P, PR, QRS, ST y T; no es un registro clínico">'+
 '<defs><pattern id="c1v-paper-small" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M10 0H0V10" fill="none" stroke="#f2e1e4" stroke-width=".75"/></pattern><pattern id="c1v-paper-large" width="50" height="50" patternUnits="userSpaceOnUse"><rect width="50" height="50" fill="url(#c1v-paper-small)"/><path d="M50 0H0V50" stroke="#e3c1c9" stroke-width="1" fill="none"/></pattern></defs>'+
 '<rect width="686" height="210" rx="14" fill="#fffbfc"/><rect width="686" height="210" rx="14" fill="url(#c1v-paper-large)"/>'+
 (focus!=="none"?'<rect x="'+ranges[focus][0]+'" y="11" width="'+(ranges[focus][1]-ranges[focus][0])+'" height="159" rx="9" fill="#d4ecec" opacity=".68"/>':'')+
 Object.entries(segments).map(([id,d])=>'<path d="'+d+'" stroke="'+(chosen===id?"#058496":"#294f64")+'" stroke-width="'+(chosen===id?5:3.2)+'" stroke-linecap="round" stroke-linejoin="round" fill="none"/>').join("")+
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
 (v.picked?'<div role="status" class="c1v-feedback '+(v.picked==="voltage"?"correct":"incorrect")+'"><strong>'+(v.picked==="voltage"?"Correcto":"No exactamente")+'</strong><p>El ECG registra diferencias de potencial en función del tiempo. La función mecánica requiere una valoración distinta.</p><button type="button" data-c1v-concept="retry">Repetir</button></div>':'')+'</section>';
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
 container.innerHTML=current==="C1.0"?stageTools():wavesTool();
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
const bridge={...legacy};
legacy.render=function(topic){
 if(topic==="C1.0"||topic==="C1.1"){
  return '<section id="chapter1-v2-root" class="c1v-module" data-topic="'+topic+'">'+(topic==="C1.0"?stageTools():wavesTool())+'</section>';
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
