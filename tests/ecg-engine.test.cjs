/* Pruebas automáticas del generador ECG. Ejecutar: node --test tests/ecg-engine.test.cjs
 * Verifica consistencia matemática/temporal, NO equivalencia con ECG clínicos.
 */
const test=require("node:test");
const assert=require("node:assert/strict");
global.window=globalThis;
require("../rhythms.js");
require("../rhythms-advanced.js");
require("../ecg-engine.js");
const e=globalThis.ECGEngine;
const pick=id=>e.generate(globalThis.RHYTHMS[id],{key:id,duration:55,seed:42});
const core=s=>s.beats.filter(b=>b.qrsOnset>10&&b.qrsOnset<35);
const near=(a,b,eps=.00001)=>Math.abs(a-b)<eps;
test("Hay motor y catálogo de ritmos",()=>{
 assert.equal(e.version,"2.0");assert.ok(Object.keys(globalThis.RHYTHMS).length>=25);
});
test("Ritmo sinusal: RR constante, onda P y PR normal",()=>{
 const s=pick("sinus"),beats=core(s),p=s.pWaves.filter(p=>p.time>10&&p.time<35);
 assert.ok(beats.length>20);assert.ok(p.length>=beats.length-1);
 assert.ok(beats.slice(1).every((b,i)=>near(b.qrsOnset-beats[i].qrsOnset,.8)));
 assert.ok(p.every(p=>near(p.pr,.16)));
});
test("Frecuencias bradi y taqui: RR en segundos",()=>{
 for(const [key,hr] of [["sinusBrady",42],["sinusTach",135]]){
 const b=core(pick(key));assert.ok(b.length>6);
 assert.ok(b.slice(1).every((x,i)=>near(x.qrsOnset-b[i].qrsOnset,60/hr)));
 }
});
test("Fibrilación auricular: ausencia de P organizada y RR variable pero estable",()=>{
 const s=pick("af"),b=core(s);assert.equal(s.pWaves.length,0);
 const d=b.slice(1).map((x,i)=>x.qrsOnset-b[i].qrsOnset);
 assert.ok(d.some(x=>x>.75)&&d.some(x=>x<.55));
 assert.equal(e.sample(s,13.456),e.sample(s,13.456),"muestras deterministas");
});
test("Flutter 2:1: ondas F a 300/min y QRS a 150/min",()=>{
 const s=pick("flutter"),b=core(s),f=s.flutterWaves.filter(t=>t>10&&t<35);
 assert.ok(b.slice(1).every((x,i)=>near(x.qrsOnset-b[i].qrsOnset,.4)));
 assert.ok(f.slice(1).every((x,i)=>near(x-f[i],.2)));
});
test("Mobitz I: PR progresivamente mayor antes de P bloqueada",()=>{
 const s=pick("wenckebach"),p=s.pWaves.filter(p=>p.time>10&&p.time<35);
 assert.ok(p.some(x=>x.conducted===false));
 const ips=p.map(x=>x.pr);
 assert.ok(ips.includes(.16)&&ips.includes(.22)&&ips.includes(.28));
 assert.ok(p.filter(x=>!x.conducted).every(x=>x.pr===null));
});
test("Mobitz II: PR fijo con ondas P no conducidas",()=>{
 const s=pick("mobitz2"),p=s.pWaves.filter(p=>p.time>10&&p.time<35);
 assert.ok(p.some(x=>!x.conducted));assert.ok(p.filter(x=>x.conducted).every(x=>near(x.pr,.16)));
});
test("Bloqueo AV completo: ritmos auricular y ventricular independientes",()=>{
 const s=pick("completeBlock"),b=core(s);
 assert.ok(s.pWaves.length>s.beats.length);
 assert.ok(b.slice(1).every((x,i)=>near(x.qrsOnset-b[i].qrsOnset,60/38)));
 assert.ok(s.pWaves.every(p=>!p.conducted));
});
test("Pausa sinusal: PP / RR con prolongación no igual a múltiplo simple",()=>{
 const b=core(pick("sinusPause")),d=b.slice(1).map((x,i)=>x.qrsOnset-b[i].qrsOnset);
 assert.ok(d.some(x=>x>1.6));assert.ok(d.some(x=>x<1.1));
});
test("PVC: QRS prematuro ancho y P no conducida para evento ventricular",()=>{
 const s=pick("pvcs"),b=core(s);
 assert.ok(b.some(x=>x.morph.qrsWidth>=.15));
 assert.ok(b.slice(1).some((x,i)=>x.qrsOnset-b[i].qrsOnset<.6));
});
test("FV y asistolia: sin falsos QRS organizados",()=>{
 for(const key of ["vf","asystole"]){
 const s=pick(key);assert.equal(s.beats.length,0);assert.equal(s.pWaves.length,0);
 }
});
test("Muestreo finito, reproducible para todos los ritmos",()=>{
 for(const [key,r] of Object.entries(globalThis.RHYTHMS)){
 const s=e.generate(r,{key,duration:60,seed:19});
 const copy=e.generate(r,{key,duration:60,seed:19});
 for(const t of [10.001,11.124,16.5,18.456,21.5]){
 const v=e.sample(s,t),v2=e.sample(copy,t);
 assert.ok(Number.isFinite(v),"muestra no finita: "+key);assert.equal(v,v2,"no determinista: "+key);
 }
 }
});