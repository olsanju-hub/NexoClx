import React, { startTransition, useDeferredValue, useEffect, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Calculator,
  ChevronRight,
  Clock3,
  ExternalLink,
  Pill,
  Search,
  Stethoscope,
} from 'lucide-react';
import {
  calculateCha2ds2Vasc,
  calculateCockcroftGault,
  calculateHasBled,
  calculationAudit,
  getCalculator,
  implementedCalculators,
} from './data/calculators';
import { getMedication, medicationGroups } from './data/medications';
import {
  bibliographyBaseUsed,
  coreReference,
  getMotivoModule,
  motivoConsultaModules,
  recentActivity,
} from './data/modules';
import { getProtocol } from './data/protocols';

const brandMark = `${import.meta.env.BASE_URL}branding/NexoClx-mark.png`;

const shellBackground = {
  backgroundImage: 'linear-gradient(180deg, #f7fafb 0%, #edf2f5 100%)',
};

const surfaceClass =
  'rounded-[1.35rem] border border-slate-200/80 bg-white shadow-[0_20px_40px_-34px_rgba(15,23,42,0.35)]';
const mutedSurfaceClass = 'rounded-[1rem] border border-slate-200/80 bg-slate-50/80';
const subtleButtonClass =
  'inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950';
const primaryButtonClass =
  'inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800';

const initialCalculatorInputs = {
  'cha2ds2-vasc': {
    age: '',
    sex: 'male',
    heartFailure: false,
    hypertension: false,
    diabetes: false,
    strokeOrEmbolism: false,
    vascularDisease: false,
  },
  'has-bled': {
    age: '',
    systolicBloodPressure: '',
    renalDysfunction: false,
    hepaticDysfunction: false,
    strokeHistory: false,
    bleedingHistory: false,
    labileInr: false,
    drugsPredisposingBleeding: false,
    alcohol: false,
  },
  'cockcroft-gault': {
    age: '',
    sex: 'male',
    weightKg: '',
    serumCreatinineMgDl: '',
  },
};

const pendingCalculations = calculationAudit.filter((item) => item.status !== 'implementado');

const compactMedicationPreview = medicationGroups.map((group) => ({
  title: group.title,
  items: group.items.slice(0, 2).map((id) => getMedication(id)),
}));

const formatReference = (item) => `${item.chapter} · p. ${item.verifiedPage}`;

const openPdf = (href) => {
  window.open(href, '_blank', 'noopener,noreferrer');
};

const updateNestedState = (setState, key, field, value) => {
  setState((current) => ({
    ...current,
    [key]: {
      ...current[key],
      [field]: value,
    },
  }));
};

const SectionTitle = ({ title, note }) => (
  <div className="mb-4">
    <h2 className="text-base font-semibold tracking-tight text-slate-950">{title}</h2>
    {note ? <p className="mt-1 text-sm text-slate-500">{note}</p> : null}
  </div>
);

const StatusBadge = ({ children, tone = 'neutral' }) => {
  const toneClass =
    tone === 'active'
      ? 'border-sky-200 bg-sky-50 text-sky-700'
      : tone === 'pending'
        ? 'border-amber-200 bg-amber-50 text-amber-700'
        : 'border-slate-200 bg-slate-100 text-slate-600';

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${toneClass}`}>
      {children}
    </span>
  );
};

const HeaderButton = ({ icon: Icon, children, onClick }) => (
  <button type="button" onClick={onClick} className={subtleButtonClass}>
    <Icon className="h-4 w-4" />
    {children}
  </button>
);

const LogoButton = ({ onClick }) => (
  <button type="button" onClick={onClick} className="inline-flex items-center gap-3 text-left">
    <img src={brandMark} alt="NexoClx" className="h-8 w-8 shrink-0 object-contain" />
    <span className="text-lg font-semibold tracking-tight text-slate-950">
      Nexo<span className="text-sky-600">Clx</span>
    </span>
  </button>
);

const SurfaceLinkRow = ({ title, meta, onClick, active = false }) => (
  <button
    type="button"
    onClick={onClick}
    className={`group flex w-full items-center justify-between gap-4 rounded-[1rem] border px-4 py-3 text-left transition-colors ${
      active ? 'border-sky-200 bg-sky-50/90' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
    }`}
  >
    <div className="min-w-0">
      <p className="truncate text-sm font-semibold text-slate-900">{title}</p>
      {meta ? <p className="mt-1 truncate text-xs text-slate-500">{meta}</p> : null}
    </div>
    <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5" />
  </button>
);

const BackBar = ({ label, onClick, actions = null }) => (
  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
    <button type="button" onClick={onClick} className={subtleButtonClass}>
      <ArrowLeft className="h-4 w-4" />
      {label}
    </button>
    {actions}
  </div>
);

const DetailPanel = ({ title, children }) => (
  <section className={`${surfaceClass} p-5`}>
    <SectionTitle title={title} />
    {children}
  </section>
);

const BibliographyBlock = ({ entries }) => (
  <section className={`${surfaceClass} p-5`}>
    <SectionTitle title="Bibliografía" note="Referencia concentrada del contenido visible." />
    <div className="space-y-3">
      {entries.map((entry) => (
        <div key={entry.internalId} className={`${mutedSurfaceClass} p-4`}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">{entry.shortReference}</p>
              <p className="mt-1 text-sm text-slate-500">
                Libro: p. {entry.verifiedPages.join(', ')}
                {entry.pdfPages.length > 0 ? ` · PDF: p. ${entry.pdfPages.join(', ')}` : ''}
              </p>
              {entry.note ? <p className="mt-2 text-sm text-slate-600">{entry.note}</p> : null}
            </div>
            {entry.href ? (
              <a href={entry.href} target="_blank" rel="noreferrer" className={subtleButtonClass}>
                Abrir
                <ExternalLink className="h-4 w-4" />
              </a>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  </section>
);

const SourceList = ({ sources }) => (
  <div className="space-y-2">
    {sources.map((source) => {
      if (source.type === 'cima') {
        return (
          <a
            key={source.url}
            href={source.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between gap-3 rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950"
          >
            <span>{source.label}</span>
            <ExternalLink className="h-4 w-4 shrink-0 text-slate-300" />
          </a>
        );
      }

      return (
        <div key={source.label} className="rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-sm font-medium text-slate-900">{source.label}</p>
          {source.bibliography?.note ? (
            <p className="mt-1 text-xs text-slate-500">{source.bibliography.note}</p>
          ) : null}
          {source.bibliography?.href ? (
            <a
              href={source.bibliography.href}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-2 text-xs font-medium text-sky-700"
            >
              Abrir referencia
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : null}
        </div>
      );
    })}
  </div>
);

const BooleanField = ({ checked, label, onChange }) => (
  <label className="flex items-center gap-3 rounded-[0.9rem] border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
    <input
      type="checkbox"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
      className="h-4 w-4 rounded border-slate-300 text-sky-700 focus:ring-sky-700"
    />
    <span>{label}</span>
  </label>
);

const NumberField = ({ value, label, placeholder, onChange }) => (
  <label className="flex flex-col gap-1.5 text-sm text-slate-700">
    <span>{label}</span>
    <input
      type="number"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="rounded-[0.9rem] border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-200"
    />
  </label>
);

const SelectField = ({ value, label, options, onChange }) => (
  <label className="flex flex-col gap-1.5 text-sm text-slate-700">
    <span>{label}</span>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="rounded-[0.9rem] border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-sky-200"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </label>
);

const CalculatorResult = ({ result }) =>
  result ? (
    <div className="rounded-[1rem] border border-sky-200 bg-sky-50/80 px-4 py-3">
      <p className="text-2xl font-semibold tracking-tight text-slate-950">
        {result.value} <span className="text-sm font-medium text-slate-500">{result.unit}</span>
      </p>
      <p className="mt-1 text-sm text-slate-700">{result.interpretation}</p>
      {result.caution ? <p className="mt-2 text-xs text-slate-500">{result.caution}</p> : null}
    </div>
  ) : (
    <div className="rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
      Completa los campos para obtener el resultado.
    </div>
  );

const CalculatorPanel = ({ calculatorId, values, onChange, onOpenDetail, compact = false }) => {
  const calculator = getCalculator(calculatorId);
  const wrapperClass = compact ? `${mutedSurfaceClass} p-4` : `${surfaceClass} p-5`;

  let result = null;

  if (calculatorId === 'cha2ds2-vasc') {
    result = calculateCha2ds2Vasc(values);
  } else if (calculatorId === 'has-bled') {
    result = calculateHasBled(values);
  } else if (calculatorId === 'cockcroft-gault') {
    result = calculateCockcroftGault(values);
  }

  return (
    <section className={wrapperClass}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-slate-950">{calculator.title}</h3>
          <p className="mt-1 text-sm text-slate-500">{calculator.summary}</p>
        </div>
        {onOpenDetail ? (
          <button type="button" onClick={onOpenDetail} className={subtleButtonClass}>
            Abrir
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {calculatorId === 'cha2ds2-vasc' ? (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <NumberField
              value={values.age}
              label="Edad"
              placeholder="Ej. 78"
              onChange={(value) => onChange('age', value)}
            />
            <SelectField
              value={values.sex}
              label="Sexo"
              options={[
                { value: 'male', label: 'Hombre' },
                { value: 'female', label: 'Mujer' },
              ]}
              onChange={(value) => onChange('sex', value)}
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <BooleanField checked={values.heartFailure} label="Insuficiencia cardíaca / disfunción VI" onChange={(value) => onChange('heartFailure', value)} />
            <BooleanField checked={values.hypertension} label="Hipertensión arterial" onChange={(value) => onChange('hypertension', value)} />
            <BooleanField checked={values.diabetes} label="Diabetes mellitus" onChange={(value) => onChange('diabetes', value)} />
            <BooleanField checked={values.strokeOrEmbolism} label="Ictus / tromboembolia previa" onChange={(value) => onChange('strokeOrEmbolism', value)} />
            <BooleanField checked={values.vascularDisease} label="Enfermedad vascular" onChange={(value) => onChange('vascularDisease', value)} />
          </div>
          <CalculatorResult result={result} />
        </div>
      ) : null}

      {calculatorId === 'has-bled' ? (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <NumberField
              value={values.age}
              label="Edad"
              placeholder="Ej. 78"
              onChange={(value) => onChange('age', value)}
            />
            <NumberField
              value={values.systolicBloodPressure}
              label="PAS máxima habitual"
              placeholder="Ej. 165"
              onChange={(value) => onChange('systolicBloodPressure', value)}
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <BooleanField checked={values.renalDysfunction} label="Función renal alterada" onChange={(value) => onChange('renalDysfunction', value)} />
            <BooleanField checked={values.hepaticDysfunction} label="Función hepática alterada" onChange={(value) => onChange('hepaticDysfunction', value)} />
            <BooleanField checked={values.strokeHistory} label="Ictus previo" onChange={(value) => onChange('strokeHistory', value)} />
            <BooleanField checked={values.bleedingHistory} label="Sangrado / predisposición" onChange={(value) => onChange('bleedingHistory', value)} />
            <BooleanField checked={values.labileInr} label="INR lábil" onChange={(value) => onChange('labileInr', value)} />
            <BooleanField checked={values.drugsPredisposingBleeding} label="Fármacos que aumentan sangrado" onChange={(value) => onChange('drugsPredisposingBleeding', value)} />
            <BooleanField checked={values.alcohol} label="Alcohol relevante" onChange={(value) => onChange('alcohol', value)} />
          </div>
          <CalculatorResult result={result} />
        </div>
      ) : null}

      {calculatorId === 'cockcroft-gault' ? (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <NumberField
              value={values.age}
              label="Edad"
              placeholder="Ej. 78"
              onChange={(value) => onChange('age', value)}
            />
            <SelectField
              value={values.sex}
              label="Sexo"
              options={[
                { value: 'male', label: 'Hombre' },
                { value: 'female', label: 'Mujer' },
              ]}
              onChange={(value) => onChange('sex', value)}
            />
            <NumberField
              value={values.weightKg}
              label="Peso (kg)"
              placeholder="Ej. 72"
              onChange={(value) => onChange('weightKg', value)}
            />
            <NumberField
              value={values.serumCreatinineMgDl}
              label="Creatinina sérica (mg/dL)"
              placeholder="Ej. 1.3"
              onChange={(value) => onChange('serumCreatinineMgDl', value)}
            />
          </div>
          <CalculatorResult result={result} />
        </div>
      ) : null}
    </section>
  );
};

const Header = ({ isScrolled, onHome, onBibliography }) => (
  <header
    className={`fixed left-0 right-0 top-0 z-50 border-b border-slate-200/80 bg-white/92 backdrop-blur-xl ${
      isScrolled ? 'shadow-[0_10px_28px_-26px_rgba(15,23,42,0.7)]' : ''
    }`}
  >
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      <div className="flex h-16 items-center justify-between gap-3">
        <LogoButton onClick={onHome} />
        <HeaderButton icon={BookOpen} onClick={onBibliography}>
          Bibliografía
        </HeaderButton>
      </div>
    </div>
  </header>
);

const HomeView = ({
  searchQuery,
  onSearchChange,
  searchResults,
  onSearchOpen,
  onModuleOpen,
  onCalculationsOpen,
  onCalculationOpen,
  onMedicationsOpen,
  onMedicationOpen,
  onActivityOpen,
}) => {
  const featuredProtocol = getMotivoModule('fibrilacion-auricular');
  const secondaryModules = motivoConsultaModules.filter((module) => module.id !== 'fibrilacion-auricular');

  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
      <section className="pt-28">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-sky-700">Primer contenido clínico activo</p>
          <h1 className="mt-2 text-[2rem] font-semibold tracking-tight text-slate-950 sm:text-[2.6rem]">
            Consulta clínica inicial
          </h1>
        </div>

        <div className="relative mt-5 max-w-3xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && searchResults[0]) {
                onSearchOpen(searchResults[0].id);
              }
            }}
            placeholder="Buscar motivo de consulta"
            className={`${surfaceClass} w-full px-5 py-4 pl-12 text-base text-slate-900 outline-none placeholder:text-slate-400`}
          />
        </div>

        {searchQuery.trim() ? (
          <div className={`${surfaceClass} mt-3 max-w-3xl overflow-hidden`}>
            {searchResults.length > 0 ? (
              searchResults.map((module) => (
                <button
                  key={module.id}
                  type="button"
                  onClick={() => onSearchOpen(module.id)}
                  className="flex w-full items-center justify-between gap-3 border-b border-slate-100 px-5 py-3 text-left last:border-b-0 hover:bg-slate-50"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{module.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{formatReference(module)}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300" />
                </button>
              ))
            ) : (
              <p className="px-5 py-4 text-sm text-slate-500">Sin coincidencias en esta fase.</p>
            )}
          </div>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-2">
          {motivoConsultaModules.slice(0, 6).map((module) => (
            <button
              key={module.id}
              type="button"
              onClick={() => onModuleOpen(module.id)}
              className="rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-sky-200 hover:bg-sky-50 hover:text-sky-800"
            >
              {module.shortTitle}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,0.9fr)]">
        <article className={`${surfaceClass} p-6 sm:p-7`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-sky-700">
                Motivo de consulta
              </p>
              <h2 className="mt-2 text-[1.55rem] font-semibold tracking-tight text-slate-950">
                {featuredProtocol.title}
              </h2>
              <p className="mt-2 text-sm text-slate-500">{featuredProtocol.summary}</p>
            </div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <Stethoscope className="h-5 w-5" />
            </span>
          </div>

          <div className="mt-5 rounded-[1.1rem] border border-slate-200 bg-sky-50/70 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <StatusBadge tone="active">Activo</StatusBadge>
                  <span className="text-sm text-slate-500">{formatReference(featuredProtocol)}</span>
                </div>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  Protocolo real con cálculo embebido, anticoagulación y fichas farmacológicas enlazadas.
                </p>
              </div>
              <button type="button" onClick={() => onModuleOpen(featuredProtocol.id)} className={primaryButtonClass}>
                Abrir protocolo
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            {secondaryModules.map((module) => (
              <SurfaceLinkRow
                key={module.id}
                title={module.title}
                meta={`${formatReference(module)} · ${module.status}`}
                onClick={() => onModuleOpen(module.id)}
              />
            ))}
          </div>
        </article>

        <div className="grid gap-4">
          <article className={`${surfaceClass} p-5`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-slate-950">Medicamentos</h2>
                <p className="mt-1 text-sm text-slate-500">Fichas activas del módulo de fibrilación auricular.</p>
              </div>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                <Pill className="h-5 w-5" />
              </span>
            </div>
            <div className="mt-4 space-y-2">
              {compactMedicationPreview.flatMap((group) => group.items).slice(0, 4).map((medication) => (
                <SurfaceLinkRow
                  key={medication.id}
                  title={medication.name}
                  meta={medication.family}
                  onClick={() => onMedicationOpen(medication.id)}
                />
              ))}
            </div>
            <div className="mt-4 border-t border-slate-100 pt-4">
              <button type="button" onClick={onMedicationsOpen} className={subtleButtonClass}>
                Ver fichas activas
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </article>

          <article className={`${surfaceClass} p-5`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-slate-950">Cálculos</h2>
                <p className="mt-1 text-sm text-slate-500">Tres herramientas operativas para la FA.</p>
              </div>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                <Calculator className="h-5 w-5" />
              </span>
            </div>
            <div className="mt-4 space-y-2">
              {implementedCalculators.map((calculator) => (
                <SurfaceLinkRow
                  key={calculator.id}
                  title={calculator.title}
                  meta={`${calculator.block} · p. ${calculator.verifiedPage}`}
                  onClick={() => onCalculationOpen(calculator.id)}
                />
              ))}
            </div>
            <div className="mt-4 border-t border-slate-100 pt-4">
              <button type="button" onClick={onCalculationsOpen} className={subtleButtonClass}>
                Abrir índice de cálculos
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </article>
        </div>
      </section>

      <section className={`${surfaceClass} mt-4 overflow-hidden`}>
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-semibold tracking-tight text-slate-950">Actividad reciente</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {recentActivity.map((item) => (
            <button
              key={`${item.time}-${item.title}`}
              type="button"
              onClick={() => onActivityOpen(item.target)}
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
};

const AuditView = ({ module, onBack }) => (
  <div className="mx-auto max-w-6xl px-5 pb-16 pt-28 sm:px-8">
    <BackBar label="Volver" onClick={onBack} />
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.8fr)]">
      <section className={`${surfaceClass} p-6`}>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge tone="pending">Auditado</StatusBadge>
          <span className="text-sm text-slate-500">{formatReference(module)}</span>
        </div>
        <h1 className="mt-3 text-[2rem] font-semibold tracking-tight text-slate-950">{module.title}</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-600">
          {module.summary}
        </p>
      </section>

      <DetailPanel title="Estado del tema">
        <div className="space-y-3">
          <div className={`${mutedSurfaceClass} p-4`}>
            <p className="text-sm font-medium text-slate-900">Sin protocolo operativo todavía</p>
            <p className="mt-1 text-sm text-slate-500">
              El tema ya tiene ubicación bibliográfica verificada, pero no se ha construido su flujo clínico en esta fase.
            </p>
          </div>
          <div className={`${mutedSurfaceClass} p-4`}>
            <p className="text-sm font-medium text-slate-900">Ubicación auditada</p>
            <p className="mt-1 text-sm text-slate-500">{module.section}</p>
          </div>
        </div>
      </DetailPanel>
    </div>

    <div className="mt-4">
      <BibliographyBlock entries={module.bibliography} />
    </div>
  </div>
);

const ProtocolView = ({
  protocol,
  calculatorInputs,
  onCalculatorChange,
  onCalculatorOpen,
  onMedicationOpen,
  onCalculationsOpen,
  onMedicationsOpen,
  onBack,
}) => (
  <div className="mx-auto max-w-6xl px-5 pb-16 pt-28 sm:px-8">
    <BackBar
      label="Volver"
      onClick={onBack}
      actions={
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={onCalculationsOpen} className={subtleButtonClass}>
            <Calculator className="h-4 w-4" />
            Cálculos
          </button>
          <button type="button" onClick={onMedicationsOpen} className={subtleButtonClass}>
            <Pill className="h-4 w-4" />
            Medicamentos
          </button>
        </div>
      }
    />

    <section className={`${surfaceClass} p-6`}>
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge tone="active">Activo</StatusBadge>
        <span className="text-sm text-slate-500">
          {protocol.chapter} · índice p. {protocol.indexPage} · inicio real p. {protocol.verifiedPage}
        </span>
      </div>
      <h1 className="mt-3 text-[2rem] font-semibold tracking-tight text-slate-950">{protocol.title}</h1>
      <p className="mt-3 max-w-3xl text-sm text-slate-600">{protocol.summary}</p>
    </section>

    <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.85fr)]">
      <div className="space-y-4">
        <DetailPanel title="Evaluación inicial">
          <div className="space-y-3">
            {protocol.overview.map((item) => (
              <div key={item} className={`${mutedSurfaceClass} p-4 text-sm text-slate-700`}>
                {item}
              </div>
            ))}
          </div>
        </DetailPanel>

        <DetailPanel title="Decisión clínica">
          <div className="space-y-3">
            {protocol.flow.map((step) => (
              <section key={step.id} className={`${mutedSurfaceClass} p-4`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold tracking-tight text-slate-950">{step.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{step.description}</p>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  {step.actions.map((action) => (
                    <div key={action} className="rounded-[0.9rem] border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700">
                      {action}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </DetailPanel>

        <DetailPanel title="Cálculos del protocolo">
          <div className="space-y-3">
            {protocol.calculatorIds.map((calculatorId) => (
              <CalculatorPanel
                key={calculatorId}
                calculatorId={calculatorId}
                values={calculatorInputs[calculatorId]}
                onChange={(field, value) => onCalculatorChange(calculatorId, field, value)}
                onOpenDetail={() => onCalculatorOpen(calculatorId)}
                compact
              />
            ))}
          </div>
        </DetailPanel>
      </div>

      <div className="space-y-4">
        <DetailPanel title="Medicamentos vinculados">
          <div className="space-y-4">
            {protocol.medicationGroups.map((group) => (
              <div key={group.title}>
                <p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {group.title}
                </p>
                <div className="space-y-2">
                  {group.medicationIds.map((medicationId) => {
                    const medication = getMedication(medicationId);
                    return (
                      <SurfaceLinkRow
                        key={medication.id}
                        title={medication.name}
                        meta={medication.indication}
                        onClick={() => onMedicationOpen(medication.id)}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </DetailPanel>

        <DetailPanel title="Puntos de seguridad">
          <div className="space-y-2">
            {protocol.warnings.map((warning) => (
              <div key={warning} className={`${mutedSurfaceClass} p-4 text-sm text-slate-700`}>
                {warning}
              </div>
            ))}
          </div>
        </DetailPanel>
      </div>
    </div>

    <div className="mt-4">
      <BibliographyBlock entries={protocol.bibliography} />
    </div>
  </div>
);

const CalculationsView = ({ onBack, onCalculatorOpen }) => (
  <div className="mx-auto max-w-6xl px-5 pb-16 pt-28 sm:px-8">
    <BackBar label="Volver" onClick={onBack} />
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <DetailPanel title="Cálculos activos">
        <div className="space-y-3">
          {implementedCalculators.map((calculator) => (
            <SurfaceLinkRow
              key={calculator.id}
              title={calculator.title}
              meta={`${calculator.block} · p. ${calculator.verifiedPage}`}
              onClick={() => onCalculatorOpen(calculator.id)}
            />
          ))}
        </div>
      </DetailPanel>

      <DetailPanel title="Auditoría restante">
        <div className="space-y-2">
          {pendingCalculations.map((item) => (
            <div key={item.id} className={`${mutedSurfaceClass} p-4`}>
              <p className="text-sm font-semibold text-slate-900">{item.title}</p>
              <p className="mt-1 text-xs text-slate-500">
                {item.chapter} · p. {item.verifiedPage} · {item.status}
              </p>
            </div>
          ))}
        </div>
      </DetailPanel>
    </div>
  </div>
);

const CalculatorDetailView = ({ calculatorId, values, onChange, onBack }) => {
  const calculator = getCalculator(calculatorId);

  return (
    <div className="mx-auto max-w-5xl px-5 pb-16 pt-28 sm:px-8">
      <BackBar label="Volver" onClick={onBack} />
      <div className="space-y-4">
        <section className={`${surfaceClass} p-6`}>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge tone="active">Implementado</StatusBadge>
            <span className="text-sm text-slate-500">
              {calculator.chapter} · p. {calculator.verifiedPage}
            </span>
          </div>
          <h1 className="mt-3 text-[2rem] font-semibold tracking-tight text-slate-950">{calculator.title}</h1>
          <p className="mt-2 text-sm text-slate-600">{calculator.summary}</p>
        </section>

        <CalculatorPanel calculatorId={calculatorId} values={values} onChange={onChange} />
        <BibliographyBlock entries={calculator.bibliography} />
      </div>
    </div>
  );
};

const MedicationsView = ({ onBack, onMedicationOpen }) => (
  <div className="mx-auto max-w-6xl px-5 pb-16 pt-28 sm:px-8">
    <BackBar label="Volver" onClick={onBack} />
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <DetailPanel title="Fichas activas">
        <div className="space-y-4">
          {medicationGroups.map((group) => (
            <div key={group.id}>
              <p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                {group.title}
              </p>
              <div className="space-y-2">
                {group.items.map((medicationId) => {
                  const medication = getMedication(medicationId);
                  return (
                    <SurfaceLinkRow
                      key={medication.id}
                      title={medication.name}
                      meta={medication.indication}
                      onClick={() => onMedicationOpen(medication.id)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </DetailPanel>

      <DetailPanel title="Cobertura actual">
        <div className="space-y-2">
          <div className={`${mutedSurfaceClass} p-4 text-sm text-slate-700`}>
            Solo se muestran fichas farmacológicas activas del protocolo de fibrilación auricular.
          </div>
          <div className={`${mutedSurfaceClass} p-4 text-sm text-slate-700`}>
            Cada ficha separa lo que proviene del capítulo protocolario de FA y lo que procede de CIMA AEMPS.
          </div>
        </div>
      </DetailPanel>
    </div>
  </div>
);

const MedicationDetailView = ({ medication, onBack }) => (
  <div className="mx-auto max-w-5xl px-5 pb-16 pt-28 sm:px-8">
    <BackBar label="Volver" onClick={onBack} />
    <div className="space-y-4">
      <section className={`${surfaceClass} p-6`}>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge tone="active">{medication.family}</StatusBadge>
          <span className="text-sm text-slate-500">Módulo FA</span>
        </div>
        <h1 className="mt-3 text-[2rem] font-semibold tracking-tight text-slate-950">{medication.name}</h1>
        <p className="mt-3 text-sm text-slate-600">{medication.indication}</p>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <DetailPanel title="Pauta en este contexto">
          <div className="space-y-3">
            <div className={`${mutedSurfaceClass} p-4`}>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">Dosis</p>
              <p className="mt-2 text-sm text-slate-800">{medication.dose}</p>
            </div>
            <div className={`${mutedSurfaceClass} p-4`}>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">Vía</p>
              <p className="mt-2 text-sm text-slate-800">{medication.route}</p>
            </div>
            <div className={`${mutedSurfaceClass} p-4`}>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">Frecuencia</p>
              <p className="mt-2 text-sm text-slate-800">{medication.frequency}</p>
            </div>
            <div className={`${mutedSurfaceClass} p-4`}>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">Duración</p>
              <p className="mt-2 text-sm text-slate-800">{medication.duration}</p>
            </div>
          </div>
        </DetailPanel>

        <DetailPanel title="Seguridad y ajustes">
          <div className="space-y-3">
            <div className={`${mutedSurfaceClass} p-4`}>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">Contraindicaciones / precauciones</p>
              <div className="mt-3 space-y-2">
                {medication.contraindications.map((item) => (
                  <div key={item} className="rounded-[0.9rem] border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className={`${mutedSurfaceClass} p-4`}>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">Insuficiencia renal</p>
              <p className="mt-2 text-sm text-slate-700">{medication.renalAdjustment}</p>
            </div>
            <div className={`${mutedSurfaceClass} p-4`}>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">Insuficiencia hepática</p>
              <p className="mt-2 text-sm text-slate-700">{medication.hepaticAdjustment}</p>
            </div>
            <div className={`${mutedSurfaceClass} p-4`}>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">Observaciones prácticas</p>
              <div className="mt-3 space-y-2">
                {medication.practicalNotes.map((item) => (
                  <div key={item} className="rounded-[0.9rem] border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DetailPanel>
      </div>

      <DetailPanel title="Fuentes">
        <div className="space-y-3">
          <div className={`${mutedSurfaceClass} p-4 text-sm text-slate-700`}>{medication.sourceScope}</div>
          <SourceList sources={medication.sources} />
        </div>
      </DetailPanel>
    </div>
  </div>
);

const Footer = () => (
  <footer className="border-t border-slate-200/80 bg-white/80 px-5 py-5 sm:px-8">
    <div className="mx-auto max-w-6xl text-sm text-slate-500">
      Base clínica activa: {bibliographyBaseUsed[0].shortTitle}.
    </div>
  </footer>
);

const App = () => {
  const [route, setRoute] = useState({ view: 'home' });
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [calculatorInputs, setCalculatorInputs] = useState(initialCalculatorInputs);

  const deferredSearch = useDeferredValue(searchQuery.trim().toLowerCase());
  const protocol = getProtocol('fibrilacion-auricular');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const searchResults = deferredSearch
    ? motivoConsultaModules.filter((module) =>
        [module.title, module.shortTitle, module.section, module.chapter].join(' ').toLowerCase().includes(deferredSearch),
      )
    : [];

  const navigate = (nextRoute) => {
    startTransition(() => {
      setRoute(nextRoute);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const openModule = (moduleId) => {
    const module = getMotivoModule(moduleId);

    if (module.implemented) {
      navigate({ view: 'protocol', protocolId: module.id });
      return;
    }

    navigate({ view: 'audit', moduleId: module.id });
  };

  const openActivityTarget = (target) => {
    if (target.type === 'protocol') {
      navigate({ view: 'protocol', protocolId: target.id });
      return;
    }

    if (target.type === 'calculator') {
      navigate({
        view: 'calculator',
        calculatorId: target.id,
        returnTo: { view: 'protocol', protocolId: 'fibrilacion-auricular' },
      });
      return;
    }

    if (target.type === 'medication') {
      navigate({
        view: 'medication',
        medicationId: target.id,
        returnTo: { view: 'protocol', protocolId: 'fibrilacion-auricular' },
      });
    }
  };

  const openCalculations = (returnTo = { view: 'home' }) => {
    navigate({ view: 'calculations', returnTo });
  };

  const openCalculator = (calculatorId, returnTo = { view: 'home' }) => {
    navigate({ view: 'calculator', calculatorId, returnTo });
  };

  const openMedications = (returnTo = { view: 'home' }) => {
    navigate({ view: 'medications', returnTo });
  };

  const openMedication = (medicationId, returnTo = { view: 'home' }) => {
    navigate({ view: 'medication', medicationId, returnTo });
  };

  const handleBack = () => {
    if (route.returnTo) {
      navigate(route.returnTo);
      return;
    }

    navigate({ view: 'home' });
  };

  const renderView = () => {
    if (route.view === 'protocol') {
      return (
        <ProtocolView
          protocol={protocol}
          calculatorInputs={calculatorInputs}
          onCalculatorChange={(calculatorId, field, value) =>
            updateNestedState(setCalculatorInputs, calculatorId, field, value)
          }
          onCalculatorOpen={(calculatorId) =>
            openCalculator(calculatorId, { view: 'protocol', protocolId: 'fibrilacion-auricular' })
          }
          onMedicationOpen={(medicationId) =>
            openMedication(medicationId, { view: 'protocol', protocolId: 'fibrilacion-auricular' })
          }
          onCalculationsOpen={() => openCalculations({ view: 'protocol', protocolId: 'fibrilacion-auricular' })}
          onMedicationsOpen={() => openMedications({ view: 'protocol', protocolId: 'fibrilacion-auricular' })}
          onBack={() => navigate({ view: 'home' })}
        />
      );
    }

    if (route.view === 'audit') {
      return <AuditView module={getMotivoModule(route.moduleId)} onBack={() => navigate({ view: 'home' })} />;
    }

    if (route.view === 'calculations') {
      return (
        <CalculationsView
          onBack={handleBack}
          onCalculatorOpen={(calculatorId) =>
            openCalculator(calculatorId, { view: 'calculations', returnTo: route.returnTo ?? { view: 'home' } })
          }
        />
      );
    }

    if (route.view === 'calculator') {
      return (
        <CalculatorDetailView
          calculatorId={route.calculatorId}
          values={calculatorInputs[route.calculatorId]}
          onChange={(field, value) => updateNestedState(setCalculatorInputs, route.calculatorId, field, value)}
          onBack={handleBack}
        />
      );
    }

    if (route.view === 'medications') {
      return (
        <MedicationsView
          onBack={handleBack}
          onMedicationOpen={(medicationId) =>
            openMedication(medicationId, { view: 'medications', returnTo: route.returnTo ?? { view: 'home' } })
          }
        />
      );
    }

    if (route.view === 'medication') {
      return <MedicationDetailView medication={getMedication(route.medicationId)} onBack={handleBack} />;
    }

    return (
      <HomeView
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchResults={searchResults}
        onSearchOpen={openModule}
        onModuleOpen={openModule}
        onCalculationsOpen={() => openCalculations({ view: 'home' })}
        onCalculationOpen={(calculatorId) => openCalculator(calculatorId, { view: 'home' })}
        onMedicationsOpen={() => openMedications({ view: 'home' })}
        onMedicationOpen={(medicationId) => openMedication(medicationId, { view: 'home' })}
        onActivityOpen={openActivityTarget}
      />
    );
  };

  return (
    <div className="min-h-screen text-slate-900" style={shellBackground}>
      <Header isScrolled={isScrolled} onHome={() => navigate({ view: 'home' })} onBibliography={() => openPdf(coreReference.filePath)} />
      <main>{renderView()}</main>
      <Footer />
    </div>
  );
};

export default App;
