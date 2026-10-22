/* ECG Signal Engine v2 — modelos temporales deterministas para docencia.
 * NO es un generador validado de electrocardiogramas clínicos.
 * Una onda tiene duración en segundos, amplitud en mV y secuencia eléctrica definida.
 * Para cada ritmo se generan eventos de activación auricular y ventricular coherentes.
 */
(function(global) {
"use strict";
const DEFAULT={pAmp:.12,pWidth:.085,pr:.16,qAmp:-.06,rAmp:1.05,sAmp:-.23,qrsWidth:.09,tAmp:.29,tWidth:.17,stShift:0};
const bound=(x,a,b)=>Math.max(a,Math.min(b,x));
const mod=(a,b)=>((a%b)+b)%b;
const deepMerge=b=>({...DEFAULT,...(b||{})});
const round=(v,d=3)=>Number(v.toFixed(d));
function mulberry32(seed){let s=seed>>>0;return function(){s+=0x6d2b79f5;let t=s;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};}
function normalBump(t,onset,duration,height){
 if(!height||duration<=0||t<onset||t>onset+duration)return 0;
 const u=(t-onset)/duration;
 return height*Math.pow(Math.sin(Math.PI*u),2);
}
function gaussian(t,centre,sigma,height){const z=(t-centre)/sigma;return height*Math.exp(-.5*z*z);}
function linear(pts,x){
 if(x<=pts[0][0]||x>=pts[pts.length-1][0])return 0;
 for(let k=1;k<pts.length;k++){
  const [x2,y2]=pts[k],[x1,y1]=pts[k-1];
  if(x<=x2){const u=bound((x-x1)/(x2-x1),0,1);return y1+(y2-y1)*u;}
 }
 return 0;
}
function qrsAt(t,b){
 const dur=bound(b.qrsWidth||.09,.06,.22),u=t/dur;
 if(u<0||u>1)return b.spikeAmp?gaussian(t,-.016,.0016,b.spikeAmp):0;
 let q=b.qAmp??-.06,r=b.rAmp??1,s=b.sAmp??-.22;
 const hasRp=Boolean(b.rPrimeAmp);
 const pts=hasRp
 ? [[0,0],[.12,q],[.21,0],[.37,r],[.51,-.08],[.74,b.rPrimeAmp],[.85,s],[1,0]]
 : [[0,0],[.12,q],[.23,0],[.47,r],[.63,0],[.80,s],[1,0]];
 let y=linear(pts,u);
 if(b.deltaAmp){const x=bound(u/.36,0,1);y+=b.deltaAmp*Math.sin(Math.PI*x/2)*(u<.36?1:Math.max(0,1-(u-.36)/.12));}
 if(b.spikeAmp)y+=gaussian(t,-.016,.0016,b.spikeAmp);
 return y;
}
function beatAt(t,beat){
 const b=beat.morph,dt=t-beat.qrsOnset,qrs=bound(b.qrsWidth||.09,.06,.22);
 if(dt<-.04||dt>.8)return 0;
 let val=qrsAt(dt,b);
 const qt=beat.qt, tStart=bound(qt-(b.tWidth||.17),qrs+.052,qt-.052);
 const st=b.stShift||0;
 if(st&&dt>=qrs-.015&&dt<tStart){
  val+=st*bound((dt-(qrs-.015))/.03,0,1);
 }
 if(dt>=tStart&&dt<=qt){
  const u=(dt-tStart)/(qt-tStart);
  val+=(b.tAmp||0)*Math.pow(Math.sin(Math.PI*u),2);
  val+=st*Math.pow(Math.cos(Math.PI*u/2),2);
 }
 if(b.uAmp)val+=normalBump(dt,qt+.02,.115,b.uAmp);
 return val*beat.polarity;
}
function pAt(t,p){
 if(t<p.time||t>p.time+p.duration)return 0;
 return normalBump(t,p.time,p.duration,p.amp);
}
function pushBeat(strip,onset,beat,pSetting) {
 const b=deepMerge(beat);
 const dur=bound(b.qrsWidth,.06,.22);
 const rr=strip._lastRR||.8;
 const calculated=bound(.408*Math.sqrt(rr),Math.max(dur+.20,.28),.51);
 const qt=b.qt||((b.tWidth||0)>.22?bound(calculated+.15,.45,.70):calculated);
 strip.beats.push({qrsOnset:onset,morph:b,qt,polarity:1});
 if(pSetting!==false && b.pAmp){
  const pr=typeof pSetting==="number"?pSetting:b.pr;
  strip.pWaves.push({time:onset-pr,duration:bound(b.pWidth||.08,.04,.18),amp:b.pAmp,conducted:true,pr});
 }
}
function pushP(strip,t,b,conducted,pr){
 strip.pWaves.push({time:t,duration:bound(b.pWidth||.08,.04,.18),amp:b.pAmp||.12,conducted,pr:conducted?pr:null});
}
function generate(preset,opts={}){
 const duration=bound(opts.duration??240,12,1800);
 const seed=opts.seed??101;
 const rng=mulberry32(seed);
 const key=opts.key||"sinus";
 const hr=preset.hr||75;
 const rr=hr>0?60/hr:1;
 const strip={key,duration,seed,beats:[],pWaves:[],flutterWaves:[],hr,lead:preset.lead||"II",kind:preset.eventMode||"beat",teaching:true,_lastRR:rr};
 const base=preset.beat||DEFAULT;
 const start=-6,until=duration+4;
 if(strip.kind==="flat"||strip.kind==="vf")return strip;
 if(strip.kind==="torsades"){
  const step=60/Math.max(hr,140);
  for(let k=Math.floor(start/step);k<until/step;k++){
   const onset=k*step+.12;
   const beat={...deepMerge(base),qrsWidth:bound(base.qrsWidth||.18,.13,.22),rAmp:base.rAmp||1,sAmp:base.sAmp||-.8,tAmp:0,qt:.28};
   strip.beats.push({qrsOnset:onset,morph:beat,qt:.28,polarity:Math.cos(k*.37),torsades:true});
  }
  return strip;
 }
 if(strip.kind==="completeBlock"){
  const atrialRR=60/(preset.atrialRate||88);
  const ventRR=60/(preset.ventricularRate||38);
  const ab=deepMerge(preset.atrialBeat);
  const vb=deepMerge(preset.ventricularBeat);
  for(let t=start;t<until;t+=atrialRR)pushP(strip,t+.20,ab,false,null);
  strip._lastRR=ventRR;
  for(let t=start+.39;t<until;t+=ventRR)pushBeat(strip,t,vb,false);
 } else if(strip.kind==="wenckebach"||strip.kind==="mobitz2"){
  const cycle=preset.cycle|| (strip.kind==="wenckebach"?[.16,.22,.28,null]:[true,true,false,true]);
  const atrialRR=rr;
  let k=0;
  for(let t=start;t<until;t+=atrialRR,k++){
   const i=mod(k,cycle.length),val=cycle[i];
   const b=deepMerge(base),pr=strip.kind==="wenckebach"?val:b.pr;
   const conducted=strip.kind==="wenckebach"?val!==null:!!val;
   const pTime=t+.05;
   pushP(strip,pTime,b,conducted,conducted?pr:null);
   if(conducted)pushBeat(strip,pTime+pr,b,false);
  }
 } else if(strip.kind==="irregular"){
  // RR sequences physically irregular: consecutive R peaks computed once,
  // without dependence on pixel sampling positions or frame times.
  let t=start+.6;
  while(t<until){
   const factor=bound(.55+1.00*rng(),.52,1.62);
   const local=rr*factor;
   strip._lastRR=local;
   const b={...deepMerge(base),pAmp:0};
   pushBeat(strip,t,b,false);
   t+=local;
  }
 } else if(preset.base?.flutter){
  const atrialRR=60/(preset.base.flutterRate||300);
  for(let t=start;t<until;t+=atrialRR)strip.flutterWaves.push(t);
  for(let t=start+.27;t<until;t+=rr)pushBeat(strip,t,{...deepMerge(base),pAmp:0},false);
 } else if(key==="sinusPause"){
  const rrs=[rr,rr,rr,1.72*rr,rr,rr,rr,rr];
  let t=start+.22,k=0;
  while(t<until){pushBeat(strip,t,base);t+=rrs[k++%rrs.length]}
 }else if(strip.kind==="sequence"){
  const seq=preset.sequence||["normal"];
  let k=0;
  for(let t=start+.22;t<until;t+=rr,k++){
   const type=seq[mod(k,seq.length)];
   if(type==="pause")continue;
   const prem=type==="pvc"||type==="pac";
   if(prem){
    const x=type==="pvc"?(preset.pvcBeat||base):(preset.pacBeat||base);
    const early=type==="pvc"?(preset.pvcOffset||.62):(preset.pacOffset||.58);
    const ectopicOnset=t-rr*(1-early);
    pushBeat(strip,ectopicOnset,x,type==="pac"?Math.max(.08,x.pr||.12):false);
   }else pushBeat(strip,t,preset.normalBeat||base);
  }
 }else{
  const ignoreP=key==="svt"||key==="vt"||key==="ventEscape"||key==="aivr"||key==="paced";
  const retro=key==="svt";
  for(let t=start+.22;t<until;t+=rr){
   const b={...deepMerge(base),pAmp:ignoreP?0:base.pAmp};
   pushBeat(strip,t,b,!ignoreP);
   if(retro)pushP(strip,t+bound(b.qrsWidth||.08,.06,.22)+.018,{pAmp:-.065,pWidth:.055},false,null);
  }
 }
 strip.beats.sort((a,b)=>a.qrsOnset-b.qrsOnset);
 strip.pWaves.sort((a,b)=>a.time-b.time);
 strip.flutterWaves.sort((a,b)=>a-b);
 return strip;
}
function lowerBound(list,time,field){
 let l=0,r=list.length;while(l<r){const m=(l+r)>>>1;if((field?list[m][field]:list[m])<time)l=m+1;else r=m}return l;
}
function sample(strip,t){
 if(strip.kind==="flat")return .0015*Math.sin(2*Math.PI*2*t);
 if(strip.kind==="vf"){
  const mix=.52*Math.sin(2*Math.PI*(5.4*t+.16*Math.sin(2.5*t)))+
    .22*Math.sin(2*Math.PI*(8.6*t+.2*Math.cos(1.8*t)))+
    .21*Math.sin(2*Math.PI*(3.1*t+.3*Math.sin(2.2*t)));
  return mix*(.85+.25*Math.sin(2*Math.PI*.42*t));
 }
 let value=0;
 let i=lowerBound(strip.beats,t-.8,"qrsOnset");
 while(i<strip.beats.length&&strip.beats[i].qrsOnset<=t+.04){
  value+=beatAt(t,strip.beats[i++]);
 }
 i=lowerBound(strip.pWaves,t-.2,"time");
 while(i<strip.pWaves.length&&strip.pWaves[i].time<=t){
  value+=pAt(t,strip.pWaves[i++]);
 }
 if(strip.flutterWaves.length){
  i=lowerBound(strip.flutterWaves,t-.23);
  while(i<strip.flutterWaves.length&&strip.flutterWaves[i]<=t){
   // Sawtooth-like F waves (in inferior lead II); separate atrial cycle.
   const u=(t-strip.flutterWaves[i++])/.20;
   if(u>=0&&u<=1)value-=.105*(u<.78?(u/.78):Math.max(0,1-(u-.78)/.22));
  }
 }
 if(strip.kind==="irregular"){
  // Low-amplitude deterministic fibrillatory baseline: no distinct P waves.
  value+=.017*Math.sin(2*Math.PI*7.3*t+.65*Math.sin(2*Math.PI*1.8*t))+
          .008*Math.sin(2*Math.PI*10.9*t+.2*Math.cos(2.3*t));
 }
 if(strip.kind==="torsades")value*=1+.24*Math.sin(.9*t);
 value+=.004*Math.sin(2*Math.PI*.29*t);
 return value;
}
function intervals(strip,first=8){
 const beats=strip.beats.filter(b=>b.qrsOnset>=0&&b.qrsOnset<strip.duration).slice(0,first);
 const rrs=beats.slice(1).map((b,i)=>round(b.qrsOnset-beats[i].qrsOnset));
 const conductions=strip.pWaves.filter(p=>p.conducted&&p.pr!==null).slice(0,first).map(p=>round(p.pr));
 return {rrs,conductions,qrs:beats.map(b=>round(b.morph.qrsWidth)),qt:beats.map(b=>round(b.qt)),pwaves:strip.pWaves.length,qrsCount:strip.beats.length};
}
global.ECGEngine={version:"2.0",generate,sample,intervals,mmPerSecond:25,mmPerMv:10};
})(typeof window==="undefined"?globalThis:window);
