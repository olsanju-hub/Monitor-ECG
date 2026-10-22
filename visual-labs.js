/* ECG Visual Lab UI — all essential interactions available by touch and pointer/keyboard.
 * Delivers practice results to the Academy, without awarding theory-only mastery.
 * Diagrams are anatomical approximations for teaching, not clinical images.
 */
(function(root){
"use strict";
const C=root.ECGVisualCore;
if(!C)throw Error("ECGVisualCore not loaded");
const esc=v=>String(v).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const types={2:"conduction",3:"vectors",5:"placement",6:"measurement"};
const count={conduction:6,vectors:6,placement:6,measurement:4};
const state={type:"conduction",mode:"explore",index:0,angle:40,lead:"I",part:"sa",stage:0,playing:false,point:null,marks:[],last:null,correct:new Set(),pending:null,speed:900,zoomed:false};
let playback=null,dragging=false,dragPointer=null;
const $=sel=>document.querySelector(sel);
function stop(){if(playback){clearInterval(playback);playback=null;}state.playing=false;dragging=false}
function reset(type,mode="explore"){
 stop();state.type=type;state.mode=mode;state.index=0;state.part=type==="placement"?"V1":"sa";state.stage=0;state.point=null;state.marks=[];state.last=null;state.correct=new Set();state.zoomed=false;
}
function prepare(type,mode="practice"){if(!count[type])return;reset(type,mode);}
function render(chapter){
 const type=types[chapter];
 if(!type)return "";
 if(state.type!==type)reset(type);
 return '<div id="ecg-lab" class="lab-root">'+content()+'</div>';
}
function panel(title,subtitle){return '<div class="lab-top"><div><p class="eyebrow">PRÁCTICA VISUAL · '+esc(state.type)+'</p><h3>'+esc(title)+'</h3><p class="subtle">'+esc(subtitle)+'</p></div><div class="lab-modes" role="group" aria-label="Modo de aprendizaje"><button type="button" data-lab-mode="explore" class="'+(state.mode==="explore"?"selected":"")+'">Aprender</button><button type="button" data-lab-mode="practice" class="'+(state.mode==="practice"?"selected":"")+'">Practicar</button></div></div>'}
function summary(){
 if(state.mode!=="practice")return "";
 return '<div class="lab-score" role="status" aria-live="polite">'+state.correct.size+' / '+count[state.type]+' competencias superadas en esta sesión</div>';
}
function feedback(){if(!state.last)return '<p class="lab-guidance" role="status">Selecciona una opción para obtener explicación inmediata.</p>';
 return '<div class="lab-feedback '+(state.last.ok?"correct":"incorrect")+'" role="status" aria-live="polite"><strong>'+(state.last.ok?"Correcto":"Revisa el concepto")+'</strong><p>'+esc(state.last.reason)+'</p></div>';
}
function nextControls(){if(state.mode!=="practice"||!state.last)return "";
 return '<div class="lab-next"><button type="button" class="btn primary" data-lab-action="'+(state.last.ok?"next":"retry")+'">'+(state.last.ok?"Siguiente ejercicio →":"Volver a intentarlo")+'</button></div>';
}
function record(taskId,ok,reason){
 state.last={ok,reason};if(ok)state.correct.add(taskId);
 if(typeof root.ECG_recordVisualExercise==="function"){
  const chapter={conduction:2,vectors:3,placement:5,measurement:6}[state.type];
  root.ECG_recordVisualExercise({chapter,kind:state.type,taskId,ok,reason});
 }
}
function content(){
 if(state.type==="conduction")return conduction();
 if(state.type==="vectors")return vectors();
 if(state.type==="placement")return placement();
 return measurement();
}
function refresh({keepScroll=false}={}){
 const rootEl=$("#ecg-lab");if(!rootEl)return;
 const oldScroll=keepScroll?rootEl.querySelector(".lab-diagram-viewport")?.scrollLeft:undefined;
 const oldZoom=keepScroll?rootEl.querySelector("[data-lab-zoom]")?.value:null;
 rootEl.innerHTML=content();
 if(keepScroll&&oldScroll!=null){const sc=rootEl.querySelector(".lab-diagram-viewport");if(sc)sc.scrollLeft=oldScroll;}
 if(oldZoom){const sel=rootEl.querySelector("[data-lab-zoom]"),sheet=rootEl.querySelector(".lab-measure-sheet");if(sel)sel.value=oldZoom;if(sheet)sheet.style.width=Math.round(1000*Number(oldZoom))+"px";}
}
function viewTools(){
 return '<div class="lab-view-tools"><span>'+(state.zoomed?'Detalle ampliado: desplaza dentro del gráfico.':'Vista completa: amplía para interactuar con precisión.')+'</span><button type="button" class="btn secondary" data-lab-action="zoom-toggle" aria-pressed="'+state.zoomed+'">'+(state.zoomed?'Ajustar a pantalla':'Ampliar detalle')+'</button></div>';
}
function conduction(){
 const target=C.CONDUCTION[state.index%C.CONDUCTION.length],selected=C.CONDUCTION.find(p=>p.id===state.part)||C.CONDUCTION[0];
 const active=C.CONDUCTION[state.stage%C.CONDUCTION.length];
 const stageText=C.CONDUCTION.map((p,i)=>'<button type="button" class="'+(i===state.stage?"selected":"")+'" data-lab-stage="'+i+'">'+(i+1)+'. '+esc(p.short)+'</button>').join("");
 const top=panel("Cómo se propaga el impulso","Relaciona cada estructura cardíaca con la onda P, el PR y el QRS.");
 const prompt=state.mode==="practice"?'<p class="lab-question">Localiza en la ilustración: <strong>'+esc(target.task)+'</strong></p><p class="subtle">Toca la estructura correcta; las etiquetas se ocultan durante la prueba.</p>':"";
 const controls=state.mode==="explore"?'<div class="lab-toolbar"><button type="button" class="btn secondary" data-lab-action="'+(state.playing?"pause":"play")+'">'+(state.playing?"Pausar":"Reproducir")+" secuencia"+'</button><button type="button" class="btn secondary" data-lab-action="step">Paso siguiente</button><button type="button" class="btn secondary" data-lab-action="restart">Reiniciar</button></div><div class="lab-steps">'+stageText+"</div>":"";
 const info=state.mode==="explore"?'<div class="lab-description"><strong>'+esc(selected.title)+'</strong><p>'+esc(selected.ecg)+'</p><p class="lab-note">Paso activo: '+esc(active.short)+'. '+esc(active.ecg)+'</p></div>':feedback()+nextControls();
 return top+prompt+viewTools()+
 '<div class="lab-diagram-viewport lab-figure-container atlas-container" data-lab-zoomed="'+state.zoomed+'" aria-label="Sistema de conducción · modelo anatómico en vista completa o ampliada">'+
 root.ECGVisualAtlas.heart(C,{selected:state.part,stage:state.stage,mode:state.mode,playing:state.playing})+'</div>'+

 (state.mode==="explore"?'<div class="lab-key-grid">'+C.CONDUCTION.map((p,i)=>'<button type="button" data-lab-part="'+p.id+'" class="lab-key '+(state.part===p.id?'selected':'')+'">'+(i+1)+'. '+esc(p.short)+'</button>').join("")+'</div>':"")+
 controls+(state.mode==='explore'?'<p class="lab-correlation"><strong>Correlato ECG:</strong> '+esc(conductionPhase(state.stage))+'</p>':'')+info+summary();
}
function vectorTrace(value){
 const pts=[];for(let x=0;x<=500;x+=4){
  const u=(x-250)/27;
  const peak=Math.exp(-.5*u*u);
  const shoulder=.13*Math.exp(-.5*Math.pow((x-335)/45,2));
  const y=70-53*value*peak-15*value*shoulder;
  pts.push((x?"L":"M")+x+","+y.toFixed(2));
 }
 return pts.join(" ");
}
function conductionPhase(stage){
 const phases=["P · inicio de activación auricular","P · propagación auricular","PR · retraso nodal AV","QRS · activación septal","QRS · activación ventricular","QRS · red de Purkinje"];
 return phases[stage]||phases[0];
}
function vectorState(){
 const cases=[[0,"I"],[180,"I"],[0,"aVF"],[-150,"aVR"],[0,"aVR"],[120,"III"]];
 const angle=state.mode==="practice"?cases[state.index%6][0]:state.angle;
 const lead=state.mode==="practice"?cases[state.index%6][1]:state.lead;
 return {angle,lead,value:C.projection(angle,lead),sign:C.polarity(angle,lead)};
}
function vectors(){
 const v=vectorState(),cx=320,cy=215,r=135,a=v.angle*Math.PI/180,la=C.LEADS[v.lead]*Math.PI/180;
 const x=cx+r*Math.cos(a),y=cy-r*Math.sin(a);
 const leadX=cx+155*Math.cos(la),leadY=cy-155*Math.sin(la);
 const view=state.mode==="practice"?'¿El vector de '+v.angle+'° dará una deflexión positiva, negativa o casi equipásica en '+v.lead+'?':"Mueve el vector o cambia de derivación: observa cómo cambia la proyección.";
 const deflection=state.mode==="practice"&&!state.last?"Pendiente de predicción":Math.round(v.value*100)+" % de la amplitud máxima";
 return panel("Vectores y derivaciones","El signo depende de la proyección del vector sobre el eje de la derivación, no de su magnitud absoluta.")+
 '<p class="lab-question">'+esc(view)+'</p>'+
 viewTools()+'<div class="lab-diagram-viewport lab-figure-container" data-lab-zoomed="'+state.zoomed+'"><svg data-lab-vector-plot="true" class="lab-figure lab-vector" viewBox="0 0 690 440" role="img" aria-label="Vector eléctrico interactivo y eje frontal de derivaciones" style="touch-action:none"><circle cx="'+cx+'" cy="'+cy+'" r="158" fill="#eaf4f4" stroke="#b5d7d9" stroke-width="2"/>'+
 Object.entries(C.LEADS).map(([name,degrees])=>{const rad=degrees*Math.PI/180,ax=cx+140*Math.cos(rad),ay=cy-140*Math.sin(rad);return '<path d="M'+cx+' '+cy+' L'+ax+' '+ay+'" stroke="#c2d2d7" stroke-width="1" stroke-dasharray="5 5"/><text x="'+(cx+173*Math.cos(rad))+'" y="'+(cy-173*Math.sin(rad))+'" text-anchor="middle" fill="#486572" font-size="16" font-weight="700">'+name+'</text>'}).join("")+
 '<line x1="'+cx+'" y1="'+cy+'" x2="'+leadX+'" y2="'+leadY+'" stroke="#8b9aa5" stroke-width="6" stroke-linecap="round"/>'+
 '<path data-lab-vector-arrow d="M'+cx+' '+cy+' L'+x+' '+y+'" stroke="#087c8d" stroke-width="10" stroke-linecap="round"/>'+
 '<circle data-lab-vector-dot cx="'+x+'" cy="'+y+'" r="14" fill="#087c8d" stroke="#fff" stroke-width="4"/>'+
 '<text x="320" y="416" fill="#274557" text-anchor="middle" font-size="18">Vector: '+v.angle+'° · Derivación: '+v.lead+'</text></svg></div>'+
 (state.mode==="explore"||state.last?'<div class="lab-wave-preview"><p class="eyebrow">DEFLEXIÓN RESULTANTE · MODELO VECTORIAL</p><svg viewBox="0 0 500 140" role="img" aria-label="Deflexión orientativa calculada según proyección eléctrica"><path d="M0 70H500" stroke="#cadadd" stroke-width="1.5"/><path data-lab-projection-wave d="'+vectorTrace(v.value)+'" fill="none" stroke="#087c8d" stroke-width="4" stroke-linejoin="round"/></svg><p class="subtle">La deflexión cambia de signo cuando el vector cruza el eje perpendicular. Forma sintética esquemática, no QRS clínico.</p></div>':'')+
 (state.mode==="explore"?'<div class="lab-inputs"><label>Derivación<select data-lab-lead aria-label="Derivación del plano frontal">'+Object.keys(C.LEADS).map(k=>'<option value="'+k+'" '+(k===v.lead?'selected':'')+'>'+k+'</option>').join("")+'</select></label><label>Ángulo: <strong data-lab-angle-label>'+v.angle+'°</strong><input type="range" min="-180" max="180" step="5" value="'+v.angle+'" data-lab-angle aria-label="Ángulo del vector"/></label></div>'+
 '<div class="lab-description"><strong data-lab-projection>'+deflection+'</strong><p data-lab-polarity>Deflexión '+(v.sign==="positive"?"positiva":v.sign==="negative"?"negativa":"equipásica")+'. El vector cambia su signo cuando cruza la dirección perpendicular al eje observado.</p></div>':
 '<div class="lab-options" role="group" aria-label="Predecir polaridad">'+[["positive","Positiva"],["negative","Negativa"],["isoelectric","Equipásica"]].map(([k,label])=>'<button type="button" class="lab-answer" data-lab-polarity-choice="'+k+'" '+(state.last?'disabled':'')+'>'+label+'</button>').join("")+'</div>'+
 feedback()+nextControls())+summary();
}
function placement(){
 const name=C.PLACEMENT_ORDER[state.index%6],p=C.ELECTRODES[name],explore=state.mode==="explore";
 const torso=root.ECGVisualAtlas.torso(C,{mode:state.mode,selected:state.part,point:state.point,last:state.last});
 const intro=explore?'<p class="lab-question">Elige un electrodo para consultar referencias anatómicas. V4 se coloca antes de V3.</p>':
 '<p class="lab-question">Sitúa <strong>'+name+'</strong> sobre el tórax sin ver la solución.</p><p class="subtle">Desplaza lateralmente la ilustración en el móvil. Pulsa una vez sobre el punto elegido.</p>';
 return panel("Colocación de V1–V6","Tórax docente orientado de frente. Los espacios y las líneas se señalan para razonar la colocación.")+intro+
 viewTools()+'<div class="lab-diagram-viewport lab-figure-container lab-pan" data-lab-zoomed="'+state.zoomed+'" aria-label="Tórax en vista completa o ampliada">'+torso+'</div>'+
 (explore?'<div class="lab-key-grid">'+Object.entries(C.ELECTRODES).map(([k])=>'<button class="lab-key '+(state.part===k?'selected':'')+'" data-lab-electrode="'+k+'">'+k+'</button>').join("")+'</div><div class="lab-description"><strong>'+esc(state.part.match(/^V/)?state.part:"V1")+'</strong><p>'+esc(C.ELECTRODES[state.part]?.text||C.ELECTRODES.V1.text)+'</p><p class="lab-note">V1 y V2: cuarto espacio intercostal. V4: quinto espacio, línea medioclavicular. V5 y V6: mismo plano horizontal que V4.</p></div>':
 feedback()+nextControls())+summary();
}
function paper(){return root.ECGTeachingTrace.svg({marks:state.marks,explore:state.mode==="explore"});}
function measurement(){
 const task=C.MEASURE_TASKS[state.index%C.MEASURE_TASKS.length],explore=state.mode==="explore";
 const legend='<div class="lab-values"><span>RR: 0,80 s</span><span>PR: 0,16 s</span><span>QRS: 0,09 s</span><span>QT: 0,42 s</span></div>';
 const prompt=explore?'<p class="lab-question">Comprueba los componentes y la escala: 1 mm horizontal = 0,04 s; 1 mm vertical = 0,1 mV.</p>':
 '<p class="lab-question"><strong>'+esc(task.label)+'</strong>. '+esc(task.hint)+'</p><p class="subtle">Amplía y desplaza la tira. Toca el inicio y el final solicitados; no basta con acertar la distancia entre puntos incorrectos.</p>';
 return panel("Mediciones sobre papel ECG","Cursores táctiles con coordenadas temporales independientes del zoom y de la anchura de pantalla.")+prompt+
 '<div class="lab-toolbar"><label>Ampliación<select data-lab-zoom aria-label="Ampliación del papel ECG"><option value="1">100 %</option><option value="1.4">140 %</option><option value="2">200 %</option></select></label><button class="btn secondary" data-lab-action="clear">Borrar cursores</button></div>'+
 '<div class="lab-diagram-viewport lab-measure-viewport" aria-label="Tira ECG desplazable"><div class="lab-measure-sheet" style="width:1000px">'+paper()+'</div></div>'+
 (explore?legend+'<div class="lab-description"><strong>Qué medir</strong><p>RR: de un pico R al siguiente. PR: del inicio de P al inicio del QRS. QRS: desde el comienzo hasta el final de la despolarización ventricular. QT: del inicio del QRS hasta el final de T.</p><p class="lab-note">Las amplitudes y duraciones de esta tira son un ejemplo sintético. En modo Practicar se comprueba también que los cursores señalen los eventos correctos.</p></div>':
 (state.marks.length===1?'<p class="lab-guidance">Primer marcador situado. Toca el segundo punto.</p>':feedback())+nextControls())+summary();
}
function answer(part){
 const t=C.CONDUCTION[state.index%6];
 if(state.last)return;
 if(part===t.id)record(t.id,true,t.title+". "+t.ecg);
 else record(t.id,false,"Esa estructura no corresponde. Observa su posición y el recorrido desde el nodo sinusal hasta Purkinje.");
 refresh({keepScroll:true});
}
function action(name){
 if(name==="zoom-toggle"){state.zoomed=!state.zoomed;refresh({keepScroll:state.zoomed});return}
 if(name==="play"){
  stop();state.playing=true;refresh({keepScroll:true});
  playback=setInterval(()=>{if(!$("#ecg-lab")){stop();return;}state.stage=(state.stage+1)%6;refresh({keepScroll:true});},state.speed);
 }else if(name==="pause"){stop();refresh({keepScroll:true})}
 else if(name==="restart"){stop();state.stage=0;refresh({keepScroll:true})}
 else if(name==="step"){stop();state.stage=(state.stage+1)%6;refresh({keepScroll:true})}
 else if(name==="clear"){state.marks=[];state.last=null;refresh({keepScroll:true})}
 else if(name==="retry"){state.last=null;state.point=null;state.marks=[];refresh({keepScroll:true})}
 else if(name==="next"){
  state.index=(state.index+1)%count[state.type];state.last=null;state.marks=[];state.point=null;
  refresh({keepScroll:true});
 }
}
function updateVector(){
 const svg=$("#ecg-lab .lab-vector");if(!svg)return;
 const v=vectorState(),r=135,a=v.angle*Math.PI/180,x=320+r*Math.cos(a),y=215-r*Math.sin(a);
 svg.querySelector("[data-lab-vector-arrow]")?.setAttribute("d","M320 215L"+x+" "+y);
 const d=svg.querySelector("[data-lab-vector-dot]");if(d){d.setAttribute("cx",x);d.setAttribute("cy",y);}
 const label=$("#ecg-lab [data-lab-angle-label]");if(label)label.textContent=v.angle+"°";
 const sign=$("#ecg-lab [data-lab-polarity]");if(sign)sign.textContent="Deflexión "+(v.sign==="positive"?"positiva":v.sign==="negative"?"negativa":"equipásica")+". El signo depende de la proyección.";
 const val=$("#ecg-lab [data-lab-projection]");if(val)val.textContent=Math.round(v.value*100)+" % de la amplitud máxima";
 const trace=$("#ecg-lab [data-lab-projection-wave]");if(trace)trace.setAttribute("d",vectorTrace(v.value));
 const input=$("#ecg-lab [data-lab-angle]");if(input)input.value=v.angle;
 const text=svg.querySelector("text:last-of-type");if(text)text.textContent="Vector: "+v.angle+"° · Derivación: "+v.lead;
}
document.body.addEventListener("click",event=>{
 const t=event.target.closest("[data-lab-mode],[data-lab-part],[data-lab-stage],[data-lab-action],[data-lab-electrode],[data-lab-polarity-choice]");
 if(!$("#ecg-lab"))return;
 const plot=event.target.closest("[data-lab-torso],[data-lab-paper]");
 if(plot&&state.mode==="practice"&&!state.last){
  const point=C.svgClientPoint(plot,event.clientX,event.clientY);
  if(plot.hasAttribute("data-lab-torso")&&state.type==="placement"){
   const id=C.PLACEMENT_ORDER[state.index%C.PLACEMENT_ORDER.length];
   const graded=C.gradePlacement(id,point.x,point.y);
   state.point=point;record(id,graded.ok,graded.reason);refresh({keepScroll:true});return;
  }
  if(plot.hasAttribute("data-lab-paper")&&state.type==="measurement"){
   if(point.x<0||point.x>1100)return;
   state.marks.push(point.x/220);
   if(state.marks.length>=2){
    const id=C.MEASURE_TASKS[state.index%C.MEASURE_TASKS.length].id;
    const result=C.measurementGrade(id,state.marks[0],state.marks[1]);
    record(id,result.ok,result.reason);
   }
   refresh({keepScroll:true});return;
  }
 }
 if(!t)return;
 if(t.hasAttribute("data-lab-mode")){reset(state.type,t.dataset.labMode);refresh();return}
 if(t.hasAttribute("data-lab-stage")){stop();state.stage=Number(t.dataset.labStage);refresh({keepScroll:true});return}
 if(t.hasAttribute("data-lab-action")){action(t.dataset.labAction);return}
 if(t.hasAttribute("data-lab-part")){
  if(state.type!=="conduction")return;
  const id=t.dataset.labPart;if(state.mode==="practice"){answer(id);return;}
  state.part=id;state.stage=C.CONDUCTION.findIndex(p=>p.id===id);refresh({keepScroll:true});return;
 }
 if(t.hasAttribute("data-lab-electrode")){
  if(state.type!=="placement"||state.mode!=="explore")return;
  state.part=t.dataset.labElectrode;refresh({keepScroll:true});return;
 }
 if(t.hasAttribute("data-lab-polarity-choice")){
  if(state.type!=="vectors"||state.mode!=="practice"||state.last)return;
  const a=vectorState(),ok=t.dataset.labPolarityChoice===a.sign;
  record("vector-"+state.index,ok,ok?"Proyección cos("+a.angle+"° − "+C.LEADS[a.lead]+"°) = "+a.value.toFixed(2)+". Resultado: "+(a.sign==="positive"?"positivo":a.sign==="negative"?"negativo":"casi equipásico")+".":"Analiza el ángulo entre vector y polo positivo: cos("+a.angle+"° − "+C.LEADS[a.lead]+"°) = "+a.value.toFixed(2)+".");
  refresh({keepScroll:true});return;
 }

});
document.body.addEventListener("keydown",event=>{
 if((event.key==="Enter"||event.key===" ")&&event.target.matches("[data-lab-part],[data-lab-electrode]")){
  event.preventDefault();event.target.click();
 }
});
document.body.addEventListener("change",event=>{
 if(event.target.matches("[data-lab-lead]")){state.lead=event.target.value;refresh({keepScroll:true});}
 if(event.target.matches("[data-lab-zoom]")){
  const zoom=Number(event.target.value),sheet=$("#ecg-lab .lab-measure-sheet");
  if(sheet)sheet.style.width=Math.round(1000*zoom)+"px";
 }
});
document.body.addEventListener("input",event=>{
 if(event.target.matches("[data-lab-angle]")){state.angle=Number(event.target.value);updateVector();}
});
document.body.addEventListener("pointerdown",event=>{
 const plot=event.target.closest("[data-lab-vector-plot]");
 if(!plot||state.mode!=="explore"||state.type!=="vectors")return;
 dragging=true;dragPointer=event.pointerId;plot.setPointerCapture?.(event.pointerId);
 updateFromPointer(plot,event);
});
document.body.addEventListener("pointermove",event=>{
 if(!dragging||dragPointer!==event.pointerId)return;
 const plot=$("#ecg-lab [data-lab-vector-plot]");if(plot)updateFromPointer(plot,event);
});
function updateFromPointer(svg,event){
 const p=C.svgClientPoint(svg,event.clientX,event.clientY);
 state.angle=Math.round(Math.atan2(215-p.y,p.x-320)*180/Math.PI/5)*5;
 state.angle=Math.max(-180,Math.min(180,state.angle));updateVector();
}
const endDrag=event=>{if(dragPointer===event.pointerId){dragging=false;dragPointer=null}};
document.body.addEventListener("pointerup",endDrag);
document.body.addEventListener("pointercancel",endDrag);
root.ECGVisualLab={render,prepare,getStatus:()=>({type:state.type,mode:state.mode,correct:state.correct.size,total:count[state.type]})};
})(typeof window==="undefined"?globalThis:window);