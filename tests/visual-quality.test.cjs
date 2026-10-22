const test=require("node:test");
const assert=require("node:assert/strict");
require("../visual-labs-core.js");
require("../visual-atlas.js");
require("../visual-trace.js");
const C=globalThis.ECGVisualCore,A=globalThis.ECGVisualAtlas,T=globalThis.ECGTeachingTrace;
test("Heart atlas retains all six accessible conduction zones",()=>{
 const h=A.heart(C,{selected:"av",stage:2,mode:"explore",playing:false});
 assert.match(h,/<svg /);assert.match(h,/lab-heart/);assert.match(h,/AD\/AI/);
 for(const p of C.CONDUCTION){assert.ok(h.includes('data-lab-part="'+p.id+'"'),p.id)}
 assert.match(h,/data-selected="true"/);
 assert.match(h,/role="button"/);
});
test("Heartbeat hotspots remain present but answers do not appear as names in practice",()=>{
 const h=A.heart(C,{selected:"sa",stage:0,mode:"practice",playing:false});
 assert.equal((h.match(/data-lab-part=/g)||[]).length,6);
 assert.ok(!h.includes('data-selected="true"'));
});
test("Anatomical precordial landmarks agree with six standard site coordinates",()=>{
 const html=A.torso(C,{mode:"explore",selected:"V4",point:null,last:null});
 assert.match(html,/data-lab-torso="true"/);
 for(const id of ["V1","V2","V3","V4","V5","V6"]){
  const p=C.ELECTRODES[id];
  assert.match(html,new RegExp('data-lab-electrode="'+id+'"'));
  assert.ok(html.includes('cx="'+p.x+'" cy="'+p.y+'"'),id+" geometric reference lost");
 }
 assert.match(html,/4\.º EIC/);
 assert.match(html,/5\.º EIC/);
 assert.match(html,/MCL/);assert.match(html,/LAA/);assert.match(html,/LAM/);
});
test("Practice torso hides location markers while retaining landmark geometry",()=>{
 const html=A.torso(C,{mode:"practice",selected:"V4",point:null,last:null});
 assert.match(html,/data-lab-torso="true"/);
 assert.equal((html.match(/data-lab-electrode=/g)||[]).length,0);
});
test("Paper milliseconds exactly match the authored learning references",()=>{
 assert.ok(Math.abs(T.RR-.8)<1e-8);
 const task=Object.fromEntries(C.MEASURE_TASKS.map(x=>[x.id,x]));
 assert.ok(Math.abs(T.QRS_ON-task.QRS.points[0])<1e-8);
 assert.ok(Math.abs(T.QRS_OFF-task.QRS.points[1])<1e-8);
 assert.ok(Math.abs(T.T_OFF-task.QT.points[1])<1e-8);
 assert.ok(Math.abs(T.P_ON-task.PR.points[0])<1e-8);
 assert.ok(Math.abs(task.RR.points[1]-task.RR.points[0]-T.RR)<1e-8);
});
test("P, QRS and T onset/offset are exactly on baseline",()=>{
 for(const t of [T.P_ON,T.QRS_ON,T.QRS_OFF,T.T_ON,T.T_OFF]){
  assert.ok(Math.abs(T.sample(t))<.000001,t+": "+T.sample(t));
 }
 assert.ok(T.sample(.544)>.85);
 assert.ok(T.sample(.38)>.11);
 assert.ok(T.sample(.828)>.20);
});
test("Waveform is deterministic and bounded",()=>{
 for(let i=0;i<=900;i++){
  const t=i/300;
  const v=T.sample(t);
  assert.ok(Number.isFinite(v)&&v>=-.24&&v<=1.07,t+" "+v);
  assert.equal(v,T.sample(t));
 }
});
test("SVG ECG includes paper grid, calibration and markers",()=>{
 const html=T.svg({marks:[.544,1.344],explore:false});
 assert.match(html,/data-lab-paper="true"/);assert.match(html,/viewBox="0 0 1100 318"/);
 assert.match(html,/25 mm\/s/);assert.match(html,/10 mm\/mV/);
 assert.match(html,/1 mV \/ 200 ms/);
 assert.equal((html.match(/class="teach-cursor"/g)||[]).length,2);
 assert.ok(!html.includes("P inicio"),"practice must not reveal P onset");
});
test("Explore paper shows annotations and practice hides them",()=>{
 const explore=T.svg({marks:[],explore:true}),practice=T.svg({marks:[],explore:false});
 assert.match(explore,/P inicio/);assert.match(explore,/QRS inicio/);assert.match(explore,/T fin/);
 assert.ok(!practice.includes("QRS inicio"));
});
