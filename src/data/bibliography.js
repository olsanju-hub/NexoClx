const baseUrl = import.meta.env.BASE_URL;

export const bibliographyCatalog = {
  murillo7: {
    id: 'murillo7',
    title: 'Medicina de urgencias y emergencias. Guía diagnóstica y protocolos de actuación, 7.ª edición',
    shortTitle: 'Murillo 7.ª ed.',
    filePath: `${baseUrl}biblio/urgencias-murillo-7ma.pdf`,
  },
};

export const buildReferenceHref = (referenceId, page) => {
  const source = bibliographyCatalog[referenceId];

  if (!source) {
    return null;
  }

  return page ? `${source.filePath}#page=${page}` : source.filePath;
};

export const createBibliographyEntry = ({
  id,
  referenceId,
  pages = [],
  note = '',
}) => {
  const source = bibliographyCatalog[referenceId];
  const firstPage = Array.isArray(pages) && pages.length > 0 ? pages[0] : null;

  return {
    id,
    referenceId,
    reference: source?.title ?? referenceId,
    shortReference: source?.shortTitle ?? referenceId,
    filePath: source?.filePath ?? '',
    pages,
    href: buildReferenceHref(referenceId, firstPage),
    internalId: `${referenceId}:${id}`,
    note,
  };
};
