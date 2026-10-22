/* ECG laboratorios: pruebas de geometría, competencias y tiempo medido. */
const test=require("node:test");
const assert=require("node:assert/strict");
require("../visual-labs-core.js");
const E=globalThis.ECGVisualCore;
const near=(a,b,tol=.0001)=>Math.abs(a-b)<=tol;
test("Currículo visual ofrece todas las derivaciones frontales",()=>{
 assert.deepEqual(Object.keys(E.LEADS),["I","II","III","aVR","aVL","aVF"]);
 assert.equal(E.CONDUCTION.length,6);
 assert.deepEqual(E.PLACEMENT_ORDER,["V1","V2","V4","V3","V5","V6"]);
});
test("Vectores conservan signo físico para seis derivaciones",()=>{
 assert.ok(near(E.projection(0,"I"),1));
 assert.ok(near(E.projection(180,"I"),-1));
 assert.ok(near(E.projection(0,"aVF"),0));
 assert.equal(E.polarity(0,"I"),"positive");
 assert.equal(E.polarity(180,"I"),"negative");
 assert.equal(E.polarity(0,"aVF"),"isoelectric");
 assert.equal(E.polarity(0,"aVR"),"negative");
 assert.equal(E.polarity(-150,"aVR"),"positive");
 assert.throws(()=>E.projection(0,"V1"),/Derivación inválida/);
});
test("Electrodos precordiales en orden docente",()=>{
 for(const [name,p] of Object.entries(E.ELECTRODES)){
  assert.ok(E.gradePlacement(name,p.x,p.y).ok);
  assert.ok(!E.gradePlacement(name,p.x+75,p.y).ok);
  assert.ok(!E.gradePlacement(name,p.x,p.y+75).ok);
 }
});
test("Error precordial especifica dirección",()=>{
 const p=E.ELECTRODES.V2;
 assert.match(E.gradePlacement("V2",p.x,p.y-75).reason,/alto/);
 assert.match(E.gradePlacement("V2",p.x+85,p.y).reason,/lateral/);
 assert.match(E.gradePlacement("V2",p.x,p.y+75).reason,/bajo/);
 assert.throws(()=>E.gradePlacement("X",1,2));
});
test("Referencias básicas de electrodos preservadas",()=>{
 assert.match(E.ELECTRODES.V1.text,/Cuarto espacio intercostal/);
 assert.match(E.ELECTRODES.V4.text,/Quinto espacio intercostal/);
 assert.match(E.ELECTRODES.V6.text,/axilar media/);
});
test("Mediciones exigidas: RR, PR, QRS, QT",()=>{
 assert.deepEqual(E.MEASURE_TASKS.map(t=>t.id),["RR","PR","QRS","QT"]);
 for(const t of E.MEASURE_TASKS){
  const measured=E.measurementGrade(t.id,...t.points);
  assert.ok(measured.ok,t.id);
  assert.ok(near(measured.measured,t.seconds),t.id);
 }
});
test("No basta medir la distancia correcta en ondas equivocadas",()=>{
 const m=E.measurementGrade("RR",1.344,2.144);
 assert.ok(!m.ok);
 assert.ok(near(m.measured,.8));
});
test("Tolerancia rechaza cursores desplazados",()=>{
 const p=E.measurementGrade("QRS",.64,.73);
 assert.ok(!p.ok);
 assert.throws(()=>E.measurementGrade("XYZ",.1,.2));
 assert.ok(!E.measurementGrade("RR",1.344,.544).ok);
});
test("Transformaciones táctiles usan la matriz SVG si existe",()=>{
 const svg={createSVGPoint(){return{x:0,y:0,matrixTransform(){return{x:this.x/2+4,y:this.y/2-7}}}},getScreenCTM(){return{inverse(){return{}}}}};
 assert.deepEqual(E.svgClientPoint(svg,200,100),{x:104,y:43});
});
test("SVG con preserveAspectRatio conoce las bandas laterales",()=>{
 const svg={viewBox:{baseVal:{x:0,y:0,width:700,height:470}},getBoundingClientRect(){return{left:10,top:20,width:500,height:500}}};
 const scale=500/700;
 const p=E.svgClientPoint(svg,10+500/2,20+500/2);
 assert.ok(near(p.x,350));
 assert.ok(near(p.y,235));
});
