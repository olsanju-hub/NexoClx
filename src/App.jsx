import React, { startTransition, useEffect, useState } from 'react';
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Calculator,
  ChevronRight,
  ClipboardList,
  ExternalLink,
  Info,
  LayoutDashboard,
  Pill,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import { buildReferenceHref } from './data/bibliography';
import {
  calculateCha2ds2Vasc,
  calculateCockcroftGault,
  calculateHasBled,
  getCalculator,
  implementedCalculators,
} from './data/calculators';
import { getMedication, medicationGroups } from './data/medications';
import { getMotivoModule, motivoConsultaModules } from './data/modules';
import { getProtocol } from './data/protocols';

const brandMark = `${import.meta.env.BASE_URL}branding/app-icon-512.png`;

const shellBackground = {
  backgroundImage: 'linear-gradient(180deg, #f7fafc 0%, #eef3f7 100%)',
};

const shellCardClass =
  'rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_28px_70px_-48px_rgba(15,23,42,0.55)]';
const panelClass =
  'rounded-[1.75rem] border border-slate-200/80 bg-white shadow-[0_20px_45px_-40px_rgba(15,23,42,0.45)]';
const mutedPanelClass = 'rounded-[1.35rem] border border-slate-200/80 bg-slate-50/90';
const subtleButtonClass =
  'inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950';

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

const initialFaFlowState = {
  step: 1,
  stability: null,
  duration: null,
  structuralHeartDisease: null,
};

const formatReference = (item) => `${item.chapter} · p. ${item.verifiedPage}`;
const compactSentence = (value) => value.split('. ')[0]?.trim() ?? value;

const getCalculatorResult = (calculatorId, values) => {
  if (calculatorId === 'cha2ds2-vasc') {
    return calculateCha2ds2Vasc(values);
  }

  if (calculatorId === 'has-bled') {
    return calculateHasBled(values);
  }

  if (calculatorId === 'cockcroft-gault') {
    return calculateCockcroftGault(values);
  }

  return null;
};

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

const getPrimarySection = (view) => {
  if (view === 'protocol' || view === 'protocols') {
    return 'protocols';
  }

  if (view === 'calculator' || view === 'calculations') {
    return 'calculations';
  }

  if (view === 'medication' || view === 'medications') {
    return 'medications';
  }

  return 'home';
};

const getPageLabel = (route) => {
  if (route.view === 'protocol') {
    return getProtocol(route.protocolId ?? 'fibrilacion-auricular').title;
  }

  if (route.view === 'calculator') {
    return getCalculator(route.calculatorId).title;
  }

  if (route.view === 'medication') {
    return getMedication(route.medicationId).name;
  }

  if (route.view === 'protocols') {
    return 'Protocolos';
  }

  if (route.view === 'calculations') {
    return 'Cálculos';
  }

  if (route.view === 'medications') {
    return 'Medicamentos';
  }

  return 'Inicio clínico';
};

const SectionTitle = ({ eyebrow, title, note, action = null }) => (
  <div className="mb-4 flex items-start justify-between gap-3">
    <div>
      {eyebrow ? (
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-slate-400">{eyebrow}</p>
      ) : null}
      <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-950">{title}</h2>
      {note ? <p className="mt-1.5 text-sm text-slate-500">{note}</p> : null}
    </div>
    {action}
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
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] ${toneClass}`}
    >
      {children}
    </span>
  );
};

const AppHeader = ({ isScrolled, pageLabel, onHome }) => (
  <header
    className={`fixed left-0 right-0 top-0 z-40 border-b border-slate-200/80 bg-white/88 backdrop-blur-xl lg:left-24 ${
      isScrolled ? 'shadow-[0_16px_45px_-40px_rgba(15,23,42,0.6)]' : ''
    }`}
  >
    <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
      <button type="button" onClick={onHome} className="flex min-w-0 items-center gap-3 text-left">
        <img src={brandMark} alt="NexoClx" className="h-9 w-9 rounded-2xl object-contain" />
        <div className="min-w-0">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-slate-400">NexoClx</p>
          <p className="truncate text-sm font-semibold tracking-tight text-slate-950">{pageLabel}</p>
        </div>
      </button>

      <div className="hidden text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-400 sm:block">
        App clínica
      </div>
    </div>
  </header>
);

const PrimaryNavigation = ({ activeKey, onSelect }) => {
  const items = [
    { key: 'home', label: 'Inicio', icon: LayoutDashboard },
    { key: 'protocols', label: 'Protocolos', icon: ClipboardList },
    { key: 'calculations', label: 'Cálculos', icon: Calculator },
    { key: 'medications', label: 'Fármacos', icon: Pill },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200/80 bg-white/95 px-2 pb-[calc(env(safe-area-inset-bottom,0px)+0.4rem)] pt-2 backdrop-blur-xl lg:hidden">
        <div className="grid grid-cols-4 gap-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeKey === item.key;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onSelect(item.key)}
                className={`flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.16em] transition-colors ${
                  isActive ? 'bg-sky-50 text-sky-800' : 'text-slate-400'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <aside className="fixed bottom-0 left-0 top-0 z-50 hidden w-24 border-r border-slate-200/80 bg-white/90 backdrop-blur-xl lg:flex lg:flex-col lg:items-center lg:gap-8 lg:px-3 lg:py-6">
        <button
          type="button"
          onClick={() => onSelect('home')}
          className="flex flex-col items-center gap-2 rounded-[1.6rem] px-2 py-2 text-center text-sky-800"
        >
          <img src={brandMark} alt="NexoClx" className="h-11 w-11 rounded-[1.2rem] object-contain" />
          <span className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-slate-400">NexoClx</span>
        </button>

        <div className="flex w-full flex-1 flex-col gap-2">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeKey === item.key;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onSelect(item.key)}
                className={`flex w-full flex-col items-center gap-2 rounded-[1.4rem] px-2 py-3 text-center transition-colors ${
                  isActive ? 'bg-sky-50 text-sky-800' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[0.62rem] font-semibold uppercase tracking-[0.18em]">{item.label}</span>
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
};

const BackBar = ({ label = 'Volver', onClick, action = null }) => (
  <div className="mb-4 flex items-center justify-between gap-3">
    <button type="button" onClick={onClick} className={subtleButtonClass}>
      <ArrowLeft className="h-4 w-4" />
      {label}
    </button>
    {action}
  </div>
);

const DetailPanel = ({ title, note, action = null, children, eyebrow = null }) => (
  <section className={`${panelClass} p-4 sm:p-5`}>
    <SectionTitle eyebrow={eyebrow} title={title} note={note} action={action} />
    {children}
  </section>
);

const ListActionRow = ({ title, meta, onClick, badge = null }) => (
  <button
    type="button"
    onClick={onClick}
    className="group flex w-full items-center justify-between gap-3 rounded-[1.2rem] border border-slate-200/80 bg-white px-4 py-3 text-left transition-colors hover:border-slate-300 hover:bg-slate-50"
  >
    <div className="min-w-0">
      <div className="flex min-w-0 items-center gap-2">
        <p className="truncate text-sm font-semibold text-slate-900">{title}</p>
        {badge}
      </div>
      {meta ? <p className="mt-1 truncate text-xs text-slate-500">{meta}</p> : null}
    </div>
    <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5" />
  </button>
);

const HomeShortcutCard = ({ icon: Icon, title, meta, onClick, tone = 'light' }) => {
  const toneClass =
    tone === 'dark'
      ? 'border-slate-950 bg-slate-950 text-white'
      : tone === 'primary'
        ? 'border-sky-200 bg-sky-50 text-slate-900'
        : 'border-slate-200 bg-white text-slate-900';

  const iconClass =
    tone === 'dark'
      ? 'bg-white/10 text-white'
      : tone === 'primary'
        ? 'bg-white text-sky-700'
        : 'bg-slate-100 text-slate-700';

  const metaClass = tone === 'dark' ? 'text-slate-300' : 'text-slate-500';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex min-h-[104px] flex-col justify-between rounded-[1.45rem] border px-4 py-4 text-left transition-colors hover:border-slate-300 ${toneClass}`}
    >
      <span className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${iconClass}`}>
        <Icon className="h-5 w-5" />
      </span>
      <div className="pt-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-base font-semibold tracking-tight">{title}</p>
          <ChevronRight
            className={`h-4 w-4 transition-transform group-hover:translate-x-0.5 ${
              tone === 'dark' ? 'text-white/60' : 'text-slate-300'
            }`}
          />
        </div>
        {meta ? <p className={`mt-1 text-xs ${metaClass}`}>{meta}</p> : null}
      </div>
    </button>
  );
};

const ProtocolSectionButton = ({ label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
      active
        ? 'bg-slate-950 text-white'
        : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-950'
    }`}
  >
    {label}
  </button>
);

const SummaryActionCard = ({ title, action, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex min-h-[110px] flex-col justify-between rounded-[1.35rem] border border-slate-200/80 bg-white px-4 py-4 text-left transition-colors hover:border-sky-200 hover:bg-sky-50/50"
  >
    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-400">{title}</p>
    <p className="text-sm font-medium leading-snug text-slate-900">{action}</p>
  </button>
);

const DecisionCard = ({ card, onOpenCalculations, onOpenMedications }) => (
  <section className={`${mutedPanelClass} p-4`}>
    <div className="rounded-[1.1rem] border border-slate-200/80 bg-white px-4 py-3">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-400">Situación</p>
      <p className="mt-1.5 text-sm font-semibold text-slate-900">{card.situation}</p>
    </div>
    <div className="mt-3 rounded-[1.1rem] border border-slate-200/80 bg-white px-4 py-3">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-sky-700">Qué hacer ahora</p>
      <p className="mt-1.5 text-sm text-slate-800">{card.action}</p>
    </div>
    <div className="mt-3 rounded-[1.1rem] border border-slate-200/80 bg-white px-4 py-3">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-400">Matiz clínico</p>
      <p className="mt-1.5 text-sm text-slate-700">{card.nuance}</p>
    </div>
    <div className="mt-3 flex flex-wrap gap-2">
      <button type="button" onClick={onOpenCalculations} className={subtleButtonClass}>
        <Calculator className="h-4 w-4" />
        Cálculos FA
      </button>
      <button type="button" onClick={onOpenMedications} className={subtleButtonClass}>
        <Pill className="h-4 w-4" />
        Fármacos
      </button>
    </div>
  </section>
);

const MedicationQuickRow = ({ medication, onOpen }) => (
  <button
    type="button"
    onClick={onOpen}
    className="group flex w-full items-center justify-between gap-3 rounded-[1.2rem] border border-slate-200/80 bg-white px-4 py-3 text-left transition-colors hover:border-slate-300 hover:bg-slate-50"
  >
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-sm font-semibold text-slate-900">{medication.name}</p>
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-slate-400">
          {medication.family}
        </span>
      </div>
      <p className="mt-1 text-xs text-slate-500">{compactSentence(medication.indication)}</p>
      <p className="mt-1 text-xs text-slate-600">{compactSentence(medication.dose)}</p>
    </div>
    <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5" />
  </button>
);

const CalculatorQuickRow = ({ calculator, result, isOpen, onToggle, onOpenDetail }) => (
  <div className={`${mutedPanelClass} p-4`}>
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900">{calculator.title}</p>
        <p className="mt-1 text-xs text-slate-500">
          {result ? `${result.value} ${result.unit} · ${result.interpretation}` : calculator.summary}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={onToggle} className={subtleButtonClass}>
          {isOpen ? 'Ocultar' : 'Rápido'}
        </button>
        <button type="button" onClick={onOpenDetail} className={subtleButtonClass}>
          Abrir
        </button>
      </div>
    </div>
  </div>
);

const BibliographyBlock = ({ entries }) => (
  <section className={`${panelClass} p-4 sm:p-5`}>
    <SectionTitle
      eyebrow="Referencia"
      title="Bibliografía"
      note="Enlaces directos a las páginas verificadas del contenido visible."
    />
    <div className="space-y-3">
      {entries.map((entry) => (
        <div key={entry.internalId} className={`${mutedPanelClass} p-4`}>
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
            className="flex items-center justify-between gap-3 rounded-[1rem] border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950"
          >
            <span>{source.label}</span>
            <ExternalLink className="h-4 w-4 shrink-0 text-slate-300" />
          </a>
        );
      }

      return (
        <div key={source.label} className="rounded-[1rem] border border-slate-200/80 bg-slate-50 px-4 py-3">
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
  <label className="flex items-center gap-3 rounded-[0.95rem] border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
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
      className="rounded-[0.95rem] border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-200"
    />
  </label>
);

const SelectField = ({ value, label, options, onChange }) => (
  <label className="flex flex-col gap-1.5 text-sm text-slate-700">
    <span>{label}</span>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="rounded-[0.95rem] border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-sky-200"
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
  const wrapperClass = compact ? `${mutedPanelClass} p-4` : `${panelClass} p-5`;
  const result = getCalculatorResult(calculatorId, values);

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
            <BooleanField
              checked={values.heartFailure}
              label="Insuficiencia cardíaca / disfunción VI"
              onChange={(value) => onChange('heartFailure', value)}
            />
            <BooleanField
              checked={values.hypertension}
              label="Hipertensión arterial"
              onChange={(value) => onChange('hypertension', value)}
            />
            <BooleanField checked={values.diabetes} label="Diabetes mellitus" onChange={(value) => onChange('diabetes', value)} />
            <BooleanField
              checked={values.strokeOrEmbolism}
              label="Ictus / tromboembolia previa"
              onChange={(value) => onChange('strokeOrEmbolism', value)}
            />
            <BooleanField
              checked={values.vascularDisease}
              label="Enfermedad vascular"
              onChange={(value) => onChange('vascularDisease', value)}
            />
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
            <BooleanField
              checked={values.drugsPredisposingBleeding}
              label="Fármacos que aumentan sangrado"
              onChange={(value) => onChange('drugsPredisposingBleeding', value)}
            />
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

const HomeView = ({ onProtocolsOpen, onCalculationsOpen, onMedicationsOpen }) => (
  <div className="mx-auto max-w-4xl space-y-3">
    <button
      type="button"
      onClick={onProtocolsOpen}
      className="group w-full rounded-[2rem] border border-slate-950 bg-slate-950 px-5 py-6 text-left text-white shadow-[0_28px_70px_-48px_rgba(15,23,42,0.8)] transition-colors hover:bg-slate-900 sm:px-6 sm:py-7"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
          <ClipboardList className="h-6 w-6" />
        </span>
        <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-white/55 transition-transform group-hover:translate-x-0.5" />
      </div>
      <div className="mt-7">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-400">Entrada principal</p>
        <h1 className="mt-2 text-[1.9rem] font-semibold tracking-tight sm:text-[2.2rem]">Protocolos</h1>
        <p className="mt-2 text-sm text-slate-300">Abrir protocolo activo y entrar directo en la conducta clínica.</p>
      </div>
    </button>

    <section className="grid gap-3 sm:grid-cols-2">
      <HomeShortcutCard
        icon={Calculator}
        title="Cálculos"
        meta="Abrir escalas activas"
        onClick={onCalculationsOpen}
        tone="primary"
      />
      <HomeShortcutCard
        icon={Pill}
        title="Medicamentos"
        meta="Abrir fichas activas"
        onClick={onMedicationsOpen}
      />
    </section>
  </div>
);

const ProtocolsView = ({ onBack, onModuleOpen }) => {
  const activeModules = motivoConsultaModules.filter((module) => module.implemented);

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <BackBar label="Inicio" onClick={onBack} />

      <section className={`${shellCardClass} p-5 sm:p-6`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-400">Protocolos activos</p>
            <h1 className="mt-2 text-[1.8rem] font-semibold tracking-tight text-slate-950">Protocolos</h1>
            <p className="mt-2 max-w-xl text-sm text-slate-500">
              Solo se muestra lo que está operativo para evitar ruido en la navegación clínica.
            </p>
          </div>
          <StatusBadge tone="active">{activeModules.length} activo</StatusBadge>
        </div>
      </section>

      <DetailPanel title="Lista activa" note="Abre el contenido del protocolo solo cuando lo necesites.">
        <div className="space-y-2">
          {activeModules.map((module) => (
            <ListActionRow
              key={module.id}
              title={module.title}
              meta={module.summary}
              badge={<StatusBadge tone="active">Activo</StatusBadge>}
              onClick={() => onModuleOpen(module.id)}
            />
          ))}
        </div>
      </DetailPanel>
    </div>
  );
};

const FaStepChip = ({ index, label, active }) => (
  <div
    className={`rounded-full border px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] ${
      active ? 'border-sky-200 bg-sky-50 text-sky-800' : 'border-slate-200 bg-white text-slate-400'
    }`}
  >
    {index}. {label}
  </div>
);

const FlowChoiceCard = ({ icon: Icon, title, note, onClick, tone = 'neutral' }) => {
  const toneClass =
    tone === 'critical'
      ? 'border-red-100 bg-red-50/40 hover:bg-red-50'
      : 'border-slate-200 bg-slate-50/70 hover:border-sky-100 hover:bg-white';
  const iconClass = tone === 'critical' ? 'text-red-600' : 'text-sky-700';
  const titleClass = tone === 'critical' ? 'text-red-950' : 'text-slate-900';
  const noteClass = tone === 'critical' ? 'text-red-700/70' : 'text-slate-500';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center gap-4 rounded-[1.45rem] border px-5 py-5 text-left transition-colors ${toneClass}`}
    >
      <span className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white ${iconClass}`}>
        <Icon className="h-6 w-6" />
      </span>
      <div className="min-w-0">
        <p className={`text-sm font-semibold ${titleClass}`}>{title}</p>
        <p className={`mt-1 text-xs leading-relaxed ${noteClass}`}>{note}</p>
      </div>
      <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5" />
    </button>
  );
};

const FlowSelectButton = ({ label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-[1rem] border px-4 py-4 text-sm font-semibold transition-colors ${
      active
        ? 'border-sky-800 bg-sky-800 text-white shadow-[0_18px_35px_-26px_rgba(3,105,161,0.7)]'
        : 'border-transparent bg-slate-50 text-slate-600'
    }`}
  >
    {label}
  </button>
);

const FlowActionCard = ({ title, body, tone = 'neutral', children = null }) => {
  const toneClass =
    tone === 'critical'
      ? 'border-red-200/80 bg-red-600 text-white'
      : tone === 'warning'
        ? 'border-amber-200/80 bg-amber-50 text-amber-950'
        : 'border-slate-200/80 bg-white text-slate-900';

  return (
    <section className={`rounded-[1.6rem] border px-5 py-5 shadow-[0_24px_50px_-44px_rgba(15,23,42,0.5)] ${toneClass}`}>
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      <p
        className={`mt-2 text-sm leading-relaxed ${
          tone === 'critical' ? 'text-red-50/90' : tone === 'warning' ? 'text-amber-900/80' : 'text-slate-600'
        }`}
      >
        {body}
      </p>
      {children ? <div className="mt-5">{children}</div> : null}
    </section>
  );
};

const FibrilacionAuricularFlowView = ({
  protocol,
  faFlowState,
  onFaFlowChange,
  onFaFlowReset,
  onCalculatorOpen,
  onCalculationsHub,
  onMedicationOpen,
  onMedicationsHub,
  onBack,
  onFinish,
}) => {
  const referenceHref = protocol.bibliography[0]?.href ?? buildReferenceHref('murillo7', protocol.pdfPage);
  const { step, stability, duration, structuralHeartDisease } = faFlowState;
  const controlMedicationIds = structuralHeartDisease ? ['digoxina', 'amiodarona'] : ['metoprolol', 'verapamilo'];
  const preventionMedicationIds = ['apixaban', 'acenocumarol'];
  const quickCalculationIds = ['cha2ds2-vasc', 'has-bled', 'cockcroft-gault'];

  const updateFlow = (changes) => {
    onFaFlowChange(changes);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <section className={`${shellCardClass} p-5 sm:p-6`}>
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-400 transition-colors hover:text-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Cancelar
          </button>
          {referenceHref ? (
            <button
              type="button"
              onClick={() => openPdf(referenceHref)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-[0.65rem] font-medium uppercase tracking-[0.14em] text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-900"
            >
              <BookOpen className="h-3.5 w-3.5" />
              Fuente
            </button>
          ) : null}
        </div>

        <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-sky-700">Protocolo FA</p>
            <h1 className="mt-2 text-[1.8rem] font-semibold tracking-tight text-slate-950 sm:text-[2rem]">
              {protocol.longTitle ?? protocol.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Flujo clínico corto para decidir conducta inmediata, sin volver a una pantalla larga.
            </p>
          </div>
          <div className="min-w-[180px]">
            <div className="text-right text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Paso {step} de 4
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-sky-600 transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <FaStepChip index={1} label="Estabilidad" active={step === 1} />
          <FaStepChip index={2} label="Contexto" active={step === 2} />
          <FaStepChip index={3} label="Conducta" active={step === 3} />
          <FaStepChip index={4} label="Ictus" active={step === 4} />
        </div>
      </section>

      {step === 1 ? (
        <section className={`${panelClass} animate-in fade-in slide-in-from-bottom-4 p-5 duration-300 sm:p-6`}>
          <SectionTitle
            eyebrow="Paso 1"
            title="Estabilidad hemodinámica"
            note="Evalúa shock, edema agudo de pulmón o síndrome coronario agudo antes de decidir el resto."
          />
          <div className="grid gap-4">
            <FlowChoiceCard
              icon={ShieldAlert}
              title="Inestabilidad / crítico"
              note="Shock, angina grave o insuficiencia cardíaca aguda."
              tone="critical"
              onClick={() =>
                updateFlow({
                  step: 2,
                  stability: 'unstable',
                  duration: null,
                  structuralHeartDisease: null,
                })
              }
            />
            <FlowChoiceCard
              icon={Activity}
              title="Estabilidad clínica"
              note="Sin compromiso hemodinámico inmediato."
              onClick={() =>
                updateFlow({
                  step: 2,
                  stability: 'stable',
                })
              }
            />
          </div>
        </section>
      ) : null}

      {step === 2 && stability === 'stable' ? (
        <section className={`${panelClass} animate-in fade-in slide-in-from-right-4 p-5 duration-300 sm:p-6`}>
          <SectionTitle
            eyebrow="Paso 2"
            title="Contexto del episodio"
            note="Completa las dos variables antes de pasar a la conducta."
          />

          <div className="space-y-6">
            <div>
              <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Tiempo de evolución
              </p>
              <div className="grid grid-cols-2 gap-3">
                <FlowSelectButton
                  label="< 48 horas"
                  active={duration === 'lt48'}
                  onClick={() => updateFlow({ duration: 'lt48' })}
                />
                <FlowSelectButton
                  label="> 48 h o desconocida"
                  active={duration === 'gt48'}
                  onClick={() => updateFlow({ duration: 'gt48' })}
                />
              </div>
            </div>

            <div>
              <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Cardiopatía estructural significativa
              </p>
              <div className="grid grid-cols-2 gap-3">
                <FlowSelectButton
                  label="Sí"
                  active={structuralHeartDisease === true}
                  onClick={() => updateFlow({ structuralHeartDisease: true })}
                />
                <FlowSelectButton
                  label="No / desconocido"
                  active={structuralHeartDisease === false}
                  onClick={() => updateFlow({ structuralHeartDisease: false })}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => updateFlow({ step: 1 })} className={subtleButtonClass}>
                Volver
              </button>
              <button
                type="button"
                disabled={!duration || structuralHeartDisease === null}
                onClick={() => updateFlow({ step: 3 })}
                className="inline-flex items-center gap-2 rounded-2xl bg-sky-800 px-4 py-3 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continuar
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {step === 2 && stability === 'unstable' ? (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <FlowActionCard
            title="Conducta inmediata: cardioversión eléctrica urgente"
            body="Prioridad absoluta: estabilización hemodinámica. La fibrilación rápida inestable no debe esperar a un desarrollo largo del protocolo."
            tone="critical"
          >
            <div className="space-y-3">
              <div className="rounded-[1.1rem] border border-white/15 bg-white/10 px-4 py-3">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-red-100/70">
                  Preprocedimiento
                </p>
                <p className="mt-2 text-sm text-red-50/90">
                  Analgesia y sedación. Si el paciente toma digoxina, considera iniciar con menor energía y evita cardioversión si sospechas intoxicación digitálica.
                </p>
              </div>
              <div className="rounded-[1.1rem] border border-white/15 bg-white/10 px-4 py-3">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-red-100/70">
                  Anticoagulación aguda
                </p>
                <p className="mt-2 text-sm text-red-50/90">
                  Si no está anticoagulado, plantea HBPM terapéutica en fase aguda y documenta el plan de continuación.
                </p>
              </div>
              <div className="space-y-2">
                {['enoxaparina', 'amiodarona'].map((medicationId) => (
                  <MedicationQuickRow
                    key={medicationId}
                    medication={getMedication(medicationId)}
                    onOpen={() => onMedicationOpen(medicationId)}
                  />
                ))}
              </div>
            </div>
          </FlowActionCard>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={onFaFlowReset} className={subtleButtonClass}>
              Reevaluar estabilidad
            </button>
            <button
              type="button"
              onClick={() => updateFlow({ step: 4 })}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            >
              <Calculator className="h-4 w-4" />
              Ir a prevención de ictus
            </button>
          </div>
        </div>
      ) : null}

      {step === 3 && stability === 'stable' ? (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <section className="overflow-hidden rounded-[1.8rem] border border-slate-200/80 bg-white shadow-[0_28px_60px_-44px_rgba(15,23,42,0.5)]">
            <div className="bg-sky-900 px-5 py-5 text-white sm:px-6">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-sky-200">Paso 3</p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight">Conducta inicial</h3>
              <p className="mt-1 text-sm text-sky-100/80">Objetivo operativo: control de frecuencia y definición de cardioversión.</p>
            </div>

            <div className="space-y-5 px-5 py-5 sm:px-6">
              <div className="rounded-[1.25rem] border border-slate-200/80 bg-slate-50 px-4 py-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Info className="h-4 w-4 text-sky-700" />
                  {structuralHeartDisease ? 'Con cardiopatía estructural significativa' : 'Sin cardiopatía estructural significativa'}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  {structuralHeartDisease
                    ? 'Prioriza digoxina para control de frecuencia y reserva amiodarona como apoyo si la situación lo exige.'
                    : 'Prioriza betabloqueante o verapamilo/diltiazem según perfil clínico y tolerancia.'}
                </p>
              </div>

              <div className="space-y-2">
                {controlMedicationIds.map((medicationId) => (
                  <MedicationQuickRow
                    key={medicationId}
                    medication={getMedication(medicationId)}
                    onOpen={() => onMedicationOpen(medicationId)}
                  />
                ))}
              </div>

              <FlowActionCard
                title={duration === 'lt48' ? 'Control del ritmo: cardioversión urgente' : 'Control del ritmo: cardioversión electiva'}
                body={
                  duration === 'lt48'
                    ? 'Si el episodio es menor de 48 horas, puedes plantear cardioversión farmacológica o eléctrica tras controlar síntomas y revisar el contexto clínico.'
                    : 'Si el episodio supera 48 horas o la duración es desconocida, necesita anticoagulación previa o ETE antes de la cardioversión.'
                }
                tone={duration === 'lt48' ? 'neutral' : 'warning'}
              >
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => onMedicationOpen('amiodarona')} className={subtleButtonClass}>
                    Abrir amiodarona
                  </button>
                  <button type="button" onClick={onMedicationsHub} className={subtleButtonClass}>
                    Ver fármacos
                  </button>
                </div>
              </FlowActionCard>

              <div className="rounded-[1.2rem] border border-amber-200/80 bg-amber-50/70 px-4 py-3 text-sm text-amber-950/80">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                  <span>{protocol.warnings[0]}</span>
                </div>
              </div>
            </div>
          </section>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => updateFlow({ step: 2 })} className={subtleButtonClass}>
              Volver al contexto
            </button>
            <button
              type="button"
              onClick={() => updateFlow({ step: 4 })}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            >
              <Calculator className="h-4 w-4" />
              Evaluar riesgo embólico
            </button>
          </div>
        </div>
      ) : null}

      {step === 4 ? (
        <section className={`${panelClass} animate-in fade-in slide-in-from-bottom-4 p-5 duration-300 sm:p-6`}>
          <SectionTitle
            eyebrow="Paso 4"
            title="Prevención de ictus"
            note="Abre las escalas y enlaza la estrategia de anticoagulación sin salir de la arquitectura general."
          />

          <div className="rounded-[1.4rem] bg-slate-900 px-5 py-5 text-white">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Criterio operativo
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-100">
              Anticoagulación oral si CHA2DS2-VASc es igual o mayor de 1 en hombres o igual o mayor de 2 en mujeres. Si no hay prótesis valvular mecánica ni estenosis mitral moderada/grave, prioriza ACOD.
            </p>
          </div>

          <div className="mt-4 space-y-2">
            {quickCalculationIds.map((calculatorId) => {
              const calculator = getCalculator(calculatorId);
              return (
                <ListActionRow
                  key={calculatorId}
                  title={calculator.title}
                  meta={calculator.summary}
                  onClick={() => onCalculatorOpen(calculatorId)}
                />
              );
            })}
          </div>

          <div className="mt-4 grid gap-2 lg:grid-cols-2">
            {preventionMedicationIds.map((medicationId) => (
              <MedicationQuickRow
                key={medicationId}
                medication={getMedication(medicationId)}
                onOpen={() => onMedicationOpen(medicationId)}
              />
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={() => updateFlow({ step: stability === 'unstable' ? 2 : 3 })} className={subtleButtonClass}>
              Volver
            </button>
            <button type="button" onClick={onCalculationsHub} className={subtleButtonClass}>
              Abrir cálculos
            </button>
            <button type="button" onClick={onMedicationsHub} className={subtleButtonClass}>
              Abrir medicamentos
            </button>
            <button
              type="button"
              onClick={onFinish}
              className="inline-flex items-center gap-2 rounded-2xl bg-sky-800 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-700"
            >
              Finalizar
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
};

const CalculationsView = ({ onBack, onCalculatorOpen }) => (
  <div className="mx-auto max-w-5xl space-y-4">
    <BackBar label="Inicio" onClick={onBack} />

    <section className={`${shellCardClass} p-5 sm:p-6`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-400">Herramientas rápidas</p>
          <h1 className="mt-2 text-[1.8rem] font-semibold tracking-tight text-slate-950">Cálculos</h1>
          <p className="mt-2 max-w-xl text-sm text-slate-500">
            Vista corta para abrir escalas sin invadir la home ni el protocolo principal.
          </p>
        </div>
        <StatusBadge tone="active">{implementedCalculators.length} activos</StatusBadge>
      </div>
    </section>

    <DetailPanel title="Disponibles" note="Las mismas escalas pueden abrirse desde FA en modo rápido.">
      <div className="space-y-2">
        {implementedCalculators.map((calculator) => (
          <ListActionRow
            key={calculator.id}
            title={calculator.title}
            meta={`${calculator.block} · p. ${calculator.verifiedPage}`}
            onClick={() => onCalculatorOpen(calculator.id)}
          />
        ))}
      </div>
    </DetailPanel>
  </div>
);

const CalculatorDetailView = ({ calculatorId, values, onChange, onBack }) => {
  const calculator = getCalculator(calculatorId);

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <BackBar label="Cálculos" onClick={onBack} />

      <section className={`${shellCardClass} p-5 sm:p-6`}>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge tone="active">Implementado</StatusBadge>
          <span className="text-sm text-slate-500">
            {calculator.chapter} · p. {calculator.verifiedPage}
          </span>
        </div>
        <h1 className="mt-3 text-[1.9rem] font-semibold tracking-tight text-slate-950">{calculator.title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">{calculator.summary}</p>
      </section>

      <CalculatorPanel calculatorId={calculatorId} values={values} onChange={onChange} />
      <BibliographyBlock entries={calculator.bibliography} />
    </div>
  );
};

const MedicationsView = ({ onBack, onMedicationOpen }) => {
  const [activeGroupId, setActiveGroupId] = useState(medicationGroups[0]?.id ?? '');
  const currentGroup = medicationGroups.find((group) => group.id === activeGroupId) ?? medicationGroups[0];

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <BackBar label="Inicio" onClick={onBack} />

      <section className={`${shellCardClass} p-5 sm:p-6`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-400">Fármacos conectados</p>
            <h1 className="mt-2 text-[1.8rem] font-semibold tracking-tight text-slate-950">Medicamentos</h1>
            <p className="mt-2 max-w-xl text-sm text-slate-500">
              Se mantienen las fichas completas, pero la lista principal se reduce a accesos claros y agrupados.
            </p>
          </div>
          <StatusBadge tone="active">{medicationGroups.reduce((count, group) => count + group.items.length, 0)} fichas</StatusBadge>
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
          {medicationGroups.map((group) => (
            <ProtocolSectionButton
              key={group.id}
              label={group.title}
              active={currentGroup.id === group.id}
              onClick={() => setActiveGroupId(group.id)}
            />
          ))}
        </div>
      </section>

    <DetailPanel title={currentGroup.title} note="Desde aquí puedes abrir la ficha completa y volver al contexto anterior.">
      <div className="space-y-2">
        {currentGroup.items.map((medicationId) => {
          const medication = getMedication(medicationId);

          return (
            <MedicationQuickRow
              key={medication.id}
              medication={medication}
              onOpen={() => onMedicationOpen(medication.id)}
            />
          );
        })}
      </div>
    </DetailPanel>
  </div>
);
};

const MedicationDetailView = ({ medication, onBack }) => (
  <div className="mx-auto max-w-5xl space-y-4">
    <BackBar label="Medicamentos" onClick={onBack} />

    <section className={`${shellCardClass} p-5 sm:p-6`}>
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge tone="active">{medication.family}</StatusBadge>
        <span className="text-sm text-slate-500">Módulo FA</span>
      </div>
      <h1 className="mt-3 text-[1.9rem] font-semibold tracking-tight text-slate-950">{medication.name}</h1>
      <p className="mt-3 max-w-3xl text-sm text-slate-600">{medication.indication}</p>
    </section>

    <div className="grid gap-4 lg:grid-cols-2">
      <DetailPanel title="Pauta clínica">
        <div className="space-y-3">
          <div className={`${mutedPanelClass} p-4`}>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">Dosis</p>
            <p className="mt-2 text-sm text-slate-800">{medication.dose}</p>
          </div>
          <div className={`${mutedPanelClass} p-4`}>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">Vía</p>
            <p className="mt-2 text-sm text-slate-800">{medication.route}</p>
          </div>
          <div className={`${mutedPanelClass} p-4`}>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">Frecuencia</p>
            <p className="mt-2 text-sm text-slate-800">{medication.frequency}</p>
          </div>
          <div className={`${mutedPanelClass} p-4`}>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">Duración</p>
            <p className="mt-2 text-sm text-slate-800">{medication.duration}</p>
          </div>
        </div>
      </DetailPanel>

      <DetailPanel title="Seguridad y ajustes">
        <div className="space-y-3">
          <div className={`${mutedPanelClass} p-4`}>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">Contraindicaciones / precauciones</p>
            <div className="mt-3 space-y-2">
              {medication.contraindications.map((item) => (
                <div
                  key={item}
                  className="rounded-[0.95rem] border border-slate-200/80 bg-white px-3 py-2.5 text-sm text-slate-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className={`${mutedPanelClass} p-4`}>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">Insuficiencia renal</p>
            <p className="mt-2 text-sm text-slate-700">{medication.renalAdjustment}</p>
          </div>
          <div className={`${mutedPanelClass} p-4`}>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">Insuficiencia hepática</p>
            <p className="mt-2 text-sm text-slate-700">{medication.hepaticAdjustment}</p>
          </div>
          <div className={`${mutedPanelClass} p-4`}>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">Observaciones prácticas</p>
            <div className="mt-3 space-y-2">
              {medication.practicalNotes.map((item) => (
                <div
                  key={item}
                  className="rounded-[0.95rem] border border-slate-200/80 bg-white px-3 py-2.5 text-sm text-slate-700"
                >
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
        <div className={`${mutedPanelClass} p-4 text-sm text-slate-700`}>{medication.sourceScope}</div>
        <SourceList sources={medication.sources} />
      </div>
    </DetailPanel>
  </div>
);

const App = () => {
  const [route, setRoute] = useState({ view: 'home' });
  const [isScrolled, setIsScrolled] = useState(false);
  const [calculatorInputs, setCalculatorInputs] = useState(initialCalculatorInputs);
  const [faFlowState, setFaFlowState] = useState(initialFaFlowState);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigate = (nextRoute) => {
    startTransition(() => {
      setRoute(nextRoute);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const resetFaFlow = () => {
    setFaFlowState(initialFaFlowState);
  };

  const updateFaFlow = (changes) => {
    setFaFlowState((current) => ({
      ...current,
      ...changes,
    }));
  };

  const openModule = (moduleId, returnTo = { view: 'protocols' }) => {
    const module = getMotivoModule(moduleId);

    if (!module.implemented) {
      return;
    }

    resetFaFlow();
    navigate({ view: 'protocol', protocolId: module.id, returnTo });
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

  const handlePrimaryNavigation = (sectionKey) => {
    if (sectionKey === 'home') {
      navigate({ view: 'home' });
      return;
    }

    if (sectionKey === 'protocols') {
      navigate({ view: 'protocols' });
      return;
    }

    if (sectionKey === 'calculations') {
      openCalculations({ view: 'home' });
      return;
    }

    openMedications({ view: 'home' });
  };

  const renderView = () => {
    if (route.view === 'protocol') {
      return (
        <FibrilacionAuricularFlowView
          protocol={getProtocol(route.protocolId ?? 'fibrilacion-auricular')}
          faFlowState={faFlowState}
          onFaFlowChange={updateFaFlow}
          onFaFlowReset={resetFaFlow}
          onCalculatorOpen={(calculatorId) =>
            openCalculator(calculatorId, {
              view: 'protocol',
              protocolId: route.protocolId ?? 'fibrilacion-auricular',
            })
          }
          onCalculationsHub={() =>
            openCalculations({
              view: 'protocol',
              protocolId: route.protocolId ?? 'fibrilacion-auricular',
            })
          }
          onMedicationOpen={(medicationId) =>
            openMedication(medicationId, {
              view: 'protocol',
              protocolId: route.protocolId ?? 'fibrilacion-auricular',
            })
          }
          onMedicationsHub={() =>
            openMedications({
              view: 'protocol',
              protocolId: route.protocolId ?? 'fibrilacion-auricular',
            })
          }
          onBack={handleBack}
          onFinish={() => {
            resetFaFlow();
            navigate({ view: 'home' });
          }}
        />
      );
    }

    if (route.view === 'protocols') {
      return (
        <ProtocolsView
          onBack={() => navigate({ view: 'home' })}
          onModuleOpen={(moduleId) => openModule(moduleId, { view: 'protocols' })}
        />
      );
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
        onProtocolsOpen={() => navigate({ view: 'protocols' })}
        onCalculationsOpen={() => openCalculations({ view: 'home' })}
        onMedicationsOpen={() => openMedications({ view: 'home' })}
      />
    );
  };

  return (
    <div className="min-h-screen text-slate-900" style={shellBackground}>
      <PrimaryNavigation activeKey={getPrimarySection(route.view)} onSelect={handlePrimaryNavigation} />
      <AppHeader isScrolled={isScrolled} pageLabel={getPageLabel(route)} onHome={() => navigate({ view: 'home' })} />
      <main className="pb-24 pt-20 lg:pl-24 lg:pb-10">
        <div className="px-4 sm:px-6 lg:px-8">{renderView()}</div>
      </main>
    </div>
  );
};

export default App;
