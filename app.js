const RHYTHMS = {
  sinus: {
    label: 'Ritmo sinusal',
    hr: 75,
    description: {
      intro: 'Ritmo sinusal regular con onda P visible antes de cada QRS y complejos estrechos.',
      bullets: ['P antes de cada QRS', 'PR estable', 'QRS estrecho', 'Trazado regular']
    },
    eventMode: 'beat',
    beat: { pAmp: 0.12, qAmp: -0.08, rAmp: 1.0, sAmp: -0.25, tAmp: 0.32, qrsWidth: 0.09, stShift: 0, tWidth: 0.16, pWidth: 0.08, pr: 0.16 }
  },
  sinusBrady: {
    label: 'Bradicardia sinusal', hr: 42,
    description: { intro: 'Morfología sinusal conservada con frecuencia baja.', bullets: ['Ritmo regular', 'P sinusal', 'Frecuencia baja'] },
    eventMode: 'beat', beat: { pAmp: 0.12, qAmp: -0.08, rAmp: 1.0, sAmp: -0.25, tAmp: 0.30, qrsWidth: 0.09, stShift: 0, tWidth: 0.16, pWidth: 0.08, pr: 0.16 }
  },
  sinusTach: {
    label: 'Taquicardia sinusal', hr: 135,
    description: { intro: 'Ritmo sinusal regular con frecuencia alta.', bullets: ['P sinusal', 'Relación 1:1 P-QRS', 'Frecuencia elevada'] },
    eventMode: 'beat', beat: { pAmp: 0.11, qAmp: -0.08, rAmp: 0.95, sAmp: -0.22, tAmp: 0.26, qrsWidth: 0.085, stShift: 0, tWidth: 0.14, pWidth: 0.075, pr: 0.14 }
  },
  af: {
    label: 'Fibrilación auricular', hr: 118,
    description: { intro: 'Ritmo irregularmente irregular sin ondas P organizadas.', bullets: ['Ausencia de P sinusal', 'RR irregular', 'Línea de base fibrilatoria discreta'] },
    eventMode: 'irregular', base: { fibrillation: true }, beat: { pAmp: 0, qAmp: -0.08, rAmp: 0.95, sAmp: -0.25, tAmp: 0.25, qrsWidth: 0.09, stShift: 0, tWidth: 0.15, pWidth: 0, pr: 0 }
  },
  flutter: {
    label: 'Flutter auricular', hr: 150,
    description: { intro: 'Taquicardia regular con actividad auricular en dientes de sierra.', bullets: ['Ondas F repetitivas', 'Respuesta ventricular regular en este ejemplo', 'QRS estrecho'] },
    eventMode: 'beat', base: { flutter: true, flutterRate: 300 }, beat: { pAmp: 0, qAmp: -0.08, rAmp: 0.92, sAmp: -0.22, tAmp: 0.16, qrsWidth: 0.085, stShift: 0, tWidth: 0.12, pWidth: 0, pr: 0 }
  },
  svt: {
    label: 'TSVP', hr: 180,
    description: { intro: 'Taquicardia supraventricular paroxística regular, generalmente de QRS estrecho.', bullets: ['Ritmo regular', 'Frecuencia alta', 'P poco visible o retrógrada'] },
    eventMode: 'beat', beat: { pAmp: 0.02, qAmp: -0.06, rAmp: 0.9, sAmp: -0.20, tAmp: 0.18, qrsWidth: 0.08, stShift: 0, tWidth: 0.11, pWidth: 0.04, pr: 0.06 }
  },
  pvcs: {
    label: 'Extrasístoles ventriculares frecuentes', hr: 78,
    description: { intro: 'Ritmo de base sinusal con latidos ventriculares prematuros anchos e intercalados.', bullets: ['Latidos prematuros anchos', 'Pausa compensadora', 'QRS aberrante en las extrasístoles'] },
    eventMode: 'sequence', sequence: ['normal','normal','pvc','normal','normal','pvc'],
    normalBeat: { pAmp: 0.12, qAmp: -0.08, rAmp: 1.0, sAmp: -0.25, tAmp: 0.30, qrsWidth: 0.09, stShift: 0, tWidth: 0.15, pWidth: 0.08, pr: 0.16 },
    pvcBeat: { pAmp: 0, qAmp: 0, rAmp: 1.25, sAmp: -0.8, tAmp: -0.22, qrsWidth: 0.16, stShift: 0.04, tWidth: 0.18, pWidth: 0, pr: 0 },
    pvcOffset: 0.62
  },
  avBlock1: {
    label: 'Bloqueo AV de primer grado', hr: 68,
    description: { intro: 'Onda P sinusal seguida de QRS, con PR prolongado de manera estable.', bullets: ['PR largo y constante', 'Conducción 1:1', 'QRS habitualmente estrecho'] },
    eventMode: 'beat', beat: { pAmp: 0.12, qAmp: -0.08, rAmp: 0.96, sAmp: -0.24, tAmp: 0.28, qrsWidth: 0.09, stShift: 0, tWidth: 0.15, pWidth: 0.08, pr: 0.28 }
  },
  wenckebach: {
    label: 'Wenckebach (Mobitz I)', hr: 72,
    description: { intro: 'Prolongación progresiva del PR hasta que una onda P no conduce.', bullets: ['PR creciente', 'Latido bloqueado intermitente', 'Patrón cíclico'] },
    eventMode: 'wenckebach', cycle: [0.16, 0.22, 0.28, null], beat: { pAmp: 0.11, qAmp: -0.08, rAmp: 0.95, sAmp: -0.24, tAmp: 0.28, qrsWidth: 0.09, stShift: 0, tWidth: 0.15, pWidth: 0.08, pr: 0.16 }
  },
  completeBlock: {
    label: 'Bloqueo AV completo', hr: 38,
    description: { intro: 'Disociación AV: ondas P y QRS siguen su propio ritmo.', bullets: ['P y QRS sin relación fija', 'Frecuencia ventricular de escape', 'Bradicardia marcada'] },
    eventMode: 'completeBlock', atrialRate: 88, ventricularRate: 38,
    atrialBeat: { pAmp: 0.11, pWidth: 0.08 },
    ventricularBeat: { pAmp: 0, qAmp: 0, rAmp: 1.0, sAmp: -0.58, tAmp: -0.16, qrsWidth: 0.15, stShift: 0.02, tWidth: 0.17, pWidth: 0, pr: 0 }
  },
  vt: {
    label: 'Taquicardia ventricular', hr: 172,
    description: { intro: 'Taquicardia regular de QRS ancho con morfología ventricular.', bullets: ['QRS ancho', 'Frecuencia alta', 'Trazado monomorfo en este ejemplo'] },
    eventMode: 'beat', beat: { pAmp: 0, qAmp: 0, rAmp: 1.25, sAmp: -0.95, tAmp: -0.18, qrsWidth: 0.18, stShift: 0.02, tWidth: 0.14, pWidth: 0, pr: 0 }
  },
  asystole: {
    label: 'Asistolia', hr: 0,
    description: { intro: 'Ausencia de actividad eléctrica organizada en este ejemplo.', bullets: ['Línea prácticamente plana', 'Sin complejos QRS', 'Escenario extremo'] },
    eventMode: 'flat'
  },
  hyperK: {
    label: 'Hiperpotasemia', hr: 62,
    description: { intro: 'Patrón simplificado con ondas T picudas y tendencia al aplanamiento de la P.', bullets: ['T altas y picudas', 'P pequeña', 'Conducción potencialmente enlentecida'] },
    eventMode: 'beat', beat: { pAmp: 0.05, qAmp: -0.06, rAmp: 0.90, sAmp: -0.18, tAmp: 0.56, qrsWidth: 0.10, stShift: 0, tWidth: 0.11, pWidth: 0.05, pr: 0.20 }
  },
  stemiAnterior: {
    label: 'IAM anterior con elevación del ST', hr: 86,
    description: { intro: 'Ejemplo docente de elevación del ST en un contexto de patrón anterior agudo.', bullets: ['Elevación del ST', 'Cambios de repolarización', 'No sustituye ECG real de 12 derivaciones'] },
    eventMode: 'beat', beat: { pAmp: 0.11, qAmp: -0.18, rAmp: 0.78, sAmp: -0.18, tAmp: 0.34, qrsWidth: 0.10, stShift: 0.18, tWidth: 0.17, pWidth: 0.08, pr: 0.16 }
  }
};

const state = {
  rhythmKey: 'sinus',
  heartRate: RHYTHMS.sinus.hr,
  speed: 25,
  gain: 10,
  noise: 0.01,
  baselineWander: true,
  showGrid: true,
  paused: false,
  phase: 0,
  lastTime: performance.now(),
  sampleBuffer: []
};

const canvas = document.getElementById('ecgCanvas');
const ctx = canvas.getContext('2d');
const rhythmSelect = document.getElementById('rhythmSelect');
const heartRateRange = document.getElementById('heartRateRange');
const speedRange = document.getElementById('speedRange');
const gainRange = document.getElementById('gainRange');
const noiseRange = document.getElementById('noiseRange');
const baselineToggle = document.getElementById('baselineToggle');
const gridToggle = document.getElementById('gridToggle');
const pauseBtn = document.getElementById('pauseBtn');
const infoText = document.getElementById('infoText');
const currentRhythmLabel = document.getElementById('currentRhythmLabel');
const heartRateValue = document.getElementById('heartRateValue');
const speedValue = document.getElementById('speedValue');
const gainValue = document.getElementById('gainValue');

function populateRhythms() {
  Object.entries(RHYTHMS).forEach(([key, rhythm]) => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = rhythm.label;
    rhythmSelect.appendChild(option);
  });
}

function renderInfo() {
  const rhythm = RHYTHMS[state.rhythmKey];
  const bullets = rhythm.description.bullets.map(item => `<li>${item}</li>`).join('');
  infoText.innerHTML = `<h2>${rhythm.label}</h2><p>${rhythm.description.intro}</p><ul>${bullets}</ul>`;
  currentRhythmLabel.textContent = rhythm.label;
  heartRateValue.textContent = String(Math.round(state.heartRate));
  speedValue.textContent = String(state.speed);
  gainValue.textContent = String(state.gain);
}

function syncControls() {
  rhythmSelect.value = state.rhythmKey;
  heartRateRange.value = state.heartRate;
  speedRange.value = state.speed;
  gainRange.value = state.gain;
  noiseRange.value = state.noise;
  baselineToggle.checked = state.baselineWander;
  gridToggle.checked = state.showGrid;
}

function setRhythm(key) {
  state.rhythmKey = key;
  state.heartRate = RHYTHMS[key].hr;
  state.phase = 0;
  renderInfo();
  syncControls();
}

function randomNoise(amount) {
  return (Math.random() * 2 - 1) * amount;
}

function gaussian(x, center, width, amplitude) {
  const sigma = width / 2.355;
  return amplitude * Math.exp(-0.5 * ((x - center) / sigma) ** 2);
}

function renderBeatShape(t, beat) {
  let y = 0;
  if (beat.pAmp) y += gaussian(t, 0.18, beat.pWidth || 0.08, beat.pAmp);
  if (beat.qAmp) y += gaussian(t, 0.46, 0.018, beat.qAmp);
  if (beat.rAmp) y += gaussian(t, 0.50, 0.022, beat.rAmp);
  if (beat.sAmp) y += gaussian(t, 0.535, 0.02, beat.sAmp);
  if (beat.stShift) y += smoothPlateau(t, 0.56, 0.68, beat.stShift);
  if (beat.tAmp) y += gaussian(t, 0.77, beat.tWidth || 0.16, beat.tAmp);
  return y;
}

function smoothPlateau(t, start, end, amplitude) {
  const edge = 0.02;
  if (t < start || t > end) return 0;
  if (t < start + edge) return amplitude * ((t - start) / edge);
  if (t > end - edge) return amplitude * ((end - t) / edge);
  return amplitude;
}

function sampleBeat(phase, beat, duration) {
  const normalized = (phase % duration) / duration;
  return renderBeatShape(normalized, beat);
}

function sampleRhythm(timeSec) {
  const rhythm = RHYTHMS[state.rhythmKey];
  const wander = state.baselineWander ? Math.sin(timeSec * Math.PI * 0.45) * 0.025 : 0;
  let y = 0;

  switch (rhythm.eventMode) {
    case 'flat':
      y = 0;
      break;

    case 'beat': {
      const beatDuration = 60 / Math.max(1, state.heartRate);
      y = sampleBeat(timeSec, rhythm.beat, beatDuration);
      if (rhythm.base?.fibrillation) {
        y += Math.sin(timeSec * 45) * 0.018 + Math.sin(timeSec * 31) * 0.01;
      }
      if (rhythm.base?.flutter) {
        y += flutterWave(timeSec, rhythm.base.flutterRate || 300) * 0.06;
      }
      break;
    }

    case 'irregular': {
      const irregularDuration = irregularBeatDuration(timeSec, state.heartRate);
      y = sampleBeat(timeSec, rhythm.beat, irregularDuration);
      y += Math.sin(timeSec * 37) * 0.015 + Math.sin(timeSec * 23) * 0.011;
      break;
    }

    case 'sequence': {
      const baseDuration = 60 / Math.max(1, state.heartRate);
      const seq = rhythm.sequence;
      const cycleLen = seq.length * baseDuration;
      const tInCycle = timeSec % cycleLen;
      const index = Math.floor(tInCycle / baseDuration);
      const type = seq[index];
      const localTime = tInCycle - index * baseDuration;
      if (type === 'pvc') {
        y = sampleBeat(localTime + baseDuration * (1 - rhythm.pvcOffset), rhythm.pvcBeat, baseDuration);
      } else {
        y = sampleBeat(localTime, rhythm.normalBeat, baseDuration);
      }
      break;
    }

    case 'wenckebach': {
      const baseDuration = 60 / Math.max(1, state.heartRate);
      const cycle = rhythm.cycle;
      const cycleLen = cycle.length * baseDuration;
      const tInCycle = timeSec % cycleLen;
      const index = Math.floor(tInCycle / baseDuration);
      const local = tInCycle - index * baseDuration;
      const pr = cycle[index];
      y += gaussian(local / baseDuration, 0.18, 0.08, 0.1);
      if (pr !== null) {
        const beat = { ...rhythm.beat, pr };
        y += renderBeatShape((local / baseDuration + pr * 0.05) % 1, beat);
      }
      break;
    }

    case 'completeBlock': {
      const atrialDuration = 60 / rhythm.atrialRate;
      const ventricularDuration = 60 / rhythm.ventricularRate;
      const pPhase = (timeSec % atrialDuration) / atrialDuration;
      const qrsPhase = (timeSec % ventricularDuration) / ventricularDuration;
      y += gaussian(pPhase, 0.18, rhythm.atrialBeat.pWidth || 0.08, rhythm.atrialBeat.pAmp || 0.1);
      y += renderBeatShape(qrsPhase, rhythm.ventricularBeat);
      break;
    }

    default:
      y = 0;
  }

  y += wander + randomNoise(state.noise);
  return y;
}

function flutterWave(timeSec, atrialRate) {
  const hz = atrialRate / 60;
  const x = (timeSec * hz) % 1;
  return x < 0.6 ? x / 0.6 : -(x - 0.6) / 0.4;
}

function irregularBeatDuration(timeSec, baseHr) {
  const base = 60 / Math.max(1, baseHr);
  const mod = 0.22 * Math.sin(timeSec * 2.1) + 0.14 * Math.sin(timeSec * 3.7);
  return Math.max(base * 0.55, base * (1 + mod));
}

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * ratio;
  canvas.height = rect.height * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function drawGrid(width, height) {
  if (!state.showGrid) return;
  const small = 16;
  const large = small * 5;
  ctx.save();
  for (let x = 0; x <= width; x += small) {
    ctx.strokeStyle = x % large === 0 ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)';
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y <= height; y += small) {
    ctx.strokeStyle = y % large === 0 ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)';
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawTrace(width, height) {
  const baselineY = height * 0.55;
  const pxPerSecond = state.speed * 8;
  const dt = 1 / pxPerSecond;
  const gainPx = state.gain * 12;
  ctx.save();
  ctx.beginPath();
  ctx.lineWidth = 2.2;
  ctx.strokeStyle = '#62f0b3';
  ctx.shadowColor = '#62f0b3';
  ctx.shadowBlur = 10;

  for (let x = 0; x <= width; x += 1) {
    const ageSec = (width - x) / pxPerSecond;
    const sampleTime = state.phase - ageSec;
    const value = sampleRhythm(sampleTime);
    const y = baselineY - value * gainPx;
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, baselineY);
  ctx.lineTo(width, baselineY);
  ctx.stroke();
  ctx.restore();
}

function render(now) {
  const rect = canvas.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;
  const delta = Math.min(0.05, (now - state.lastTime) / 1000);
  state.lastTime = now;
  if (!state.paused) state.phase += delta;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#050a0d';
  ctx.fillRect(0, 0, width, height);
  drawGrid(width, height);
  drawTrace(width, height);
  requestAnimationFrame(render);
}

rhythmSelect.addEventListener('change', (e) => setRhythm(e.target.value));
heartRateRange.addEventListener('input', (e) => {
  state.heartRate = Number(e.target.value);
  heartRateValue.textContent = String(Math.round(state.heartRate));
});
speedRange.addEventListener('input', (e) => {
  state.speed = Number(e.target.value);
  speedValue.textContent = String(state.speed);
});
gainRange.addEventListener('input', (e) => {
  state.gain = Number(e.target.value);
  gainValue.textContent = String(state.gain);
});
noiseRange.addEventListener('input', (e) => { state.noise = Number(e.target.value); });
baselineToggle.addEventListener('change', (e) => { state.baselineWander = e.target.checked; });
gridToggle.addEventListener('change', (e) => { state.showGrid = e.target.checked; });
pauseBtn.addEventListener('click', () => {
  state.paused = !state.paused;
  pauseBtn.textContent = state.paused ? 'Reanudar' : 'Pausar';
  pauseBtn.setAttribute('aria-pressed', String(state.paused));
});

window.addEventListener('resize', resizeCanvas);

populateRhythms();
setRhythm('sinus');
resizeCanvas();
requestAnimationFrame(render);
