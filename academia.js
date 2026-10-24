/* ECG Academia — interfaz y aprendizaje sin dependencias externas.
   El monitor legado permanece accesible como simulación didáctica. */
(function(){
"use strict";
const chapters=window.ECG_CURRICULUM,bank=window.ECG_QUESTIONS;
const KEY="ecg-academia-v1";
const empty=()=>({version:1,visited:{},done:{},attempts:[],practice:{},visualHistory:[],pretest:false,activeTopic:"C1.0",activeChapter:1,seconds:0,started:Date.now(),diagnosticScore:null,history:[]});
let saved;try{saved=JSON.parse(localStorage.getItem(KEY)||"null")}catch(e){saved=null}
let S=saved&&saved.version===1?Object.assign(empty(),saved):empty();
let page="home",quiz=null,measure=[],vectorAngle=55,selectedElectrode="V1",recentFeedback="",placementMode=false,placementIndex=0,placementFeedback="";
const $=id=>document.getElementById(id);
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){console.warn("No se pudo guardar progreso",e)}};
const esc=str=>String(str).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const chapter=n=>chapters[n-1];
const topics=chapters.flatMap(c=>c.topics);
const getTopic=id=>topics.find(t=>t.id===id)||topics[0];
const fmtMin=min=>min>=60?Math.floor(min/60)+" h "+Math.round(min%60)+" min":Math.round(min)+" min";
const countDone=()=>topics.filter(t=>S.done[t.id]).length;
const visitedChapters=()=>new Set(Object.keys(S.visited).map(id=>getTopic(id).chapter));
const attemptsFor=n=>S.attempts.filter(a=>a.chapter===n&&a.mode!=="diagnostic");
function chapterAccuracy(n){const a=attemptsFor(n).slice(-60);return a.length?Math.round(100*a.filter(x=>x.ok).length/a.length):null}
function visualMastery(n){const map={1:["fundamentals",3],2:["conduction",6],3:["vectors",6],5:["placement",6],6:["measurement",4]};if(!map[n])return !!S.practice[n];const [kind,required]=map[n];return new Set((S.visualHistory||[]).filter(x=>x.kind===kind&&x.ok).map(x=>x.taskId)).size>=required}
function mastery(n){const c=chapter(n),done=c.topics.every(t=>S.done[t.id]),a=chapterAccuracy(n);return done&&a!==null&&a>=(n===1?80:85)&&(n!==1||attemptsFor(1).length>=10)&&(![1,2,3,5,6,7,8,9].includes(n)||visualMastery(n))}
function estimate(){
 let remaining=0;
 chapters.forEach(c=>c.topics.forEach(t=>{if(!S.done[t.id]) remaining+=7+(c.number===7||c.number===8?3:0)}));
 const completed=countDone(),total=topics.length;
 const review=Math.max(15,Math.round(remaining*.28));
 const breaks=Math.ceil(remaining/65)*8;
 return {remaining:Math.round(remaining+review+breaks),completed,total,review,breaks};
}
function formatTime(s){const m=Math.floor(s/60);return m>=60?Math.floor(m/60)+" h "+(m%60)+" min":m+" min"}
function statusFor(n){if(mastery(n))return "Dominado";const a=chapterAccuracy(n);if(a!==null&&a<85)return "Necesita refuerzo";if(chapter(n).topics.some(t=>S.done[t.id]))return "En curso";return "Pendiente"}
function icon(name){const paths={heart:'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z',pulse:'M2 12h4l3-6 4 12 3-6h6',book:'M4 19V5a2 2 0 0 1 2-2h14v17H6a2 2 0 0 1-2-1Zm0 0a2 2 0 0 1 2-2h14',activity:'M4 17l6-6 4 4 6-8',clock:'M12 3a9 9 0 1 0 .01 0ZM12 7v5l3 2',award:'m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z'};return '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="'+paths[name]+'"/></svg>'}
function heading(kicker,title,subtitle){return '<div class="section-heading"><p class="eyebrow">'+esc(kicker)+'</p><h1>'+esc(title)+'</h1><p class="subtle">'+esc(subtitle)+'</p></div>'}
function render(){
 document.querySelectorAll('[data-page]').forEach(el=>{const active=el.dataset.page===page;el.classList.toggle("active",active);el.setAttribute("aria-current",active?"page":"false")});
 const m=$("monitorView"),content=$("screen");m.hidden=page!=="monitor";content.hidden=page==="monitor";
 if(page==="home")content.innerHTML=home();
 if(page==="route")content.innerHTML=route();
 if(page==="learn")content.innerHTML=learn();
 if(page==="practice")content.innerHTML=practice();
 if(page==="calculators")content.innerHTML=window.ECGTeachingTools?.calculators()||"<p>No disponible</p>";
 if(page==="progress")content.innerHTML=progress();
 if(page==="quiz")content.innerHTML=quizScreen();
 if(page==="monitor"){if(typeof resizeCanvas==="function")resizeCanvas();}
 document.querySelectorAll("[data-progress]").forEach(el=>{el.style.width=el.dataset.progress+"%"});
 window.scrollTo({top:0,left:0,behavior:"auto"});
 save();
}
function home(){
 const e=estimate(),pct=Math.round(100*e.completed/e.total),last=getTopic(S.activeTopic);
 return '<section class="hero"><div class="hero-copy"><p class="eyebrow">APRENDIZAJE ELECTROCARDIOGRÁFICO · OFFLINE FIRST</p><h1>Comprende el trazado.<br><em>Reconoce el patrón.</em></h1><p>Estudia los diez capítulos del libro, entrena con preguntas acumulativas y analiza ondas en un monitor interactivo.</p><div class="action-row"><button class="btn primary" data-action="'+(S.pretest?"continue":"diagnostic")+'">'+(S.pretest?"Continuar estudio":"Iniciar prueba diagnóstica")+' →</button><button class="btn secondary" data-page="monitor">Abrir monitor</button></div></div><div class="hero-wave">'+waveSvg("hero-wave-svg")+'<div class="wave-caption">ECG · señal ilustrativa en DII</div></div></section>'+
 '<section class="metrics"><article class="metric">'+icon("book")+'<span>Microlecciones</span><strong>'+e.completed+' <small>/ '+e.total+'</small></strong></article><article class="metric">'+icon("clock")+'<span>Estimación pendiente</span><strong>'+fmtMin(e.remaining)+'</strong></article><article class="metric">'+icon("activity")+'<span>Tiempo activo</span><strong>'+formatTime(S.seconds)+'</strong></article><article class="metric">'+icon("award")+'<span>Capítulos dominados</span><strong>'+chapters.filter(c=>mastery(c.number)).length+' <small>/ 10</small></strong></article></section>'+
 '<section class="two-col"><article class="surface"><div class="row-between"><div><p class="eyebrow">TU RUTA</p><h2>Aprendizaje en un día</h2></div><span class="pill">'+pct+' % recorrido</span></div><div class="progress-track"><div class="progress-fill" data-progress="'+pct+'"></div></div><p class="subtle">Tiempo estimado según el currículo pendiente, ejercicios y descansos. Se actualiza con tu avance, no asegura dominio en 24 h.</p><button class="text-link" data-page="route">Ver itinerario completo →</button></article><article class="surface"><p class="eyebrow">PRÓXIMO PASO</p><h2>'+esc(last.title)+'</h2><p>'+esc(last.explanation)+'</p><div class="action-row"><button class="btn primary" data-action="continue">Abrir lección</button><button class="btn secondary" data-action="cumulative">Repaso acumulativo</button></div></article></section>'+
 '<section class="section-gap"><div class="row-between"><h2>Capítulos del libro</h2><button class="text-link" data-page="route">Explorar todos →</button></div><div class="chapter-grid">'+chapters.map(c=>chapterCard(c)).join("")+'</div></section>';
}
function chapterCard(c){
 const n=c.number,done=c.topics.filter(t=>S.done[t.id]).length,pct=Math.round(done/c.topics.length*100);
 return '<button class="chapter-card" data-chapter="'+n+'"><span class="chapter-no">'+String(n).padStart(2,"0")+'</span><strong>'+esc(c.title)+'</strong><span class="muted">'+c.topics.length+' conceptos · '+statusFor(n)+'</span><div class="progress-track small"><div class="progress-fill" data-progress="'+pct+'"></div></div></button>';
}
function route(){
 const e=estimate();
 return heading("RUTA DE ESTUDIO · SEGÚN EL LIBRO","Diez capítulos, ningún atajo","Orden curricular completo con navegación libre. Cada apartado conserva su referencia al capítulo original.")+
 '<div class="surface route-top"><strong>Plan personal</strong><p>'+e.total+' microlecciones · '+fmtMin(e.remaining)+' estimados pendientes (incluye aproximadamente '+fmtMin(e.review)+' de práctica y '+fmtMin(e.breaks)+' de descansos).</p><button class="btn primary" data-action="'+(S.pretest?"continue":"diagnostic")+'">'+(S.pretest?"Seguir aprendiendo":"Realizar diagnóstico inicial")+'</button></div>'+
 chapters.map(c=>'<details class="outline surface" '+(S.activeChapter===c.number?'open':'')+'><summary><span class="chapter-no">'+String(c.number).padStart(2,"0")+'</span><span><strong>'+esc(c.title)+'</strong><small>'+c.topics.filter(t=>S.done[t.id]).length+'/'+c.topics.length+' estudiados · '+statusFor(c.number)+'</small></span><span class="chevron">⌄</span></summary><div class="outline-items">'+c.topics.map((t,i)=>'<button class="topic-row" data-topic="'+t.id+'"><span class="topic-index">'+(i+1)+'.</span><span>'+esc(t.title)+'</span><span class="topic-status">'+(S.done[t.id]?"✓":"→")+'</span></button>').join("")+'<button class="text-link outline-exam" data-test-chapter="'+c.number+'">Evaluación del capítulo →</button></div></details>').join("");
}
function learn(){
 const t=getTopic(S.activeTopic),c=chapter(t.chapter),index=c.topics.findIndex(x=>x.id===t.id),globalIdx=topics.findIndex(x=>x.id===t.id);
 S.visited[t.id]=true;S.activeChapter=t.chapter;
 if(t.chapter===1)window.ECGChapter1?.setTopic(t.id);
 return '<div class="lesson-head"><button class="text-link" data-page="route">← Índice del libro</button><span class="pill">Capítulo '+t.chapter+' · '+(index+1)+'/'+c.topics.length+'</span></div>'+
 heading(c.title,t.title,"Microlección "+(globalIdx+1)+" de "+topics.length+" · "+(t.chapter===1?"Lección ampliada con herramientas y ejercicios prácticos":"Contenido docente redactado a partir del temario del libro"))+
 '<div class="lesson-layout"><div class="lesson-main"><section class="surface lesson-intro"><div class="tag">COMPRENDER</div><p class="lead-paragraph">'+esc(t.explanation)+'</p><div class="takeaway"><strong>Clave para interpretar</strong><p>'+esc(t.takeaway)+'</p></div></section>'+
 (t.chapter===1?window.ECGChapter1.render(t.id):'')+
 ([2,3,5,6].includes(t.chapter)?'<section class="surface diagram-card">'+visual(t)+'</section>':'')+
 (t.id==='C7.3'?window.ECGTeachingTools.axis():'')+
 (t.id==='C7.1'||t.id==='C6.5'?'<div class="surface"><h2>Entrena con números reales</h2><p>Convierte lo aprendido en una operación comprobable. La calculadora explica tanto el resultado como sus límites.</p><button class="btn primary" data-action="open-calculators">Abrir calculadoras educativas →</button></div>':'')+
 (t.chapter===1?'':'<section class="surface"><h2>Aplicación práctica</h2><p>'+esc(t.takeaway)+' Comprueba la escala, el contexto clínico y la calidad técnica antes de establecer conclusiones.</p><details class="deep-dive"><summary>Entender mejor <span>+</span></summary><p>'+esc(t.explanation)+' Busca una segunda derivación o un ECG previo cuando la morfología sea equívoca. Una alteración aislada no siempre permite un diagnóstico definitivo.</p></details></section>')+
 '<div class="lesson-actions"><button class="btn secondary" data-action="prev-topic" '+(globalIdx===0?'disabled':'')+'>← Anterior</button><button class="btn primary" data-action="mark-topic">'+(S.done[t.id]?"Estudiado ✓":"Marcar estudiado y avanzar")+'</button><button class="btn secondary" data-action="next-topic" '+(globalIdx===topics.length-1?'disabled':'')+'>Siguiente →</button></div></div>'+
 '<aside class="lesson-aside"><div class="surface sticky-box"><p class="eyebrow">EN ESTE CAPÍTULO</p><h3>'+esc(c.title)+'</h3>'+c.topics.map(x=>'<button class="side-topic '+(x.id===t.id?'active':'')+'" data-topic="'+x.id+'"><span>'+esc(x.title)+'</span><span>'+(S.done[x.id]?'✓':'')+'</span></button>').join("")+'<button class="btn secondary full" data-test-chapter="'+c.number+'">Test del capítulo</button></div></aside></div>';
}
function practice(){
 const labs=[
 ["conduction","Sistema de conducción","Identifica estructuras, conecta el impulso con las ondas P, PR y QRS.","heart"],
 ["vectors","Vectores eléctricos","Predice la polaridad en las derivaciones frontales.","activity"],
 ["placement","Colocación V1–V6","Sitúa los electrodos sin etiquetas y corrige errores anatómicos.","heart"],
 ["measurement","Mediciones ECG","Mide RR, PR, QRS y QT con cursores táctiles.","clock"]
 ];
 return heading("ENTRENAMIENTO","Practica hasta comprender","Las imágenes enseñan y evalúan habilidades concretas: misma funcionalidad en móvil y ordenador.")+
 '<div class="practice-grid">'+labs.map(([type,title,desc,ico])=>'<article class="surface option-card"><span class="large-icon">'+icon(ico)+'</span><h2>'+esc(title)+'</h2><p>'+esc(desc)+'</p><button class="btn primary" data-action="lab-'+type+'">Practicar</button></article>').join("")+
 '<article class="surface option-card"><span class="large-icon">'+icon("book")+'</span><h2>Test por capítulo</h2><p>Preguntas y corrección razonada.</p><label for="chapterTest" class="small-label">Capítulo</label><select id="chapterTest">'+chapters.map(ch=>'<option value="'+ch.number+'" '+(ch.number===S.activeChapter?'selected':'')+'>'+ch.number+' · '+esc(ch.title)+'</option>').join("")+'</select><button class="btn secondary" data-action="chapter-test">Iniciar test</button></article>'+
 '<article class="surface option-card"><span class="large-icon">'+icon("award")+'</span><h2>Repaso acumulativo</h2><p>Examen final y repetición prioritaria de errores.</p><div class="action-row"><button class="btn secondary" data-action="cumulative">Repasar</button><button class="btn secondary" data-action="final">Examen</button></div></article></div>'+
 '<section class="surface section-gap"><p class="eyebrow">CÁLCULO Y RAZONAMIENTO</p><h2>Del papel ECG a la decisión</h2><p>Aprende a estimar el eje eléctrico, la frecuencia y el QT corregido; interpreta los signos antes de usar los números.</p><div class="action-row"><button class="btn primary" data-action="open-axis">Eje eléctrico: lección y seis casos →</button><button class="btn secondary" data-action="open-calculators">Frecuencia y QTc</button></div></section>'+
 '<section class="surface section-gap"><h2>Reconocimiento de arritmias</h2><p>Utiliza los retos del monitor docente para comparar trazados sintéticos y reconocer sus limitaciones.</p><button class="btn secondary" data-page="monitor">Abrir monitor →</button></section>';
}
function progress(){
 const e=estimate(),pct=Math.round(100*e.completed/e.total);
 return heading("SEGUIMIENTO","Tu aprendizaje","Datos guardados en este navegador. Puedes exportar una copia y reiniciar en cualquier momento.")+
 '<section class="metrics"><article class="metric"><span>Microlecciones estudiadas</span><strong>'+e.completed+' / '+e.total+'</strong></article><article class="metric"><span>Dominio acreditado</span><strong>'+chapters.filter(c=>mastery(c.number)).length+' / 10</strong></article><article class="metric"><span>Respuestas registradas</span><strong>'+S.attempts.length+'</strong></article><article class="metric"><span>Tiempo de estudio</span><strong>'+formatTime(S.seconds)+'</strong></article></section>'+
 '<section class="surface section-gap"><h2>Auditoría del temario</h2><p>El porcentaje de recorrido mide las microlecciones marcadas. El dominio requiere ≥85 % y, para capítulos prácticos, la competencia evaluada. Esta auditoría NO demuestra una validación página por página del PDF original.</p><div class="progress-track"><div class="progress-fill" data-progress="'+pct+'"></div></div><p class="subtle">'+pct+' % recorrido · '+bank.length+' preguntas distribuidas entre '+topics.length+' microlecciones</p><div class="progress-list">'+chapters.map(c=>{const a=chapterAccuracy(c.number),v=c.topics.filter(t=>S.done[t.id]).length;return '<div class="progress-row"><strong>'+c.number+'. '+esc(c.title)+'</strong><span>'+v+'/'+c.topics.length+' lecciones</span><span>'+(a===null?'Sin evaluación':a+' %')+'</span><span>'+statusFor(c.number)+'</span><button class="text-link" data-test-chapter="'+c.number+'">Practicar</button></div>'}).join("")+'</div></section>'+
 '<section class="surface section-gap"><h2>Datos y reinicio</h2><p class="subtle">El progreso es local, no se sincroniza entre dispositivos. Exporta antes de cambiar de navegador o eliminar datos.</p><div class="action-row"><button class="btn secondary" data-action="export">Exportar JSON</button><button class="btn secondary" data-action="import">Importar JSON</button><button class="btn secondary" data-action="reset-chapter">Reiniciar capítulo actual</button><button class="btn danger" data-action="reset-all">Reiniciar todo</button></div></section>'+
 '<section class="surface section-gap"><h2>Fuentes y límites</h2><p>Temario: <em>Aprenda ECG en un día: Un enfoque sistemático</em> (edición española 2014). Texto docente original. Correcciones orientadas a ESC SCA 2023, ESC FA 2024 y Definición universal de IAM 2018. Los trazados son esquemas docentes generados, no señales clínicas obtenidas de pacientes ni certificados diagnósticamente.</p><p>La evaluación clínica y la comprobación integral del temario requieren revisión editorial adicional.</p><p>Instalación en iPhone: abre la aplicación con Safari y utiliza Compartir → Añadir a pantalla de inicio. La instalación offline necesita completar primero la descarga inicial conectada.</p><p id="offlineStatus" class="subtle">Estado sin conexión: recursos locales tras instalación, sujeto a comprobación.</p></section>';
}
function questionPool(mode,n){
 const keys=bank.filter(q=>mode==="chapter"?q.chapter===n:mode==="diagnostic"||mode==="final"?true:q.chapter<=Math.max(S.activeChapter,...Array.from(visitedChapters()),1));
 if(mode==="diagnostic"){const picks=[];for(let i=1;i<=10;i++){const a=keys.filter(q=>q.chapter===i);if(a.length)picks.push(a[Math.floor(a.length/2)])}return picks.concat(keys.filter(q=>!picks.includes(q)).slice(0,2))}
 if(mode==="chapter")return shuffled(keys).slice(0,Math.min(12,keys.length));
 if(mode==="final")return shuffled(keys).slice(0,Math.min(30,keys.length));
 const wrongCounts={};S.attempts.filter(a=>!a.ok).forEach(a=>{wrongCounts[a.id]=(wrongCounts[a.id]||0)+1});
 const weighted=keys.slice().sort((a,b)=>(wrongCounts[b.id]||0)-(wrongCounts[a.id]||0));
 return weighted.slice(0,Math.min(5,weighted.length)).concat(shuffled(weighted.slice(5)).slice(0,Math.min(7,weighted.length-5)));
}
function shuffled(a){return a.slice().sort(()=>Math.random()-.5)}
function startQuiz(mode,n){
 const pool=questionPool(mode,n),order=pool.map(q=>shuffled([0,1,2,3]));
 quiz={mode,n,questions:pool,index:0,answers:[],order,chosen:null,feedback:false};
 page="quiz";render();
}
function quizScreen(){
 if(!quiz)return heading("TEST","Sin evaluación activa","Selecciona una modalidad desde Practicar.");
 const q=quiz.questions[quiz.index];
 if(!q)return resultsScreen();
 const labels={diagnostic:"DIAGNÓSTICO INICIAL",chapter:"EVALUACIÓN DE CAPÍTULO",cumulative:"REPASO ACUMULATIVO",final:"EXAMEN FINAL"};
 const chosen=quiz.chosen,opts=quiz.order[quiz.index];
 return '<div class="quiz-wrap"><div class="row-between"><p class="eyebrow">'+labels[quiz.mode]+'</p><span class="pill">Pregunta '+(quiz.index+1)+' / '+quiz.questions.length+'</span></div><div class="progress-track"><div class="progress-fill" data-progress="'+(100*quiz.index/quiz.questions.length)+'"></div></div>'+
 '<article class="surface quiz-panel"><p class="eyebrow">CAPÍTULO '+q.chapter+' · '+esc(getTopic(q.topic).title)+'</p><h2>'+esc(q.question)+'</h2><div class="answer-grid">'+opts.map((original,i)=>'<button class="answer '+(chosen!==null?(original===0?'answer-good':original===chosen?'answer-bad':''):'')+'" data-choice="'+original+'" '+(chosen!==null?'disabled':'')+'><span class="answer-letter">'+String.fromCharCode(65+i)+'</span>'+esc(q.choices[original])+'</button>').join("")+'</div>'+
 (chosen!==null?'<div class="quiz-feedback '+(chosen===0?'good':'bad')+'"><strong>'+(chosen===0?'Respuesta correcta':'Respuesta incorrecta')+'</strong><p>'+esc(q.reason)+'</p><p class="subtle">Solución: '+esc(q.choices[0])+'</p></div><button class="btn primary" data-action="next-question">'+(quiz.index===quiz.questions.length-1?"Ver resultados":"Siguiente pregunta →")+'</button>':'<p class="subtle">Elige una respuesta. Cada pregunta tiene una única respuesta correcta.</p>')+'</article><button class="text-link" data-action="abort-quiz">Salir de la evaluación</button></div>';
}
function resultsScreen(){
 const score=quiz.answers.filter(a=>a).length,all=quiz.questions.length,pct=Math.round(100*score/all);
 const next=quiz.mode==="diagnostic"?"Empezar ruta":"Volver a práctica";
 return '<section class="result-card surface"><span class="result-ring">'+pct+'%</span><p class="eyebrow">EVALUACIÓN TERMINADA</p><h1>'+score+' de '+all+' aciertos</h1><p>'+(pct>=85?"Buen rendimiento en esta evaluación.":"Repasa las microlecciones correspondientes a los errores antes de repetir.")+'</p><p class="subtle">La cifra no equivale automáticamente a competencia clínica; para marcar dominio se exige completar el capítulo y las prácticas pertinentes.</p><div class="action-row"><button class="btn primary" data-action="finish-quiz">'+next+'</button><button class="btn secondary" data-action="retry-quiz">Repetir evaluación</button></div></section>';
}
function gaussian(x,m,s){const z=(x-m)/s;return Math.exp(-0.5*z*z)}
function waveform(t,rr){
 let y=0;for(let k=-1;k<9;k++){const r=.42+k*rr;y+=.14*gaussian(t,r-.19,.026)-.08*gaussian(t,r-.028,.009)+1.05*gaussian(t,r,.010)-.24*gaussian(t,r+.028,.012)+.31*gaussian(t,r+.27,.075)}return y;
}
function waveSvg(id){
 const path=[];for(let x=0;x<=1000;x+=2){const y=160-80*waveform(x/200,.8);path.push((x===0?"M":"L")+x.toFixed(1)+","+y.toFixed(2))}
 return '<div class="ecg-svg-wrap"><svg id="'+id+'" class="ecg-svg" viewBox="0 0 1000 310" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tira electrocardiográfica esquemática; cuadrícula de 25 mm por segundo" '+(id==="measure-wave"?'data-measure="true"':'')+'><defs><pattern id="'+id+'-s" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M8 0H0V8" fill="none" stroke="#e7a5ae" stroke-width=".55"/></pattern><pattern id="'+id+'-l" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="url(#'+id+'-s)"/><path d="M40 0H0V40" fill="none" stroke="#d0788d" stroke-width="1.05"/></pattern></defs><rect width="1000" height="310" fill="#fffaf9"/><rect width="1000" height="310" fill="url(#'+id+'-l)"/><path d="'+path.join(" ")+'" fill="none" stroke="#073a50" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/><text x="18" y="295" font-size="17" fill="#4f6b7a">DII · 25 mm/s · 10 mm/mV · esquema docente</text><g id="measureOverlay"></g></svg></div>';
}
function heartSvg(){
 return '<div class="diagram-note">Pulsa una estructura de conducción para identificarla. Diagrama docente original, no una reproducción anatómica a escala.</div><svg class="heart-svg" viewBox="0 0 660 420" role="img" aria-label="Corazón esquemático, cuatro cavidades y sistema de conducción"><defs><linearGradient id="chambers" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e58e95"/><stop offset="1" stop-color="#a74660"/></linearGradient></defs><path d="M280 81Q178 36 150 139Q135 239 246 333L332 397Q413 330 471 236Q521 130 440 84Q387 52 333 108Q308 78 280 81Z" fill="#f1c7c5" stroke="#863d51" stroke-width="5"/><path d="M200 141Q187 108 231 106Q288 107 295 180Q295 235 253 250Q194 230 200 141Z" fill="#e68d95" stroke="#a8586b" stroke-width="3"/><path d="M363 113Q408 83 450 141Q469 208 424 238Q382 239 366 197Z" fill="#dd8391" stroke="#a8586b" stroke-width="3"/><path d="M222 264Q244 237 294 246Q325 281 321 354L252 321Z" fill="url(#chambers)" stroke="#873d51" stroke-width="3"/><path d="M343 253Q372 215 429 243Q416 318 345 366Z" fill="url(#chambers)" stroke="#873d51" stroke-width="3"/><path d="M323 167Q333 225 332 357" stroke="#94384b" stroke-width="5" fill="none"/><path d="M365 113Q338 60 354 10M386 111Q395 69 423 31" stroke="#b75563" stroke-width="22" stroke-linecap="round" fill="none"/><path d="M243 155Q279 191 316 203L331 256L300 319M331 256L360 315M331 256L390 288" fill="none" stroke="#0d7580" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path class="conducting" d="M243 155Q279 191 316 203L331 256L300 319M331 256L360 315M331 256L390 288" fill="none" stroke="#c4ecb5" stroke-width="3" stroke-dasharray="12 16"/><circle data-structure="Nodo SA" cx="243" cy="155" r="12" fill="#f9d961" stroke="#ae8335" stroke-width="3"/><circle data-structure="Nodo AV" cx="316" cy="203" r="11" fill="#f9d961" stroke="#ae8335" stroke-width="3"/><g font-size="17" fill="#183c50" font-weight="600"><text x="45" y="111">Aurícula derecha</text><text x="461" y="106">Aurícula izquierda</text><text x="50" y="291">Ventrículo derecho</text><text x="457" y="302">Ventrículo izquierdo</text><text x="50" y="162">Nodo SA</text><text x="457" y="209">Nodo AV</text><text x="457" y="246">His / ramas</text></g><g stroke="#5f7e88" stroke-width="1.8" fill="none"><path d="M197 120L145 114M425 121L463 110M251 277L205 287M420 281L457 293M231 157L148 157M329 201L456 203M333 255L456 243"/></g></svg><p id="diagramFeedback" class="feedback-compact">Secuencia: nodo SA → aurículas → nodo AV → His → ramas → Purkinje.</p>';
}
function vectorSvg(){
 const a=vectorAngle*Math.PI/180,x=295+175*Math.cos(a),y=180-175*Math.sin(a);
 return '<div class="diagram-note">Mueve el control para modificar la dirección del vector y su proyección positiva/negativa sobre la derivación I.</div><svg class="vector-svg" viewBox="0 0 600 350" role="img" aria-label="Proyección interactiva del vector sobre una derivación"><circle cx="295" cy="180" r="145" fill="#edf5f3" stroke="#d7e3e5" stroke-width="2"/><path d="M90 180H505" stroke="#677b89" stroke-width="2"/><path d="M295 325V35" stroke="#c2ced3" stroke-width="2" stroke-dasharray="5 7"/><path d="M295 180L'+x+' '+y+'" stroke="#0d7484" stroke-width="8" stroke-linecap="round"/><circle cx="'+x+'" cy="'+y+'" r="12" fill="#0d7484"/><text x="90" y="158" fill="#526877">−</text><text x="498" y="158" fill="#526877">+</text><text x="320" y="325" fill="#496273" font-size="19">Proyección en I: '+Math.cos(a).toFixed(2)+'</text></svg><label class="slider-label">Ángulo: <strong id="angleLabel">'+vectorAngle+'°</strong><input type="range" min="-180" max="180" value="'+vectorAngle+'" id="vectorSlider" aria-label="Ángulo del vector"/></label>';
}
function placementSvg(){
 const spots=[["V1",288,174],["V2",328,174],["V3",363,215],["V4",395,259],["V5",443,259],["V6",491,259]];
 const description={"V1":"4.º espacio intercostal, borde esternal derecho.","V2":"4.º espacio intercostal, borde esternal izquierdo.","V3":"Entre V2 y V4.","V4":"5.º espacio intercostal, línea medioclavicular izquierda.","V5":"Línea axilar anterior a la altura de V4.","V6":"Línea axilar media a la altura de V4."};
 const notice=placementMode
 ?'<div class="diagram-note"><strong>Coloca '+spots[placementIndex][0]+'</strong> tocando la posición correcta sobre el tórax. Los puntos y etiquetas están ocultos durante la prueba.</div>'
 :'<div class="diagram-note">Selecciona V1–V6 para estudiar su posición anatómica. En Practicar puedes evaluar tu memoria sin marcadores.</div>';
 const chips=placementMode?'':'<div class="electrode-choices">'+spots.map(s=>'<button class="chip '+(selectedElectrode===s[0]?'active':'')+'" data-electrode="'+s[0]+'">'+s[0]+'</button>').join("")+'</div>';
 const base='<svg class="torso-svg" '+(placementMode?'data-placement-zone="true" style="cursor:crosshair;touch-action:manipulation"':'')+' viewBox="0 0 750 390" role="img" aria-label="Tórax frontal esquemático con referencias esternales e intercostales"><path d="M245 35Q211 78 133 99L95 359H643L606 99Q520 81 478 37L434 35Q407 82 363 83Q318 83 288 35Z" fill="#f2d9d0" stroke="#b68882" stroke-width="4"/><path d="M364 82V340" stroke="#9f7c7b" stroke-width="5"/><path d="M196 128Q288 170 357 118M370 118Q450 172 546 128" fill="none" stroke="#cbaba5" stroke-width="3"/>'+
 [132,171,210,249,288].map(y=>'<path d="M199 '+y+'Q282 '+(y+15)+' 353 '+y+'M371 '+y+'Q451 '+(y+15)+' 544 '+y+'" fill="none" stroke="#e7c3bb" stroke-width="2"/>').join("");
 const points=placementMode?'':spots.map(s=>'<circle data-electrode="'+s[0]+'" cx="'+s[1]+'" cy="'+s[2]+'" r="'+(selectedElectrode===s[0]?20:15)+'" fill="'+(selectedElectrode===s[0]?'#0d7887':'#ffffff')+'" stroke="#0d7887" stroke-width="3"/><text x="'+s[1]+'" y="'+(s[2]+5)+'" font-size="13" text-anchor="middle" fill="'+(selectedElectrode===s[0]?'white':'#0d7887')+'" font-weight="700">'+s[0]+'</text>').join("");
 return notice+chips+base+points+'</svg><p class="feedback-compact">'+esc(placementMode?(placementFeedback||"Toca el lugar donde colocarías el electrodo solicitado."):description[selectedElectrode])+'</p>';
}
function visual(t){return window.ECGVisualLab?.render(t.chapter)||""}
function onAction(action){
 switch(action){
 case "diagnostic":startQuiz("diagnostic");break;
 case "continue":page="learn";render();break;
 case "cumulative":startQuiz("cumulative");break;
 case "final":startQuiz("final");break;
 case "chapter-test":startQuiz("chapter",Number($("chapterTest")?.value||S.activeChapter));break;
 case "open-axis":S.activeTopic="C7.3";S.activeChapter=7;page="learn";render();break;
 case "open-calculators":page="calculators";render();break;
 case "lab-conduction":case "lab-vectors":case "lab-placement":case "lab-measurement":{
  const type=action.slice(4),number={conduction:2,vectors:3,placement:5,measurement:6}[type];
  window.ECGVisualLab?.prepare(type,"practice");
  S.activeTopic=chapter(number).topics[0].id;S.activeChapter=number;page="learn";render();break;
 }
 case "placement":placementMode=true;placementIndex=0;placementFeedback="";S.activeTopic="C5.1";page="learn";render();break;
 case "measurement":page="practice";render();setTimeout(()=>{const el=$("measure-wave");el?.scrollIntoView({block:"center",behavior:"smooth"})},80);break;
 case "clear-measure":measure=[];recentFeedback="";render();break;
 case "prev-topic":case "next-topic":{const i=topics.findIndex(t=>t.id===S.activeTopic);S.activeTopic=topics[Math.max(0,Math.min(topics.length-1,i+(action==="next-topic"?1:-1)))].id;page="learn";render();break}
 case "mark-topic":{S.done[S.activeTopic]=true;const i=topics.findIndex(t=>t.id===S.activeTopic);if(i<topics.length-1)S.activeTopic=topics[i+1].id;page="learn";render();break}
 case "next-question":quiz.chosen=null;quiz.index++;render();break;
 case "abort-quiz":quiz=null;page="practice";render();break;
 case "finish-quiz":if(quiz?.mode==="diagnostic"){S.pretest=true;S.diagnosticScore=Math.round(100*quiz.answers.filter(a=>a).length/quiz.answers.length);page="learn"}else page="practice";quiz=null;render();break;
 case "retry-quiz":startQuiz(quiz.mode,quiz.n);break;
 case "export":exportData();break;
 case "import":$("importFile").click();break;
 case "reset-chapter":{const n=S.activeChapter; if(confirm("¿Reiniciar el capítulo "+n+"? Se borrarán sus respuestas, prácticas y progreso.")){chapter(n).topics.forEach(t=>{delete S.done[t.id];delete S.visited[t.id]});S.attempts=S.attempts.filter(a=>a.chapter!==n);delete S.practice[n];S.visualHistory=(S.visualHistory||[]).filter(h=>h.chapter!==n);save();render()}break}
 case "reset-all":if(confirm("¿Eliminar TODO tu progreso local de ECG? Esta acción no se puede deshacer. Exporta primero una copia.")){S=empty();save();page="home";render()}break;
 }
}
function exportData(){const b=new Blob([JSON.stringify(S,null,2)],{type:"application/json"}),url=URL.createObjectURL(b),a=document.createElement("a");a.href=url;a.download="ecg-progreso-"+new Date().toISOString().slice(0,10)+".json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
$("importFile").addEventListener("change",async e=>{const file=e.target.files[0];if(!file)return;try{const v=JSON.parse(await file.text());if(v.version!==1||!v.done||!Array.isArray(v.attempts)||!v.visited)throw Error("Formato de progreso no válido");if(confirm("¿Sustituir el progreso actual por el archivo importado?")){S=Object.assign(empty(),v);save();page="progress";render()}}catch(err){alert("No se ha podido importar: "+err.message)}e.target.value=""});
document.body.addEventListener("click",e=>{
 const target=e.target.closest("[data-page],[data-chapter],[data-topic],[data-test-chapter],[data-choice],[data-action],[data-electrode],[data-structure],[data-measure],[data-placement-zone]");
 if(!target)return;
 if(target.dataset.page){page=target.dataset.page;render();return}
 if(target.dataset.chapter){S.activeChapter=Number(target.dataset.chapter);S.activeTopic=chapter(S.activeChapter).topics[0].id;page="learn";render();return}
 if(target.dataset.topic){S.activeTopic=target.dataset.topic;page="learn";render();return}
 if(target.dataset.testChapter){startQuiz("chapter",Number(target.dataset.testChapter));return}
 if(target.dataset.action){onAction(target.dataset.action);return}
 if(target.dataset.electrode){selectedElectrode=target.dataset.electrode;if(page==="learn")render();return}
 if(target.dataset.structure){$("diagramFeedback").textContent=target.dataset.structure+": estructura señalada en el sistema de conducción.";return}
 if(target.dataset.choice!==undefined&&quiz&&quiz.chosen===null){
 const original=Number(target.dataset.choice),q=quiz.questions[quiz.index],ok=original===q.correct;quiz.chosen=original;quiz.answers.push(ok);
 S.attempts.push({id:q.id,chapter:q.chapter,topic:q.topic,ok,mode:quiz.mode,ts:Date.now()});
 // Acertar ABCD no acredita una competencia práctica.
 if(S.attempts.length>2000)S.attempts=S.attempts.slice(-2000);
 save();render();return;
 }

});
document.body.addEventListener("input",e=>{if(e.target.id==="vectorSlider"){
 vectorAngle=Number(e.target.value);const a=vectorAngle*Math.PI/180,x=295+175*Math.cos(a),y=180-175*Math.sin(a);
 const p=document.querySelector('.vector-svg path[stroke="#0d7484"]');
 const dot=document.querySelector('.vector-svg circle[fill="#0d7484"]');
 const label=document.getElementById("angleLabel");
 if(p)p.setAttribute("d","M295 180L"+x+" "+y);
 if(dot){dot.setAttribute("cx",x);dot.setAttribute("cy",y);}
 if(label)label.textContent=vectorAngle+"°";
 const svg=document.querySelector(".vector-svg"),txt=svg?.querySelectorAll("text");
 if(txt&&txt.length)txt[txt.length-1].textContent="Proyección en I: "+Math.cos(a).toFixed(2);
 }});
window.ECG_recordVisualExercise=({chapter,kind,taskId,ok,reason})=>{
 if(!Array.isArray(S.visualHistory))S.visualHistory=[];
 S.visualHistory.push({chapter,kind,taskId,ok,reason,ts:Date.now()});
 if(S.visualHistory.length>600)S.visualHistory=S.visualHistory.slice(-600);
 const required={fundamentals:3,conduction:6,vectors:6,placement:6,measurement:4};
 const unique=new Set(S.visualHistory.filter(a=>a.kind===kind&&a.ok).map(a=>a.taskId));
 if(unique.size>=required[kind])S.practice[chapter]=true;
 save();
};
window.ECG_markPractice=(chapterNumber)=>{if([5,6,7,8,9].includes(chapterNumber)){S.practice[chapterNumber]=true;save();}};
document.addEventListener("visibilitychange",()=>{if(document.hidden)save()});
let lastInteraction=Date.now();
document.addEventListener("pointerdown",()=>lastInteraction=Date.now(),{passive:true});
document.addEventListener("keydown",()=>lastInteraction=Date.now());
setInterval(()=>{if(!document.hidden&&S.pretest&&Date.now()-lastInteraction<60000){S.seconds+=15;save()}},15000);
function updateOfflineStatus(){
 const indicator=$("connectionIndicator"),info=$("offlineStatus");
 const online=navigator.onLine!==false;
 const set=(ready)=>{
   const message=ready?(online?"Listo para usar offline":"Sin conexión · disponible"):online?"En línea":"Sin conexión · sin caché verificada";
   if(indicator)indicator.textContent="● "+message;
   if(info)info.textContent=ready?"Los recursos educativos principales ya están guardados para utilizarse sin conexión en este navegador.":"El modo offline requiere instalar el service worker y completar la carga inicial conectada.";
 };
 if(typeof caches==="undefined"){set(false);return;}
 caches.keys().then(keys=>set(keys.some(k=>k.startsWith("ecg-academia-v9-")))).catch(()=>set(false));
}
if("serviceWorker" in navigator)window.addEventListener("load",()=>{
 navigator.serviceWorker.register("./sw.js").then(()=>navigator.serviceWorker.ready).then(updateOfflineStatus).catch(updateOfflineStatus);
});
window.addEventListener("online",updateOfflineStatus);
window.addEventListener("offline",updateOfflineStatus);
render();
updateOfflineStatus();
})();