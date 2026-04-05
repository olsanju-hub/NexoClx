const baseUrl = import.meta.env.BASE_URL;

export const bibliographyCatalog = {
  murillo7: {
    id: 'murillo7',
    title: 'Medicina de urgencias y emergencias. Guía diagnóstica y protocolos de actuación, 7.ª edición',
    shortTitle: 'Murillo 7.ª ed.',
    filePath: `${baseUrl}biblio/urgencias-murillo-7ma.pdf`,
  },
};

export const buildReferenceHref = (referenceId, pdfPage) => {
  const source = bibliographyCatalog[referenceId];

  if (!source) {
    return null;
  }

  return pdfPage ? `${source.filePath}#page=${pdfPage}` : source.filePath;
};

export const createBibliographyEntry = ({
  id,
  referenceId,
  indexPages = [],
  verifiedPages = [],
  pdfPages = [],
  note = '',
}) => {
  const source = bibliographyCatalog[referenceId];
  const firstPdfPage = Array.isArray(pdfPages) && pdfPages.length > 0 ? pdfPages[0] : null;

  return {
    id,
    referenceId,
    reference: source?.title ?? referenceId,
    shortReference: source?.shortTitle ?? referenceId,
    filePath: source?.filePath ?? '',
    indexPages,
    verifiedPages,
    pdfPages,
    href: buildReferenceHref(referenceId, firstPdfPage),
    internalId: `${referenceId}:${id}`,
    note,
  };
};
