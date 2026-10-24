/* Approved Chapter 1: original curriculum, equations, semantics and interactions. */
const test=require("node:test");
const assert=require("node:assert/strict");
global.window=globalThis;
const listeners={};
let content="",events=[];
const host={dataset:{},get innerHTML(){return content},set innerHTML(x){content=x},querySelector(){return null}};
global.document={hidden:false,body:{addEventListener(name,fn){(listeners[name]??=[]).push(fn)}},addEventListener(name,fn){(listeners[name]??=[]).push(fn)},querySelector(sel){return (sel==="#chapter1-root"&&host.dataset.topic==="C1.2")||(sel.startsWith("#chapter1-v2-root")&&host.dataset.topic!=="C1.2")?host:null}};
global.ECG_recordVisualExercise=e=>events.push(e);
require("../curriculum.js");
require("../chapter1.js");
require("../chapter1-v2.js");
const E=global.ECGChapter1;
function show(id){E.setTopic(id);host.dataset.topic=id;content=E.render(id);}
function fake(kind,key,prefix="c1"){
 const attr="data-"+prefix+"-"+kind;
 const datasetKey=prefix+kind.charAt(0).toUpperCase()+kind.slice(1).replace(/-([a-z])/g,(_,ch)=>ch.toUpperCase());
 const el={dataset:{[datasetKey]:key},hasAttribute(v){return v===attr}};
 el.closest=()=>el;
 return el;
}
function choose(kind,key,prefix="c1"){for(const fn of listeners.click||[])fn({target:fake(kind,key,prefix)})}
test("Ten fully explained questions replace the old three while all ten chapters stay",()=>{
 assert.equal(ECG_CURRICULUM.length,10);
 assert.equal(ECG_CURRICULUM[0].title,"Fundamentos del electrocardiograma");
 assert.equal(ECG_CURRICULUM[0].topics.length,3);
 assert.equal(ECG_QUESTIONS.filter(q=>q.chapter===1).length,10);
 assert.equal(new Set(ECG_QUESTIONS.map(q=>q.id)).size,ECG_QUESTIONS.length);
 assert.ok(ECG_QUESTIONS.length>=76);
 for(const q of ECG_QUESTIONS.filter(x=>x.chapter===1)){
  assert.equal(q.correct,0);
  assert.equal(q.choices.length,4);
  assert.ok(q.reason.length>40);
 }
});
test("Question 8 identifies both extremities and the poles without unexplained abbreviations",()=>{
 const q=E.questions[7];
 assert.match(q.question,/brazo derecho/i);assert.match(q.question,/brazo izquierdo/i);
 assert.match(q.question,/DI/);assert.match(q.question,/\(\+\)/);assert.match(q.question,/\(−\)/);
 assert.doesNotMatch(q.question,/\b(?:BD|BI|PI)\b/);
 assert.match(q.reason,/brazo izquierdo − potencial del brazo derecho/i);
 assert.equal(q.choices[0],"+0,6 mV");
});
test("Einthoven formula holds for variable instantaneous limb potentials",()=>{
 const scenarios=[{bd:0,bi:.6,pi:1.1},{bd:1.4,bi:-.2,pi:.1},{bd:-.6,bi:-.2,pi:-.9}];
 for(const x of scenarios){const a=E.leads(x);assert.ok(Math.abs(a.di+a.diii-a.dii)<1e-7)}
 assert.deepEqual(E.leads({bd:0,bi:.6,pi:1.1}),{di:.6,dii:1.1,diii:.5});
});
test("Each lesson contains its own meaningful interactive teaching surface",()=>{
 show("C1.0");assert.match(content,/Del impulso al registro/);assert.match(content,/data-c1v-play/);assert.match(content,/data-c1v-concept/);assert.doesNotMatch(content,/CORAZÓN · CORTE ESQUEMÁTICO/);
 show("C1.1");assert.match(content,/data-c1v-wave/);assert.match(content,/intervalo PR/i);assert.match(content,/segmento ST/i);
 show("C1.2");for(const term of ["Brazo derecho","Brazo izquierdo","Pierna izquierda","Polo negativo","Polo positivo","data-c1-select-lead","data-c1-potential","data-c1-mode"]){assert.ok(content.includes(term),term)}
 assert.doesNotMatch(content,/LABORATORIO DOCENTE/);
 assert.doesNotMatch(content,/<h2>Bibliografía/i);
});
test("Practical wave test hides the wave names and replaces them by numbered regions",()=>{
 show("C1.1");choose("wave-mode","practice","c1v");
 assert.match(content,/Zona 1/);assert.match(content,/Zona 2/);assert.match(content,/Zona 3/);
 assert.match(content,/data-c1v-wave="P"/);
 assert.doesNotMatch(content,/Onda P<\/button>/);
 assert.match(content,/data-c1v-wave="QRS"/);
});
test("A visual competence requires successful choices for P, PR, QRS, ST and T",()=>{
 show("C1.1");choose("wave-mode","practice","c1v");
 for(const [i,key] of ["P","PR","QRS","ST","T"].entries()){
  choose("wave",key,"c1v");
  assert.match(content,/Correcto/);
  if(i<4)choose("wave-next","next","c1v");
 }
 assert.ok(events.some(x=>x.chapter===1&&x.taskId==="waves"&&x.ok));
});
test("Einthoven practice has two unique solved tasks and does not leak the answer",()=>{
 show("C1.2");choose("mode","practice");
 assert.match(content,/Si DI = \+0,8 mV y DIII = −0,3 mV/);
 choose("pot-answer","0.5");
 assert.match(content,/Correcto/);
 choose("action","next-pot");
 choose("pot-answer","0.6");
 assert.ok(events.some(x=>x.chapter===1&&x.taskId==="einthoven"&&x.ok));
});
test("Conceptual question records the electrical/mechanical distinction",()=>{
 show("C1.0");choose("concept","voltage","c1v");
 assert.ok(events.some(x=>x.chapter===1&&x.taskId==="recording"&&x.ok));
 assert.match(content,/Correcto/);
});

test("Einthoven derivation control updates real polarity, formula and highlighted vector",()=>{
 show("C1.2");choose("select-lead","DIII");
 assert.match(content,/Derivación DIII/);
 assert.match(content,/Pierna izquierda − brazo izquierdo/i);
 assert.match(content,/data-c1-select-lead="DIII" class="c1-lead-choice selected"/);
 assert.match(content,/Seleccionada DIII/);
 for(const key of ["DI","DII","DIII"])assert.match(content,new RegExp('data-c1-select-lead="'+key+'"'));
});
test("Einthoven diagram keeps limb names in separated legend, not within SVG geometry",()=>{
 show("C1.2");
 const svg=content.match(/<svg class="c1-triangle"[\s\S]*?<\/svg>/)?.[0];
 assert.ok(svg);
 for(const term of ["Brazo derecho","Brazo izquierdo","Pierna izquierda"]){
  assert.ok(!svg.includes('>'+term+'<'),term+" must remain outside diagram");
 }
 for(const label of ["BD","BI","PI","DI","DII","DIII"])assert.ok(svg.includes('>'+label+'</text>'),label);
 assert.match(content,/c1-sites/);
});

test("Chapter 1 reuses no legacy schematic heart and has 6 stepped heart states",()=>{
 show("C1.0");
 assert.match(content,/c1v-heart/);
 assert.match(content,/Ilustración anatómica semirrealista/);
 assert.match(content,/assets\/chapter1\/heart-anatomy\.webp/);
 assert.match(content,/c1v-anatomy-overlay/);
 assert.match(content,/data-c1v-current="sa"/);
 assert.doesNotMatch(content,/atlas-hotspot|atlas-chamber-labels/);
 assert.equal(global.ECGChapter1V2.steps.length,6);
 choose("nav","next","c1v");
 assert.match(content,/Activación auricular/);
 assert.match(content,/data-c1v-current="atria"/);
 choose("go","4","c1v");
 assert.match(content,/Miocardio ventricular/);
 assert.match(content,/data-c1v-current="qrs"/);
 choose("nav","reset","c1v");
 assert.match(content,/data-c1v-current="sa"/);
});
test("Wave explorer includes intervals and segments as assessable regions",()=>{
 show("C1.1");choose("wave-mode","learn","c1v");
 for(const key of ["P","PR","QRS","ST","T"]){choose("wave",key,"c1v");assert.match(content,new RegExp("Estás explorando|ESTÁS EXPLORANDO"));}
 choose("wave-mode","practice","c1v");
 assert.match(content,/EJERCICIO 1 DE 5/);
});
