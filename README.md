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

## Bitácora

### Fase 1 · Base del proyecto

- Se montó la app estática con `Vite + React + Tailwind`.
- Se preparó el despliegue en `GitHub Pages`.
- Se dejó el repo listo para build y publicación continua.

### Fase 2 · Limpieza visual y home

- Se redujo la home para evitar aspecto de demo o dashboard genérico.
- Se rebajó el peso visual de la bibliografía y de la marca repetida.
- Se dejó una única dirección visual sobria y más compacta.

### Fase 3 · Auditoría bibliográfica

- Se auditó la obra base `Murillo 7.ª ed.`.
- Se separó `página índice`, `página libro` y `página PDF`.
- Se construyó el índice maestro de temas y cálculos reales detectados en la bibliografía.
- Se dejó constancia de que la nueva bibliografía específica de radiología no está en este workspace.

### Fase 4 · Primer contenido clínico real

- Se construyó el primer protocolo real: `fibrilación auricular`.
- Se integraron tres cálculos útiles para ese flujo: `CHA2DS2-VASc`, `HAS-BLED` y `Cockcroft-Gault`.
- Se construyeron fichas farmacológicas enlazadas al protocolo.
- Se usó `CIMA AEMPS` como fuente farmacológica principal y el capítulo 23 del Murillo como base contextual del protocolo.

## Estructura real de la app

### Flujo funcional actual

- `Home`
- `Motivo de consulta`
- `Protocolo activo de fibrilación auricular`
- `Cálculos`
- `Medicamentos`
- `Bibliografía`

### Estructura técnica

- `src/App.jsx`
  - interfaz principal
  - navegación contextual entre home, protocolo, cálculos y medicamentos
  - retorno al contexto de origen desde cálculo o fármaco

- `src/data/bibliography.js`
  - catálogo bibliográfico
  - generación de enlaces al PDF
  - estructura común de referencias

- `src/data/modules.js`
  - módulos auditados para `Motivo de consulta`
  - actividad reciente
  - bibliografía base usada
  - índice clínico auditado

- `src/data/protocols.js`
  - protocolos clínicos reales
  - en esta fase contiene `fibrilación auricular`

- `src/data/calculators.js`
  - auditoría de cálculos y escalas
  - lógica activa de `CHA2DS2-VASc`
  - lógica activa de `HAS-BLED`
  - lógica activa de `Cockcroft-Gault`

- `src/data/medications.js`
  - fichas farmacológicas del protocolo activo
  - dosis, vía, frecuencia, duración
  - contraindicaciones y ajustes por IR / IH
  - fuentes CIMA y referencia contextual del protocolo

- `src/data/imageTemplates.js`
  - índice de plantillas de imagen
  - primera plantilla preparada: `RX tórax sistemática`

- `public/biblio/urgencias-murillo-7ma.pdf`
  - obra base activa usada por la app

### Qué está realmente activo hoy

- Home compacta
- Protocolo de fibrilación auricular
- Cálculos de FA
- Fichas farmacológicas de FA
- Índice maestro auditado en este `README`

## Pendiente

### Pendiente funcional

- Construir el siguiente protocolo real a partir de los temas ya auditados.
- Ampliar `Medicamentos` más allá del módulo de fibrilación auricular.
- Implementar nuevos cálculos solo cuando se active su módulo clínico correspondiente.
- Mejorar la búsqueda para que no sea solo una entrada de navegación sino también una entrada clínica más útil.

### Pendiente bibliográfico

- Subir la bibliografía específica de radiología al repo.
- Indexar esa nueva fuente una vez esté realmente disponible.
- Completar la plantilla `RX tórax sistemática` con base radiológica real verificada.

### Pendiente clínico

- Desarrollar protocolos reales para temas ya auditados como `ictus`, `sepsis`, `shock` o `síndrome coronario agudo`.
- Mantener la misma arquitectura conectada entre protocolo, cálculos, medicamentos y bibliografía.
- Seguir separando con claridad lo que proviene del libro y lo que proviene de `CIMA AEMPS`.

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
