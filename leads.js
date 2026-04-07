const LEAD_MAP = {
  sinus: 'II',
  sinusBrady: 'II',
  sinusTach: 'II',
  atrialEctopic: 'II',
  pac: 'II',
  af: 'II',
  flutter: 'II',
  svt: 'II',
  pvcs: 'V2',
  avBlock1: 'II',
  wenckebach: 'II',
  mobitz2: 'II',
  completeBlock: 'II',
  rbbb: 'V1',
  lbbb: 'V6',
  wpw: 'II',
  vt: 'V1',
  ventEscape: 'V1',
  aivr: 'V1',
  pericarditis: 'II',
  hypoK: 'II',
  asystole: 'II',
  hyperK: 'II',
  stemiAnterior: 'V2'
};

const leadBadge = document.getElementById('leadBadge');
const rhythmSelect = document.getElementById('rhythmSelect');

function updateLeadBadge() {
  if (!leadBadge || !rhythmSelect) return;
  leadBadge.textContent = LEAD_MAP[rhythmSelect.value] || 'II';
}

if (rhythmSelect) {
  rhythmSelect.addEventListener('change', updateLeadBadge);
  requestAnimationFrame(updateLeadBadge);
}
