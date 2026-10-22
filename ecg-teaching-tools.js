/* ECG didactic calculators / axis tutor.
 * Original explanations, diagrams and examples. No scraped UI or graphics.
 */
(function(root){
"use strict";
const E=root.ECGTeachingMath;
if(!E)throw Error("ECGTeachingMath missing");
const esc=s=>String(s).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
let challengeIndex=0,choice=null,completed=new Set(),calcResult=null,frequencyResult=null,qtcResult=null;
const sign=v=>v>0.2?"positivo":v<-.2?"negativo":"casi equipásico";
const num=(v)=>{if(!/^[+-]?(?:\d+([.,]\d*)?|[.,]\d+)$/.test(String(v).trim()))throw Error("Introduce un número válido");return Number(String(v).trim().replace(",","."))};
function vectorPicture(angle){
 const vals=E.leadAmplitudes(angle,8),a=angle*Math.PI/180,cx=170,cy=151,dx=cx+95*Math.cos(a),dy=cy-95*Math.sin(a);
 return '<svg class="teach-axis-svg" viewBox="0 0 350 310" role="img" aria-label="Plano hexaxial con vector orientado a '+Math.round(angle)+' grados">'+
 '<circle cx="'+cx+'" cy="'+cy+'" r="120" fill="#f0f8f7" stroke="#bcdada"/>'+
 Object.entries(E.LEADS).map(([name,deg])=>{const rad=deg*Math.PI/180,x=cx+105*Math.cos(rad),y=cy-105*Math.sin(rad),tx=cx+132*Math.cos(rad),ty=cy-132*Math.sin(rad);return '<path d="M'+cx+' '+cy+'L'+x+' '+y+'" stroke="#a9c6cd" stroke-dasharray="4 5"/><text x="'+tx+'" y="'+(ty+5)+'" font-size="14" font-weight="700" fill="#335567" text-anchor="middle">'+name+'</text>'}).join("")+
 '<path d="M'+cx+' '+cy+'L'+dx+' '+dy+'" stroke="#087c8d" stroke-width="6" stroke-linecap="round"/><circle cx="'+dx+'" cy="'+dy+'" r="8" fill="#087c8d"/>'+
 '<text x="'+cx+'" y="303" text-anchor="middle" font-size="15" fill="#0a3d62" font-weight="700">Eje aproximado: '+Math.round(angle)+'°</text></svg>';
}
function qrsTrace(value,label){
 const y=51-36*Math.max(-1,Math.min(1,value/8));
 return '<svg viewBox="0 0 150 104" role="img" aria-label="QRS esquemático de '+label+', voltaje neto '+value.toFixed(1)+' milímetros">'+
 '<path d="M0 51H150" stroke="#c8d6d7" stroke-width="1.5"/>'+
 '<path d="M7 51H46L52 54L63 '+y.toFixed(2)+'L74 51H143" stroke="#0a5970" stroke-width="3.2" fill="none" stroke-linejoin="round"/>'+
 '<text x="7" y="17" font-size="15" font-weight="800" fill="#0a3d62">'+label+'</text></svg>';
}
function caseScreen(){
 const c=E.CASES[challengeIndex%E.CASES.length],v=c.voltages;
 const strips=['I','aVF','II'].map(key=>'<div class="teach-lead"><strong>'+key+'</strong>'+qrsTrace(v[key],key)+'<small>'+sign(v[key])+' · '+v[key].toFixed(1)+' mm</small></div>').join("");
 return '<div class="teach-card" id="axis-exercises"><div class="teach-head"><div><p class="eyebrow">EJERCICIO '+(challengeIndex+1)+' DE '+E.CASES.length+'</p><h3>Clasifica el eje observando I, aVF y II</h3></div><span class="pill">'+completed.size+'/'+E.CASES.length+' acertados</span></div>'+
 '<p class="subtle">Son QRS esquemáticos con voltaje neto derivado de un vector único. Evalúa el signo, no la forma clínica exacta.</p>'+
 '<div class="teach-three-leads">'+strips+'</div>'+
 '<div class="teach-answer-grid">'+[["normal","Normal"],["left","Izquierdo"],["right","Derecho"],["extreme","Extremo"]].map(([k,t])=>'<button type="button" class="teach-answer" data-teach-axis-answer="'+k+'" '+(choice!==null?'disabled':'')+'>'+t+'</button>').join("")+'</div>'+
 (choice!==null?'<div class="teach-feedback '+(choice===E.classifyAxis(c.angle)?"correct":"incorrect")+'" role="status"><strong>'+(choice===E.classifyAxis(c.angle)?"Correcto":"Revisa la clasificación")+'</strong><p>'+esc(c.why)+'</p><p>El eje del ejemplo es '+c.angle+'°, '+E.nameAxis(E.classifyAxis(c.angle)).toLowerCase()+'.</p></div><button type="button" class="btn primary" data-teach-axis-next="true">Otro ejemplo →</button>':'<p class="subtle">Elige una clasificación antes de consultar la solución.</p>')+'</div>';
}
function calcAxisScreen(){
 const r=calcResult;
 return '<div class="teach-card" id="axis-calculator"><h3>Calculadora educativa del eje</h3>'+
 '<p>Introduce el <strong>QRS neto</strong> medido en milímetros: amplitud positiva de R menos la profundidad de Q y S. El modelo utiliza I y aVF para estimar el ángulo; no sustituye una lectura multiparamétrica.</p>'+
 '<div class="teach-form"><label>QRS neto en I (mm)<input id="axisI" inputmode="decimal" type="text" value="6" autocomplete="off" aria-label="Amplitud neta de derivación I"/></label>'+
 '<label>QRS neto en aVF (mm)<input id="axisAVF" inputmode="decimal" type="text" value="4" autocomplete="off" aria-label="Amplitud neta de derivación aVF"/></label>'+
 '<button type="button" class="btn primary" data-teach-calc="axis">Calcular y explicar</button></div>'+
 (r?r.error?'<p class="teach-feedback incorrect" role="alert">'+esc(r.error)+'</p>':r.indeterminate?'<p class="teach-feedback incorrect">'+esc(r.message)+'</p>':
 '<div class="teach-results">'+vectorPicture(r.angle)+'<div><h3>'+Math.round(r.angle)+'° · '+E.nameAxis(r.group)+'</h3>'+
 '<p><strong>Primer paso:</strong> I '+sign(r.i)+' y aVF '+sign(r.avf)+'.</p>'+
 '<p><strong>Segundo paso:</strong> II calculada ≈ '+r.ii.toFixed(1)+' mm ('+sign(r.ii)+').'+(r.i>0&&r.avf<0?' Esto permite separar −30° a 0° del eje izquierdo.':'')+'</p>'+
 '<p><strong>Estimación angular:</strong> atan2(aVF, I) = '+Math.round(r.angle)+'°.</p>'+
 '<p class="subtle">La precisión disminuye con voltajes bajos, complejos multifásicos o derivaciones mal colocadas. Este cálculo aproxima un vector frontal único.</p></div></div>':"")+'</div>';
}
function axis(){
 return '<section id="axis-masterclass" class="surface teach-module">'+
 '<div class="teach-head"><div><p class="eyebrow">INTERPRETACIÓN SISTEMÁTICA · CAPÍTULO 7</p><h2>Eje eléctrico: del concepto al ECG</h2></div><span class="pill neutral">Lección ampliada</span></div>'+
 '<p class="teach-lead">El eje medio del QRS indica hacia dónde apunta la <strong>resultante de la despolarización ventricular en el plano frontal</strong>. No es la dirección de la contracción mecánica ni identifica por sí solo una enfermedad.</p>'+
 '<div class="teach-steps"><div><strong>1. Comprende el signo</strong><p>Una derivación mira el vector desde su polo positivo. Si el vector se dirige hacia ese polo, el QRS tiende a ser positivo; si se aleja, negativo; si es perpendicular, puede ser equipásico.</p></div>'+
 '<div><strong>2. Lee I y aVF</strong><p>I positivo y aVF positivo: cuadrante entre 0° y 90°. I negativo y aVF positivo: desviación derecha. Ambos negativos: eje extremo. I positivo y aVF negativo exige el tercer paso.</p></div>'+
 '<div><strong>3. Consulta II cuando haga falta</strong><p>Con I positiva y aVF negativa, II positiva indica eje entre aproximadamente −30° y 0° (normal en adultos). Si II es negativa, orienta a desviación izquierda por debajo de −30°.</p></div>'+
 '<div><strong>4. Interpreta en contexto</strong><p>Rango habitual adulto: de −30° a +90°. Variantes, hemibloqueos, crecimiento ventricular y ritmos ventriculares pueden modificarlo. La desviación sola no establece la causa.</p></div></div>'+
 '<details class="teach-why"><summary>¿Por qué no basta decir «I positiva / aVF negativa = eje izquierdo»?</summary><p>Porque el cuadrante superior izquierdo abarca de −90° a 0°. Los valores entre −30° y 0° aún se consideran normales en adultos. El signo de II orienta sobre el límite de −30°.</p></details>'+
 '<div id="axis-practice-host">'+caseScreen()+'</div>'+
 '<div id="axis-calc-host">'+calcAxisScreen()+'</div>'+
 '<p class="teach-footnote">Referencias de orientación: My EKG (apartados de lectura sistemática y eje) y recomendaciones AHA/ACCF/HRS de interpretación ECG. Texto, figuras y ejercicios desarrollados específicamente para esta aplicación.</p>'+
 '</section>';
}
function calculators(){
 return '<section class="surface teach-module">'+
 '<p class="eyebrow">HERRAMIENTAS FORMATIVAS</p><h1>Calcula, interpreta y comprueba</h1>'+
 '<p>Estas calculadoras muestran las operaciones y sus límites. Son ejercicios educativos; no interpretan registros clínicos ni aportan decisiones terapéuticas automatizadas.</p>'+
 '<div class="teach-tool-grid"><div class="teach-card"><h2>Frecuencia cardíaca</h2><p>En un ritmo regular, cuenta los milímetros entre dos R consecutivas. A 25 mm/s, cada mm equivale a 0,04 s; con 20 mm, RR es 0,8 s y FC 75 lpm.</p>'+
 '<div class="teach-form"><label>Distancia RR (mm)<input id="teachRR" inputmode="decimal" type="text" value="20"/></label><label>Velocidad del papel<select id="teachSpeed"><option value="25">25 mm/s</option><option value="50">50 mm/s</option></select></label><button class="btn primary" data-teach-calc="rate">Calcular frecuencia</button></div>'+
 '<div id="teachRateResult" role="status">'+(frequencyResult?frequencyResult.error?'<p class="teach-feedback incorrect">'+esc(frequencyResult.error)+'</p>':'<div class="teach-feedback correct"><strong>'+frequencyResult.hr.toFixed(1)+' lpm</strong><p>RR = '+frequencyResult.rr.toFixed(3)+' s; FC = 60/RR. Método válido para ritmo suficientemente regular.</p></div>':'')+'</div></div>'+
 '<div class="teach-card"><h2>QT corregido (QTc)</h2><p>El QT depende de la frecuencia. Compara dos correcciones habituales: Bazett (QT/√RR) y Fridericia (QT/∛RR). Las diferencias se acentúan en frecuencias extremas.</p>'+
 '<div class="teach-form"><label>QT medido (ms)<input id="teachQT" inputmode="decimal" type="text" value="400"/></label><label>Frecuencia (lpm)<input id="teachHR" inputmode="decimal" type="text" value="75"/></label><button class="btn primary" data-teach-calc="qtc">Calcular QTc</button></div>'+
 '<div id="teachQTResult" role="status">'+(qtcResult?qtcResult.error?'<p class="teach-feedback incorrect">'+esc(qtcResult.error)+'</p>':'<div class="teach-feedback correct"><strong>Bazett: '+Math.round(qtcResult.bazett)+' ms · Fridericia: '+Math.round(qtcResult.fridericia)+' ms</strong><p>RR = '+qtcResult.rr.toFixed(3)+' s. No diagnosticar un síndrome de QT largo solo a partir de la calculadora: comprobar fin de T, derivación, fármacos, electrolitos y clínica.</p></div>':'')+'</div></div></div>'+
 '<div class="action-row"><button type="button" class="btn secondary" data-teach-go-axis="true">Aprender y calcular el eje →</button></div>'+
 '<p class="teach-footnote">Diseño didáctico original tomando como referencia las categorías de calculadoras de My EKG; fórmulas estándar y límites explicitados. No copiar interfaces ajenas.</p></section>';
}
function readField(id){const x=document.getElementById(id);if(!x)throw Error("Falta el campo "+id);return num(x.value)}
document.body.addEventListener("click",event=>{
 const t=event.target.closest("[data-teach-axis-answer],[data-teach-axis-next],[data-teach-calc],[data-teach-go-axis]");
 if(!t)return;
 if(t.dataset.teachAxisAnswer){
  if(choice!==null)return;
  choice=t.dataset.teachAxisAnswer;
  if(choice===E.classifyAxis(E.CASES[challengeIndex].angle))completed.add(E.CASES[challengeIndex].id);
  const el=document.getElementById("axis-practice-host");if(el)el.innerHTML=caseScreen();
  return;
 }
 if(t.hasAttribute("data-teach-axis-next")){
  challengeIndex=(challengeIndex+1)%E.CASES.length;choice=null;
  const el=document.getElementById("axis-practice-host");if(el)el.innerHTML=caseScreen();
  return;
 }
 if(t.hasAttribute("data-teach-calc")){
  const type=t.dataset.teachCalc;
  if(type==="axis"){
   try{calcResult=E.vectorFromIAVF(readField("axisI"),readField("axisAVF"))}
   catch(err){calcResult={error:err.message}}
   // Preserve input values on re-render.
   const values=[document.getElementById("axisI")?.value,document.getElementById("axisAVF")?.value];
   const el=document.getElementById("axis-calc-host");if(el){el.innerHTML=calcAxisScreen();el.querySelector("#axisI").value=values[0];el.querySelector("#axisAVF").value=values[1]}
  }
  if(type==="rate"){
   try{const mm=readField("teachRR"),speed=readField("teachSpeed");frequencyResult={hr:E.heartRateFromSquares(mm,speed),rr:mm/speed}}
   catch(err){frequencyResult={error:err.message}}
   const out=document.getElementById("teachRateResult");if(out)out.innerHTML=frequencyResult.error?'<p class="teach-feedback incorrect">'+esc(frequencyResult.error)+'</p>':'<div class="teach-feedback correct"><strong>'+frequencyResult.hr.toFixed(1)+' lpm</strong><p>RR = '+frequencyResult.rr.toFixed(3)+' s; FC = 60/RR.</p></div>';
  }
  if(type==="qtc"){
   try{qtcResult=E.qtc(readField("teachQT"),readField("teachHR"))}
   catch(err){qtcResult={error:err.message}}
   const out=document.getElementById("teachQTResult");if(out)out.innerHTML=qtcResult.error?'<p class="teach-feedback incorrect">'+esc(qtcResult.error)+'</p>':'<div class="teach-feedback correct"><strong>Bazett '+Math.round(qtcResult.bazett)+' ms · Fridericia '+Math.round(qtcResult.fridericia)+' ms</strong><p>RR = '+qtcResult.rr.toFixed(3)+' s. Comprobar medición y contexto clínico antes de interpretar.</p></div>';
  }
 }
});
root.ECGTeachingTools={axis,calculators,getProgress:()=>({correct:completed.size,total:E.CASES.length})};
})(typeof window==="undefined"?globalThis:window);