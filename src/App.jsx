import React, { useEffect, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  BookOpen,
  Calculator,
  ChevronRight,
  Clock3,
  ExternalLink,
  FileText,
  HeartPulse,
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
const brandLogo = `${import.meta.env.BASE_URL}branding/NexoClx.png`;

const shellBackground = {
  backgroundImage:
    'radial-gradient(circle at top right, rgba(14,165,233,0.12), transparent 26%), radial-gradient(circle at top left, rgba(15,23,42,0.08), transparent 24%), linear-gradient(180deg, #f7fafc 0%, #f3f6f8 100%)',
};

const surfaceClass =
  'rounded-[2rem] border border-slate-200/80 bg-white/88 shadow-[0_26px_70px_-50px_rgba(15,23,42,0.42)] backdrop-blur';

const utilityCardConfig = {
  medicamentos: {
    icon: Pill,
    accent: 'bg-sky-50 text-sky-700 ring-sky-100',
    description:
      'Estructura preparada para dosis, vía, duración y contraindicaciones enlazadas a la referencia usada.',
    previewItems: ['Dosis recomendada', 'Vía de administración', 'Contraindicaciones'],
  },
  calculos: {
    icon: Calculator,
    accent: 'bg-slate-100 text-slate-700 ring-slate-200',
    description:
      'Estructura preparada para cálculos e interpretación con referencia directa a la bibliografía base.',
    previewItems: ['Bioquímica sanguínea', 'Estudio de la coagulación', 'Gasometría'],
  },
};

const viewCopy = {
  home: {
    title: 'Consulta clínica inicial',
    description:
      'Acceso directo a motivos de consulta, soporte vital y exploraciones del manual de referencia sin ruido de interfaz.',
    breadcrumb: 'Inicio',
  },
  'motivo-consulta': {
    title: 'Motivo de consulta',
    description:
      'Primera capa de orientación construida con módulos enlazados a capítulos concretos y bibliografía estructurada por página.',
    breadcrumb: 'Motivo de consulta',
  },
};

const formatModuleReference = (module) => `${module.chapter} · p. ${module.page}`;

const BrandLockup = ({ compact = false, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="group text-left transition-transform duration-300 hover:scale-[1.01]"
  >
    <span
      className={`block overflow-hidden rounded-[1.35rem] border border-slate-200/80 bg-slate-950 p-1.5 shadow-[0_24px_55px_-38px_rgba(14,165,233,0.95)] ring-1 ring-sky-900/10 ${
        compact ? 'w-[148px]' : 'w-[228px]'
      }`}
    >
      <img src={brandLogo} alt="NexoClx" className="block h-auto w-full object-contain" />
    </span>
  </button>
);

const HeaderAction = ({ href, children, icon: Icon, subtle = false }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
      subtle
        ? 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
        : 'bg-slate-950 text-white hover:bg-sky-800'
    }`}
  >
    <Icon className="h-4 w-4" />
    {children}
  </a>
);

const ChapterRow = ({ module, active = false, dark = false, onClick }) => {
  const Element = onClick ? 'button' : 'div';

  return (
    <Element
      {...(onClick ? { type: 'button', onClick } : {})}
      className={`group flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition-all ${
        dark
          ? active
            ? 'border-sky-500/40 bg-white/10'
            : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]'
          : active
            ? 'border-sky-200 bg-sky-50/80'
            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/90'
      }`}
    >
      <span>
        <span className={`block text-sm font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>
          {module.title}
        </span>
        <span className={`mt-1 block text-xs ${dark ? 'text-slate-300' : 'text-slate-500'}`}>
          {module.section} · {formatModuleReference(module)}
        </span>
      </span>
      <ChevronRight
        className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${
          dark ? 'text-slate-400' : 'text-slate-300'
        }`}
      />
    </Element>
  );
};

const UtilityCard = ({ module }) => {
  const config = utilityCardConfig[module.id];
  const Icon = config.icon;

  return (
    <article className={`${surfaceClass} flex h-full flex-col justify-between p-7`}>
      <div>
        <div
          className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ${config.accent}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="mb-3 text-xl font-semibold tracking-tight text-slate-950">{module.title}</h3>
        <p className="text-sm leading-relaxed text-slate-600">{config.description}</p>
      </div>

      <div className="mt-8 space-y-2">
        {config.previewItems.map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 text-sm font-medium text-slate-700"
          >
            {item}
          </div>
        ))}
      </div>
    </article>
  );
};

const SectionHeader = ({ eyebrow, title, description }) => (
  <div className="mb-6">
    <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-sky-700">
      {eyebrow}
    </p>
    <h3 className="text-[1.35rem] font-semibold tracking-tight text-slate-950">{title}</h3>
    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">{description}</p>
  </div>
);

const StructuredList = ({ title, items, emptyLabel }) => (
  <div className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50/70 p-5">
    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-sky-700">{title}</p>
    {items.length > 0 ? (
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={`${title}-${item.label}-${item.value}`} className="rounded-2xl bg-white px-4 py-3 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
            <p className="mt-1 text-sm font-medium text-slate-800">{item.value}</p>
          </div>
        ))}
      </div>
    ) : (
      <p className="mt-4 text-sm text-slate-500">{emptyLabel}</p>
    )}
  </div>
);

const BibliographyBlock = ({ entries }) => (
  <div className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50/70 p-5">
    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-sky-700">
      Bibliografía estructurada
    </p>

    <div className="mt-4 space-y-3">
      {entries.map((entry) => (
        <div key={entry.internalId} className="rounded-2xl bg-white px-4 py-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">{entry.shortReference}</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-500">{entry.reference}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 font-medium text-slate-600">
              Páginas: {entry.pages.join(', ')}
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 font-medium text-slate-600">
              ID: {entry.internalId}
            </span>
          </div>
          {entry.note ? (
            <p className="mt-3 text-sm text-slate-500">{entry.note}</p>
          ) : null}
          <a
            href={entry.href}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-sky-800 transition-colors hover:text-sky-900"
          >
            Abrir referencia
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      ))}
    </div>
  </div>
);

const App = () => {
  const [view, setView] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState(clinicalModules[0].id);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 32);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateTo = (newView) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setView(newView);
  };

  const openClinicalLayer = (moduleId) => {
    setSelectedModuleId(moduleId);
    navigateTo('motivo-consulta');
  };

  const currentView = viewCopy[view];
  const selectedModule = getClinicalModule(selectedModuleId);
  const quickSearchModules = clinicalModules.slice(0, 6);
  const heroPriorityModules = clinicalModules.slice(0, 4);

  const Header = () => (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200/80 bg-white/88 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="flex min-h-[84px] items-center justify-between gap-4">
          <BrandLockup onClick={() => navigateTo('home')} />

          <div className="flex items-center gap-3">
            <HeaderAction href={bibliographyHref} icon={BookOpen} subtle>
              Obra base
            </HeaderAction>
            <HeaderAction href={bibliographyHref} icon={ExternalLink}>
              Abrir PDF
            </HeaderAction>
          </div>
        </div>

        {isScrolled && (
          <div className="flex items-center gap-2 pb-4 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="transition-colors hover:text-sky-700"
            >
              Inicio
            </button>
            {view !== 'home' && (
              <>
                <ChevronRight className="h-3 w-3" />
                <span className="text-slate-900">{currentView.breadcrumb}</span>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );

  const Hero = () => (
    <section className="px-6 pb-14 pt-32 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.92fr)]">
        <div className="pt-4">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-sky-800">
            <BookOpen className="h-4 w-4" />
            Base clínica activa
          </div>

          <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-[3.35rem]">
            {currentView.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            {currentView.description}
          </p>

          {view === 'home' ? (
            <>
              <div className="relative mt-10 max-w-3xl overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_30px_80px_-55px_rgba(15,23,42,0.45)]">
                <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar motivo de consulta o capítulo del manual"
                  className="w-full bg-transparent py-5 pl-14 pr-6 text-lg text-slate-800 outline-none placeholder:text-slate-400"
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {quickSearchModules.map((module) => (
                  <button
                    key={module.id}
                    type="button"
                    onClick={() => openClinicalLayer(module.id)}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:border-sky-200 hover:bg-sky-50 hover:text-sky-800"
                  >
                    {module.title}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="mt-10 inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
              <HeartPulse className="h-4 w-4 text-sky-700" />
              Motivo activo: <span className="font-semibold text-slate-950">{selectedModule.title}</span>
            </div>
          )}
        </div>

        <aside className={`${surfaceClass} relative overflow-hidden p-7 sm:p-8`}>
          <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-sky-200/30 blur-3xl" />

          <div className="relative">
            <div className="mb-6 overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-slate-950 p-2 shadow-[0_30px_70px_-45px_rgba(14,165,233,0.9)]">
              <img src={brandLogo} alt="NexoClx" className="block h-auto w-full object-contain" />
            </div>

            {view === 'home' ? (
              <>
                <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-sky-700">
                  Referencia de trabajo
                </p>
                <h2 className="max-w-sm text-2xl font-semibold tracking-tight text-slate-950">
                  Medicina de urgencias y emergencias
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Guía diagnóstica y protocolos de actuación, 7.ª edición.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {referenceSections.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-slate-200/80 bg-slate-50/90 px-4 py-3 text-sm font-medium text-slate-700"
                    >
                      {item}
                    </div>
                  ))}
                </div>

                <a
                  href={bibliographyHref}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:border-slate-300 hover:text-slate-950"
                >
                  Abrir bibliografía
                  <ExternalLink className="h-4 w-4" />
                </a>
              </>
            ) : (
              <>
                <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-sky-700">
                  Ruta abierta
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                  {selectedModule.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{selectedModule.summary}</p>

                <div className="mt-8 space-y-3">
                  <div className="rounded-2xl border border-slate-200/80 bg-slate-50/90 px-4 py-4">
                    <p className="text-sm font-semibold text-slate-900">Sección</p>
                    <p className="mt-1 text-sm text-slate-500">{selectedModule.section}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200/80 bg-slate-50/90 px-4 py-4">
                    <p className="text-sm font-semibold text-slate-900">Referencia exacta</p>
                    <p className="mt-1 text-sm text-slate-500">{formatModuleReference(selectedModule)}</p>
                  </div>
                </div>

                <a
                  href={selectedModule.bibliography[0]?.href ?? bibliographyHref}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:border-slate-300 hover:text-slate-950"
                >
                  Abrir referencia exacta
                  <ExternalLink className="h-4 w-4" />
                </a>
              </>
            )}
          </div>
        </aside>
      </div>
    </section>
  );

  const HomeView = () => (
    <div className="mx-auto max-w-7xl px-6 pb-24 sm:px-8">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,0.9fr)]">
        <button
          type="button"
          onClick={() => openClinicalLayer(selectedModuleId)}
          className="group relative overflow-hidden rounded-[2rem] bg-slate-950 p-8 text-left shadow-[0_34px_90px_-50px_rgba(15,23,42,0.9)] sm:p-10"
        >
          <div className="absolute right-6 top-6 w-[152px] overflow-hidden rounded-[1.2rem] border border-white/10 bg-slate-950/90 p-1.5 opacity-80 shadow-[0_22px_50px_-35px_rgba(56,189,248,0.95)]">
            <img src={brandLogo} alt="NexoClx" className="block h-auto w-full object-contain" />
          </div>
          <div className="relative z-10">
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <Stethoscope className="h-7 w-7 text-white" />
            </div>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
              <div>
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-sky-300">
                  Acceso principal
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
                  Motivo de consulta
                </h2>
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-300">
                  Primera capa montada como módulos clínicos con bibliografía enlazable y página exacta.
                </p>

                <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white">
                  Abrir capa clínica
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>

              <div className="space-y-3">
                {heroPriorityModules.map((module) => (
                  <div
                    key={module.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4"
                  >
                    <p className="text-sm font-semibold text-white">{module.title}</p>
                    <p className="mt-1 text-xs text-slate-400">{formatModuleReference(module)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </button>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-1">
          {utilityModules.map((module) => (
            <UtilityCard key={module.id} module={module} />
          ))}
        </div>
      </div>

      <section className={`${surfaceClass} mt-6 overflow-hidden`}>
        <div className="flex items-center justify-between border-b border-slate-200/80 px-7 py-6 sm:px-8">
          <div className="flex items-center gap-3">
            <Activity className="h-4 w-4 text-sky-700" />
            <h3 className="text-lg font-semibold tracking-tight text-slate-950">Actividad reciente</h3>
          </div>
          <button
            type="button"
            className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
          >
            Ver todo
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {recentActivity.map((item) => (
            <button
              key={`${item.time}-${item.moduleId}`}
              type="button"
              onClick={() => openClinicalLayer(item.moduleId)}
              className="flex w-full items-center justify-between gap-4 px-7 py-5 text-left transition-colors hover:bg-slate-50/90 sm:px-8"
            >
              <div className="flex items-center gap-5">
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                  <Clock3 className="h-3.5 w-3.5" />
                  {item.time}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.meta}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-300" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );

  const ClinicalView = () => (
    <div className="mx-auto max-w-7xl px-6 pb-24 sm:px-8">
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigateTo('home')}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:border-slate-300 hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a inicio
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_360px]">
        <div className="space-y-6">
          <section className={`${surfaceClass} p-7 sm:p-8`}>
            <SectionHeader
              eyebrow="Capítulos prioritarios"
              title="Entradas iniciales para esta capa"
              description="Selección de módulos enlazados a capítulos concretos del índice y preparados para crecer con contenido, cálculos, tratamiento y bibliografía."
            />

            <div className="grid gap-3 md:grid-cols-2">
              {clinicalModules.map((module) => (
                <ChapterRow
                  key={module.id}
                  module={module}
                  active={module.id === selectedModuleId}
                  onClick={() => setSelectedModuleId(module.id)}
                />
              ))}
            </div>
          </section>

          <section className={`${surfaceClass} p-7 sm:p-8`}>
            <SectionHeader
              eyebrow="Exploraciones de apoyo"
              title="Pruebas que acompañan la primera valoración"
              description="Módulos complementarios ya preparados para enlazar su bibliografía exacta."
            />

            <div className="grid gap-3 md:grid-cols-2">
              {explorationModules.map((module) => (
                <ChapterRow key={module.id} module={module} />
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="overflow-hidden rounded-[2rem] bg-slate-950 p-7 shadow-[0_34px_90px_-56px_rgba(15,23,42,0.9)]">
            <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-sky-300">
              Soporte inmediato
            </p>
            <h3 className="text-[1.35rem] font-semibold tracking-tight text-white">
              Soporte vital antes de profundizar
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              El primer tramo de la ruta enlaza con módulos de soporte vital ya referenciados por capítulo y página.
            </p>

            <div className="mt-6 space-y-3">
              {supportModules.map((module) => (
                <ChapterRow key={module.id} module={module} dark />
              ))}
            </div>
          </section>

          <section className={`${surfaceClass} p-7`}>
            <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-sky-700">
              Estructura del módulo
            </p>
            <h3 className="text-[1.2rem] font-semibold tracking-tight text-slate-950">
              {selectedModule.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{selectedModule.summary}</p>

            <div className="mt-5 space-y-4">
              <StructuredList
                title="Contenido"
                items={selectedModule.content}
                emptyLabel="Sin contenido desplegado en esta capa."
              />
              <StructuredList
                title="Cálculos"
                items={selectedModule.calculations}
                emptyLabel="Sin cálculos asociados en esta capa."
              />
              <StructuredList
                title="Tratamiento"
                items={selectedModule.treatment}
                emptyLabel="Sin tratamiento desplegado en esta capa."
              />
            </div>
          </section>

          <section className={`${surfaceClass} p-7`}>
            <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-sky-700">
              Cruces frecuentes
            </p>
            <h3 className="text-[1.2rem] font-semibold tracking-tight text-slate-950">
              Capítulos relacionados
            </h3>
            <div className="mt-5 space-y-3">
              {relatedModules.map((module) => (
                <ChapterRow key={module.id} module={module} />
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

      <footer className="border-t border-slate-200/80 px-6 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-slate-500 sm:flex-row">
          <BrandLockup compact onClick={() => navigateTo('home')} />

          <a
            href={bibliographyHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 transition-colors hover:text-slate-900"
          >
            <BookOpen className="h-4 w-4" />
            {coreReference.shortTitle}
          </a>
        </div>
      </footer>
    </div>
  );
};

export default App;
