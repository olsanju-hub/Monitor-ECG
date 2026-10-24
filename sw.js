/* ECG PWA — recursos precargados y actualización network-first */
const CACHE="ecg-academia-v12-20261024";
const ASSETS=[
 "./","./index.html","./styles.css","./academia.js","./curriculum.js","./chapter1.js","./chapter1.css","./chapter1-v2.js","./chapter1-v2.css",
 "./ecg-teaching-math.js","./ecg-teaching-tools.js","./visual-labs-core.js","./visual-labs.js","./visual-atlas.js","./visual-trace.js","./ecg-engine.js","./monitor.js","./rhythms.js","./rhythms-advanced.js",
 "./manifest.webmanifest","./icons/icon.svg","./icons/icon-192.png",
 "./icons/icon-512.png","./icons/apple-touch-icon.png"
];
self.addEventListener("install",event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch",event=>{
 if(event.request.method!=="GET")return;
 const url=new URL(event.request.url);
 if(url.origin!==self.location.origin)return;
 event.respondWith(fetch(event.request).then(response=>{
  if(response.ok){
   const copy=response.clone();
   caches.open(CACHE).then(cache=>cache.put(event.request,copy)).catch(()=>{});
  }
  return response;
 }).catch(async()=>{
  const cached=await caches.match(event.request);
  if(cached)return cached;
  if(event.request.mode==="navigate")return caches.match("./index.html")||Response.error();
  return Response.error();
 }));
});