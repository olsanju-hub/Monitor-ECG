const state={rhythmKey:'sinus',phase:0,lastTime:performance.now()};
const canvas=document.getElementById('ecgCanvas');
const ctx=canvas.getContext('2d');
const rhythmSelect=document.getElementById('rhythmSelect');
const infoText=document.getElementById('infoText');
const currentRhythmLabel=document.getElementById('currentRhythmLabel');
const leadBadge=document.getElementById('leadBadge');

function populateRhythms(){
  Object.entries(window.RHYTHMS).forEach(([key,r])=>{
    const o=document.createElement('option');
    o.value=key;
    o.textContent=r.label;
    rhythmSelect.appendChild(o);
  });
}

function renderInfo(){
  const r=window.RHYTHMS[state.rhythmKey];
  const bullets=r.description.bullets.map(i=>`<li>${i}</li>`).join('');
  infoText.innerHTML=`<h2>${r.label}</h2><p>${r.description.intro}</p><ul>${bullets}</ul>`;
  currentRhythmLabel.textContent=r.label;
  if(leadBadge) leadBadge.textContent=r.lead||'II';
}

function setRhythm(key){
  state.rhythmKey=key;
  state.phase=0;
  renderInfo();
  rhythmSelect.value=key;
}

const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
const randomNoise=a=>(Math.random()*2-1)*a;
const gaussian=(x,c,w,a)=>{const s=w/2.355;return a*Math.exp(-0.5*((x-c)/s)**2)};

function smoothPlateau(t,start,end,amp){
  const e=.02;
  if(t<start||t>end) return 0;
  if(t<start+e) return amp*((t-start)/e);
  if(t>end-e) return amp*((end-t)/e);
  return amp;
}

function renderBeatShape(t,b){
  let y=0;
  if(b.pAmp) y+=gaussian(t,.18,b.pWidth||.08,b.pAmp);
  if(b.deltaAmp) y+=gaussian(t,.43,.05,b.deltaAmp);
  if(b.qAmp) y+=gaussian(t,.46,b.qWidth||.018,b.qAmp);
  if(b.rAmp) y+=gaussian(t,.50,b.rWidth||.022,b.rAmp);
  if(b.rPrimeAmp) y+=gaussian(t,b.rPrimeCenter||.57,b.rPrimeWidth||.022,b.rPrimeAmp);
  if(b.sAmp) y+=gaussian(t,.535,b.sWidth||.02,b.sAmp);
  if(b.stShift) y+=smoothPlateau(t,.56,.68,b.stShift);
  if(b.tAmp) y+=gaussian(t,.77,b.tWidth||.16,b.tAmp);
  if(b.uAmp) y+=gaussian(t,.90,.07,b.uAmp);
  return y;
}

function sampleBeat(phase,beat,dur){
  const n=(((phase%dur)+dur)%dur)/dur;
  return renderBeatShape(n,beat);
}

function flutterWave(timeSec,rate){
  const hz=rate/60;
  const x=(timeSec*hz)%1;
  return x<.6?x/.6:-(x-.6)/.4;
}

function irregularBeatDuration(timeSec,baseHr){
  const base=60/Math.max(1,baseHr);
  const mod=.22*Math.sin(timeSec*2.1)+.14*Math.sin(timeSec*3.7);
  return Math.max(base*.55,base*(1+mod));
}
