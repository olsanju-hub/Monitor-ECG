/* ECG · Chapter 1: fundamentals approved for educational use.
 * Original explanatory text, diagrams and exercises; no copied textbook art.
 * The mathematical Einthoven simulator compares INSTANTANEOUS limb potentials.
 */
(function(root){
"use strict";
const c=root.ECG_CURRICULUM?.[0];
if(!c)throw Error("ECG curriculum must load before chapter 1");
c.title="Fundamentos del electrocardiograma";
const lessons=[
 ["Qué registra realmente un ECG",
  "La activación eléctrica del corazón produce diferencias de potencial detectables en la superficie corporal. El electrocardiógrafo mide estas diferencias a lo largo del tiempo; no registra directamente la contracción ni cuantifica el gasto cardíaco.",
  "El eje horizontal es tiempo; el vertical es voltaje. Un ECG normal no garantiza por sí solo una función mecánica normal."],
 ["Comprender las ondas P, QRS y T",
  "La onda P refleja la despolarización auricular; el QRS, la despolarización ventricular; y la T, su repolarización. El intervalo PR abarca desde el comienzo de P al comienzo del QRS, y el segmento ST va desde el final del QRS al inicio de T.",
  "La repolarización auricular suele quedar oculta por el QRS. La polaridad de cada deflexión depende de la derivación. No todos los QRS presentan ondas Q, R y S identificables."],
 ["Derivaciones y triángulo de Einthoven",
  "Una derivación no es un electrodo: es una forma de registrar la diferencia de potencial entre dos polos eléctricos. Cada derivación tiene un polo positivo y otro negativo. Al comparar las tres derivaciones clásicas en el mismo instante se cumple: DII = DI + DIII.",
  "Primero identifica qué extremidad corresponde a cada polo. Después resta el potencial negativo al positivo. En la relación de Einthoven los tres valores deben corresponder al mismo instante."]
];
for(let i=0;i<3;i++){c.topics[i].title=lessons[i][0];c.topics[i].explanation=lessons[i][1];c.topics[i].takeaway=lessons[i][2];}
const QUESTIONS=[
 ["C1.0","¿Qué registra directamente un electrocardiógrafo?",["Diferencias de potencial eléctrico a lo largo del tiempo","Gasto cardíaco","Presión arterial","Contractilidad ventricular"],"Registra voltaje frente al tiempo, no el rendimiento mecánico del corazón."],
 ["C1.0","¿Qué contribución hizo Einthoven al desarrollo del ECG?",["Perfeccionó el registro eléctrico mediante el galvanómetro de cuerda","Inventó la ecocardiografía","Descubrió la angioplastia","Introdujo el cateterismo pulmonar"],"La relevancia histórica de Einthoven fue decisiva para obtener registros electrocardiográficos precisos."],
 ["C1.0","¿Por qué se obtienen doce derivaciones con diez electrodos en un ECG convencional?",["Porque los potenciales captados se combinan para obtener diferentes perspectivas","Porque dos electrodos no registran actividad eléctrica","Porque dos derivaciones se descartan","Porque cada derivación necesita un electrodo exclusivo"],"Las derivaciones se construyen a partir de señales y combinaciones de los diez electrodos."],
 ["C1.1","¿Qué fenómeno representa principalmente la onda P?",["Despolarización auricular","Despolarización ventricular","Repolarización ventricular","Apertura de válvulas cardíacas"],"La onda P refleja activación eléctrica auricular, no directamente la contracción."],
 ["C1.1","¿Qué evento eléctrico corresponde al complejo QRS?",["Despolarización ventricular","Repolarización auricular aislada","Relajación mecánica ventricular","Repolarización ventricular"],"El QRS representa el proceso de activación ventricular."],
 ["C1.1","¿Qué representa la onda T?",["Repolarización ventricular","Despolarización auricular","Retraso de conducción nodal","Contracción auricular"],"La onda T corresponde a la recuperación eléctrica de los ventrículos."],
 ["C1.1","¿Puede existir un QRS sin onda Q visible y ser normal?",["Sí: Q, R y S designan deflexiones observadas, no componentes siempre obligatorios","No: toda onda R debe estar precedida por una Q","Solo si hay un infarto de miocardio","Solo si existe marcapasos"],"La nomenclatura describe la morfología en cada derivación. No todos los complejos incluyen Q, R y S."],
 ["C1.2","El brazo derecho tiene 0 mV y el brazo izquierdo +0,6 mV. La derivación DI mide el brazo izquierdo (+) menos el brazo derecho (−). ¿Cuál es el valor de DI?",["+0,6 mV","−0,6 mV","0 mV","No se puede calcular"],"DI = potencial del brazo izquierdo − potencial del brazo derecho = +0,6 − 0 = +0,6 mV. Primero se identifican el polo positivo y el negativo."],
 ["C1.2","Si DI vale +0,6 mV y DIII vale −0,2 mV simultáneamente, ¿cuánto vale DII?",["+0,4 mV","+0,8 mV","−0,4 mV","−0,8 mV"],"DII = DI + DIII = +0,6 + (−0,2) = +0,4 mV."],
 ["C1.2","¿Un QRS predominantemente negativo significa necesariamente enfermedad?",["No: depende de cómo el vector eléctrico se proyecta sobre esa derivación","Sí: indica necrosis miocárdica","Sí: define un bloqueo de rama","Sí: implica hipopotasemia"],"Una deflexión negativa puede reflejar fuerzas eléctricas que se alejan del polo positivo; se interpreta en contexto."]
];
const qnew=QUESTIONS.map((q,i)=>({id:"C1-Q"+String(i+1).padStart(2,"0"),chapter:1,topic:q[0],question:q[1],choices:q[2],correct:0,reason:q[3]}));
root.ECG_QUESTIONS=[...qnew,...root.ECG_QUESTIONS.filter(q=>q.chapter!==1)];
const PHASES=[
 {key:"P",title:"Despolarización auricular",when:"Primero se activan las aurículas.",more:"La despolarización auricular origina la onda P. El ECG no mide directamente la contracción auricular."},
 {key:"QRS",title:"Despolarización ventricular",when:"El impulso se propaga por el sistema His–Purkinje y el miocardio ventricular.",more:"El complejo QRS refleja la activación ventricular. La repolarización auricular suele quedar oculta en él."},
 {key:"T",title:"Repolarización ventricular",when:"Los ventrículos recuperan progresivamente su estado eléctrico.",more:"La onda T refleja la repolarización ventricular. La relajación mecánica no es otra onda ECG."}
];
const WAVE_TASKS=[
 {key:"P",question:"Identifica el componente que representa despolarización auricular."},
 {key:"QRS",question:"Identifica el componente de despolarización ventricular."},
 {key:"T",question:"Identifica el componente de repolarización ventricular."}
];
const POTENTIAL_CASES=[
 {bd:0,bi:.8,pi:.5,question:"Si DI = +0,8 mV y DIII = −0,3 mV, ¿cuánto vale DII?",answer:.5},
 {bd:0,bi:.6,pi:1.1,question:"Brazo derecho: 0 mV. Brazo izquierdo: +0,6 mV. ¿Cuánto registra DI, que resta el brazo derecho al izquierdo?",answer:.6}
];
const state={phase:0,mode:"learn",wave:"P",waveQuestion:0,waveDone:new Set(),potential:{bd:0,bi:.6,pi:1.1},selectedLead:"DI",potPractice:0,potDone:new Set(),potAnswer:null,potFeedback:null,conceptAnswer:null};
function esc(s){return String(s).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));}
function fixed(n){return (Math.abs(n)<.0001?0:n).toFixed(1).replace(".",",");}
function round(n){return Math.round(n*10)/10;}
function leads(v){const {bd,bi,pi}=v;return {di:round(bi-bd),dii:round(pi-bd),diii:round(pi-bi)};}
function record(taskId,ok,reason){
 if(typeof root.ECG_recordVisualExercise==="function")
  root.ECG_recordVisualExercise({chapter:1,kind:"fundamentals",taskId,ok,reason});
}
function title(text,subtitle){
 return '<div class="c1-title"><p class="eyebrow">CAPÍTULO 1 · APRENDER Y PRACTICAR</p><h2>'+esc(text)+'</h2><p>'+esc(subtitle)+'</p></div>';
}
function waveGraphic(selected,showLabels=true,interactive=false){
 const active=selected||"none";
 const curve={
 P:"M25 115H77C87 115 91 100 101 100C115 100 120 115 134 115",
 QRS:"M134 115H166L181 126L195 23L208 146L224 115H260",
 T:"M260 115H304C326 115 331 79 352 77C374 76 385 115 408 115H465"
 };
 const labels=showLabels?'<g font-size="15" font-weight="800" text-anchor="middle" fill="#274d5e"><text x="104" y="81">P</text><text x="195" y="17">R</text><text x="354" y="61">T</text></g>':"";
 return '<svg class="c1-wave-svg" viewBox="0 0 490 180" role="img" aria-label="ECG didáctico con onda P, complejo QRS y onda T. Trazado sintético, no clínico."><defs><pattern id="c1-small" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M10 0H0V10" stroke="#e9d3d8" stroke-width=".6" fill="none"/></pattern><pattern id="c1-large" width="50" height="50" patternUnits="userSpaceOnUse"><rect width="50" height="50" fill="url(#c1-small)"/><path d="M50 0H0V50" stroke="#d8abb6" stroke-width="1" fill="none"/></pattern></defs><rect width="490" height="180" rx="12" fill="#fffbfa"/><rect width="490" height="180" fill="url(#c1-large)"/>'+
 Object.entries(curve).map(([k,path])=>'<path d="'+path+'" fill="none" stroke="'+(active===k?"#087b8c":"#4b6573")+'" stroke-width="'+(active===k?5:2.7)+'" stroke-linejoin="round" stroke-linecap="round"/>').join("")+
 labels+(interactive?'<g class="c1-selectable-waves">'+
 [["P",72,130,104,1],["QRS",164,227,195,2],["T",313,409,354,3]].map(([key,x1,x2,xc,n])=>'<g role="button" tabindex="0" data-c1-wave="'+key+'" aria-label="Seleccionar zona '+n+' del trazado"><rect x="'+x1+'" y="0" width="'+(x2-x1)+'" height="148" rx="9" fill="transparent" stroke="transparent"/><rect x="'+(xc-15)+'" y="139" width="30" height="23" rx="9" fill="#e5f4f2" stroke="#9bbfc4"/><text x="'+xc+'" y="155" text-anchor="middle" font-weight="800" font-size="14" fill="#125768">'+n+'</text></g>').join("")+'</g>':'')+
 '<text x="16" y="176" font-size="11.7" fill="#58737b">Esquema eléctrico, no ECG diagnóstico</text></svg>';
}
function phaseTool(){
 const p=PHASES[state.phase];
 const atlas=root.ECGVisualAtlas,core=root.ECGVisualCore;
 const heart=atlas&&core?atlas.heart(core,{selected:"none",stage:state.phase===0?1:state.phase===1?5:6,mode:"practice",playing:false}):"";
 return title("Del impulso al registro","Explora qué actividad eléctrica se registra y qué información no proporciona el ECG.")+
 '<div class="c1-panel c1-panel-hero"><div class="c1-physiology"><div class="c1-mini-heart">'+heart+'</div><div><span class="c1-step">FASE '+(state.phase+1)+' DE 3</span><h3>'+p.title+'</h3><p>'+p.when+'</p><p class="c1-muted">La actividad eléctrica precede a la respuesta mecánica, que no se mide directamente con este trazado.</p></div></div>'+waveGraphic(p.key)+
 '<div class="c1-step-actions">'+PHASES.map((x,i)=>'<button type="button" data-c1-phase="'+i+'" class="'+(state.phase===i?"selected":"")+'">'+(i+1)+'. '+x.key+'</button>').join("")+'</div><div class="c1-comment"><strong>'+p.title+'</strong><p>'+p.more+'</p></div></div>'+
 '<div class="c1-panel"><h3>Un breve contexto histórico</h3><p>Augustus Waller registró actividad eléctrica cardíaca humana antes de Einthoven. Willem Einthoven perfeccionó el galvanómetro de cuerda y consolidó el registro electrocardiográfico moderno; recibió el Nobel de Medicina en 1924. Lo importante aquí es comprender la medición eléctrica, no memorizar las fechas.</p></div><div class="c1-panel"><h3>Comprueba lo aprendido</h3><p>¿Qué magnitud mide directamente el ECG?</p><div class="c1-answer-grid">'+[["voltage","Diferencias de potencial eléctrico"],["mechanic","Fuerza de contracción"],["flow","Gasto cardíaco"]].map(([key,label])=>'<button type="button" data-c1-concept="'+key+'" '+(state.conceptAnswer?"disabled":"")+'>'+label+'</button>').join("")+'</div>'+
 (state.conceptAnswer?'<div class="c1-feedback '+(state.conceptAnswer==="voltage"?"good":"bad")+'" role="status"><strong>'+(state.conceptAnswer==="voltage"?"Correcto":"Revisa la diferencia")+'</strong><p>El ECG registra voltajes relativos a lo largo del tiempo. La contracción y el gasto cardíaco requieren otros métodos de valoración.</p></div><button class="btn secondary" data-c1-action="retry-concept">Volver a intentar</button>':'')+'</div>';
}
function wavesTool(){
 const practice=state.mode==="practice",task=WAVE_TASKS[state.waveQuestion%3];
 return title("Comprende P, PR, QRS, ST y T","Relaciona cada componente con el fenómeno eléctrico correspondiente.")+
 '<div class="c1-panel"><div class="c1-toolbar"><div class="c1-mode"><button data-c1-mode="learn" class="'+(!practice?"selected":"")+'">Aprender</button><button data-c1-mode="practice" class="'+(practice?"selected":"")+'">Practicar</button></div><span class="c1-step">'+state.waveDone.size+'/3 estructuras identificadas</span></div>'+
 '<div class="c1-wave-wrap">'+waveGraphic(practice?"none":state.wave,!practice,practice)+'</div>'+
 (practice?'<p class="c1-question">'+task.question+'</p>':'<p class="c1-muted">Selecciona una onda para resaltar su segmento y consultar el significado.</p>')+
 '<div class="c1-wave-select">'+PHASES.map((p,i)=>'<button type="button" data-c1-wave="'+p.key+'" class="'+(!practice&&state.wave===p.key?"selected":"")+'">'+(practice?"Zona "+(i+1):p.key==="QRS"?"Complejo QRS":"Onda "+p.key)+'</button>').join("")+'</div>'+
 (practice?'<p class="c1-muted">En modo práctica las zonas se numeran sin revelar las ondas. Puedes tocar el trazado o seleccionar una zona inferior.</p>':
 '<div class="c1-comment"><strong>'+PHASES.find(p=>p.key===state.wave).title+'</strong><p>'+PHASES.find(p=>p.key===state.wave).more+'</p></div>')+
 (state.waveAnswer?'<div class="c1-feedback '+(state.waveAnswer.ok?"good":"bad")+'" role="status"><strong>'+(state.waveAnswer.ok?"Identificación correcta":"Identificación incorrecta")+'</strong><p>'+esc(state.waveAnswer.reason)+'</p></div><button type="button" class="btn secondary" data-c1-action="'+(state.waveAnswer.ok?"next-wave":"retry-wave")+'">'+(state.waveAnswer.ok?"Siguiente componente →":"Reintentar")+'</button>':"")+
 '</div><div class="c1-panel"><h3>Otros componentes importantes</h3><div class="c1-two-grid"><div><strong>Intervalo PR</strong><p>Desde el comienzo de P al inicio del QRS. Incluye conducción auricular y auriculoventricular.</p></div><div><strong>Segmento ST</strong><p>Desde el final del QRS hasta el comienzo de T. Debe valorarse respecto a la línea isoeléctrica y el contexto.</p></div></div><p class="c1-muted">La repolarización auricular suele quedar enmascarada por la despolarización ventricular. Un QRS normal no requiere que se distingan ondas Q, R y S en todas las derivaciones.</p></div>';
}
const EINTHOVEN_LEADS={
 DI:{color:"#0d8192",positive:"Brazo izquierdo",negative:"Brazo derecho",formula:"Brazo izquierdo − brazo derecho",arrow:"M176 106H464",label:[320,74],minus:[189,83],plus:[451,83]},
 DII:{color:"#b1853d",positive:"Pierna izquierda",negative:"Brazo derecho",formula:"Pierna izquierda − brazo derecho",arrow:"M149 143L296 319",label:[157,248],minus:[161,153],plus:[269,293]},
 DIII:{color:"#8072a5",positive:"Pierna izquierda",negative:"Brazo izquierdo",formula:"Pierna izquierda − brazo izquierdo",arrow:"M491 143L344 319",label:[482,248],minus:[479,153],plus:[371,293]}
};
function einthovenGraphic(active){
 const selected=EINTHOVEN_LEADS[active]||EINTHOVEN_LEADS.DI;
 const activePath=Object.entries(EINTHOVEN_LEADS).map(([key,d])=>{
  const focus=key===active;
  return '<g class="c1-vessel" data-highlight="'+focus+'">'+
   '<path d="'+d.arrow+'" stroke="'+d.color+'" stroke-width="'+(focus?6:3)+'" stroke-linecap="round" fill="none" opacity="'+(focus?1:.28)+'" marker-end="url(#c1-arrow-'+key+')"/>'+
   '<text x="'+d.label[0]+'" y="'+d.label[1]+'" class="c1-fig-lead" text-anchor="middle" fill="'+d.color+'" opacity="'+(focus?1:.45)+'">'+key+'</text>'+
   (focus?'<g class="c1-fig-polarity"><circle cx="'+d.minus[0]+'" cy="'+d.minus[1]+'" r="12" fill="#fff" stroke="'+d.color+'" stroke-width="1.5"/><text x="'+d.minus[0]+'" y="'+(d.minus[1]+5)+'" text-anchor="middle">−</text><circle cx="'+d.plus[0]+'" cy="'+d.plus[1]+'" r="12" fill="#fff" stroke="'+d.color+'" stroke-width="1.5"/><text x="'+d.plus[0]+'" y="'+(d.plus[1]+5)+'" text-anchor="middle">+</text></g>':'')+
   '</g>';
 }).join("");
 const defs=Object.entries(EINTHOVEN_LEADS).map(([key,d])=>'<marker id="c1-arrow-'+key+'" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto"><path d="M0 0L10 5L0 10Z" fill="'+d.color+'"/></marker>').join("");
 const nodes=[
  {id:"BD",x:120,y:106},{id:"BI",x:520,y:106},{id:"PI",x:320,y:357}
 ].map(n=>'<g class="c1-fig-node"><circle cx="'+n.x+'" cy="'+n.y+'" r="34"/><text x="'+n.x+'" y="'+(n.y+7)+'" text-anchor="middle">'+n.id+'</text></g>').join("");
 return '<svg class="c1-triangle" viewBox="0 0 640 415" role="img" aria-label="Triángulo de Einthoven. Seleccionada '+active+'. El polo positivo es '+selected.positive+' y el negativo es '+selected.negative+'. Las extremidades son brazo derecho, brazo izquierdo y pierna izquierda.">'+
 '<defs>'+defs+'<linearGradient id="c1-node-fill" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#f7fdfc"/><stop offset="1" stop-color="#e9f4f2"/></linearGradient></defs>'+
 '<rect width="640" height="415" rx="22" fill="#f8fbfa"/>'+
 '<path d="M120 106H520L320 357Z" fill="#e8f2f0" fill-opacity=".45" stroke="#cadbdc" stroke-width="1.7" stroke-dasharray="7 10"/>'+
 activePath+nodes+'</svg>';
}
function potCell(id,label,value){
 return '<label class="c1-range-label"><span>'+label+'</span><strong data-c1-display="'+id+'">'+fixed(value)+' mV</strong><input type="range" data-c1-potential="'+id+'" min="-1.5" max="1.5" step="0.1" value="'+value+'" aria-label="'+label+'"/></label>';
}
function lawTool(){
 const p=state.potential,v=leads(p),test=POTENTIAL_CASES[state.potPractice%2],practice=state.mode==="practice";
 const selected=EINTHOVEN_LEADS[state.selectedLead],result=state.potFeedback;
 const guidance='<div class="c1-lead-intro"><strong>Una derivación no es un electrodo.</strong><p>Compara el potencial eléctrico de dos puntos: al polo positivo se le resta el polo negativo.</p></div>';
 const legend='<div class="c1-sites" aria-label="Referencias anatómicas del esquema">'+
 [['BD','Brazo derecho'],['BI','Brazo izquierdo'],['PI','Pierna izquierda']].map(([abbr,name])=>'<div class="c1-site"><span class="c1-site-abbr">'+abbr+'</span><span>'+name+'</span></div>').join("")+'</div>';
 const leadButtons='<div class="c1-lead-choices" role="group" aria-label="Seleccionar derivación">'+Object.keys(EINTHOVEN_LEADS).map(key=>{
  const d=EINTHOVEN_LEADS[key],active=state.selectedLead===key;
  return '<button type="button" data-c1-select-lead="'+key+'" class="c1-lead-choice '+(active?'selected':'')+'" aria-pressed="'+active+'" style="--lead-color:'+d.color+'"><strong>'+key+'</strong><span>'+d.negative+' → '+d.positive+'</span></button>';
 }).join("")+'</div>';
 const detail='<div class="c1-selected-detail" aria-live="polite" style="--lead-color:'+selected.color+'"><div class="c1-selected-heading"><span class="c1-dot"></span><strong>Derivación '+state.selectedLead+'</strong></div>'+
 '<div class="c1-pole-pair"><div><span>Polo negativo (−)</span><strong>'+selected.negative+'</strong></div><div><span>Polo positivo (+)</span><strong>'+selected.positive+'</strong></div></div>'+
 '<p class="c1-math-line"><strong>'+state.selectedLead+'</strong> = '+selected.formula+'</p></div>';
 return title("Comprender las derivaciones","Cómo se forman DI, DII y DIII y qué significan sus polos.")+
 '<div class="c1-panel c1-einthoven-panel"><div class="c1-mode" role="group" aria-label="Modo de uso"><button data-c1-mode="learn" class="'+(!practice?'selected':'')+'">Aprender</button><button data-c1-mode="practice" class="'+(practice?'selected':'')+'">Practicar</button></div>'+
 guidance+'<div class="c1-einthoven-layout"><div class="c1-einthoven-figure"><h3>Triángulo de Einthoven</h3>'+einthovenGraphic(state.selectedLead)+legend+'</div>'+
 '<div class="c1-einthoven-guide"><h3>Elige una derivación</h3><p class="c1-muted">La flecha va del polo negativo al positivo. Selecciona una derivación y observa qué puntos compara.</p>'+leadButtons+detail+'</div></div>'+
 (practice?'<div class="c1-practice-box"><p class="c1-question">Ejercicio '+(state.potPractice+1)+'/2 · '+test.question+'</p><div class="c1-answer-grid">'+getOptions(test).map(choice=>'<button type="button" data-c1-pot-answer="'+choice+'" '+(result?'disabled':'')+'>'+fixed(choice)+' mV</button>').join("")+'</div>'+
 (result?'<div class="c1-feedback '+(result.ok?'good':'bad')+'" role="status"><strong>'+(result.ok?'Correcto':'Revisa los polos y los signos')+'</strong><p>'+esc(result.reason)+'</p></div><button class="btn secondary" data-c1-action="'+(result.ok?'next-pot':'retry-pot')+'">'+(result.ok?'Continuar →':'Reintentar')+'</button>':'')+'</div>':
 '<div class="c1-parameter-grid"><h3>Comprueba los valores</h3><p class="c1-muted">Modifica los potenciales de las extremidades en un mismo instante.</p>'+potCell('bd','Brazo derecho',p.bd)+potCell('bi','Brazo izquierdo',p.bi)+potCell('pi','Pierna izquierda',p.pi)+
 '<div class="c1-results"><div><span>DI</span><strong data-c1-lead="di">'+fixed(v.di)+'</strong><small>mV</small></div><div><span>DII</span><strong data-c1-lead="dii">'+fixed(v.dii)+'</strong><small>mV</small></div><div><span>DIII</span><strong data-c1-lead="diii">'+fixed(v.diii)+'</strong><small>mV</small></div></div>'+
 '<div class="c1-law-result"><strong>Ley de Einthoven</strong><p data-c1-equation>DII = DI + DIII → '+fixed(v.dii)+' = '+fixed(v.di)+' + ('+fixed(v.diii)+') mV</p></div><button type="button" data-c1-action="reset-pots" class="btn secondary">Restablecer ejemplo</button></div>')+
 '</div><p class="c1-muted">La relación DII = DI + DIII se cumple al comparar potenciales simultáneos. En un ECG estándar se obtienen 12 derivaciones mediante 10 electrodos.</p>';
}
function getOptions(t){return t.answer===.5?[1.1,.5,-.5,-1.1]:[-.6,.6,0,1.2]}
function render(id){
 if(id==="C1.0")return '<section id="chapter1-root" class="c1-module">'+phaseTool()+'</section>';
 if(id==="C1.1")return '<section id="chapter1-root" class="c1-module">'+wavesTool()+'</section>';
 return '<section id="chapter1-root" class="c1-module">'+lawTool()+'</section>';
}
function refresh(){
 const el=document.querySelector("#chapter1-root");if(!el)return;
 const id=el.dataset.topic||root.ECGChapter1.activeTopic||"C1.0";
 el.innerHTML=(id==="C1.0"?phaseTool():id==="C1.1"?wavesTool():lawTool());
}
function setTopic(id){const changed=root.ECGChapter1.activeTopic!==id;root.ECGChapter1.activeTopic=id;if(changed){state.mode="learn";state.waveAnswer=null;state.potFeedback=null;}}
function evalWaves(value){
 const target=WAVE_TASKS[state.waveQuestion%3],ok=value===target.key;
 state.waveAnswer={ok,reason:target.question+" "+PHASES.find(p=>p.key===target.key).more};
 if(ok){state.waveDone.add(target.key);if(state.waveDone.size===3)record("waves",true,"Reconoce P, QRS y T en ejercicios sucesivos.");}
 else record("waves",false,state.waveAnswer.reason);
}
function evalPots(value){
 const t=POTENTIAL_CASES[state.potPractice%2],ok=Math.abs(Number(value)-t.answer)<.005;
 const reason=state.potPractice===0?"DII = DI + DIII = +0,8 + (−0,3) = +0,5 mV." :"DI = brazo izquierdo − brazo derecho = +0,6 − 0 = +0,6 mV.";
 state.potFeedback={ok,reason};
 if(ok){state.potDone.add(state.potPractice);if(state.potDone.size===2)record("einthoven",true,"Resuelve correctamente dos casos aplicando las derivaciones de Einthoven.");}
 else record("einthoven",false,reason);
}
if(typeof document!=="undefined"){
 document.body.addEventListener("click",event=>{
  const el=event.target.closest("[data-c1-phase],[data-c1-mode],[data-c1-wave],[data-c1-concept],[data-c1-pot-answer],[data-c1-action],[data-c1-select-lead]");if(!el||!document.querySelector("#chapter1-root"))return;
  if(el.hasAttribute("data-c1-select-lead"))state.selectedLead=el.dataset.c1SelectLead;
  else if(el.hasAttribute("data-c1-phase"))state.phase=Number(el.dataset.c1Phase);
  else if(el.hasAttribute("data-c1-mode")){state.mode=el.dataset.c1Mode;state.waveAnswer=null;state.potFeedback=null;state.potPractice=0;state.waveQuestion=0;}
  else if(el.hasAttribute("data-c1-concept")){if(state.conceptAnswer)return;state.conceptAnswer=el.dataset.c1Concept;record("recording",state.conceptAnswer==="voltage","El ECG registra diferencias de potencial en el tiempo, no variables mecánicas.");}
  else if(el.hasAttribute("data-c1-wave")){if(state.mode==="practice"&&state.waveAnswer)return;if(state.mode==="learn")state.wave=el.dataset.c1Wave;else evalWaves(el.dataset.c1Wave);}
  else if(el.hasAttribute("data-c1-pot-answer")){if(state.potFeedback)return;evalPots(el.dataset.c1PotAnswer);}
  else if(el.hasAttribute("data-c1-action")){
   if(el.dataset.c1Action==="retry-concept")state.conceptAnswer=null;
   if(el.dataset.c1Action==="retry-wave")state.waveAnswer=null;
   if(el.dataset.c1Action==="next-wave"){state.waveQuestion=(state.waveQuestion+1)%3;state.waveAnswer=null;}
   if(el.dataset.c1Action==="retry-pot")state.potFeedback=null;
   if(el.dataset.c1Action==="next-pot"){state.potPractice=(state.potPractice+1)%2;state.potFeedback=null;}
   if(el.dataset.c1Action==="reset-pots")state.potential={bd:0,bi:.6,pi:1.1};
  }
  refresh();
 });
 document.body.addEventListener("keydown",event=>{
  if((event.key==="Enter"||event.key===" ")&&event.target.matches?.('g[data-c1-wave][role="button"]')){event.preventDefault();event.target.dispatchEvent(new MouseEvent("click",{bubbles:true}));}
 });
 document.body.addEventListener("input",event=>{
  if(!event.target.hasAttribute("data-c1-potential")||!document.querySelector("#chapter1-root"))return;
  const key=event.target.dataset.c1Potential,val=Number(event.target.value);if(!Number.isFinite(val)||!["bd","bi","pi"].includes(key))return;
  state.potential[key]=val;const v=leads(state.potential);
  const rootEl=document.querySelector("#chapter1-root");
  const label=rootEl.querySelector('[data-c1-display="'+key+'"]');if(label)label.textContent=fixed(val)+" mV";
  for(const k of ["di","dii","diii"]){const e=rootEl.querySelector('[data-c1-lead="'+k+'"]');if(e)e.textContent=fixed(v[k]);}
  const e=rootEl.querySelector("[data-c1-equation]");if(e)e.textContent="DII = DI + DIII → "+fixed(v.dii)+" = "+fixed(v.di)+" + ("+fixed(v.diii)+") mV";
 });
}
root.ECGChapter1={render,setTopic,activeTopic:"C1.0",leads,questions:qnew,options:getOptions,phases:PHASES,version:"1.1"};
})(typeof window!=="undefined"?window:globalThis);