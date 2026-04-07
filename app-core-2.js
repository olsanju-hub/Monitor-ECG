function sampleRhythm(timeSec){
  const r=window.RHYTHMS[state.rhythmKey];
  const baseHr=r.hr;
  let y=0;
  switch(r.eventMode){
    case 'flat':
      break;
    case 'beat': {
      const d=60/Math.max(1,baseHr);
      y=sampleBeat(timeSec,r.beat,d);
      if(r.base?.fibrillation) y+=Math.sin(timeSec*45)*.018+Math.sin(timeSec*31)*.01;
      if(r.base?.flutter) y+=flutterWave(timeSec,r.base.flutterRate||300)*.06;
      break;
    }
    case 'irregular': {
      const d=irregularBeatDuration(timeSec,baseHr);
      y=sampleBeat(timeSec,r.beat,d);
      y+=Math.sin(timeSec*37)*.015+Math.sin(timeSec*23)*.011;
      break;
    }
    case 'sequence': {
      const bd=60/Math.max(1,baseHr);
      const seq=r.sequence;
      const cycleLen=seq.length*bd;
      const t=((timeSec%cycleLen)+cycleLen)%cycleLen;
      const index=Math.floor(t/bd);
      const type=seq[index];
      const local=t-index*bd;
      if(type==='pvc') y=sampleBeat(local+bd*(1-r.pvcOffset),r.pvcBeat,bd);
      else if(type==='pac') y=sampleBeat(local+bd*(1-r.pacOffset),r.pacBeat,bd);
      else y=sampleBeat(local,r.normalBeat,bd);
      break;
    }
    case 'wenckebach': {
      const bd=60/Math.max(1,baseHr);
      const cycle=r.cycle;
      const cycleLen=cycle.length*bd;
      const t=((timeSec%cycleLen)+cycleLen)%cycleLen;
      const index=Math.floor(t/bd);
      const local=t-index*bd;
      const pr=cycle[index];
      y+=gaussian(local/bd,.18,.08,.1);
      if(pr!==null){
        const beat={...r.beat,pr};
        y+=renderBeatShape((local/bd+pr*.05)%1,beat);
      }
      break;
    }
    case 'mobitz2': {
      const bd=60/Math.max(1,baseHr);
      const cycle=r.cycle;
      const cycleLen=cycle.length*bd;
      const t=((timeSec%cycleLen)+cycleLen)%cycleLen;
      const index=Math.floor(t/bd);
      const local=t-index*bd;
      const conducts=cycle[index];
      y+=gaussian(local/bd,.18,.08,.1);
      if(conducts) y+=renderBeatShape(local/bd,r.beat);
      break;
    }
    case 'completeBlock': {
      const ad=60/r.atrialRate;
      const vd=60/r.ventricularRate;
      const p=(((timeSec%ad)+ad)%ad)/ad;
      const q=(((timeSec%vd)+vd)%vd)/vd;
      y+=gaussian(p,.18,r.atrialBeat.pWidth||.08,r.atrialBeat.pAmp||.1);
      y+=renderBeatShape(q,r.ventricularBeat);
      break;
    }
  }
  return y+Math.sin(timeSec*Math.PI*.45)*.02+randomNoise(.008);
}

function resizeCanvas(){
  const ratio=window.devicePixelRatio||1;
  const rect=canvas.getBoundingClientRect();
  const w=Math.max(1,Math.floor(rect.width));
  const h=Math.max(1,Math.floor(rect.height));
  canvas.width=w*ratio;
  canvas.height=h*ratio;
  ctx.setTransform(ratio,0,0,ratio,0,0);
}

function drawGrid(w,h){
  const small=18;
  const large=small*5;
  ctx.save();
  ctx.lineWidth=1;
  for(let x=0;x<=w;x+=small){
    ctx.strokeStyle=x%large===0?'rgba(85,120,145,0.14)':'rgba(85,120,145,0.06)';
    ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();
  }
  for(let y=0;y<=h;y+=small){
    ctx.strokeStyle=y%large===0?'rgba(85,120,145,0.14)':'rgba(85,120,145,0.06)';
    ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();
  }
  ctx.restore();
}

function drawTrace(w,h){
  const baselineY=h*.52;
  const pxPerSecond=25*8;
  const gainPx=10*8.5;
  ctx.save();
  ctx.beginPath();
  ctx.lineWidth=2.1;
  ctx.strokeStyle='#2fb88b';
  ctx.shadowColor='rgba(47,184,139,0.35)';
  ctx.shadowBlur=8;
  for(let x=0;x<=w;x+=1){
    const age=(w-x)/pxPerSecond;
    const t=state.phase-age;
    const val=sampleRhythm(t);
    const y=clamp(baselineY-val*gainPx,12,h-12);
    if(x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  ctx.stroke();
  ctx.restore();
}

function render(now){
  const rect=canvas.getBoundingClientRect();
  const w=rect.width;
  const h=rect.height;
  const delta=Math.min(.05,(now-state.lastTime)/1000);
  state.lastTime=now;
  state.phase+=delta;
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle='#eef5f7';
  ctx.fillRect(0,0,w,h);
  drawGrid(w,h);
  drawTrace(w,h);
  requestAnimationFrame(render);
}

rhythmSelect.addEventListener('change',e=>setRhythm(e.target.value));
window.addEventListener('resize',resizeCanvas);
populateRhythms();
setRhythm('sinus');
resizeCanvas();
requestAnimationFrame(render);
