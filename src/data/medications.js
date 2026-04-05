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

const cimaSource = (label, url) => ({ label, url, type: 'cima' });
const protocolSource = (label, bibliography) => ({ label, bibliography, type: 'protocol' });

export const medicationCatalog = {
  metoprolol: {
    id: 'metoprolol',
    name: 'Metoprolol',
    protocolId: 'fibrilacion-auricular',
    family: 'Control de frecuencia',
    indication:
      'Control de la frecuencia ventricular en fibrilación auricular rápida sin insuficiencia cardíaca manifiesta.',
    dose:
      'En este contexto: 100 mg VO cada 12 h o 2,5 mg IV lento; repetir cada 10 min hasta 15 mg totales si hace falta.',
    route: 'Oral / intravenosa',
    frequency: 'Cada 12 h por vía oral; bolos IV titulados en fase aguda.',
    duration: 'Uso agudo y transición posterior según respuesta clínica y plan cardiológico.',
    contraindications: [
      'Bradicardia marcada o bloqueo AV clínicamente relevante.',
      'Shock cardiogénico o hipotensión no tolerada.',
      'Precaución si se combina con verapamilo o digoxina por riesgo de enlentecimiento excesivo.',
    ],
    renalAdjustment:
      'La ficha CIMA oral consultada indica escasa influencia de la insuficiencia renal sobre la biodisponibilidad; no describe un ajuste fijo, pero obliga a monitorizar la tolerancia clínica.',
    hepaticAdjustment:
      'La ficha CIMA oral consultada señala aumento de exposición en cirrosis hepática grave o derivación portocava; conviene empezar bajo y vigilar.',
    practicalNotes: [
      'En FA el libro lo sitúa como primera opción si no hay insuficiencia cardíaca.',
      'No combinar de entrada con verapamilo o diltiazem.',
    ],
    sourceScope:
      'La pauta IV específica del contexto FA procede del capítulo 23 del Murillo; la ficha técnica CIMA consultada corresponde a la formulación oral.',
    sources: [
      cimaSource(
        'CIMA · Beloken 100 mg comprimidos',
        'https://cima.aemps.es/cima/dochtml/ft/55748/FichaTecnica_55748.html',
      ),
      protocolSource(
        'Murillo 7.ª ed. · control de frecuencia en FA',
        referenceEntry({
          id: 'metoprolol-fa',
          verifiedPage: 187,
          pdfPage: 212,
          note: 'Cuadro 23.2 con pauta oral e intravenosa en FA rápida.',
        }),
      ),
    ],
  },
  verapamilo: {
    id: 'verapamilo',
    name: 'Verapamilo',
    protocolId: 'fibrilacion-auricular',
    family: 'Control de frecuencia',
    indication:
      'Control de la frecuencia ventricular en fibrilación auricular rápida cuando no hay insuficiencia cardíaca con fracción reducida ni vía accesoria.',
    dose:
      'En este contexto: 40-80 mg VO cada 8 h; IV 5 mg en 10 min, repetible cada 20 min hasta 20 mg totales.',
    route: 'Oral / intravenosa',
    frequency: 'Cada 8 h por vía oral; bolos IV titulados en fase aguda.',
    duration: 'Uso agudo con reevaluación posterior del control de frecuencia.',
    contraindications: [
      'Shock cardiogénico, bloqueo AV de segundo/tercer grado o síndrome del nodo sinusal enfermo.',
      'Insuficiencia cardíaca con fracción de eyección reducida.',
      'Flutter o FA con vía accesoria (WPW / Lown-Ganong-Levine).',
    ],
    renalAdjustment:
      'La ficha CIMA oral consultada no fija reducción estándar, pero exige uso con precaución y vigilancia estrecha si la función renal está alterada.',
    hepaticAdjustment:
      'La ficha CIMA oral consultada indica metabolismo más lento en insuficiencia hepática y recomienda iniciar con dosis bajas.',
    practicalNotes: [
      'En la obra se reserva para FA rápida sin insuficiencia cardíaca.',
      'No asociar de entrada con betabloqueantes.',
      'Usar con precaución junto con digoxina porque puede elevar sus concentraciones.',
    ],
    sourceScope:
      'La pauta IV concreta del contexto FA procede del capítulo 23 del Murillo; la ficha CIMA consultada corresponde a la formulación oral.',
    sources: [
      cimaSource('CIMA · Manidón 80 mg comprimidos', 'https://cima.aemps.es/cima/dochtml/ft/50891'),
      protocolSource(
        'Murillo 7.ª ed. · control de frecuencia en FA',
        referenceEntry({
          id: 'verapamilo-fa',
          verifiedPage: 187,
          pdfPage: 212,
          note: 'Cuadro 23.2 con pauta oral e intravenosa en FA rápida.',
        }),
      ),
    ],
  },
  digoxina: {
    id: 'digoxina',
    name: 'Digoxina',
    protocolId: 'fibrilacion-auricular',
    family: 'Control de frecuencia',
    indication:
      'Control de frecuencia en FA cuando no se toleran betabloqueantes/verapamilo o cuando existe insuficiencia cardíaca.',
    dose:
      'En este contexto: digitalización VO 0,25 mg cada 8 h durante 48 h y luego 0,25 mg/24 h; IV 0,25 mg cada 2 h hasta control o 1,5 mg máximos.',
    route: 'Oral / intravenosa',
    frequency: 'Cargas fraccionadas y luego mantenimiento diario.',
    duration: 'Ajuste individual según frecuencia, función renal y niveles séricos.',
    contraindications: [
      'Taquicardia o fibrilación ventricular.',
      'Bloqueo AV avanzado o enfermedad del seno sintomática sin marcapasos.',
      'Arritmias supraventriculares con vía accesoria auriculoventricular si no se ha valorado el riesgo.',
    ],
    renalAdjustment:
      'La ficha CIMA consultada exige individualizar la dosis según aclaramiento de creatinina y controlar niveles séricos; la insuficiencia renal es una causa frecuente de toxicidad.',
    hepaticAdjustment:
      'La ficha CIMA consultada no aporta un ajuste hepático cerrado. Mantener individualización y vigilancia clínica si hay disfunción multiorgánica.',
    practicalNotes: [
      'En la obra es fármaco de elección si hay insuficiencia cardíaca, aunque pierde eficacia cuando predomina la activación simpática.',
      'Si el paciente ya toma digitálicos no debe redigitalizarse.',
      'La cardioversión eléctrica requiere precaución añadida en tratamiento digitálico.',
    ],
    sourceScope:
      'La pauta específica de carga y mantenimiento en FA procede del capítulo 23 del Murillo; la ficha CIMA consultada refuerza individualización y monitorización.',
    sources: [
      cimaSource(
        'CIMA · Digoxina Teofarma 0,25 mg comprimidos',
        'https://cima.aemps.es/cima/dochtml/ft/23850/FichaTecnica_23850.html',
      ),
      protocolSource(
        'Murillo 7.ª ed. · control de frecuencia en FA',
        referenceEntry({
          id: 'digoxina-fa',
          verifiedPage: 187,
          pdfPage: 212,
          note: 'Cuadro 23.2 con pautas de digitalización oral e intravenosa.',
        }),
      ),
    ],
  },
  amiodarona: {
    id: 'amiodarona',
    name: 'Amiodarona',
    protocolId: 'fibrilacion-auricular',
    family: 'Control de frecuencia y ritmo',
    indication:
      'Última opción aguda para control de frecuencia o alternativa de control del ritmo cuando no hay opciones más limpias o existe insuficiencia cardíaca moderada-grave.',
    dose:
      'En este contexto: IV 5-7 mg/kg de carga, con posibilidad de completar 1,2-1,8 g en 24 h; VO 200 mg cada 8 h 7 días, luego cada 12 h 7 días y después 200 mg/24 h 5 días/semana.',
    route: 'Oral / intravenosa',
    frequency: 'Carga aguda y mantenimiento posterior según respuesta.',
    duration: 'Solo uso agudo en control de frecuencia del libro; otras indicaciones dependen de cardiología.',
    contraindications: [
      'Bradicardia sinusal, trastorno grave de conducción o enfermedad del nodo sinusal sin marcapasos.',
      'Disfunción tiroidea.',
      'Precaución extrema con fármacos que prolongan QT o inducen torsade de pointes.',
    ],
    renalAdjustment:
      'La ficha CIMA oral consultada no establece un ajuste renal cuantificado; recomienda empezar con la dosis más baja razonable considerando la función renal y la comorbilidad.',
    hepaticAdjustment:
      'La ficha CIMA oral consultada no detalla un esquema numérico de ajuste hepático; obliga a prudencia clínica y vigilancia por su perfil de toxicidad.',
    practicalNotes: [
      'En la obra solo se usa como última opción en control de frecuencia agudo o como fármaco de ritmo en determinados escenarios.',
      'No mezclar antiarrítmicos de clase I y III en el mismo momento.',
    ],
    sourceScope:
      'La pauta detallada de FA procede del capítulo 23 del Murillo; la ficha CIMA oral consultada aporta contraindicaciones y recomendaciones generales de inicio.',
    sources: [
      cimaSource(
        'CIMA · Trangorex 200 mg comprimidos',
        'https://cima.aemps.es/cima/dochtml/ft/48048/FT_48048.html',
      ),
      protocolSource(
        'Murillo 7.ª ed. · control de ritmo y frecuencia en FA',
        referenceEntry({
          id: 'amiodarona-fa',
          verifiedPage: 188,
          pdfPage: 213,
          note: 'Cuadro 23.3 con pauta de cardioversión y mantenimiento.',
        }),
      ),
    ],
  },
  apixaban: {
    id: 'apixaban',
    name: 'Apixabán',
    protocolId: 'fibrilacion-auricular',
    family: 'Anticoagulación',
    indication:
      'Anticoagulación oral en FA no valvular cuando la estratificación tromboembólica la justifica.',
    dose:
      'CIMA: 5 mg VO cada 12 h. Reducir a 2,5 mg cada 12 h en pacientes con al menos dos de estos criterios: edad ≥ 80 años, peso ≤ 60 kg, creatinina sérica ≥ 1,5 mg/dL. El libro cita 2,5-5 mg/12 h.',
    route: 'Oral',
    frequency: 'Cada 12 h.',
    duration: 'Tratamiento crónico o periodos peri-cardioversión según duración del episodio y riesgo.',
    contraindications: [
      'Hemorragia activa clínicamente significativa.',
      'Hepatopatía asociada a coagulopatía y riesgo hemorrágico clínicamente relevante.',
      'No recomendado si aclaramiento de creatinina < 15 mL/min o en diálisis según la ficha consultada.',
    ],
    renalAdjustment:
      'CIMA: si el aclaramiento de creatinina es 15-29 mL/min, en FA no valvular usar 2,5 mg cada 12 h; no recomendado si es < 15 mL/min.',
    hepaticAdjustment:
      'CIMA: contraindicado si hay hepatopatía con coagulopatía y riesgo de sangrado; no recomendado en insuficiencia hepática grave.',
    practicalNotes: [
      'En el libro se incluye como anti-Xa de referencia para FA no valvular.',
      'Revisar el Cockcroft-Gault antes de decidir dosis si la función renal es dudosa.',
    ],
    sourceScope:
      'La indicación contextual procede del capítulo 23 del Murillo y la dosificación estructural principal de la ficha técnica CIMA.',
    sources: [
      cimaSource(
        'CIMA · Eliquis 5 mg comprimidos',
        'https://cima.aemps.es/cima/dochtml/ft/111691014/FT_111691014.html',
      ),
      protocolSource(
        'Murillo 7.ª ed. · anticoagulación en FA',
        referenceEntry({
          id: 'apixaban-fa',
          verifiedPage: 189,
          pdfPage: 214,
          note: 'Cuadro 23.4 con dosis orientativa de apixabán en FA.',
        }),
      ),
    ],
  },
  dabigatran: {
    id: 'dabigatran',
    name: 'Dabigatrán',
    protocolId: 'fibrilacion-auricular',
    family: 'Anticoagulación',
    indication:
      'Anticoagulación oral en FA no valvular cuando la estratificación tromboembólica la justifica.',
    dose:
      'CIMA: 150 mg VO cada 12 h; considerar 110 mg cada 12 h en pacientes de mayor edad o con riesgo de sangrado. El libro cita 110-150 mg/12 h.',
    route: 'Oral',
    frequency: 'Cada 12 h.',
    duration: 'Tratamiento crónico o peri-cardioversión según duración del episodio y riesgo.',
    contraindications: [
      'Hemorragia activa clínicamente significativa.',
      'Aclaramiento de creatinina < 30 mL/min.',
      'Lesión orgánica con riesgo relevante de sangrado o combinación con determinados inhibidores potentes de la P-gp.',
    ],
    renalAdjustment:
      'CIMA: contraindicado si el aclaramiento de creatinina es < 30 mL/min. Entre 30-50 mL/min obliga a reevaluar riesgo hemorrágico y puede motivar reducción.',
    hepaticAdjustment:
      'No he podido extraer de forma fiable una pauta hepática cuantificada de la ficha CIMA consultada; debe revisarse la ficha completa si existe hepatopatía relevante antes de indicar el fármaco.',
    practicalNotes: [
      'El libro lo sitúa entre los ACOD anti-IIa para FA no valvular.',
      'Si se pauta, documentar siempre aclaramiento de creatinina previo.',
    ],
    sourceScope:
      'La posología de FA está respaldada por la ficha CIMA; el uso contextual dentro del protocolo proviene del capítulo 23 del Murillo.',
    sources: [
      cimaSource(
        'CIMA · Pradaxa 150 mg cápsulas duras',
        'https://cima.aemps.es/cima/dochtml/ft/08442011/FichaTecnica_08442011.html',
      ),
      protocolSource(
        'Murillo 7.ª ed. · anticoagulación en FA',
        referenceEntry({
          id: 'dabigatran-fa',
          verifiedPage: 189,
          pdfPage: 214,
          note: 'Cuadro 23.4 con dosis orientativa de dabigatrán en FA.',
        }),
      ),
    ],
  },
  edoxaban: {
    id: 'edoxaban',
    name: 'Edoxabán',
    protocolId: 'fibrilacion-auricular',
    family: 'Anticoagulación',
    indication:
      'Anticoagulación oral en FA no valvular cuando la estratificación tromboembólica la justifica.',
    dose:
      'CIMA: 60 mg VO cada 24 h; reducir a 30 mg cada 24 h si el aclaramiento de creatinina es 15-50 mL/min, peso ≤ 60 kg o hay determinados inhibidores de la P-gp. El libro cita 30-60 mg/24 h.',
    route: 'Oral',
    frequency: 'Cada 24 h.',
    duration: 'Tratamiento crónico o peri-cardioversión según duración del episodio y riesgo.',
    contraindications: [
      'Sangrado activo clínicamente significativo.',
      'Hepatopatía asociada a coagulopatía y riesgo de sangrado clínicamente relevante.',
      'No recomendado si el aclaramiento de creatinina es < 15 mL/min.',
    ],
    renalAdjustment:
      'La ficha CIMA del edoxabán reduce a 30 mg/24 h si el aclaramiento de creatinina está entre 15 y 50 mL/min. No se recomienda por debajo de 15 mL/min.',
    hepaticAdjustment:
      'Contraindicado si existe hepatopatía con coagulopatía y riesgo hemorrágico. Si hay insuficiencia hepática leve o moderada sin coagulopatía, la ficha debe revisarse completa antes de prescribir.',
    practicalNotes: [
      'El libro lo cita entre los anti-Xa disponibles para FA no valvular.',
      'En este módulo conviene apoyarse en Cockcroft-Gault antes de seleccionar dosis.',
    ],
    sourceScope:
      'La dosis principal procede de la ficha CIMA consultada; el encaje clínico dentro de FA viene del capítulo 23 del Murillo.',
    sources: [
      cimaSource(
        'CIMA · Lixiana 30 mg comprimidos',
        'https://cima.aemps.es/cima/dochtml/ft/115993015/FT_115993015.html',
      ),
      protocolSource(
        'Murillo 7.ª ed. · anticoagulación en FA',
        referenceEntry({
          id: 'edoxaban-fa',
          verifiedPage: 189,
          pdfPage: 214,
          note: 'Cuadro 23.4 con dosis orientativa de edoxabán en FA.',
        }),
      ),
    ],
  },
  rivaroxaban: {
    id: 'rivaroxaban',
    name: 'Rivaroxabán',
    protocolId: 'fibrilacion-auricular',
    family: 'Anticoagulación',
    indication:
      'Anticoagulación oral en FA no valvular cuando la estratificación tromboembólica la justifica.',
    dose:
      'CIMA: 20 mg VO cada 24 h con alimentos; 15 mg cada 24 h si el aclaramiento de creatinina es 15-49 mL/min cuando el riesgo hemorrágico lo aconseja. El libro cita 15-20 mg/24 h.',
    route: 'Oral',
    frequency: 'Cada 24 h con alimentos.',
    duration: 'Tratamiento crónico o peri-cardioversión según duración del episodio y riesgo.',
    contraindications: [
      'Hemorragia activa clínicamente significativa.',
      'Hepatopatía asociada a coagulopatía y riesgo hemorrágico, incluidos Child-Pugh B y C.',
      'No recomendado si aclaramiento de creatinina < 15 mL/min.',
    ],
    renalAdjustment:
      'La ficha CIMA ajusta a 15 mg/24 h en FA cuando el aclaramiento de creatinina está entre 15 y 49 mL/min; no recomendado por debajo de 15 mL/min.',
    hepaticAdjustment:
      'La ficha CIMA contraindica rivaroxabán si existe hepatopatía con coagulopatía y riesgo de sangrado clínicamente relevante, incluidos Child-Pugh B y C.',
    practicalNotes: [
      'Debe tomarse con alimentos para asegurar exposición adecuada.',
      'En este módulo el libro lo incluye como anti-Xa para FA no valvular.',
    ],
    sourceScope:
      'La pauta base procede de CIMA y el uso contextual en FA de la bibliografía de Murillo.',
    sources: [
      cimaSource(
        'CIMA · Xarelto 20 mg comprimidos',
        'https://cima.aemps.es/cima/dochtml/ft/08472018/FT_08472018.html',
      ),
      protocolSource(
        'Murillo 7.ª ed. · anticoagulación en FA',
        referenceEntry({
          id: 'rivaroxaban-fa',
          verifiedPage: 189,
          pdfPage: 214,
          note: 'Cuadro 23.4 con dosis orientativa de rivaroxabán en FA.',
        }),
      ),
    ],
  },
  acenocumarol: {
    id: 'acenocumarol',
    name: 'Acenocumarol',
    protocolId: 'fibrilacion-auricular',
    family: 'Anticoagulación',
    indication:
      'Anticoagulación oral en FA asociada a estenosis mitral moderada/grave o prótesis valvular mecánica, y alternativa con INR guiado en otros contextos.',
    dose:
      'CIMA: inicio habitual 1-3 mg/día en una única toma, con ajuste por INR. En el capítulo de FA se usa 3 mg/24 h asociado inicialmente a enoxaparina.',
    route: 'Oral',
    frequency: 'Una toma diaria, ajustada por INR.',
    duration: 'Crónica si FA con estenosis mitral moderada/grave o prótesis mecánica; también peri-cardioversión cuando se elige AVK.',
    contraindications: [
      'Embarazo.',
      'Situaciones con riesgo hemorrágico alto: diátesis hemorrágica, sangrado activo relevante, hipertensión grave.',
      'Insuficiencia hepática grave o insuficiencia renal grave si el riesgo hemorrágico supera el trombótico.',
    ],
    renalAdjustment:
      'La ficha CIMA no da una dosis fija por aclaramiento; insiste en cautela en insuficiencia renal leve-moderada y evita el uso en insuficiencia renal grave si el riesgo hemorrágico supera el beneficio.',
    hepaticAdjustment:
      'La ficha CIMA contraindica insuficiencia hepática grave y pide especial precaución en insuficiencia hepática leve-moderada por alteración de síntesis de factores y riesgo de sangrado.',
    practicalNotes: [
      'Requiere control estrecho de INR.',
      'El libro orienta a INR 2,5-3,5 si FA con estenosis mitral moderada/grave o prótesis mecánica; INR 2-3 en otros contextos con AVK.',
    ],
    sourceScope:
      'La pauta de inicio específica del protocolo FA y los objetivos de INR proceden del Murillo; la individualización detallada por INR procede de la ficha CIMA.',
    sources: [
      cimaSource(
        'CIMA · Sintrom 4 mg comprimidos',
        'https://cima.aemps.es/cima/dochtml/ft/25670/ft_25670.html',
      ),
      protocolSource(
        'Murillo 7.ª ed. · anticoagulación con AVK en FA',
        referenceEntry({
          id: 'acenocumarol-fa',
          verifiedPage: 189,
          pdfPage: 214,
          note: 'Cuadro 23.4 con pauta inicial de acenocumarol e INR objetivo.',
        }),
      ),
    ],
  },
  enoxaparina: {
    id: 'enoxaparina',
    name: 'Enoxaparina',
    protocolId: 'fibrilacion-auricular',
    family: 'Anticoagulación puente',
    indication:
      'Anticoagulación terapéutica puente en FA aguda cuando aún no hay anticoagulación oral establecida o antes de cardioversión según el capítulo de FA.',
    dose:
      'En este contexto: 1 mg/kg SC cada 12 h durante las primeras 48 h asociado a AVK, o dosis única terapéutica de 100 UI/kg SC en episodios agudos según escenario clínico del capítulo.',
    route: 'Subcutánea',
    frequency: 'Cada 12 h en pauta terapéutica puente; dosis única en algunos episodios agudos.',
    duration: 'Uso corto mientras se estabiliza la estrategia anticoagulante.',
    contraindications: [
      'Hemorragia activa clínicamente relevante.',
      'Antecedente de trombocitopenia inmune inducida por heparina en los últimos 100 días o anticuerpos circulantes.',
      'Precaución alta si el riesgo de sangrado supera el beneficio esperado.',
    ],
    renalAdjustment:
      'CIMA: si el aclaramiento de creatinina es 15-30 mL/min, las pautas terapéuticas pasan a 1 mg/kg cada 24 h. No recomendada si es < 15 mL/min fuera de hemodiálisis.',
    hepaticAdjustment:
      'CIMA: datos limitados; usar con precaución en insuficiencia hepática por aumento potencial del riesgo hemorrágico.',
    practicalNotes: [
      'La ficha CIMA no lista FA como indicación literal; en este proyecto se usa como puente anticoagulante porque así aparece en el capítulo 23 del Murillo.',
      'Si se usa como puente con AVK, documentar claramente el plan de suspensión y el primer control de coagulación.',
    ],
    sourceScope:
      'El uso en FA es protocolario y procede del Murillo; la ficha CIMA aporta la base de seguridad, presentación y ajuste renal de la HBPM.',
    sources: [
      cimaSource(
        'CIMA · Clexane 10.000 UI (100 mg)/1 ml',
        'https://cima.aemps.es/cima/dochtml/ft/62472/FT_62472.html',
      ),
      protocolSource(
        'Murillo 7.ª ed. · anticoagulación puente en FA',
        referenceEntry({
          id: 'enoxaparina-fa',
          verifiedPage: 189,
          pdfPage: 214,
          note: 'Cuadro 23.4 con pauta terapéutica de HBPM asociada a AVK.',
        }),
      ),
    ],
  },
};

export const medicationList = Object.values(medicationCatalog);

export const medicationGroups = [
  {
    id: 'control-frecuencia',
    title: 'Control de frecuencia',
    items: ['metoprolol', 'verapamilo', 'digoxina', 'amiodarona'],
  },
  {
    id: 'anticoagulacion',
    title: 'Anticoagulación en FA no valvular',
    items: ['apixaban', 'dabigatran', 'edoxaban', 'rivaroxaban'],
  },
  {
    id: 'puente-o-avk',
    title: 'Puente o AVK',
    items: ['acenocumarol', 'enoxaparina'],
  },
];

export const getMedication = (medicationId) => medicationCatalog[medicationId] ?? medicationList[0];
