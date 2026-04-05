# NexoClx

Interfaz React + Vite para una primera capa de consulta clínica basada en *Medicina de urgencias y emergencias. Guía diagnóstica y protocolos de actuación, 7.ª edición*.

## Estado actual

- Home compacta y centrada en `Motivo de consulta`.
- Bibliografía accesible pero no dominante.
- Capa `Cálculos` mostrada como índice auditado, no como calculadora operativa.
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

- `src/App.jsx`: interfaz principal
- `src/data/modules.js`: módulos clínicos, auditoría temática y auditoría de cálculos
- `src/data/bibliography.js`: catálogo bibliográfico y construcción de enlaces al PDF
- `public/biblio/urgencias-murillo-7ma.pdf`: obra base
- `public/biblio/urgencias-murillo-7ma-cover.png`: portada pequeña usada en interfaz
- `public/branding/NexoClx.png`: logo original subido al proyecto
- `public/branding/NexoClx-mark.png`: isotipo limpio derivado del logo para uso de interfaz

## Índice maestro del proyecto

### Convención de páginas

- `Página libro`: numeración impresa del libro, verificada sobre el propio contenido.
- `Página PDF`: página física del archivo usada para enlaces `#page=`.

### Cálculos del proyecto

#### Implementados

Actualmente no hay cálculos operativos expuestos en la interfaz.

#### Auditados en la bibliografía

| Cálculo / escala | Capítulo o bloque | Página libro verificada | Página PDF | Estado | Observaciones |
| --- | --- | ---: | ---: | --- | --- |
| Aclaramiento de creatinina (Cockcroft-Gault) | Cap. 5 · Bioquímica sanguínea | 39 | 64 | Pendiente | Fórmula citada como estimación útil en urgencias. |
| TFG estimado (CKD-EPI) | Cap. 5 · Bioquímica sanguínea | 39 | 64 | Pendiente | Se menciona junto a la estimación del filtrado glomerular. |
| Diferencia alveoloarterial de O2 (∆AaPO2) | Cap. 8 · Gasometría, pulsioximetría y capnografía | 66 | 91 | Pendiente | Incluye fórmula esperada y ecuación del gas alveolar. |
| CHA2DS2-VASc | Cap. 23 · Fibrilación y flúter auriculares | 189 | 214 | No aplicable por ahora | Fuera del alcance actual de la home y de la primera capa clínica. |
| HAS-BLED | Cap. 23 · Fibrilación y flúter auriculares | 189 | 214 | No aplicable por ahora | Misma razón que CHA2DS2-VASc. |
| GRACE | Cap. 26 · Síndrome coronario agudo | 220 | 245 | Pendiente | Escala de riesgo isquémico explícita en tabla. |
| Clase Killip | Cap. 26 · Síndrome coronario agudo | 220 | 245 | Pendiente | Clasificación cuantificable del mismo módulo clínico. |
| Modelo de Wells para TVP | Cap. 36 · Enfermedad tromboembólica venosa | 261 | 286 | No aplicable por ahora | Detectado en tabla 36.1; pendiente de módulo específico. |
| Modelo de Wells para TEP | Cap. 39 · Tromboembolia pulmonar | 278 | 303 | No aplicable por ahora | Detectado en tabla 39.1; fuera del alcance actual. |
| PESI / sPESI | Cap. 39 · Tromboembolia pulmonar | 281 | 306 | No aplicable por ahora | Herramienta pronóstica de TEP detectada en el capítulo. |
| Glasgow-Blatchford | Cap. 48 · Hemorragia digestiva alta | 329 | 354 | No aplicable por ahora | Escala validada para HDA, fuera del alcance actual. |
| Escala de Alvarado modificada | Cap. 50 · Dolor abdominal agudo | 349 | 374 | Pendiente | Referida en el diagnóstico diferencial del abdomen agudo. |
| Escala de coma de Glasgow | Cap. 62 · Coma | 429 | 454 | Pendiente | Escala explícita para valoración del nivel de conciencia. |
| Escala de Cincinnati | Cap. 64 · Ictus | 446 | 471 | Pendiente | Escala extrahospitalaria citada en la activación del Código Ictus. |
| NIHSS | Cap. 64 · Ictus | 446 | 471 | Pendiente | Tabla de valoración neurológica para ictus. |
| Escala de Rankin modificada | Cap. 64 · Ictus | 442 | 467 | Pendiente | Se usa como criterio funcional en la selección terapéutica del ictus. |
| qSOFA / SOFA | Cap. 107 · Sepsis | 640 | 665 | Pendiente | Escalas propuestas para sospecha diagnóstica y estratificación de riesgo. |

### Índice clínico comprobado

| Tema | Capítulo | Página del índice | Página real verificada | Página PDF | Observaciones |
| --- | --- | ---: | ---: | ---: | --- |
| Soporte vital básico en adultos | Cap. 1 | 2 | 2 | 27 | Sin discrepancia. |
| Soporte vital avanzado en adultos | Cap. 2 | 7 | 7 | 32 | Sin discrepancia. |
| Gasometría, pulsioximetría y capnografía | Cap. 8 | 64 | 64 | 89 | Sin discrepancia. |
| Electrocardiografía de urgencias | Cap. 9 | 71 | 71 | 96 | Sin discrepancia. |
| Radiografía de tórax | Cap. 10 | 83 | 83 | 108 | Sin discrepancia. |
| Ecografía | Cap. 12 | 108 | 108 | 133 | Sin discrepancia. |
| Shock | Cap. 18 | 154 | 154 | 179 | El arranque conceptual está en la página indexada; el rótulo del capítulo se repite en la siguiente. |
| Insuficiencia cardíaca | Cap. 19 | 161 | 161 | 186 | Sin discrepancia. |
| Dolor torácico agudo | Cap. 25 | 207 | 207 | 232 | El contenido arranca en la página indexada. |
| Síndrome coronario agudo | Cap. 26 | 214 | 214 | 239 | El arranque conceptual está en la página indexada; el rótulo del capítulo aparece a continuación. |
| Dolor abdominal agudo | Cap. 50 | 340 | 340 | 365 | El contenido arranca en la página indexada. |
| Náuseas, vómitos y diarrea | Cap. 51 | 358 | 358 | 383 | Sin discrepancia. |
| Coma | Cap. 62 | 428 | 428 | 453 | El arranque conceptual está en la página indexada; el rótulo del capítulo aparece en la siguiente. |
| Crisis epilépticas | Cap. 63 | 435 | 435 | 460 | Sin discrepancia. |
| Ictus | Cap. 64 | 442 | 442 | 467 | El arranque conceptual está en la página indexada; el rótulo del capítulo aparece en la siguiente. |
| Sepsis | Cap. 107 | 640 | 640 | 665 | Sin discrepancia. |

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
