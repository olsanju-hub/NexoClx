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
    summary:
      'El manejo urgente depende de la estabilidad hemodinámica, la respuesta ventricular, la duración del episodio y la indicación de anticoagulación.',
    overview: [
      'Confirmar la arritmia con ECG de 12 derivaciones y tira de ritmo de al menos 30 s.',
      'Buscar inestabilidad hemodinámica, insuficiencia cardíaca, cardiopatía estructural significativa y duración del episodio.',
      'Pedir creatinina y coagulación si la anticoagulación forma parte de la decisión inmediata.',
    ],
    flow: [
      {
        id: 'inestable',
        title: 'Paciente inestable',
        description:
          'Shock cardiogénico, edema agudo de pulmón, síndrome coronario agudo o mala tolerancia grave.',
        actions: [
          'Aplicar medidas generales: vía venosa, oxígeno si SpO2 < 90 %, monitorización continua y presión arterial seriada.',
          'Si la FA rápida dura menos de 48 h y no se consigue el objetivo con fármacos, realizar cardioversión eléctrica urgente.',
          'Si la duración es mayor de 48 h o desconocida, iniciar anticoagulación terapéutica y valorar ecocardiografía transesofágica antes de cardioversión.',
        ],
      },
      {
        id: 'rapida-menor-48',
        title: 'FA rápida < 48 h y estable',
        description:
          'La prioridad es controlar frecuencia antes de decidir el control del ritmo.',
        actions: [
          'Sin insuficiencia cardíaca: metoprolol o verapamilo; si no son opción, digoxina; amiodarona como última opción aguda.',
          'Con insuficiencia cardíaca: digoxina; si no basta o no es viable, valorar amiodarona.',
          'Tras estabilizar la frecuencia, decidir cardioversión y duración de la anticoagulación según riesgo embólico y duración real del episodio.',
        ],
      },
      {
        id: 'rapida-mayor-48',
        title: 'FA rápida > 48 h o de duración desconocida',
        description:
          'Control de frecuencia y estrategia de anticoagulación antes de cardioversión electiva o guiada por eco transesofágica.',
        actions: [
          'Controlar la frecuencia con el mismo esquema que en FA rápida < 48 h.',
          'Si no hay estenosis mitral moderada/grave ni prótesis mecánica, valorar ACOD; si las hay, orientar a AVK.',
          'Usar CHA2DS2-VASc y HAS-BLED para decidir anticoagulación crónica y el nivel de control posterior.',
        ],
      },
      {
        id: 'lenta-o-normal',
        title: 'FA lenta o respuesta ventricular 60-100 lat/min',
        description:
          'No suele exigir cardioversión urgente salvo síntomas o inestabilidad por otra causa.',
        actions: [
          'Si la frecuencia es menor de 40 lat/min o hay pausas > 3 s, manejar como bradiarritmia.',
          'Si la frecuencia es normal y la clínica no obliga a intervenir, centrar la decisión en anticoagulación y causa desencadenante.',
          'En FA permanente o aceptada, la prioridad urgente suele ser la frecuencia y el riesgo tromboembólico, no la cardioversión.',
        ],
      },
    ],
    warnings: [
      'No combinar de entrada betabloqueante con verapamilo o diltiazem.',
      'La asociación digoxina + verapamilo puede elevar los niveles de digoxina.',
      'HAS-BLED ≥ 3 no contraindica por sí mismo la anticoagulación; obliga a control más estrecho.',
      'En FA con estenosis mitral moderada/grave o prótesis valvular mecánica, el capítulo orienta a AVK.',
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
