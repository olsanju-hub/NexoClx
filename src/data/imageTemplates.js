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

export const imageTemplateAudit = [
  {
    id: 'rx-torax-sistematica',
    name: 'RX tórax sistemática',
    bibliographyBase: 'Murillo 7.ª ed. · Cap. 10 Radiografía de tórax',
    location: 'src/data/imageTemplates.js',
    status: 'en desarrollo',
    note:
      'Se deja la estructura de plantilla, pero no se añade todavía una secuencia diagnóstica completa porque la bibliografía específica de radiología no está en el repo actual.',
    bibliography: [
      referenceEntry({
        id: 'rx-torax-cap10',
        indexPage: 83,
        pdfPage: 108,
        note: 'Capítulo base auditado disponible en la obra principal.',
      }),
    ],
    scaffold: {
      title: 'RX tórax sistemática',
      checklist: [],
      overlays: [],
      annotations: [],
    },
  },
];
