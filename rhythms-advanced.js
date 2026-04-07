window.RHYTHMS_ADV = {
  brugada: {
    label: 'Patrón de Brugada',
    lead: 'V1',
    hr: 74,
    description: {
      intro: 'Patrón docente con elevación del ST en precordiales derechas y T negativa terminal.',
      bullets: ['V1-V2 orientativo', 'ST elevado', 'T negativa terminal']
    },
    eventMode: 'beat',
    beat: { pAmp: 0.08, qAmp: 0, rAmp: 0.88, sAmp: -0.55, qrsWidth: 0.13, stShift: 0.20, tAmp: -0.12, tWidth: 0.13, pWidth: 0.08, pr: 0.16 }
  },
  longQT: {
    label: 'QT largo',
    lead: 'II',
    hr: 62,
    description: {
      intro: 'Patrón docente con repolarización prolongada y alargamiento del QT.',
      bullets: ['QT prolongado', 'T tardía', 'Riesgo arrítmico']
    },
    eventMode: 'beat',
    beat: { pAmp: 0.10, qAmp: -0.06, rAmp: 0.96, sAmp: -0.20, qrsWidth: 0.09, stShift: 0.02, tAmp: 0.20, tWidth: 0.26, pWidth: 0.08, pr: 0.16 }
  },
  paced: {
    label: 'Ritmo de marcapasos',
    lead: 'V1',
    hr: 70,
    description: {
      intro: 'Patrón docente con espiga de marcapasos y QRS ancho estimulado.',
      bullets: ['Espiga previa', 'QRS ancho', 'Captura ventricular']
    },
    eventMode: 'beat',
    beat: { spikeAmp: 0.9, pAmp: 0, qAmp: 0, rAmp: 1.05, sAmp: -0.72, qrsWidth: 0.16, tAmp: -0.10, tWidth: 0.15, pWidth: 0, pr: 0 }
  },
  vf: {
    label: 'Fibrilación ventricular',
    lead: 'II',
    hr: 0,
    description: {
      intro: 'Patrón caótico sin complejos QRS organizados.',
      bullets: ['Actividad caótica', 'Sin QRS reconocible', 'Ritmo letal']
    },
    eventMode: 'vf'
  },
  torsades: {
    label: 'Torsade de pointes',
    lead: 'V1',
    hr: 190,
    description: {
      intro: 'Taquicardia ventricular polimórfica con amplitud oscilante alrededor de la línea de base.',
      bullets: ['QRS ancho', 'Amplitud cambiante', 'Asociada a QT largo']
    },
    eventMode: 'torsades',
    beat: { pAmp: 0, qAmp: 0, rAmp: 1.0, sAmp: -0.85, qrsWidth: 0.17, tAmp: -0.08, tWidth: 0.12, pWidth: 0, pr: 0 }
  },
  sinusPause: {
    label: 'Pausa sinusal',
    lead: 'II',
    hr: 58,
    description: {
      intro: 'Ritmo sinusal con pausas intermitentes por fallo transitorio del nodo sinusal.',
      bullets: ['Pausa visible', 'Reinicio sinusal', 'Ritmo irregular']
    },
    eventMode: 'sequence',
    sequence: ['normal','normal','normal','pause','normal'],
    normalBeat: { pAmp: 0.12, qAmp: -0.08, rAmp: 1.0, sAmp: -0.25, tAmp: 0.30, qrsWidth: 0.09, tWidth: 0.15, pWidth: 0.08, pr: 0.16 },
    pauseBeat: { pAmp: 0, qAmp: 0, rAmp: 0, sAmp: 0, tAmp: 0, qrsWidth: 0.09, tWidth: 0.15, pWidth: 0, pr: 0 },
    pauseOffset: 0.5
  }
};
Object.assign(window.RHYTHMS, window.RHYTHMS_ADV);
