/* Monitor ECG docente (motor de señal por tiempo absoluto, escala configurable).
 * Cada onda mantiene duración en segundos independientemente de la frecuencia.
 * MORFOLOGÍAS ESQUEMÁTICAS: no validadas como registros clínicos.
 */
(function(){
"use strict";
const canvas=document.getElementById("ecgCanvas"),ctx=canvas.getContext("2d");
const select=document.getElementById("rhythmSelect"),label=document.getElementById("currentRhythmLabel");
const info=document.getElementById("infoText"),leadBadge=document.getElementById("leadBadge");
const presets=window.RHYTHMS||{},state={key:"sinus",phase:12,lastTime:0,paused:false,speed:1,strip:null,seed:101,labels:true};
const engine=window.ECGEngine;
const range=(v,min,max)=>Math.max(min,Math.min(max,v));
if(!engine)throw Error("ECGEngine 2.0 is required");
function signal(t){return engine.sample(state.strip,t);}
function ecgMetrics(){
 const s=state.strip;if(!s)return;
 const info=engine.intervals(s,10),v=presets[state.key];
 const mask=Boolean(monitorQuizState.current);
 const metrics=document.getElementById("monitorMetrics");
 if(!metrics)return;
 const value=(a,kind)=>a.length?Math.round(a[0]*1000)+" ms":"—";
 metrics.innerHTML=mask?"<span>Observa FC y regularidad</span><span>Busca ondas P</span><span>Mide QRS y RR</span>":
  '<span>FC nominal: '+(v.hr||0)+' lpm</span><span>PR: '+value(info.conductions,"PR")+'</span>'+
  '<span>QRS: '+value(info.qrs,"QRS")+'</span><span>QT: '+value(info.qt,"QT")+'</span>';
}
const monitorQuizState={solved:new Set(),current:null,choices:[]};
function startMonitorChallenge(){
 const candidates=["sinus","sinusBrady","sinusTach","af","flutter","svt","wenckebach","mobitz2","completeBlock","rbbb","lbbb","wpw","vt","pvcs","hypoK","hyperK"];
 const available=candidates.filter(key=>presets[key]);
 const pool=available.filter(key=>!monitorQuizState.solved.has(key));
 const key=(pool.length?pool:available)[Math.floor(Math.random()*(pool.length?pool.length:available.length))];
 if(!key)return;
 setRhythm(key);
 monitorQuizState.current=key;
 const distractors=available.filter(x=>x!==key).sort(()=>Math.random()-.5).slice(0,3);
 monitorQuizState.choices=[key,...distractors].sort(()=>Math.random()-.5);
 select.disabled=true;select.style.visibility="hidden";ecgMetrics();
 label.textContent="¿Qué ritmo estás observando?";
 info.innerHTML="<p>Observa frecuencia, regularidad, morfología QRS y ondas auriculares antes de responder. El patrón es un esquema docente simplificado.</p>";
 const panel=document.getElementById("monitorChallengePanel");
 panel.hidden=false;
 panel.innerHTML='<p class="eyebrow">RETO DE IDENTIFICACIÓN · ECG ESQUEMÁTICO</p><p>Elige el diagnóstico que mejor corresponde al trazado.</p><div class="challenge-answers">'+monitorQuizState.choices.map(x=>'<button type="button" data-monitor-answer="'+x+'">'+presets[x].label+'</button>').join("")+'</div><p class="subtle">'+monitorQuizState.solved.size+' patrones diferentes identificados correctamente en esta sesión.</p>';
}
function answerMonitorChallenge(chosen){
 const right=monitorQuizState.current;
 if(!right)return;
 const ok=chosen===right;
 if(ok)monitorQuizState.solved.add(right);
 const r=presets[right];
 const panel=document.getElementById("monitorChallengePanel");
 panel.innerHTML='<p class="'+(ok?"correct-answer":"wrong-answer")+'">'+(ok?"Identificación correcta.":"No es el patrón seleccionado.")+'</p><p><strong>Diagnóstico docente: '+r.label+'</strong></p><p>'+r.description.intro+'</p><p>'+monitorQuizState.solved.size+' patrones distintos identificados correctamente.</p><button type="button" class="btn primary" id="monitorAnother">Otro trazado →</button>';
 if(ok&&monitorQuizState.solved.size>=5&&window.ECG_markPractice)window.ECG_markPractice(8);
 if(ok&&monitorQuizState.solved.size>=7&&window.ECG_markPractice)window.ECG_markPractice(9);
 select.disabled=false;select.style.visibility="";
 info.innerHTML="<h2>"+r.label+"</h2><p>"+r.description.intro+"</p><ul>"+(r.description.bullets||[]).map(x=>"<li>"+x+"</li>").join("")+"</ul>";
 monitorQuizState.current=null;ecgMetrics();
 document.getElementById("monitorAnother")?.addEventListener("click",startMonitorChallenge);
}

const toolbar=document.createElement("div");toolbar.className="monitor-tools";
toolbar.innerHTML='<button type="button" id="monitorPlay">Pausar</button>'+
 '<button type="button" id="monitorRestart">Reiniciar trazo</button>'+
 '<label for="monitorSpeed">Velocidad <strong id="monitorSpeedLabel">1×</strong></label>'+
 '<input type="range" id="monitorSpeed" min=".5" max="2" step=".5" value="1" aria-label="Velocidad de animación"/>'+
 '<button type="button" id="monitorAnnotations" aria-pressed="true">Ocultar anotaciones</button>';
document.querySelector(".monitor-chooser")?.after(toolbar);
const metrics=document.createElement("div");metrics.className="ecg-live-metrics";metrics.id="monitorMetrics";
document.querySelector(".monitor-device")?.after(metrics);
document.getElementById("monitorAnnotations").addEventListener("click",e=>{
 state.labels=!state.labels;e.target.textContent=state.labels?"Ocultar anotaciones":"Mostrar anotaciones";
 e.target.setAttribute("aria-pressed",String(state.labels));
});

const challengeTrigger=document.createElement("button");
challengeTrigger.type="button";challengeTrigger.textContent="Identificar un ritmo";
challengeTrigger.addEventListener("click",startMonitorChallenge);
toolbar.append(challengeTrigger);
const monitorChallengePanel=document.createElement("div");
monitorChallengePanel.id="monitorChallengePanel";monitorChallengePanel.className="monitor-challenge";monitorChallengePanel.hidden=true;
toolbar.after(monitorChallengePanel);
monitorChallengePanel.addEventListener("click",event=>{
 const btn=event.target.closest("[data-monitor-answer]");
 if(btn)answerMonitorChallenge(btn.dataset.monitorAnswer);
});

document.getElementById("monitorPlay")?.addEventListener("click",e=>{state.paused=!state.paused;e.target.textContent=state.paused?"Reproducir":"Pausar"});
document.getElementById("monitorRestart")?.addEventListener("click",()=>{setRhythm(state.key);});
document.getElementById("monitorSpeed")?.addEventListener("input",e=>{state.speed=Number(e.target.value);document.getElementById("monitorSpeedLabel").textContent=state.speed+"×"});
const order=Object.keys(presets);order.forEach(key=>{const el=document.createElement("option");el.value=key;el.textContent=presets[key].label;select.appendChild(el)});
function setRhythm(key){
 if(!presets[key])return;
 const r=presets[key];state.key=key;state.phase=12;state.seed+=1;state.strip=engine.generate(r,{key,seed:state.seed,duration:900});select.value=key;
 label.textContent=r.label;leadBadge.textContent=r.lead||"II";
 const bullets=(r.description?.bullets||[]).map(t=>"<li>"+t.replace(/&/g,"&amp;").replace(/</g,"&lt;")+"</li>").join("");
 info.innerHTML="<h2>"+r.label+"</h2><p>"+(r.description?.intro||"Simulación docente.")+"</p><ul>"+bullets+"</ul>";
 ecgMetrics();
}
select.addEventListener("change",e=>setRhythm(e.target.value));
setRhythm("sinus");
function draw(now){
 const size=canvas.getBoundingClientRect();
 const w=Math.max(1,size.width),h=Math.max(1,size.height),dpr=Math.min(2,window.devicePixelRatio||1);
 if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr)}
 ctx.setTransform(dpr,0,0,dpr,0,0);
 const dt=state.lastTime?Math.min(.05,(now-state.lastTime)/1000):0;
 state.lastTime=now;
 if(!state.paused&&!document.hidden)state.phase+=dt*state.speed;
 ctx.fillStyle="#09232e";ctx.fillRect(0,0,w,h);
 const pxPerSecond=25*8,pxPerMv=10*8,baseline=h*.55,small=8;
 ctx.lineWidth=.55;ctx.strokeStyle="#214a50";
 for(let x=0;x<w;x+=small){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke()}
 for(let y=0;y<h;y+=small){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke()}
 ctx.strokeStyle="#326069";ctx.lineWidth=1;
 for(let x=0;x<w;x+=small*5){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke()}
 for(let y=0;y<h;y+=small*5){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke()}
 ctx.save();ctx.beginPath();ctx.strokeStyle="#64f3bd";ctx.lineWidth=2;
 ctx.shadowColor="#20e7a5";ctx.shadowBlur=5;
 for(let x=0;x<w;x+=1.5){
   const time=state.phase-(w-x)/pxPerSecond,v=signal(time),y=range(baseline-v*pxPerMv,7,h-7);
   if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
 }ctx.stroke();ctx.restore();
 ctx.fillStyle="#96c9cb";ctx.font="12px system-ui";ctx.fillText("25 mm/s · 10 mm/mV · SEÑAL DOCENTE",13,h-14);
 // Dibujar pulso de calibración vertical de 1 mV (10 mm) y 200 ms horizontal (5 mm).
 ctx.save();ctx.strokeStyle="#a4cfd1";ctx.lineWidth=1.3;
 const calX=12,calY=h*.87;
 ctx.beginPath();ctx.moveTo(calX,calY);ctx.lineTo(calX+8,calY);ctx.lineTo(calX+8,calY-80);ctx.lineTo(calX+48,calY-80);ctx.lineTo(calX+48,calY);ctx.lineTo(calX+56,calY);ctx.stroke();
 ctx.restore();
 if(state.labels&&!monitorQuizState.current&&state.strip){
  const target=state.strip.beats.find(b=>b.qrsOnset>state.phase-(w/pxPerSecond)+.60&&b.qrsOnset<state.phase-.60);
  if(target){
   const x=w-(state.phase-target.qrsOnset)*pxPerSecond;
   const qx=x+target.morph.qrsWidth*pxPerSecond;
   ctx.strokeStyle="#f4d39d";ctx.lineWidth=1;ctx.setLineDash([4,4]);
   ctx.beginPath();ctx.moveTo(x,12);ctx.lineTo(x,h-25);ctx.moveTo(qx,12);ctx.lineTo(qx,h-25);ctx.stroke();ctx.setLineDash([]);
   ctx.fillStyle="#f7dbb0";ctx.font="bold 11px system-ui";
   ctx.fillText("QRS "+Math.round(target.morph.qrsWidth*1000)+" ms",Math.max(8,Math.min(w-88,x-25)),14);
  }
 }
 if(state.phase>=870)state.phase=12;
window.requestAnimationFrame(draw);
}
function resizeCanvas(){const r=canvas.getBoundingClientRect();if(r.width>0&&r.height>0){canvas.width=Math.round(r.width*(devicePixelRatio||1));canvas.height=Math.round(r.height*(devicePixelRatio||1))}}
window.resizeCanvas=resizeCanvas;
window.requestAnimationFrame(draw);
})();