/* ECG teaching formulas and curricular references: run with node --test */
const test=require("node:test");
const assert=require("node:assert/strict");
require("../ecg-teaching-math.js");
const M=globalThis.ECGTeachingMath;
const near=(a,b,t=.015)=>Math.abs(a-b)<t;
test("Axis estimation correctly discriminates normal, left, right and extreme cases",()=>{
 for(const c of M.CASES){
  const r=M.vectorFromIAVF(c.voltages.I,c.voltages.aVF);
  assert.ok(near(r.angle,c.angle),"incorrect angle "+c.name+": "+r.angle+" not "+c.angle);
  assert.equal(r.group,M.classifyAxis(c.angle),c.name);
 }
});
test("Boundary -15 degrees is normal despite aVF negative",()=>{
 const v=M.leadAmplitudes(-15,8),r=M.vectorFromIAVF(v.I,v.aVF);
 assert.equal(r.group,"normal");
 assert.equal(M.interpretQuadrant(v.I,v.aVF,v.II),"normal_izquierdo");
});
test("Axis -55 is left, with lead II negative",()=>{
 const v=M.leadAmplitudes(-55,8),r=M.vectorFromIAVF(v.I,v.aVF);
 assert.equal(r.group,"left");
 assert.ok(r.ii<0);
 assert.equal(M.interpretQuadrant(v.I,v.aVF,v.II),"izquierda");
});
test("Lead I + lead III estimates same angle as I + aVF",()=>{
 for(const c of M.CASES){
  const v=c.voltages,r=M.vectorFromIAndIII(v.I,v.III);
  assert.ok(near(r.angle,c.angle),c.name+" "+r.angle);
 }
});
test("Axis classification adult boundaries",()=>{
 for(const [value,expected] of [[-30,"normal"],[0,"normal"],[90,"normal"],[-31,"left"],[-90,"left"],[-120,"extreme"],[120,"right"]]){
  assert.equal(M.classifyAxis(value),expected,String(value));
 }
});
test("Tiny voltages must not yield spurious precise axis",()=>{
 const r=M.vectorFromIAVF(.03,-.04);
 assert.equal(r.indeterminate,true);
 assert.throws(()=>M.vectorFromIAVF(Number.NaN,1));
});
test("QRS amplitudes are orthogonal projections onto 6 lead axes",()=>{
 const v=M.leadAmplitudes(60,8);
 assert.ok(near(v.II,8));assert.ok(near(v.I,4));
 assert.ok(near(v.aVF,8*Math.sin(Math.PI/3)));
 assert.ok(v.aVR<0);
});
test("Heart rate handles paper speed and RR units",()=>{
 assert.ok(near(M.heartRateFromRR(.8),75));
 assert.ok(near(M.heartRateFromSquares(20,25),75));
 assert.ok(near(M.heartRateFromSquares(40,50),75));
 assert.throws(()=>M.heartRateFromSquares(0,25));
});
test("QTc formulas, RR in seconds and ms results",()=>{
 const r=M.qtc(400,75);
 assert.ok(near(r.rr,.8));
 assert.ok(near(r.bazett,447.213595));
 assert.ok(near(r.fridericia,430.8869));
 assert.ok(r.bazett>r.fridericia);
 assert.throws(()=>M.qtc(400,0));
});
test("ECG curricular content retains ten chapters and exposes educational case host",()=>{
 const win={};const fs=require("node:fs"),path=require("node:path");
 const src=fs.readFileSync(path.resolve(__dirname,"../curriculum.js"),"utf8");
 new Function("window",src)(win);
 assert.equal(win.ECG_CURRICULUM.length,10);
 const axis=win.ECG_CURRICULUM[6].topics.find(t=>t.title==="Eje eléctrico");
 assert.match(axis.explanation,/aVF/);assert.match(axis.explanation,/−30/);
});
