/* Monitor ECG docente (motor de señal por tiempo absoluto, escala configurable).
 * Cada onda mantiene duración en segundos independientemente de la frecuencia.
 * MORFOLOGÍAS ESQUEMÁTICAS: no validadas como registros clínicos.
 */
(function(){
"use strict";
const canvas=document.getElementById("ecgCanvas"),ctx=canvas.getContext("2d");
const select=document.getElementById("rhythmSelect"),label=document.getElementById("currentRhythmLabel");
const info=document.getElementById("infoText"),leadBadge=document.getElementById("leadBadge");
const presets=window.RHYTHMS||{},state={key:"sinus",phase:0,lastTime:0,paused:false,speed:1};
const range=(v,a,b)=>Math.min(b,Math.max(a,v));
const gauss=(t,c,s,a)=>a*Math.exp(-.5*((t-c)/s)**2);
const timeMod=(t,r)=>((t%r)+r)%r;
function wave(t,t0,b,onlyP=false,hideP=false){
 if(!b)return 0;
 const qrsDur=b.qrsWidth||.09,pDur=b.pWidth||.08,pr=b.pr??.16;
 const pStart=t0+.014, qStart=pStart+pr, qEnd=qStart+qrsDur;
 let v=0;
 if(!hideP&&b.pAmp)v+=gauss(t,pStart+pDur*.48,pDur/3,b.pAmp);
 if(onlyP)return v;
 if(b.spikeAmp)v+=gauss(t,qStart-.027,.003,b.spikeAmp);
 if(b.deltaAmp)v+=gauss(t,qStart+.023,.024,b.deltaAmp);
 if(b.qAmp)v+=gauss(t,qStart+qrsDur*.14,(b.qWidth||.013),b.qAmp);
 if(b.rAmp)v+=gauss(t,qStart+qrsDur*.43,(b.rWidth||Math.max(.008,qrsDur*.105)),b.rAmp);
 if(b.rPrimeAmp)v+=gauss(t,qStart+qrsDur*.80,(b.rPrimeWidth||.012),b.rPrimeAmp);
 if(b.sAmp)v+=gauss(t,qStart+qrsDur*.70,(b.sWidth||.012),b.sAmp);
 if(b.stShift){
  const a=qEnd,bp=qEnd+.16,k=range(Math.min((t-a)/.025,(bp-t)/.035),0,1);
  v+=b.stShift*k;
 }
 if(b.tAmp)v+=gauss(t,qEnd+.19,Math.max(.048,(b.tWidth||.16)/2.355),b.tAmp);
 if(b.uAmp)v+=gauss(t,qEnd+.36,.035,b.uAmp);
 return v;
}
const BASE={pAmp:.12,pWidth:.08,pr:.16,qAmp:-.08,rAmp:1,sAmp:-.22,qrsWidth:.09,tAmp:.28,tWidth:.17};
function signal(t){
 const r=presets[state.key];if(!r)return 0;
 if(r.eventMode==="flat")return .002*Math.sin(2*Math.PI*t*2);
 if(r.eventMode==="vf"){
  return (.36*Math.sin(2*Math.PI*6.3*t+.5*Math.sin(t*5.6))+
   .27*Math.sin(2*Math.PI*8.4*t+1.8)+.18*Math.sin(2*Math.PI*3.1*t))* (1+.30*Math.sin(t*2.1));
 }
 if(r.eventMode==="torsades"){
  const rr=60/(r.hr||190);
  const k=Math.floor(t/rr),phase=timeMod(t,rr)/rr;
  const envelope=Math.sin(k*.41);
  return (gauss(phase,.42,.14,1.1*envelope)+gauss(phase,.72,.12,-.7*envelope))*(.75+.35*Math.cos(k*.3));
 }
 let val=0;
 if(r.eventMode==="completeBlock"){
  const ar=60/r.atrialRate,vr=60/r.ventricularRate;
  const ai=Math.floor(t/ar),vi=Math.floor(t/vr);
  for(let k=ai-1;k<=ai+1;k++)val+=gauss(t,k*ar+.15,.026,r.atrialBeat?.pAmp||.11);
  for(let k=vi-1;k<=vi+1;k++)val+=wave(t,k*vr,{...r.ventricularBeat,pAmp:0,pr:0},false,true);
 }else{
  let rr=60/Math.max(1,r.hr),beatTimeIndex;
  if(r.eventMode==="irregular"){
   // Fixed cyclic RR distribution: keeps R positions stable over time.
   const rrSeq=[.77,1.18,.66,1.05,.72,1.25,.82,.69,1.13,.88,.62,1.16].map(x=>x*rr);
   const cycle=rrSeq.reduce((a,b)=>a+b,0),mod=timeMod(t,cycle);
   let onset=0;
   const times=[-rrSeq.at(-1),0];
   for(const interval of rrSeq){onset+=interval;times.push(onset)}
   times.push(cycle+rrSeq[0]);
   let position=t-mod;
   for(let m=-1;m<=1;m++)for(const tick of times)val+=wave(t,position+m*cycle+tick,r.beat,false,true);
   val+=(Math.sin(2*Math.PI*7.4*t)+.55*Math.sin(2*Math.PI*10.8*t))*.025;
  }else{
   beatTimeIndex=Math.floor(t/rr);
   for(let k=beatTimeIndex-2;k<=beatTimeIndex+2;k++){
    const t0=k*rr;let b=r.beat||BASE,onlyP=false;
    if(r.eventMode==="sequence"){
     const sequence=r.sequence||["normal"];
     const type=sequence[((k%sequence.length)+sequence.length)%sequence.length];
     if(type==="pause")continue;
     if(type==="pvc"){b=r.pvcBeat||BASE;val+=wave(t,t0-rr*(1-(r.pvcOffset||.6)),b,false,true);continue}
     if(type==="pac"){b=r.pacBeat||BASE;val+=wave(t,t0-rr*(1-(r.pacOffset||.6)),b);continue}
     b=r.normalBeat||BASE;
    }
    if(r.eventMode==="wenckebach"){
     const cycle=r.cycle||[.16,.22,.28,null],index=((k%cycle.length)+cycle.length)%cycle.length;
     if(cycle[index]===null){val+=wave(t,t0,{...b,pr:.16},true);continue}
     b={...b,pr:cycle[index]};
    }
    if(r.eventMode==="mobitz2"){
     const cycle=r.cycle||[true,true,false,true],index=((k%cycle.length)+cycle.length)%cycle.length;
     if(!cycle[index]){val+=wave(t,t0,b,true);continue}
    }
    val+=wave(t,t0,b,false,Boolean(r.base?.flutter));
   }
   if(r.base?.flutter){
    const hz=(r.base.flutterRate||300)/60,part=timeMod(t*hz,1);
    val+=(part<.26?part/.26:1-(part-.26)/.74)*.16-.08;
   }
  }
 }
 return val+.005*Math.sin(2*Math.PI*t*.32)+.002*Math.sin(2*Math.PI*t*43);
}
const toolbar=document.createElement("div");toolbar.className="monitor-tools";
toolbar.innerHTML='<button type="button" id="monitorPlay">Pausar</button><label for="monitorSpeed">Velocidad <strong id="monitorSpeedLabel">1×</strong></label><input type="range" id="monitorSpeed" min=".5" max="2" step=".5" value="1" aria-label="Velocidad de reproducción"/><button type="button" id="monitorRestart">Reiniciar trazo</button>';
document.querySelector(".monitor-chooser")?.after(toolbar);
document.getElementById("monitorPlay")?.addEventListener("click",e=>{state.paused=!state.paused;e.target.textContent=state.paused?"Reproducir":"Pausar"});
document.getElementById("monitorRestart")?.addEventListener("click",()=>state.phase=0);
document.getElementById("monitorSpeed")?.addEventListener("input",e=>{state.speed=Number(e.target.value);document.getElementById("monitorSpeedLabel").textContent=state.speed+"×"});
const order=Object.keys(presets);order.forEach(key=>{const el=document.createElement("option");el.value=key;el.textContent=presets[key].label;select.appendChild(el)});
function setRhythm(key){
 if(!presets[key])return;
 const r=presets[key];state.key=key;state.phase=0;select.value=key;
 label.textContent=r.label;leadBadge.textContent=r.lead||"II";
 const bullets=(r.description?.bullets||[]).map(t=>"<li>"+t.replace(/&/g,"&amp;").replace(/</g,"&lt;")+"</li>").join("");
 info.innerHTML="<h2>"+r.label+"</h2><p>"+(r.description?.intro||"Simulación docente.")+"</p><ul>"+bullets+"</ul>";
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
 const pxPerS=250,pxPerMv=100,baseline=h*.55,small=10;
 ctx.lineWidth=.55;ctx.strokeStyle="#214a50";
 for(let x=0;x<w;x+=small){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke()}
 for(let y=0;y<h;y+=small){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke()}
 ctx.strokeStyle="#326069";ctx.lineWidth=1;
 for(let x=0;x<w;x+=small*5){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke()}
 for(let y=0;y<h;y+=small*5){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke()}
 ctx.save();ctx.beginPath();ctx.strokeStyle="#64f3bd";ctx.lineWidth=2;
 ctx.shadowColor="#20e7a5";ctx.shadowBlur=5;
 for(let x=0;x<w;x+=1.5){
   const time=state.phase-(w-x)/pxPerS,v=signal(time),y=range(baseline-v*pxPerMv,7,h-7);
   if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
 }ctx.stroke();ctx.restore();
 ctx.fillStyle="#96c9cb";ctx.font="12px system-ui";ctx.fillText("25 mm/s  ·  10 mm/mV  ·  SIMULACIÓN",13,h-14);
 requestAnimationFrame(draw);
}
function resizeCanvas(){const r=canvas.getBoundingClientRect();if(r.width>0&&r.height>0){canvas.width=Math.round(r.width*(devicePixelRatio||1));canvas.height=Math.round(r.height*(devicePixelRatio||1))}}
window.resizeCanvas=resizeCanvas;
requestAnimationFrame(draw);
})();