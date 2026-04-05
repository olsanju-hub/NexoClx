import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Calculator,
  ChevronDown,
  ChevronRight,
  Clock3,
  ExternalLink,
  FileText,
  Pill,
  Search,
  Stethoscope,
} from 'lucide-react';
import {
  clinicalModules,
  coreReference,
  explorationModules,
  getClinicalModule,
  recentActivity,
  referenceSections,
  relatedModules,
  supportModules,
  utilityModules,
} from './data/modules';

const bibliographyHref = coreReference.filePath;
const brandMark = `${import.meta.env.BASE_URL}branding/NexoClx-mark.png`;
const bookCover = `${import.meta.env.BASE_URL}biblio/urgencias-murillo-7ma-cover.png`;

const shellBackground = {
  backgroundImage: 'linear-gradient(180deg, #f8fbfc 0%, #eef3f6 100%)',
};

const surfaceClass =
  'rounded-[1.4rem] border border-slate-200/80 bg-white shadow-[0_18px_40px_-34px_rgba(15,23,42,0.45)]';

const mutedSurfaceClass = 'rounded-[1.1rem] border border-slate-200/70 bg-slate-50/90';

const utilityCardConfig = {
  medicamentos: {
    icon: Pill,
    description: 'Dosis, vía y contraindicaciones.',
    links: [
      { label: 'Dosis' },
      { label: 'Vía' },
      { label: 'Contraindicaciones' },
    ],
  },
  calculos: {
    icon: Calculator,
    description: 'Bioquímica, coagulación y gasometría.',
    links: [
      { label: 'Bioquímica' },
      { label: 'Coagulación' },
      { label: 'Gasometría' },
    ],
  },
};

const formatModuleReference = (module) => `${module.chapter} · p. ${module.page}`;

const SectionHeading = ({ title, note }) => (
  <div className="mb-4">
    <h2 className="text-base font-semibold tracking-tight text-slate-950">{title}</h2>
    {note ? <p className="mt-1 text-sm text-slate-500">{note}</p> : null}
  </div>
);

const HeaderButton = ({ children, href, icon: Icon, onClick, primary = false }) => {
  const className = `inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
    primary
      ? 'bg-slate-950 text-white hover:bg-slate-800'
      : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-950'
  }`;

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        <Icon className="h-4 w-4" />
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      <Icon className="h-4 w-4" />
      {children}
    </button>
  );
};

const BrandLockup = ({ onClick }) => (
  <button type="button" onClick={onClick} className="inline-flex items-center gap-3 text-left">
    <img src={brandMark} alt="NexoClx" className="h-8 w-8 shrink-0 object-contain" />
    <span className="flex items-baseline text-lg font-semibold tracking-tight text-slate-950">
      Nexo<span className="text-sky-600">Clx</span>
    </span>
  </button>
);

const ModuleRow = ({ module, active = false, href, onClick }) => {
  const Element = onClick ? 'button' : href ? 'a' : 'div';

  return (
    <Element
      {...(onClick ? { type: 'button', onClick } : {})}
      {...(href ? { href, target: '_blank', rel: 'noreferrer' } : {})}
      className={`group flex w-full items-center justify-between gap-4 rounded-[1rem] border px-4 py-3 text-left transition-colors ${
        active
          ? 'border-sky-200 bg-sky-50/90'
          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-900">{module.title}</p>
        <p className="mt-1 truncate text-xs text-slate-500">{formatModuleReference(module)}</p>
      </div>
      {href ? (
        <ExternalLink className="h-4 w-4 shrink-0 text-slate-300 transition-colors group-hover:text-slate-500" />
      ) : (
        <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5" />
      )}
    </Element>
  );
};

const UtilityCard = ({ module }) => {
  const config = utilityCardConfig[module.id];
  const Icon = config.icon;
  const fallbackHref = module.bibliography[0]?.href ?? bibliographyHref;
  const links = config.links.map((item, index) => ({
    label: item.label,
    href: module.bibliography[index]?.href ?? fallbackHref,
  }));

  return (
    <article className={`${surfaceClass} p-5`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-slate-950">{module.title}</h3>
          <p className="mt-1 text-sm text-slate-500">{config.description}</p>
        </div>
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
          <Icon className="h-5 w-5" />
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {links.map((link) => (
          <a
            key={`${module.id}-${link.label}`}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-white hover:text-slate-950"
          >
            {link.label}
          </a>
        ))}
      </div>
    </article>
  );
};

const DetailGroup = ({ title, items, emptyLabel }) => (
  <div className={`${mutedSurfaceClass} p-4`}>
    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">{title}</p>
    {items.length > 0 ? (
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <div
            key={`${title}-${item.label}-${item.value}`}
            className="flex items-start justify-between gap-3 text-sm"
          >
            <span className="text-slate-500">{item.label}</span>
            <span className="text-right font-medium text-slate-900">{item.value}</span>
          </div>
        ))}
      </div>
    ) : (
      <p className="mt-3 text-sm text-slate-500">{emptyLabel}</p>
    )}
  </div>
);

const BibliographyBlock = ({ entries }) => (
  <section className={`${surfaceClass} p-5`}>
    <SectionHeading title="Bibliografía" note="Referencia exacta del módulo activo." />

    <div className="space-y-3">
      {entries.map((entry) => (
        <div key={entry.internalId} className={`${mutedSurfaceClass} p-4`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">{entry.shortReference}</p>
              <p className="mt-1 text-sm text-slate-500">Páginas: {entry.pages.join(', ')}</p>
              {entry.note ? <p className="mt-2 text-sm text-slate-600">{entry.note}</p> : null}
            </div>
            <a
              href={entry.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950"
            >
              Abrir
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const App = () => {
  const [view, setView] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState(clinicalModules[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [referenceOpen, setReferenceOpen] = useState(false);
  const referenceRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const selectedModule = getClinicalModule(selectedModuleId);
  const searchTerm = searchQuery.trim().toLowerCase();
  const searchResults = searchTerm
    ? clinicalModules
        .filter((module) =>
          [module.title, module.section, module.chapter].join(' ').toLowerCase().includes(searchTerm),
        )
        .slice(0, 6)
    : [];
  const quickChips = clinicalModules.slice(0, 6);
  const primaryClinicalModules = clinicalModules.slice(0, 4);

  const navigateTo = (nextView) => {
    setView(nextView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openClinicalLayer = (moduleId) => {
    setSelectedModuleId(moduleId);
    setSearchQuery('');
    setView('motivo-consulta');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openRecentItem = (moduleId) => {
    const existsInClinical = clinicalModules.some((module) => module.id === moduleId);

    if (existsInClinical) {
      openClinicalLayer(moduleId);
      return;
    }

    navigateTo('motivo-consulta');
  };

  const focusReference = () => {
    setReferenceOpen(true);

    if (view !== 'home') {
      setView('home');
    }

    window.setTimeout(() => {
      referenceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, view === 'home' ? 80 : 220);
  };

  const Header = () => (
    <header
      className={`fixed left-0 right-0 top-0 z-50 border-b border-slate-200/80 bg-white/92 backdrop-blur-xl ${
        isScrolled ? 'shadow-[0_10px_28px_-26px_rgba(15,23,42,0.7)]' : ''
      }`}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex h-16 items-center justify-between gap-3">
          <BrandLockup onClick={() => navigateTo('home')} />

          <div className="flex items-center gap-2">
            <HeaderButton icon={BookOpen} onClick={focusReference}>
              Obra base
            </HeaderButton>
            <HeaderButton href={bibliographyHref} icon={ExternalLink} primary>
              Abrir PDF
            </HeaderButton>
          </div>
        </div>
      </div>
    </header>
  );

  const Hero = () => (
    <section className="px-5 pb-8 pt-28 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="max-w-3xl text-[2rem] font-semibold tracking-tight text-slate-950 sm:text-[2.7rem]">
          {view === 'home' ? 'Consulta clínica inicial' : selectedModule.title}
        </h1>

        {view === 'home' ? (
          <>
            <div className="relative mt-5 max-w-3xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && searchResults[0]) {
                    openClinicalLayer(searchResults[0].id);
                  }
                }}
                placeholder="Buscar motivo de consulta"
                className={`${surfaceClass} w-full px-5 py-4 pl-12 text-base text-slate-900 outline-none placeholder:text-slate-400`}
              />
            </div>

            {searchTerm ? (
              <div className={`${surfaceClass} mt-3 max-w-3xl overflow-hidden`}>
                {searchResults.length > 0 ? (
                  searchResults.map((module) => (
                    <button
                      key={module.id}
                      type="button"
                      onClick={() => openClinicalLayer(module.id)}
                      className="flex w-full items-center justify-between gap-3 border-b border-slate-100 px-5 py-3 text-left last:border-b-0 hover:bg-slate-50"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{module.title}</p>
                        <p className="mt-1 text-xs text-slate-500">{formatModuleReference(module)}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-300" />
                    </button>
                  ))
                ) : (
                  <p className="px-5 py-4 text-sm text-slate-500">Sin coincidencias en esta capa.</p>
                )}
              </div>
            ) : null}

            <div className="mt-4 flex flex-wrap gap-2">
              {quickChips.map((module) => (
                <button
                  key={module.id}
                  type="button"
                  onClick={() => openClinicalLayer(module.id)}
                  className="rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-sky-200 hover:bg-sky-50 hover:text-sky-800"
                >
                  {module.title}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600">
              Motivo de consulta
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600">
              {selectedModule.section}
            </span>
            <a
              href={selectedModule.bibliography[0]?.href ?? bibliographyHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950"
            >
              {formatModuleReference(selectedModule)}
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        )}
      </div>
    </section>
  );

  const HomeView = () => (
    <div className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,0.9fr)]">
        <section className={`${surfaceClass} p-6 sm:p-7`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-sky-700">
                Acción principal
              </p>
              <h2 className="mt-2 text-[1.65rem] font-semibold tracking-tight text-slate-950">
                Motivo de consulta
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Entradas iniciales por capítulo y página.
              </p>
            </div>

            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <Stethoscope className="h-5 w-5" />
            </span>
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {primaryClinicalModules.map((module) => (
              <ModuleRow
                key={module.id}
                module={module}
                active={module.id === selectedModuleId}
                onClick={() => openClinicalLayer(module.id)}
              />
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <p className="text-sm text-slate-500">Siete accesos clínicos listos para crecer.</p>
            <button
              type="button"
              onClick={() => openClinicalLayer(selectedModuleId)}
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
            >
              Abrir capa clínica
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </section>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          {utilityModules.map((module) => (
            <UtilityCard key={module.id} module={module} />
          ))}
        </div>
      </div>

      <section ref={referenceRef} id="obra-base" className={`${surfaceClass} mt-4 p-4 sm:p-5`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <img
              src={bookCover}
              alt={coreReference.title}
              className="h-20 w-[3.8rem] shrink-0 rounded-xl border border-slate-200 object-cover"
            />
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
                Obra base
              </p>
              <h2 className="mt-1 max-w-2xl text-sm font-semibold leading-relaxed text-slate-900">
                {coreReference.title}
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setReferenceOpen((current) => !current)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950"
            >
              Ver secciones
              <ChevronDown
                className={`h-4 w-4 transition-transform ${referenceOpen ? 'rotate-180' : ''}`}
              />
            </button>
            <a
              href={bibliographyHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950"
            >
              Abrir PDF
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        {referenceOpen ? (
          <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {referenceSections.map((section) => (
              <div key={section} className={`${mutedSurfaceClass} px-4 py-3 text-sm text-slate-700`}>
                {section}
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <section className={`${surfaceClass} mt-4 overflow-hidden`}>
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-semibold tracking-tight text-slate-950">Actividad reciente</h2>
        </div>

        <div className="divide-y divide-slate-100">
          {recentActivity.map((item) => (
            <button
              key={`${item.time}-${item.moduleId}`}
              type="button"
              onClick={() => openRecentItem(item.moduleId)}
              className="flex w-full items-center justify-between gap-4 px-5 py-3 text-left transition-colors hover:bg-slate-50"
            >
              <div className="flex min-w-0 items-center gap-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                  <Clock3 className="h-3.5 w-3.5" />
                  {item.time}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="truncate text-xs text-slate-500">{item.meta}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );

  const ClinicalView = () => (
    <div className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigateTo('home')}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </button>

        <a
          href={selectedModule.bibliography[0]?.href ?? bibliographyHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950"
        >
          Abrir referencia
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_340px]">
        <div className="space-y-4">
          <section className={`${surfaceClass} p-5`}>
            <SectionHeading title="Motivos de consulta" note="Selección principal de esta capa." />
            <div className="grid gap-2 md:grid-cols-2">
              {clinicalModules.map((module) => (
                <ModuleRow
                  key={module.id}
                  module={module}
                  active={module.id === selectedModuleId}
                  onClick={() => setSelectedModuleId(module.id)}
                />
              ))}
            </div>
          </section>

          <section className={`${surfaceClass} p-5`}>
            <SectionHeading title="Exploraciones de apoyo" note="Capítulos complementarios enlazados a su referencia." />
            <div className="grid gap-2 md:grid-cols-2">
              {explorationModules.map((module) => (
                <ModuleRow
                  key={module.id}
                  module={module}
                  href={module.bibliography[0]?.href ?? bibliographyHref}
                />
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-4">
          <section className={`${surfaceClass} p-5`}>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-sky-700">
              Módulo activo
            </p>
            <h2 className="mt-2 text-[1.4rem] font-semibold tracking-tight text-slate-950">
              {selectedModule.title}
            </h2>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700">
                {selectedModule.section}
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700">
                {formatModuleReference(selectedModule)}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <DetailGroup
                title="Contenido"
                items={selectedModule.content}
                emptyLabel="Sin contenido desplegado en esta capa."
              />
              <DetailGroup
                title="Cálculos"
                items={selectedModule.calculations}
                emptyLabel="Sin cálculos asociados."
              />
              <DetailGroup
                title="Tratamiento"
                items={selectedModule.treatment}
                emptyLabel="Sin tratamiento desplegado."
              />
            </div>
          </section>

          <section className={`${surfaceClass} p-5`}>
            <SectionHeading title="Soporte vital" note="Acceso rápido de apoyo inicial." />
            <div className="space-y-2">
              {supportModules.map((module) => (
                <ModuleRow
                  key={module.id}
                  module={module}
                  href={module.bibliography[0]?.href ?? bibliographyHref}
                />
              ))}
            </div>
          </section>

          <section className={`${surfaceClass} p-5`}>
            <SectionHeading title="Cruces frecuentes" note="Capítulos relacionados con esta capa." />
            <div className="space-y-2">
              {relatedModules.map((module) => (
                <ModuleRow
                  key={module.id}
                  module={module}
                  href={module.bibliography[0]?.href ?? bibliographyHref}
                />
              ))}
            </div>
          </section>

          <BibliographyBlock entries={selectedModule.bibliography} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen text-slate-900" style={shellBackground}>
      <Header />

      <main>
        <Hero />
        {view === 'home' ? <HomeView /> : <ClinicalView />}
      </main>

      <footer className="border-t border-slate-200/80 px-5 py-6 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>NexoClx · Consulta clínica inicial</p>
          <a
            href={bibliographyHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 transition-colors hover:text-slate-900"
          >
            <FileText className="h-4 w-4" />
            {coreReference.shortTitle}
          </a>
        </div>
      </footer>
    </div>
  );
};

export default App;
