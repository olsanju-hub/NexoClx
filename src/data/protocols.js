import { createBibliographyEntry } from './bibliography';

const referenceEntry = ({ id, indexPage, verifiedPage = indexPage, pdfPage, note }) =>
  createBibliographyEntry({
    id,
    referenceId: 'murillo7',
    indexPages: indexPage ? [indexPage] : [],
    verifiedPages: verifiedPage ? [verifiedPage] : [],
    pdfPages: pdfPage ? [pdfPage] : [],
    note,
  });

export const protocolCatalog = {
  'fibrilacion-auricular': {
    id: 'fibrilacion-auricular',
    title: 'Fibrilación auricular',
    longTitle: 'Fibrilación y flúter auriculares',
    chapter: 'Cap. 23',
    section: 'Urgencias cardiovasculares',
    indexPage: 184,
    verifiedPage: 185,
    pdfPage: 210,
    status: 'implementado',
    summary: 'Decidir por estabilidad, duración del episodio y necesidad de anticoagulación.',
    quickChecks: [
      'ECG y tira de ritmo',
      'Estable o inestable',
      'Duración: < 48 h, > 48 h o desconocida',
      'Creatinina y coagulación si cambia la decisión terapéutica',
    ],
    quickSummary: [
      {
        id: 'inestable',
        title: 'Inestable',
        action: 'Cardioversión urgente o anticoagulación + ETE según duración.',
      },
      {
        id: 'lt48',
        title: 'Estable < 48 h',
        action: 'Controlar frecuencia primero. Valorar ritmo y anticoagulación posterior.',
      },
      {
        id: 'gt48',
        title: '> 48 h / desconocida',
        action: 'Frecuencia primero. Anticoagulación antes de cardioversión.',
      },
      {
        id: 'always',
        title: 'Siempre',
        action: 'Revisar CHA2DS2-VASc, HAS-BLED y función renal si vas a anticoagular.',
      },
    ],
    decisionCards: [
      {
        id: 'inestable',
        situation: 'FA con inestabilidad hemodinámica',
        action: 'Medidas generales y cardioversión eléctrica urgente si la FA rápida es < 48 h o fracasa el tratamiento farmacológico.',
        nuance: 'Si dura > 48 h o es desconocida, anticoagulación terapéutica y valorar ecocardiografía transesofágica antes de cardioversión.',
      },
      {
        id: 'lt48',
        situation: 'FA rápida, estable, < 48 h',
        action: 'Controlar primero la frecuencia. Sin insuficiencia cardíaca: metoprolol o verapamilo; con insuficiencia cardíaca: digoxina; amiodarona como rescate agudo.',
        nuance: 'Tras controlar frecuencia, valorar cardioversión y si hace falta anticoagulación de 4 semanas según duración y riesgo.',
      },
      {
        id: 'gt48',
        situation: 'FA rápida, estable, > 48 h o de duración desconocida',
        action: 'Control de frecuencia y estrategia anticoagulante antes de cardioversión.',
        nuance: 'Sin estenosis mitral moderada/grave ni prótesis mecánica, pensar en ACOD; si existen, orientar a AVK.',
      },
      {
        id: 'slow-normal',
        situation: 'FA lenta o frecuencia 60-100 lat/min',
        action: 'Si no hay síntomas relevantes, priorizar causa desencadenante y necesidad de anticoagulación.',
        nuance: 'Si la frecuencia es < 40 lat/min o hay pausas > 3 s, manejar como bradiarritmia.',
      },
    ],
    warnings: [
      'No combinar de entrada betabloqueante con verapamilo o diltiazem.',
      'Digoxina + verapamilo puede elevar niveles de digoxina.',
      'HAS-BLED ≥ 3 no contraindica por sí mismo anticoagular; obliga a control más estrecho.',
      'Con estenosis mitral moderada/grave o prótesis mecánica, el capítulo orienta a AVK.',
    ],
    calculatorIds: ['cha2ds2-vasc', 'has-bled', 'cockcroft-gault'],
    medicationGroups: [
      {
        title: 'Control de frecuencia',
        medicationIds: ['metoprolol', 'verapamilo', 'digoxina', 'amiodarona'],
      },
      {
        title: 'Anticoagulación en FA no valvular',
        medicationIds: ['apixaban', 'dabigatran', 'edoxaban', 'rivaroxaban'],
      },
      {
        title: 'Puente o AVK',
        medicationIds: ['acenocumarol', 'enoxaparina'],
      },
    ],
    bibliography: [
      referenceEntry({
        id: 'fa-start',
        indexPage: 184,
        verifiedPage: 185,
        pdfPage: 210,
        note: 'Inicio real del capítulo. El índice adelanta el capítulo una página.',
      }),
      createBibliographyEntry({
        id: 'fa-flow',
        referenceId: 'murillo7',
        verifiedPages: [187, 188, 191, 192],
        pdfPages: [212, 213, 216, 217],
        note: 'Objetivos terapéuticos, control de frecuencia, control del ritmo y ramas según duración del episodio.',
      }),
      createBibliographyEntry({
        id: 'fa-anticoag',
        referenceId: 'murillo7',
        verifiedPages: [189, 190],
        pdfPages: [214, 215],
        note: 'CHA2DS2-VASc, HAS-BLED y tratamiento anticoagulante orientado por riesgo.',
      }),
    ],
  },
};

export const protocolList = Object.values(protocolCatalog);

export const getProtocol = (protocolId) => protocolCatalog[protocolId] ?? protocolList[0];
