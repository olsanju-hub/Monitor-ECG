/* ECG Teaching Math v1 — original, standalone educational calculations.
 * Signed QRS amplitudes in mm; wave measurements in ms/seconds.
 * A single net-vector model is an approximation, not an ECG interpretation device.
 */
(function(root){
"use strict";
const RAD=Math.PI/180;
const LEADS={I:0,II:60,III:120,aVR:-150,aVL:-30,aVF:90};
function valid(value,name){if(!Number.isFinite(value))throw Error(name+" debe ser un número válido");return value;}
function normalized(angle){return ((angle+180)%360+360)%360-180}
function classifyAxis(angle){
 const a=normalized(valid(angle,"Eje"));
 if(a>=-30&&a<=90)return "normal";
 if(a< -30&&a>=-90)return "left";
 if(a>90&&a<=180)return "right";
 return "extreme";
}
function nameAxis(group){return ({normal:"Eje normal (adulto)",left:"Desviación izquierda",right:"Desviación derecha",extreme:"Eje extremo"})[group]}
function vectorFromIAVF(i,avf){
 valid(i,"Derivación I");valid(avf,"Derivación aVF");
 if(Math.hypot(i,avf)<.2)return {indeterminate:true,message:"Voltajes netos muy pequeños: el eje no es fiable con estos datos. Revisa calibración y otras derivaciones."};
 const angle=normalized(Math.atan2(avf,i)/RAD);
 const ii=.5*i+Math.cos(30*RAD)*avf;
 return {angle,group:classifyAxis(angle),i,avf,ii,indeterminate:false,netMm:Math.hypot(i,avf)};
}
function vectorFromIAndIII(i,iii){
 valid(i,"Derivación I");valid(iii,"Derivación III");
 const avf=(iii+.5*i)/(Math.sqrt(3)/2);
 return {...vectorFromIAVF(i,avf),iii};
}
function leadAmplitudes(angle,net=8){
 valid(angle,"Eje");valid(net,"Voltaje");
 return Object.fromEntries(Object.entries(LEADS).map(([key,deg])=>[key,net*Math.cos((angle-deg)*RAD)]));
}
function interpretQuadrant(i,avf,ii){
 valid(i,"Derivación I");valid(avf,"Derivación aVF");
 if(Math.abs(i)<.15||Math.abs(avf)<.15)return "limite";
 if(i>0&&avf>0)return "normal_cuadrante";
 if(i<0&&avf>0)return "derecha";
 if(i<0&&avf<0)return "extremo";
 if(ii===undefined||!Number.isFinite(ii))return "revisar_II";
 return ii>=0?"normal_izquierdo":"izquierda";
}
function heartRateFromRR(rrSeconds){
 valid(rrSeconds,"Intervalo RR");if(rrSeconds<=0||rrSeconds>10)throw Error("RR debe estar entre 0 y 10 s");
 return 60/rrSeconds;
}
function heartRateFromSquares(squares,speed=25){
 valid(squares,"Número de cuadritos");valid(speed,"Velocidad");
 if(squares<=0||squares>250||![25,50].includes(speed))throw Error("Cuadritos > 0 y velocidad 25 o 50 mm/s");
 return speed*60/squares;
}
function qtc(qtMs,hr){
 valid(qtMs,"QT");valid(hr,"Frecuencia");
 if(qtMs<=0||qtMs>1000||hr<=0||hr>300)throw Error("QT o frecuencia fuera del rango didáctico");
 const rr=60/hr,qt=qtMs/1000;
 return {rr,qtMs,bazett:1000*qt/Math.sqrt(rr),fridericia:1000*qt/Math.cbrt(rr)};
}
const CASES=[
 {name:"Eje normal",angle:60,why:"I y aVF positivos. El vector resultante se dirige hacia abajo y a la izquierda. II suele ser positivo."},
 {name:"Normal próximo al límite izquierdo",angle:-15,why:"I positivo y aVF negativo, pero II sigue positivo: eje entre −30° y 0°, considerado normal."},
 {name:"Desviación izquierda",angle:-55,why:"I positivo, aVF negativo y II negativo. Considera bloqueos fasciculares, variantes y cardiopatía, no un diagnóstico automático."},
 {name:"Desviación derecha",angle:120,why:"I negativo y aVF positivo. Relaciona con edad, sobrecarga derecha, enfermedad pulmonar, técnica y contexto."},
 {name:"Eje extremo",angle:-130,why:"I y aVF negativos. Verifica cables, marcapasos, arritmias ventriculares y enfermedad, según la clínica."},
 {name:"Eje vertical aún normal",angle:85,why:"I débilmente positivo y aVF positivo: eje normal próximo al límite derecho."}
].map((c,i)=>({...c,id:"axis-"+i,voltages:leadAmplitudes(c.angle)}));
root.ECGTeachingMath=Object.freeze({LEADS,CASES,normalized,classifyAxis,nameAxis,vectorFromIAVF,vectorFromIAndIII,leadAmplitudes,interpretQuadrant,heartRateFromRR,heartRateFromSquares,qtc});
})(typeof window==="undefined"?globalThis:window);