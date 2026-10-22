/* ECG measurement strip: bounded waveforms with exact teaching landmarks.
 * 25mm/s, 10mm/mV, 0.8s RR and original SVG. Not a patient ECG.
 * Onsets 340ms(P), 500ms(QRS), 590ms(end QRS), 920ms(end T).
 */
(function(root){
"use strict";
const RR=.8;
const P_ON=.34,QRS_ON=.50,QRS_OFF=.59,T_ON=.735,T_OFF=.92;
const bounds=(x,a,b)=>Math.max(a,Math.min(b,x));
const soft=u=>{const x=bounds(u,0,1);return x*x*(3-2*x)};
function intervalWave(t,a,b,peak){
 if(t<=a||t>=b)return 0;
 const u=(t-a)/(b-a);return peak*Math.sin(Math.PI*u)**2;
}
function qrsAt(dt){
 if(dt<=QRS_ON||dt>=QRS_OFF)return 0;
 const knots=[[QRS_ON,0],[.516,-.085],[.530,0],[.544,1.06],[.554,0],[.566,-.23],[QRS_OFF,0]];
 for(let i=1;i<knots.length;i++){
  const [x2,y2]=knots[i],[x1,y1]=knots[i-1];
  if(dt<=x2){const u=(dt-x1)/(x2-x1);return y1+(y2-y1)*soft(u);}
 }
 return 0;
}
function sample(t){
 // Include adjacent beats so T does not disappear when RR wraps.
 let v=0;
 for(let beat=Math.floor(t/RR)-1;beat<=Math.floor(t/RR)+1;beat++){
  const local=t-beat*RR;
  v+=intervalWave(local,P_ON,.43,.14);
  v+=qrsAt(local);
  v+=intervalWave(local,T_ON,T_OFF,.30);
 }
 return v;
}
function svg({marks=[],explore=false}={}){
 const scale=220,baseline=167,units=88,pts=[];
 for(let x=0;x<=1100;x+=1.25){
  const y=baseline-units*sample(x/scale);
  pts.push((x?"L":"M")+x.toFixed(2)+","+y.toFixed(2));
 }
 const defs='<defs><pattern id="lab-small-grid" width="8.8" height="8.8" patternUnits="userSpaceOnUse"><path d="M8.8 0H0V8.8" stroke="#eed3d8" stroke-width=".65" fill="none"/></pattern>'+
 '<pattern id="lab-big-grid" width="44" height="44" patternUnits="userSpaceOnUse"><rect width="44" height="44" fill="url(#lab-small-grid)"/><path d="M44 0H0V44" fill="none" stroke="#d8a1ab" stroke-width="1.15"/></pattern></defs>';
 const annotations=explore?
 '<g fill="#14556b" font-size="17" font-weight="750">'+
 '<text x="'+(.384*scale)+'" y="116" text-anchor="middle">P</text>'+
 '<text x="'+(.544*scale)+'" y="42" text-anchor="middle">R</text>'+
 '<text x="'+(.83*scale)+'" y="117" text-anchor="middle">T</text>'+
 '<text x="'+(.594*scale)+'" y="225" text-anchor="start">ST</text>'+
 '</g>'+
 '<g stroke="#26829a" stroke-width="1.5" stroke-dasharray="4 5" opacity=".75">'+
 '<path d="M'+(P_ON*scale)+' 114V188M'+(QRS_ON*scale)+' 117V188M'+(QRS_OFF*scale)+' 117V188M'+(T_OFF*scale)+' 115V188"/>'+
 '</g>'+
 '<g fill="#14556b" font-size="13.5" font-weight="650"><text x="'+(P_ON*scale)+'" y="207" text-anchor="middle">P inicio</text><text x="'+(QRS_ON*scale)+'" y="244" text-anchor="middle">QRS inicio</text><text x="'+(T_OFF*scale)+'" y="207" text-anchor="middle">T fin</text></g>'
 :'';
 const overlays=marks.map((t,i)=>'<g class="teach-cursor" pointer-events="none"><path d="M'+(t*scale)+' 24V270" stroke="#087c8d" stroke-width="2.7" stroke-dasharray="6 4"/>'+
 '<circle cx="'+(t*scale)+'" cy="27" r="9.5" fill="#087c8d" stroke="white" stroke-width="2"/>'+
 '<text x="'+(t*scale+14)+'" y="27" fill="#0a5670" font-size="16" font-weight="800">'+(i+1)+'</text></g>').join("");
 return '<svg data-lab-paper="true" class="lab-figure lab-paper atlas-paper" viewBox="0 0 1100 318" role="img" aria-label="ECG sintético para medir intervalos. Cuadrícula calibrada de 25 mm por segundo y 10 mm por milivoltio." style="touch-action:manipulation">'+
 defs+'<rect width="1100" height="318" rx="7" fill="#fffaf9"/><rect width="1100" height="318" fill="url(#lab-big-grid)"/>'+
 '<path d="'+pts.join(" ")+'" stroke="#0a4963" stroke-width="3.2" fill="none" stroke-linejoin="round" stroke-linecap="round"/>'+
 annotations+overlays+
 '<g stroke="#3b6270" stroke-width="2" fill="none"><path d="M1002 273H1016V185H1060V273H1075"/></g>'+
 '<g fill="#4a6572" font-size="17"><text x="16" y="297">DII · 25 mm/s · 10 mm/mV · ESQUEMA DE ENTRENAMIENTO</text><text x="1040" y="308" text-anchor="middle" font-size="12">1 mV / 200 ms</text></g></svg>';
}
root.ECGTeachingTrace=Object.freeze({RR,P_ON,QRS_ON,QRS_OFF,T_ON,T_OFF,sample,svg,version:"1.0"});
})(typeof window==="undefined"?globalThis:window);