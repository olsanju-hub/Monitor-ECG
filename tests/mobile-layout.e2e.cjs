/* Responsive browser smoke test. Usage: node tests/mobile-layout.e2e.cjs
   Requires 'playwright' and a Chromium installation in the execution environment. */
const fs=require("node:fs");
const path=require("node:path");
const http=require("node:http");
const assert=require("node:assert/strict");
const {chromium}=require("playwright");

const root=path.resolve(__dirname,"..");
const mime={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".svg":"image/svg+xml",".png":"image/png",".json":"application/json",".webmanifest":"application/manifest+json"};
const server=http.createServer((req,res)=>{
 const u=new URL(req.url,"http://localhost");
 const relative=decodeURIComponent(u.pathname).replace(/^\/+/,"")||"index.html";
 const filename=path.resolve(root,relative);
 if(!filename.startsWith(root+path.sep)||!fs.existsSync(filename)||!fs.statSync(filename).isFile()){res.writeHead(404);res.end("Not found");return;}
 res.writeHead(200,{"Content-Type":mime[path.extname(filename)]||"application/octet-stream"});
 fs.createReadStream(filename).pipe(res);
});
function readyServer(){return new Promise(resolve=>server.listen(0,"127.0.0.1",()=>resolve(server.address().port)))}
async function checkViewport(page,where,width){
 const result=await page.evaluate(()=>{
  const sels=[".app-layout",".main-content","#screen",".lesson-layout",".lesson-main",".diagram-card","#ecg-lab",".lab-diagram-viewport"];
  const boxes=sels.map(sel=>{const el=document.querySelector(sel);if(!el)return null;const r=el.getBoundingClientRect();return {sel,x:r.x,right:r.right,width:r.width}}).filter(Boolean);
  return {viewport:window.innerWidth,documentWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,boxes};
 });
 assert.ok(result.documentWidth<=result.viewport+2,where+": document overflow "+JSON.stringify(result));
 for(const b of result.boxes){
  assert.ok(b.x>=-2&&b.right<=result.viewport+2,where+": "+b.sel+" outside viewport "+JSON.stringify(result));
 }
 assert.ok(Math.abs(result.viewport-width)<=2,where+": unexpected viewport");
}
async function run(){
 const port=await readyServer();
 const chromePaths=[process.env.CHROME_PATH,"/usr/bin/google-chrome","/usr/bin/google-chrome-stable","/usr/bin/chromium","/usr/bin/chromium-browser"];
 const executablePath=chromePaths.find(p=>p&&fs.existsSync(p));
 const browser=await chromium.launch({executablePath,headless:true,args:["--no-sandbox"]});
 let failures=0;
 try{
  for(const width of [375,390,430,768,1440]){
   const mobile=width<=768,context=await browser.newContext({
    viewport:{width,height:850},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:mobile?2:1
   });
   const page=await context.newPage();
   page.on("pageerror",err=>{console.error("Browser error: "+err.message);failures++});
   await page.goto("http://127.0.0.1:"+port+"/",{waitUntil:"domcontentloaded"});
   await page.locator(".hero").waitFor();
   await checkViewport(page,"minimal home "+width,width);
   const homeText=await page.locator("#screen").innerText();
   for(const forbidden of ["PRÓXIMO PASO","TU RUTA","Aprendizaje en un día","Nodo sinusal y automatismo","Capítulos del libro"]){
    assert.ok(!homeText.includes(forbidden),"Unapproved/noisy item on homepage: "+forbidden);
   }
   assert.equal(await page.locator('.chapter-card').count(),1,"Exactly one approved chapter on homepage");
   await page.locator('[data-page="route"]:visible').first().click();
   await checkViewport(page,"approved-only route "+width,width);
   assert.equal(await page.locator("details.outline").count(),1,"Only approved chapter is accessible");
   assert.equal(await page.locator('button[data-test-chapter]').count(),1,"Only approved test is accessible");
   await page.locator('[data-page="practice"]:visible').first().click();
   await checkViewport(page,"approved-only practice "+width,width);
   assert.equal(await page.locator('button[data-action^="lab-"]').count(),0,"Unapproved labs must not appear");
   assert.equal(await page.locator('button[data-action="open-axis"]').count(),0,"Unapproved axis tool must not appear");
   await page.locator('[data-chapter="1"]').first().click();
   await page.locator('#chapter1-v2-root').waitFor();
   assert.equal(await page.locator(".c1v-heart").count(),1,"New anatomical model replaces the old schematic");
   // One SVG viewport contains the bitmap and calibrated SVG regions.
   const anatomy=await page.locator(".c1v-anatomy-photo").evaluate(async img=>{
     const svg=img.closest("svg");
     const probe=new Image();
     probe.src=img.href.baseVal;
     await probe.decode();
     const base=img.getBoundingClientRect(),overlay=svg.getBoundingClientRect();
     const vb=svg.viewBox.baseVal;
     return {loaded:probe.complete&&probe.naturalWidth===357&&probe.naturalHeight===373,
       path:img.href.baseVal,
       sameSvg:svg.classList.contains("c1v-anatomy-composite"),
       viewBox:[vb.x,vb.y,vb.width,vb.height],
       widthDelta:Math.abs(base.width-overlay.width),heightDelta:Math.abs(base.height-overlay.height)};
   });
   assert.ok(anatomy.loaded,"Anatomical WebP must decode in the browser: "+JSON.stringify(anatomy));
   assert.equal(anatomy.path,"assets/chapter1/heart-anatomy.webp");
   assert.ok(anatomy.sameSvg,"Bitmap and vector paths must share one SVG viewport");
   assert.deepEqual(anatomy.viewBox,[0,0,357,373]);
   assert.ok(anatomy.widthDelta<2&&anatomy.heightDelta<2,"Anatomy should fill same viewBox "+JSON.stringify(anatomy));
   const anchors=await page.locator(".c1v-anatomy-composite").evaluate(svg=>{
     const labels=["sa","av","his"],positions={};
     for(const k of labels){const el=svg.querySelector('[data-c1v-spot="'+k+'"] .c1v-spot-hit');positions[k]=[+el.getAttribute("cx"),+el.getAttribute("cy")];}
     return positions;
   });
   assert.deepEqual(anchors,{sa:[125,122],av:[177,190],his:[190,225]},"Reviewed source-image landmarks must be stable on all screen widths");
   assert.equal(await page.locator(".c1v-heart [data-c1v-spot]").count(),6,"All six anatomical touch zones available");
   assert.equal(await page.locator('.c1-mini-heart').count(),0,"Legacy heart illustration must not render");
   await checkViewport(page,"renewed anatomy "+width,width);
   await page.locator('[data-c1v-nav="next"]').click();
   assert.match(await page.locator('.c1v-explain').innerText(),/Activación auricular/);
   await page.locator('[data-c1v-speed="1.5"]').click();
   await page.locator('[data-c1v-steps="toggle"]').click();
   await page.locator('[data-c1v-go="4"]').click();
   assert.match(await page.locator('.c1v-explain').innerText(),/Miocardio ventricular/);
   assert.equal(await page.locator('.c1v-heart-canvas[data-c1v-current="qrs"] .c1v-tissue-qrs').count(),2,"QRS represents myocardial tissue, not a Purkinje hotspot");
   await checkViewport(page,"interactive heart "+width,width);
   await page.locator('[data-c1v-concept="voltage"]').click();
   await page.locator('.c1v-feedback.correct').waitFor();
   await page.locator('.c1v-topic-nav [data-topic="C1.1"]').click();
   await page.locator('#chapter1-v2-root').waitFor();
   await checkViewport(page,"renewed wave explorer "+width,width);
   await page.locator('[data-c1v-wave-mode="practice"]').click();
   await page.locator('[data-c1v-wave="P"]').click();
   await page.locator('.c1v-feedback.correct').waitFor();
   await page.locator('.c1v-topic-nav [data-topic="C1.2"]').click();
   await checkViewport(page,"fundamentals Einthoven "+width,width);
   assert.equal(await page.locator('.c1-einthoven-figure .c1-triangle').count(),1,"Einthoven diagram must be present");
   assert.equal(await page.locator('.c1-site').count(),3,"Full limb names must be outside the diagram");
   assert.match(await page.locator('.c1-clear-intro').innerText(),/Una derivación no es un electrodo/);
   await page.locator('[data-c1-select-lead="DIII"]').click();
   assert.equal(await page.locator('[data-c1-select-lead="DIII"]').getAttribute('aria-pressed'),"true");
   assert.match(await page.locator('.c1-selected-detail').innerText(),/Pierna izquierda − brazo izquierdo/i);
   await checkViewport(page,"Einthoven DIII selected "+width,width);
   const svgCollisions=await page.locator('.c1-triangle').evaluate(svg=>{
     const els=[...svg.querySelectorAll('.c1-fig-lead,.c1-fig-node text,.c1-fig-polarity text')];
     const rects=els.filter(el=>Number(getComputedStyle(el).opacity)!==0).map(el=>({name:el.textContent.trim(),r:el.getBoundingClientRect()}));
     const collisions=[];
     for(let i=0;i<rects.length;i++)for(let j=i+1;j<rects.length;j++){
      const a=rects[i].r,b=rects[j].r;
      if(a.left<b.right-1&&a.right>b.left+1&&a.top<b.bottom-1&&a.bottom>b.top+1)collisions.push(rects[i].name+" / "+rects[j].name);
     }
     return collisions;
   });
   assert.deepEqual(svgCollisions,[],"SVG labels overlap at "+width+": "+svgCollisions);
   await page.locator('[data-c1-select-lead="DI"]').click();
   await page.locator('[data-c1-potential="bi"]').evaluate(el=>{el.value="0.4";el.dispatchEvent(new Event("input",{bubbles:true}))});
   await page.locator('[data-c1-mode="practice"]').click();
   await page.locator('[data-c1-pot-answer="0.5"]').click();
   await page.locator('.c1-feedback.good').waitFor();
   await checkViewport(page,"fundamentals practices "+width,width);
   await page.locator('[data-page="progress"]:visible').first().click();
   await checkViewport(page,"approved-only progress "+width,width);
   assert.ok((await page.locator('#screen').innerText()).includes("Fundamentos del ECG"),"progress must be approved-only");
   await page.locator('[data-page="practice"]:visible').first().click();
   await page.locator('[data-test-chapter="1"]').first().click();
   await page.locator(".quiz-panel").waitFor();
   await checkViewport(page,"approved-only quiz "+width,width);
   assert.match(await page.locator(".quiz-panel .eyebrow").innerText(),/CAPÍTULO 1/);
   await page.locator('[data-page="monitor"]:visible').first().click();
   await checkViewport(page,"monitor preserved "+width,width);
   console.log("PASS approved-only app "+width+"px");
   await context.close();
  }
  // Legacy progress from an unapproved chapter remains in localStorage, but cannot open old lessons.
  const context=await browser.newContext({viewport:{width:390,height:850},isMobile:true,hasTouch:true});
  const page=await context.newPage();
  await page.addInitScript(()=>{
   localStorage.setItem("ecg-academia-v1",JSON.stringify({version:1,visited:{"C2.0":true},done:{"C2.0":true},attempts:[],practice:{},visualHistory:[],pretest:true,activeTopic:"C2.0",activeChapter:2,seconds:60}));
  });
  await page.goto("http://127.0.0.1:"+port+"/",{waitUntil:"domcontentloaded"});
  await page.locator(".hero").waitFor();
  await page.locator('[data-page="route"]:visible').first().click();
  assert.equal(await page.locator("details.outline").count(),1,"Historic progress should not expose unapproved chapters");
  await page.locator('[data-page="home"]:visible').first().click();
  await page.locator('[data-chapter="1"]').first().click();
  assert.match(await page.locator(".lesson-head").innerText(),/Capítulo 1/);
  const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem("ecg-academia-v1")));
  assert.equal(stored.done["C2.0"],true,"Historical progress should be preserved");
  await context.close();
  assert.equal(failures,0,"Unexpected JavaScript runtime errors");
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve))}
}
run().catch(e=>{console.error(e.stack||e);process.exitCode=1;server.close()});
