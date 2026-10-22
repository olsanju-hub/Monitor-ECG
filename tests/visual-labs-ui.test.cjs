/* Smoke tests reales del despachador DOM de laboratorios, sin servidor. */
const test=require("node:test");
const assert=require("node:assert/strict");
require("../visual-labs-core.js");
const listeners={};
let html="",saved=[];
const host={
 get innerHTML(){return html},
 set innerHTML(next){html=next},
 querySelector(){return null}
};
global.document={
 body:{addEventListener(type,fn){listeners[type]=fn}},
 querySelector(sel){return sel==="#ecg-lab"?host:null}
};
global.window=globalThis;
globalThis.ECG_recordVisualExercise=e=>saved.push(e);
require("../visual-labs.js");
const lab=globalThis.ECGVisualLab;
function target(selector,value){
 const key=selector==="part"?"labPart":selector==="polarity"?"labPolarityChoice":"labMode";
 const name=selector==="part"?"data-lab-part":selector==="polarity"?"data-lab-polarity-choice":"data-lab-mode";
 const t={dataset:{[key]:value},hasAttribute(k){return k===name}};
 t.closest=q=>q.includes(name)?t:null;
 return t;
}
function screen(chapter){html=lab.render(chapter);}
function click(t,x=0,y=0){listeners.click({target:t,clientX:x,clientY:y})}
function svg(kind){
 const attr=kind==="paper"?"data-lab-paper":"data-lab-torso";
 const plot={
  hasAttribute(k){return k===attr},
  createSVGPoint(){return{x:0,y:0,matrixTransform(){return{x:this.x,y:this.y}}}},
  getScreenCTM(){return{inverse(){return{}}}}
 };
 return {closest(q){return q.includes(attr)?plot:null}};
}
test("Conducción: toca SA, recibe feedback y guarda evidencia",()=>{
 lab.prepare("conduction","practice");screen(2);
 assert.match(html,/Nodo sinoauricular/);
 click(target("part","sa"));
 assert.equal(saved.at(-1).kind,"conduction");
 assert.equal(saved.at(-1).taskId,"sa");
 assert.equal(saved.at(-1).ok,true);
 assert.match(html,/lab-feedback correct/);
});
test("Vectores: recibe decisión polar y registra el resultado",()=>{
 lab.prepare("vectors","practice");screen(3);
 click(target("polarity","positive"));
 assert.equal(saved.at(-1).kind,"vectors");
 assert.equal(saved.at(-1).ok,true);
 assert.match(html,/lab-feedback correct/);
});
test("Precordiales: click sobre SVG se corrige, sin interacción ornamental",()=>{
 lab.prepare("placement","practice");screen(5);
 assert.match(html,/data-lab-torso/);
 click(svg("torso"),322,230);
 assert.equal(saved.at(-1).kind,"placement");
 assert.equal(saved.at(-1).taskId,"V1");
 assert.equal(saved.at(-1).ok,true);
});
test("Medición: requiere dos marcas en puntos correctos",()=>{
 lab.prepare("measurement","practice");screen(6);
 const previous=saved.length;
 click(svg("paper"),.544*220,140);
 assert.equal(saved.length,previous);
 click(svg("paper"),1.344*220,140);
 assert.equal(saved.at(-1).kind,"measurement");
 assert.equal(saved.at(-1).taskId,"RR");
 assert.equal(saved.at(-1).ok,true);
});
test("Cursor equivocado no acredita la habilidad",()=>{
 lab.prepare("measurement","practice");screen(6);
 click(svg("paper"),1.344*220,140);
 click(svg("paper"),2.144*220,140);
 assert.equal(saved.at(-1).ok,false);
 assert.match(html,/lab-feedback incorrect/);
});
test("Modo Aprender expone representación útil por capítulo",()=>{
 for(const [ch,marker] of [[2,"lab-heart"],[3,"data-lab-projection-wave"],[5,"data-lab-torso"],[6,"data-lab-paper"]]){
  lab.prepare(({2:"conduction",3:"vectors",5:"placement",6:"measurement"})[ch],"explore");
  screen(ch);assert.match(html,new RegExp(marker));
  assert.match(html,/Aprender/);assert.match(html,/Practicar/);
 }
});
