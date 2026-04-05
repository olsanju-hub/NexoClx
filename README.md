# NexoClx

Interfaz React + Vite para consulta clínica inicial basada en bibliografía real de urgencias.  
La primera capa clínica activa en esta fase es `fibrilación auricular`.

## Estado actual

- Home reducida a lo esencial: logo, acceso a bibliografía, buscador, `Motivo de consulta`, `Medicamentos`, `Cálculos` y `Actividad reciente`.
- Primer protocolo real operativo: `fibrilación auricular`.
- Cálculos activos del protocolo: `CHA2DS2-VASc`, `HAS-BLED` y `Cockcroft-Gault`.
- Fichas farmacológicas activas enlazadas desde el protocolo y desde `Medicamentos`, con base principal en `CIMA AEMPS`.
- GitHub Pages publicado en `https://olsanju-hub.github.io/NexoClx/`.

## Requisitos

- Node.js 20+
- npm 10+

## Desarrollo local

```bash
npm install
npm run dev -- --host 0.0.0.0 --port 4174
```

Abrir `http://localhost:4174`.

## Build de producción

```bash
npm run build
```

La salida queda en `dist/`.

## Publicación en GitHub Pages

El proyecto ya incluye `.github/workflows/deploy-pages.yml`.

Flujo mínimo:

```bash
git add .
git commit -m "Tu cambio"
git push origin main
```

GitHub Actions compila y publica automáticamente la rama `main`.

## Estructura útil

- `src/App.jsx`: interfaz principal y navegación contextual
- `src/data/modules.js`: auditoría temática, home y bibliografía base usada
- `src/data/protocols.js`: protocolo real de fibrilación auricular
- `src/data/calculators.js`: auditoría de cálculos y calculadoras activas
- `src/data/medications.js`: fichas farmacológicas activas del módulo FA
- `src/data/imageTemplates.js`: índice de plantillas de imagen
- `src/data/bibliography.js`: catálogo bibliográfico y enlaces al PDF
- `public/biblio/urgencias-murillo-7ma.pdf`: obra base activa

## Índice maestro del proyecto

### Convención de páginas

- `Página índice`: numeración mostrada en el índice de capítulos.
- `Página libro`: numeración impresa verificada sobre el contenido real.
- `Página PDF`: página física del archivo usada para enlaces `#page=`.

### Bibliografía base usada

| Fuente | Ubicación | Estado | Observaciones |
| --- | --- | --- | --- |
| *Medicina de urgencias y emergencias. Guía diagnóstica y protocolos de actuación, 7.ª edición* | `public/biblio/urgencias-murillo-7ma.pdf` | Activa | Obra base auditada y utilizada por la app. |
| Bibliografía específica de radiología | No detectada en este workspace | No disponible en workspace | En esta fecha no hay un nuevo PDF de radiología dentro del repositorio. Por eso no se ha indexado una segunda fuente radiológica real. |

### Patologías / temas auditados

| Tema | Capítulo | Página índice | Página real verificada | Página PDF | Estado | Observaciones |
| --- | --- | ---: | ---: | ---: | --- | --- |
| Fibrilación y flúter auriculares | Cap. 23 | 184 | 185 | 210 | Implementado | El índice adelanta el capítulo una página; el arranque útil real está en p. 185. |
| Soporte vital básico en adultos | Cap. 1 | 2 | 2 | 27 | Auditado | Sin discrepancia. |
| Soporte vital avanzado en adultos | Cap. 2 | 7 | 7 | 32 | Auditado | Sin discrepancia. |
| Gasometría, pulsioximetría y capnografía | Cap. 8 | 64 | 64 | 89 | Auditado | Sin discrepancia. |
| Electrocardiografía de urgencias | Cap. 9 | 71 | 71 | 96 | Auditado | Sin discrepancia. |
| Radiografía de tórax | Cap. 10 | 83 | 83 | 108 | Auditado | Sin discrepancia. |
| Ecografía | Cap. 12 | 108 | 108 | 133 | Auditado | Sin discrepancia. |
| Shock | Cap. 18 | 154 | 154 | 179 | Auditado | El arranque conceptual está en la página indexada; el rótulo se repite en la siguiente. |
| Insuficiencia cardíaca | Cap. 19 | 161 | 161 | 186 | Auditado | Sin discrepancia. |
| Dolor torácico agudo | Cap. 25 | 207 | 207 | 232 | Auditado | El contenido arranca en la página indexada. |
| Síndrome coronario agudo | Cap. 26 | 214 | 214 | 239 | Auditado | El rótulo del capítulo aparece a continuación del arranque conceptual. |
| Dolor abdominal agudo | Cap. 50 | 340 | 340 | 365 | Auditado | El contenido arranca en la página indexada. |
| Náuseas, vómitos y diarrea | Cap. 51 | 358 | 358 | 383 | Auditado | Sin discrepancia. |
| Coma | Cap. 62 | 428 | 428 | 453 | Auditado | El rótulo del capítulo aparece en la página siguiente al arranque conceptual. |
| Crisis epilépticas | Cap. 63 | 435 | 435 | 460 | Auditado | Sin discrepancia. |
| Ictus | Cap. 64 | 442 | 442 | 467 | Auditado | El rótulo del capítulo aparece en la página siguiente al arranque conceptual. |
| Sepsis | Cap. 107 | 640 | 640 | 665 | Auditado | Sin discrepancia. |

### Cálculos / escalas auditados

| Cálculo / escala | Bloque clínico | Página libro verificada | Página PDF | Estado | Observaciones |
| --- | --- | ---: | ---: | --- | --- |
| Aclaramiento de creatinina (Cockcroft-Gault) | Cap. 5 · Bioquímica sanguínea | 39 | 64 | Implementado | Se usa ya para revisar ajuste renal de anticoagulantes en FA. |
| CHA2DS2-VASc | Cap. 23 · Fibrilación y flúter auriculares | 189 | 214 | Implementado | Integrado en el protocolo real de FA. |
| HAS-BLED | Cap. 23 · Fibrilación y flúter auriculares | 190 | 215 | Implementado | Integrado en el protocolo real de FA. |
| TFG estimado (CKD-EPI) | Cap. 5 · Bioquímica sanguínea | 39 | 64 | Pendiente | Auditado pero no necesario aún para el primer protocolo. |
| Diferencia alveoloarterial de O2 (∆AaPO2) | Cap. 8 · Gasometría, pulsioximetría y capnografía | 66 | 91 | Pendiente | Queda fuera del primer módulo real. |
| GRACE | Cap. 26 · Síndrome coronario agudo | 220 | 245 | Pendiente | Escala explícita en tabla. |
| Clase Killip | Cap. 26 · Síndrome coronario agudo | 220 | 245 | Pendiente | Clasificación de gravedad del mismo bloque. |
| Escala de Alvarado modificada | Cap. 50 · Dolor abdominal agudo | 349 | 374 | Pendiente | Referida en el diagnóstico diferencial. |
| Escala de coma de Glasgow | Cap. 62 · Coma | 429 | 454 | Pendiente | Escala explícita para nivel de conciencia. |
| NIHSS | Cap. 64 · Ictus | 446 | 471 | Pendiente | Tabla de valoración neurológica. |
| Escala de Rankin modificada | Cap. 64 · Ictus | 442 | 467 | Pendiente | Criterio funcional en ictus. |
| Escala de Cincinnati | Cap. 64 · Ictus | 446 | 471 | Pendiente | Escala extrahospitalaria citada en Código Ictus. |
| qSOFA / SOFA | Cap. 107 · Sepsis | 640 | 665 | Pendiente | Escalas de sospecha y valoración del riesgo. |
| Modelo de Wells para TVP | Cap. 36 · Enfermedad tromboembólica venosa | 261 | 286 | No aplicable por ahora | Detectado en tabla; pendiente de módulo específico. |
| Modelo de Wells para TEP | Cap. 39 · Tromboembolia pulmonar | 278 | 303 | No aplicable por ahora | Fuera del alcance actual. |
| PESI / sPESI | Cap. 39 · Tromboembolia pulmonar | 281 | 306 | No aplicable por ahora | Pendiente de módulo específico. |
| Glasgow-Blatchford | Cap. 48 · Hemorragia digestiva alta | 329 | 354 | No aplicable por ahora | Pendiente de módulo específico. |

### Plantillas de imagen

| Plantilla | Bibliografía base | Ubicación real | Estado | Observaciones |
| --- | --- | --- | --- | --- |
| RX tórax sistemática | Murillo 7.ª ed. · Cap. 10 Radiografía de tórax | `src/data/imageTemplates.js` | En desarrollo | Solo existe la estructura de plantilla. No se ha completado una secuencia diagnóstica porque la bibliografía específica de radiología no está todavía en este repo. |

### Primer protocolo real activo

`Fibrilación auricular` conecta ya cuatro capas del proyecto:

- protocolo clínico
- cálculos integrados y también accesibles desde `Cálculos`
- fichas farmacológicas accesibles desde `Medicamentos`
- bibliografía enlazada al punto real del libro

### Fichas farmacológicas activas

Las fichas activas del módulo de FA se apoyan en `CIMA AEMPS` como fuente farmacológica principal y separan:

- uso contextual dentro del protocolo de FA
- contraindicaciones y precauciones
- ajuste por insuficiencia renal
- ajuste por insuficiencia hepática
- enlace a la ficha técnica consultada

## Modelo bibliográfico usado por el proyecto

Cada entrada bibliográfica del proyecto guarda:

- `referenceId`
- `filePath`
- `indexPages`
- `verifiedPages`
- `pdfPages`
- `href`
- `internalId`
- `note`

La app prioriza `verifiedPages` para mostrar la ubicación real en el libro y usa `pdfPages` solo para construir el enlace exacto al PDF cuando hace falta.
