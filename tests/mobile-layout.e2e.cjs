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
   const mobile=width<=768;
   const context=await browser.newContext({viewport:{width,height:850},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:mobile?2:1});
   const page=await context.newPage();
   page.on("pageerror",error=>{console.error("Browser error:",error.message);failures++});
   await page.goto("http://127.0.0.1:"+port+"/",{waitUntil:"domcontentloaded"});
   await page.locator(".hero").waitFor();
   await checkViewport(page,"home "+width,width);
   for(const lab of ["conduction","vectors","placement","measurement"]){
    await page.locator('[data-page="practice"]:visible').first().click();
    await page.locator('[data-action="lab-'+lab+'"]').click();
    await page.locator("#ecg-lab").waitFor();
    await checkViewport(page,lab+" "+width,width);
    if(lab!=="measurement"){
     const diagram=page.locator(".lab-figure-container .lab-figure");
     const frame=page.locator(".lab-diagram-viewport");
     const figureWidth=await diagram.evaluate(x=>x.getBoundingClientRect().width);
     const frameWidth=await frame.evaluate(x=>x.clientWidth);
     assert.ok(figureWidth<=frameWidth+2,"Figure should fit by default: "+lab+" "+width+" "+figureWidth+" > "+frameWidth);
     await page.locator('[data-lab-action="zoom-toggle"]').click();
     await checkViewport(page,"zoom "+lab+" "+width,width);
     if(width<690){
      const dims=await frame.evaluate(x=>({scrollWidth:x.scrollWidth,clientWidth:x.clientWidth}));
      assert.ok(dims.scrollWidth>dims.clientWidth+100,"Zoom must scroll internally: "+lab+" "+width+" "+JSON.stringify(dims));
     }
     await page.locator('[data-lab-action="zoom-toggle"]').click();
     await checkViewport(page,"fit again "+lab+" "+width,width);
    }
   }
   await page.locator('[data-page="practice"]:visible').first().click();
   await page.locator('[data-action="open-axis"]').click();
   await page.locator('#axis-masterclass').waitFor();
   await checkViewport(page,"axis masterclass "+width,width);
   await page.locator('[data-teach-axis-answer="normal"]').click();
   await page.locator('.teach-feedback').first().waitFor();
   await page.locator('[data-teach-calc="axis"]').click();
   await page.locator('.teach-results').waitFor();
   await checkViewport(page,"axis calculator "+width,width);
   await page.locator('[data-page="practice"]:visible').first().click();
   await page.locator('[data-action="open-calculators"]').click();
   await page.locator('[data-teach-calc="rate"]').click();
   await page.locator('#teachRateResult strong').waitFor();
   await page.locator('[data-teach-calc="qtc"]').click();
   await page.locator('#teachQTResult strong').waitFor();
   await checkViewport(page,"didactic calculators "+width,width);
   console.log("PASS responsive viewport "+width+"px");
   await context.close();
  }
  assert.equal(failures,0,"Unexpected JavaScript runtime errors");
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve))}
}
run().catch(e=>{console.error(e.stack||e);process.exitCode=1;server.close()});
