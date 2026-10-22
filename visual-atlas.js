/* Original, layered anatomical SVG illustrations for interactive ECG teaching.
 * Not a clinical atlas: approximate proportions and landmarks, scientifically
 * labelled; geometry of electrode and conduction hotspots comes from core.
 * NO source artwork or code is copied from My EKG.
 */
(function(root){
"use strict";
function heart(C,{selected,stage,mode,playing}){
 const groups=C.CONDUCTION.map((p,i)=>{
  const hot=mode==="explore"&&selected===p.id,active=mode==="explore"&&stage===i;
  return '<g class="atlas-hotspot" role="button" tabindex="0" data-lab-part="'+p.id+'" data-selected="'+hot+'" aria-label="'+p.title+'">'+
   '<circle class="atlas-hit" cx="'+p.x+'" cy="'+p.y+'" r="31" />'+
   '<circle class="atlas-ring" cx="'+p.x+'" cy="'+p.y+'" r="'+(hot?18:active?16:13)+'" />'+
   '<circle cx="'+p.x+'" cy="'+p.y+'" r="7" fill="'+(hot?"#075b68":"#ffffff")+'" />'+
   '<text x="'+p.x+'" y="'+(p.y+4.3)+'" text-anchor="middle" class="atlas-hot-number" fill="'+(hot?"#fff":"#075b68")+'">'+(i+1)+'</text>'+
  '</g>';
 }).join("");
 const path='M260 144 C278 151 298 161 310 174 S340 203 351 218 L352 268 C343 291 328 303 309 329 C299 339 289 348 278 360 M352 268 C363 280 366 289 371 301 C401 306 413 331 436 344';
 return '<svg viewBox="0 0 720 470" class="lab-figure lab-heart atlas-heart" role="group" aria-label="Corazón anatómico esquemático en corte con cavidades, grandes vasos y seis puntos del sistema de conducción. Explora los puntos o evalúate.">'+
 '<defs>'+
 '<radialGradient id="atlas-myocardium" cx="42%" cy="30%" r="78%"><stop offset="0" stop-color="#f8ddd6"/><stop offset=".53" stop-color="#e7acac"/><stop offset="1" stop-color="#ba6878"/></radialGradient>'+
 '<linearGradient id="atlas-atrial" x1="0" x2=".85" y1=".18" y2="1"><stop stop-color="#f8cfce"/><stop offset="1" stop-color="#cc7e8e"/></linearGradient>'+
 '<linearGradient id="atlas-ventricular" x1=".16" x2="1" y1="0" y2="1"><stop stop-color="#d97d8a"/><stop offset="1" stop-color="#a54c66"/></linearGradient>'+
 '<linearGradient id="atlas-great-vessel" x1="0" x2="1" y1="0" y2="0"><stop stop-color="#ad6375"/><stop offset=".45" stop-color="#e5a1a8"/><stop offset="1" stop-color="#965366"/></linearGradient>'+
 '<linearGradient id="atlas-pulmonary" x1="0" x2="1" y1="0" y2="0"><stop stop-color="#69b4c2"/><stop offset=".6" stop-color="#8dd1d4"/><stop offset="1" stop-color="#3b8196"/></linearGradient>'+
 '<filter id="atlas-shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="9" stdDeviation="13" flood-color="#6d5165" flood-opacity=".17"/></filter>'+
 '</defs>'+
 '<rect width="720" height="470" rx="17" fill="#f9fbfb"/>'+
 '<ellipse cx="354" cy="242" rx="202" ry="207" fill="#edf3f2"/>'+
 '<g opacity=".55" fill="none" stroke="#ccd9d8" stroke-width="1.5">'+
 '<path d="M110 140C161 82 200 56 256 50M607 144C564 88 536 63 471 47"/>'+
 '</g>'+
 '<g filter="url(#atlas-shadow)">'+
 '<path d="M246 86 C194 88 174 122 164 168 C152 233 178 297 231 356 C267 398 332 432 353 432 C382 418 444 374 490 318 C525 273 548 222 530 167 C515 111 482 90 446 82 C417 75 391 84 371 101 C340 81 290 78 246 86Z" fill="url(#atlas-myocardium)" stroke="#9a586a" stroke-width="4" stroke-linejoin="round"/>'+
 '<path d="M247 103C207 101 193 131 193 163C192 215 212 246 263 258C295 266 320 250 331 222C330 183 313 123 277 111Z" fill="url(#atlas-atrial)" stroke="#b66c7d" stroke-width="2.4"/>'+
 '<path d="M390 112C426 97 463 116 481 154C492 187 483 220 450 240C409 251 379 225 367 195C364 160 374 129 390 112Z" fill="url(#atlas-atrial)" stroke="#b66c7d" stroke-width="2.4"/>'+
 '<path d="M236 262C265 238 309 254 338 283C350 323 352 378 350 407C322 388 281 367 251 331C232 306 226 285 236 262Z" fill="url(#atlas-ventricular)" stroke="#a4596c" stroke-width="2.4"/>'+
 '<path d="M385 255C422 232 474 245 491 267C481 310 432 370 364 410C364 356 362 296 385 255Z" fill="url(#atlas-ventricular)" stroke="#a4596c" stroke-width="2.4"/>'+
 '<path d="M349 225C359 273 358 327 355 407" fill="none" stroke="#8b5066" stroke-width="10" opacity=".73"/>'+
 '<path d="M349 225C356 281 355 348 353 405" fill="none" stroke="#facfc7" stroke-width="2.7" opacity=".64"/>'+
 '<path d="M221 278C253 254 302 276 321 326M395 279C438 256 470 283 472 291" stroke="#ffd8cc" stroke-width="2" opacity=".42" fill="none"/>'+
 '</g>'+
 '<g fill="none" stroke-linecap="round">'+
 '<path d="M257 118C260 75 260 50 262 24" stroke="url(#atlas-pulmonary)" stroke-width="29"/>'+
 '<path d="M254 119C257 74 259 50 262 24" stroke="#d6f2ec" stroke-width="7" opacity=".5"/>'+
 '<path d="M444 103C459 80 469 47 467 17" stroke="url(#atlas-great-vessel)" stroke-width="37"/>'+
 '<path d="M463 34C491 31 509 43 524 61" stroke="url(#atlas-great-vessel)" stroke-width="19"/>'+
 '<path d="M416 121C429 91 422 59 400 38C387 26 374 29 362 44" stroke="url(#atlas-pulmonary)" stroke-width="27"/>'+
 '<path d="M484 171C518 167 534 147 546 134" stroke="url(#atlas-pulmonary)" stroke-width="19" opacity=".7"/>'+
 '</g>'+
 '<g class="atlas-chamber-labels" font-size="13.5" font-weight="700" fill="#784b5b">'+
 '<text x="209" y="208">AD</text><text x="437" y="208">AI</text><text x="277" y="311">VD</text><text x="420" y="313">VI</text>'+
 '</g>'+
 '<g fill="none" stroke="#185d68" stroke-linecap="round" stroke-linejoin="round">'+
 '<path d="'+path+'" stroke="#e9faf1" stroke-width="12" opacity=".85"/>'+
 '<path d="'+path+'" stroke="#167886" stroke-width="6.5"/>'+
 '<path d="'+path+'" stroke="#87e5cf" stroke-width="2" stroke-dasharray="8 9" class="'+(playing?"lab-impulse":"")+'"/>'+
 '</g>'+
 '<path d="M287 154C301 144 320 150 329 168M400 332C416 329 432 340 454 364M305 348C300 360 294 377 284 387" fill="none" stroke="#227985" stroke-width="3" opacity=".65"/>'+
 groups+
 '<g class="atlas-legend-notes" font-size="13.5" font-weight="600" fill="#466372">'+
 '<text x="34" y="38">CORAZÓN · CORTE ESQUEMÁTICO</text><text x="34" y="451">AD/AI · aurículas     VD/VI · ventrículos</text>'+
 '<text x="543" y="451" text-anchor="end">Impulso: SA → AV → His → Purkinje</text>'+
 '</g></svg>';
}
function torso(C,{mode,selected,point,last}){
 const explore=mode==="explore";
 const ribY=[144,174,204,234,264,294];
 const ribs=ribY.map((y,i)=>{
  const opacity=i<2?.72:.91;
  return '<g opacity="'+opacity+'">'+
   '<path d="M346 '+y+' C310 '+(y-13)+' 248 '+(y-5)+' 183 '+(y+22)+' M354 '+y+' C392 '+(y-13)+' 455 '+(y-5)+' 527 '+(y+23)+'" fill="none" stroke="#c6958f" stroke-width="3.2" stroke-linecap="round"/>'+
   '<path d="M347 '+(y+4)+' C310 '+(y-9)+' 248 '+y+' 183 '+(y+26)+' M353 '+(y+4)+' C392 '+(y-9)+' 455 '+y+' 527 '+(y+27)+'" fill="none" stroke="#fff2e8" stroke-width="1.1" opacity=".8"/>'+
  '</g>';
 }).join("");
 const marks=Object.entries(C.ELECTRODES).map(([key,p])=>{
  if(!explore)return "";
  const current=selected===key;
  return '<g role="button" tabindex="0" class="atlas-hotspot atlas-electrode" data-lab-electrode="'+key+'" aria-label="Explorar posición '+key+'" data-selected="'+current+'">'+
   '<circle class="atlas-hit" cx="'+p.x+'" cy="'+p.y+'" r="29"/>'+
   '<circle cx="'+p.x+'" cy="'+p.y+'" r="'+(current?18.5:16)+'" fill="'+(current?"#0a4c66":"#fff")+'" stroke="'+(current?"#1d8291":"#2b8793")+'" stroke-width="2.5"/>'+
   '<text x="'+p.x+'" y="'+(p.y+5)+'" font-size="12.8" font-weight="800" text-anchor="middle" fill="'+(current?"#fff":"#0a4c66")+'">'+key+'</text></g>';
 }).join("");
 const pointMark=point?'<g stroke="'+(last?.ok?"#198267":"#bb4a5b")+'" stroke-width="3.5" stroke-linecap="round">'+
 '<path d="M'+(point.x-17)+' '+point.y+'h34M'+point.x+' '+(point.y-17)+'v34"/>'+
 '<circle cx="'+point.x+'" cy="'+point.y+'" r="23" fill="none" stroke-dasharray="4 4"/></g>':"";
 return '<svg data-lab-torso="true" class="lab-figure lab-torso atlas-torso" viewBox="0 0 700 470" role="group" aria-label="Tórax anterior, esternón, costillas e hitos de colocación de V1 a V6. Orientación como si se observara al paciente de frente.">'+
 '<defs><linearGradient id="atlas-skin" x1=".15" y1="0" x2=".88" y2="1"><stop stop-color="#fbebdf"/><stop offset=".48" stop-color="#f2d1c2"/><stop offset="1" stop-color="#e9b5aa"/></linearGradient>'+
 '<radialGradient id="atlas-torso-core" cx=".53" cy=".38" r=".75"><stop stop-color="#fff5e9" stop-opacity=".6"/><stop offset="1" stop-color="#ae817a" stop-opacity=".12"/></radialGradient></defs>'+
 '<rect width="700" height="470" rx="17" fill="#f9fbfb"/>'+
 '<path d="M248 64 C219 79 180 89 137 107 C126 172 117 286 99 440H606C585 297 578 176 566 107C512 91 473 77 446 64L413 77C391 96 376 103 349 104C319 100 297 89 281 75Z" fill="url(#atlas-skin)" stroke="#bd988c" stroke-width="3.2" stroke-linejoin="round"/>'+
 '<path d="M248 64 C219 79 180 89 137 107 C126 172 117 286 99 440H606C585 297 578 176 566 107C512 91 473 77 446 64L413 77C391 96 376 103 349 104C319 100 297 89 281 75Z" fill="url(#atlas-torso-core)"/>'+
 '<path d="M248 77C279 108 317 113 344 125 M456 77C428 104 386 116 361 125" stroke="#c08e84" stroke-width="10" fill="none" stroke-linecap="round" opacity=".68"/>'+
 '<path d="M249 76C277 104 309 107 344 122 M456 76C426 100 389 110 361 122" stroke="#fff1e3" stroke-width="3" fill="none" stroke-linecap="round" opacity=".95"/>'+
 '<path d="M335 117Q350 108 365 117L362 303Q350 317 338 303Z" fill="#f4d2c2" stroke="#c18b83" stroke-width="2.2"/>'+
 '<path d="M341 130V293" stroke="#fff2e7" opacity=".8" stroke-width="2"/>'+
 '<g>'+ribs+'</g>'+
 '<path d="M453 135V399M505 135V399M557 135V399" stroke="#6e9b9c" stroke-dasharray="5 7" opacity=".75" stroke-width="1.8" fill="none"/>'+
 '<path d="M190 241 C235 210 283 216 338 229M363 229C421 213 460 218 525 244" stroke="#d3a9a0" stroke-width="1.5" stroke-dasharray="3 5" fill="none"/>'+
 '<path d="M190 291 C238 261 290 266 338 278M362 278C420 260 470 265 525 292" stroke="#d3a9a0" stroke-width="1.5" stroke-dasharray="3 5" fill="none"/>'+
 '<g class="atlas-torso-labels" font-size="13.2" fill="#3d6170" font-weight="700">'+
 '<text x="25" y="28">DERECHA DEL PACIENTE</text><text x="675" y="28" text-anchor="end">IZQUIERDA DEL PACIENTE</text>'+
 '<text x="354" y="86" text-anchor="middle">Esternón</text>'+
 '<text x="24" y="239">4.º EIC</text><text x="24" y="289">5.º EIC</text>'+
 '<text x="453" y="425" text-anchor="middle">MCL</text><text x="505" y="425" text-anchor="middle">LAA</text><text x="557" y="425" text-anchor="middle">LAM</text>'+
 '<text x="351" y="461" text-anchor="middle" font-weight="500">Referencias de superficie · esquema no a escala</text></g>'+
 marks+pointMark+'</svg>';
}
root.ECGVisualAtlas=Object.freeze({heart,torso,version:"1.0"});
})(typeof window==="undefined"?globalThis:window);