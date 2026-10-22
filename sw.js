/* PWA ECG: precarga offline de archivos funcionales estáticos, sin backend. */
const CACHE="ecg-academia-v2-20261022";
const ASSETS=[
 "./","./index.html","./styles.css","./academia.js","./curriculum.js",
 "./monitor.js","./rhythms.js","./rhythms-advanced.js",
 "./manifest.webmanifest","./icons/icon.svg",
 "./icons/icon-192.png","./icons/icon-512.png","./icons/apple-touch-icon.png"
];
self.addEventListener("install",event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch",event=>{
 if(event.request.method!=="GET")return;
 if(new URL(event.request.url).origin!==self.location.origin)return;
 event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request).then(response=>{
  if(response.ok){const clone=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,clone));}
  return response;
 }).catch(()=>event.request.mode==="navigate"?caches.match("./index.html"):Response.error())));
});