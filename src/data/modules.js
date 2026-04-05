import { bibliographyCatalog, createBibliographyEntry } from './bibliography';

const createModule = ({
  id,
  title,
  category,
  section,
  chapter,
  page,
  summary,
  content = [],
  calculations = [],
  treatment = [],
  bibliography = [],
}) => ({
  id,
  title,
  category,
  section,
  chapter,
  page,
  summary,
  content,
  calculations,
  treatment,
  bibliography,
});

export const referenceSections = [
  'Soporte vital',
  'Exploraciones complementarias',
  'Urgencias cardiovasculares',
  'Urgencias neurológicas',
  'Urgencias del aparato digestivo',
  'Infecciones en medicina de urgencias',
];

export const clinicalModules = [
  createModule({
    id: 'shock',
    title: 'Shock',
    category: 'motivo-consulta',
    section: 'Urgencias cardiovasculares',
    chapter: 'Cap. 18',
    page: 154,
    summary: 'Acceso principal al capítulo base.',
    content: [
      { label: 'Sección', value: 'Urgencias cardiovasculares' },
      { label: 'Capítulo base', value: 'Cap. 18 · Shock' },
    ],
    bibliography: [
      createBibliographyEntry({
        id: 'shock-cap18',
        referenceId: 'murillo7',
        pages: [154],
        note: 'Capítulo base del módulo.',
      }),
    ],
  }),
  createModule({
    id: 'dolor-toracico-agudo',
    title: 'Dolor torácico agudo',
    category: 'motivo-consulta',
    section: 'Urgencias cardiovasculares',
    chapter: 'Cap. 25',
    page: 207,
    summary: 'Acceso principal al capítulo base.',
    content: [
      { label: 'Sección', value: 'Urgencias cardiovasculares' },
      { label: 'Capítulo base', value: 'Cap. 25 · Dolor torácico agudo' },
    ],
    bibliography: [
      createBibliographyEntry({
        id: 'dolor-toracico-cap25',
        referenceId: 'murillo7',
        pages: [207],
        note: 'Capítulo base del módulo.',
      }),
    ],
  }),
  createModule({
    id: 'sindrome-coronario-agudo',
    title: 'Síndrome coronario agudo',
    category: 'motivo-consulta',
    section: 'Urgencias cardiovasculares',
    chapter: 'Cap. 26',
    page: 214,
    summary: 'Acceso principal al capítulo base.',
    content: [
      { label: 'Sección', value: 'Urgencias cardiovasculares' },
      { label: 'Capítulo base', value: 'Cap. 26 · Síndrome coronario agudo' },
    ],
    bibliography: [
      createBibliographyEntry({
        id: 'sca-cap26',
        referenceId: 'murillo7',
        pages: [214],
        note: 'Capítulo base del módulo.',
      }),
    ],
  }),
  createModule({
    id: 'dolor-abdominal-agudo',
    title: 'Dolor abdominal agudo',
    category: 'motivo-consulta',
    section: 'Urgencias del aparato digestivo',
    chapter: 'Cap. 50',
    page: 340,
    summary: 'Acceso principal al capítulo base.',
    content: [
      { label: 'Sección', value: 'Urgencias del aparato digestivo' },
      { label: 'Capítulo base', value: 'Cap. 50 · Dolor abdominal agudo' },
    ],
    bibliography: [
      createBibliographyEntry({
        id: 'dolor-abdominal-cap50',
        referenceId: 'murillo7',
        pages: [340],
        note: 'Capítulo base del módulo.',
      }),
    ],
  }),
  createModule({
    id: 'coma',
    title: 'Coma',
    category: 'motivo-consulta',
    section: 'Urgencias neurológicas',
    chapter: 'Cap. 62',
    page: 428,
    summary: 'Acceso principal al capítulo base.',
    content: [
      { label: 'Sección', value: 'Urgencias neurológicas' },
      { label: 'Capítulo base', value: 'Cap. 62 · Coma' },
    ],
    bibliography: [
      createBibliographyEntry({
        id: 'coma-cap62',
        referenceId: 'murillo7',
        pages: [428],
        note: 'Capítulo base del módulo.',
      }),
    ],
  }),
  createModule({
    id: 'ictus',
    title: 'Ictus',
    category: 'motivo-consulta',
    section: 'Urgencias neurológicas',
    chapter: 'Cap. 64',
    page: 442,
    summary: 'Acceso principal al capítulo base.',
    content: [
      { label: 'Sección', value: 'Urgencias neurológicas' },
      { label: 'Capítulo base', value: 'Cap. 64 · Ictus' },
    ],
    bibliography: [
      createBibliographyEntry({
        id: 'ictus-cap64',
        referenceId: 'murillo7',
        pages: [442],
        note: 'Capítulo base del módulo.',
      }),
    ],
  }),
  createModule({
    id: 'sepsis',
    title: 'Sepsis',
    category: 'motivo-consulta',
    section: 'Infecciones en medicina de urgencias',
    chapter: 'Cap. 107',
    page: 640,
    summary: 'Acceso principal al capítulo base.',
    content: [
      { label: 'Sección', value: 'Infecciones en medicina de urgencias' },
      { label: 'Capítulo base', value: 'Cap. 107 · Sepsis' },
    ],
    bibliography: [
      createBibliographyEntry({
        id: 'sepsis-cap107',
        referenceId: 'murillo7',
        pages: [640],
        note: 'Capítulo base del módulo.',
      }),
    ],
  }),
];

export const supportModules = [
  createModule({
    id: 'svb-adultos',
    title: 'Soporte vital básico en adultos',
    category: 'soporte',
    section: 'Soporte vital',
    chapter: 'Cap. 1',
    page: 2,
    summary: 'Acceso de soporte inmediato.',
    content: [
      { label: 'Sección', value: 'Soporte vital' },
      { label: 'Capítulo base', value: 'Cap. 1 · Soporte vital básico en adultos' },
    ],
    bibliography: [
      createBibliographyEntry({
        id: 'svb-cap1',
        referenceId: 'murillo7',
        pages: [2],
        note: 'Acceso de soporte inmediato.',
      }),
    ],
  }),
  createModule({
    id: 'sva-adultos',
    title: 'Soporte vital avanzado en adultos',
    category: 'soporte',
    section: 'Soporte vital',
    chapter: 'Cap. 2',
    page: 7,
    summary: 'Acceso de soporte inmediato.',
    content: [
      { label: 'Sección', value: 'Soporte vital' },
      { label: 'Capítulo base', value: 'Cap. 2 · Soporte vital avanzado en adultos' },
    ],
    bibliography: [
      createBibliographyEntry({
        id: 'sva-cap2',
        referenceId: 'murillo7',
        pages: [7],
        note: 'Acceso de soporte inmediato.',
      }),
    ],
  }),
];

export const explorationModules = [
  createModule({
    id: 'gasometria',
    title: 'Gasometría, pulsioximetría y capnografía',
    category: 'exploracion',
    section: 'Exploraciones complementarias',
    chapter: 'Cap. 8',
    page: 64,
    summary: 'Exploración complementaria.',
    content: [
      { label: 'Sección', value: 'Exploraciones complementarias' },
      { label: 'Capítulo base', value: 'Cap. 8 · Gasometría, pulsioximetría y capnografía' },
    ],
    bibliography: [
      createBibliographyEntry({
        id: 'gasometria-cap8',
        referenceId: 'murillo7',
        pages: [64],
        note: 'Exploración de apoyo relacionada.',
      }),
    ],
  }),
  createModule({
    id: 'ecg-urgencias',
    title: 'Electrocardiografía de urgencias',
    category: 'exploracion',
    section: 'Exploraciones complementarias',
    chapter: 'Cap. 9',
    page: 71,
    summary: 'Exploración complementaria.',
    content: [
      { label: 'Sección', value: 'Exploraciones complementarias' },
      { label: 'Capítulo base', value: 'Cap. 9 · Electrocardiografía de urgencias' },
    ],
    bibliography: [
      createBibliographyEntry({
        id: 'ecg-cap9',
        referenceId: 'murillo7',
        pages: [71],
        note: 'Exploración de apoyo relacionada.',
      }),
    ],
  }),
  createModule({
    id: 'radiografia-torax',
    title: 'Radiografía de tórax',
    category: 'exploracion',
    section: 'Exploraciones complementarias',
    chapter: 'Cap. 10',
    page: 83,
    summary: 'Exploración complementaria.',
    content: [
      { label: 'Sección', value: 'Exploraciones complementarias' },
      { label: 'Capítulo base', value: 'Cap. 10 · Radiografía de tórax' },
    ],
    bibliography: [
      createBibliographyEntry({
        id: 'rx-torax-cap10',
        referenceId: 'murillo7',
        pages: [83],
        note: 'Exploración de apoyo relacionada.',
      }),
    ],
  }),
  createModule({
    id: 'ecografia',
    title: 'Ecografía',
    category: 'exploracion',
    section: 'Exploraciones complementarias',
    chapter: 'Cap. 12',
    page: 108,
    summary: 'Exploración complementaria.',
    content: [
      { label: 'Sección', value: 'Exploraciones complementarias' },
      { label: 'Capítulo base', value: 'Cap. 12 · Ecografía' },
    ],
    bibliography: [
      createBibliographyEntry({
        id: 'eco-cap12',
        referenceId: 'murillo7',
        pages: [108],
        note: 'Exploración de apoyo relacionada.',
      }),
    ],
  }),
];

export const relatedModules = [
  createModule({
    id: 'insuficiencia-cardiaca',
    title: 'Insuficiencia cardíaca',
    category: 'relacionado',
    section: 'Urgencias cardiovasculares',
    chapter: 'Cap. 19',
    page: 161,
    summary: 'Cruce relacionado.',
    content: [
      { label: 'Sección', value: 'Urgencias cardiovasculares' },
      { label: 'Capítulo base', value: 'Cap. 19 · Insuficiencia cardíaca' },
    ],
    bibliography: [
      createBibliographyEntry({
        id: 'ic-cap19',
        referenceId: 'murillo7',
        pages: [161],
        note: 'Cruce relacionado para esta capa.',
      }),
    ],
  }),
  createModule({
    id: 'nauseas-vomitos-diarrea',
    title: 'Náuseas, vómitos y diarrea',
    category: 'relacionado',
    section: 'Urgencias del aparato digestivo',
    chapter: 'Cap. 51',
    page: 358,
    summary: 'Cruce relacionado.',
    content: [
      { label: 'Sección', value: 'Urgencias del aparato digestivo' },
      { label: 'Capítulo base', value: 'Cap. 51 · Náuseas, vómitos y diarrea' },
    ],
    bibliography: [
      createBibliographyEntry({
        id: 'nvd-cap51',
        referenceId: 'murillo7',
        pages: [358],
        note: 'Cruce relacionado para esta capa.',
      }),
    ],
  }),
  createModule({
    id: 'crisis-epilepticas',
    title: 'Crisis epilépticas',
    category: 'relacionado',
    section: 'Urgencias neurológicas',
    chapter: 'Cap. 63',
    page: 435,
    summary: 'Cruce relacionado.',
    content: [
      { label: 'Sección', value: 'Urgencias neurológicas' },
      { label: 'Capítulo base', value: 'Cap. 63 · Crisis epilépticas' },
    ],
    bibliography: [
      createBibliographyEntry({
        id: 'crisis-cap63',
        referenceId: 'murillo7',
        pages: [435],
        note: 'Cruce relacionado para esta capa.',
      }),
    ],
  }),
];

export const utilityModules = [
  createModule({
    id: 'medicamentos',
    title: 'Medicamentos',
    category: 'herramienta',
    section: 'Uso transversal',
    chapter: 'Advertencia editorial',
    page: 5,
    summary: 'Espacio preparado para dosis, vía, duración y contraindicaciones.',
    content: [
      { label: 'Estado', value: 'Estructura preparada para contenido farmacológico' },
    ],
    calculations: [],
    treatment: [],
    bibliography: [
      createBibliographyEntry({
        id: 'medicamentos-advertencia',
        referenceId: 'murillo7',
        pages: [5],
        note: 'Advertencia general sobre dosis, vía, duración y contraindicaciones.',
      }),
    ],
  }),
  createModule({
    id: 'calculos',
    title: 'Cálculos',
    category: 'herramienta',
    section: 'Exploraciones complementarias',
    chapter: 'Cap. 5, Cap. 6 y Cap. 8',
    page: 36,
    summary: 'Espacio preparado para cálculos y apoyo interpretativo.',
    content: [
      { label: 'Estado', value: 'Estructura preparada para cálculos y apoyo interpretativo' },
    ],
    calculations: [
      { label: 'Bioquímica sanguínea', value: 'Cap. 5 · p. 36' },
      { label: 'Estudio de la coagulación', value: 'Cap. 6 · p. 51' },
      { label: 'Gasometría, pulsioximetría y capnografía', value: 'Cap. 8 · p. 64' },
    ],
    treatment: [],
    bibliography: [
      createBibliographyEntry({
        id: 'calculos-bioquimica',
        referenceId: 'murillo7',
        pages: [36],
        note: 'Bioquímica sanguínea.',
      }),
      createBibliographyEntry({
        id: 'calculos-coagulacion',
        referenceId: 'murillo7',
        pages: [51],
        note: 'Estudio de la coagulación.',
      }),
      createBibliographyEntry({
        id: 'calculos-gasometria',
        referenceId: 'murillo7',
        pages: [64],
        note: 'Gasometría, pulsioximetría y capnografía.',
      }),
    ],
  }),
];

export const recentActivity = [
  {
    time: '09:40',
    moduleId: 'dolor-toracico-agudo',
    title: 'Dolor torácico agudo',
    meta: 'Motivo de consulta · Cap. 25 · p. 207',
  },
  {
    time: '08:55',
    moduleId: 'gasometria',
    title: 'Gasometría, pulsioximetría y capnografía',
    meta: 'Exploraciones complementarias · Cap. 8 · p. 64',
  },
  {
    time: '08:10',
    moduleId: 'sva-adultos',
    title: 'Soporte vital avanzado en adultos',
    meta: 'Soporte vital · Cap. 2 · p. 7',
  },
];

export const getClinicalModule = (moduleId) =>
  clinicalModules.find((module) => module.id === moduleId) ?? clinicalModules[0];

export const coreReference = bibliographyCatalog.murillo7;
