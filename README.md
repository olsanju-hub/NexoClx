# NexoClx

Aplicación React con Vite para una primera capa de consulta clínica basada en *Medicina de urgencias y emergencias. Guía diagnóstica y protocolos de actuación*.

## Requisitos

- Node.js 20+ recomendado
- npm 10+

## Desarrollo

```bash
npm install
npm run dev -- --host 0.0.0.0 --port 4174
```

Abrir en `http://localhost:4174`.

## Compilación

```bash
npm run build
```

La salida de producción queda en `dist/`.

## GitHub Pages

El proyecto ya incluye workflow en `.github/workflows/deploy-pages.yml` para publicar automáticamente en GitHub Pages al hacer push a `main`.

Pasos mínimos:

1. Crear el repositorio en GitHub.
2. Subir la rama `main`.
3. En el repositorio, dejar Pages configurado para usar **GitHub Actions**.
4. El workflow hará `npm ci`, `npm run build` y desplegará `dist/`.

## Subida a GitHub

```bash
git init -b main
git add .
git commit -m "Initial NexoClx app setup"
git remote add origin https://github.com/TU_USUARIO/NexoClx.git
git push -u origin main
```

## Estructura

- `src/App.jsx`: interfaz principal
- `src/data/modules.js`: estructura de módulos preparada para contenido, cálculos, tratamiento y bibliografía
- `src/data/bibliography.js`: catálogo bibliográfico y enlaces a PDF/página
- `public/branding/NexoClx.png`: logo oficial usado dentro y fuera de la app
- `public/biblio/urgencias-murillo-7ma.pdf`: bibliografía base
- `.github/workflows/deploy-pages.yml`: despliegue automático en GitHub Pages

## Notas

- Cada módulo está preparado para incluir:
  - título
  - contenido
  - cálculos
  - tratamiento
  - bibliografía estructurada
  - enlace a la referencia y, cuando aplica, a la página exacta del PDF con `#page=`
- La bibliografía no queda como texto suelto: cada entrada guarda `referenceId`, `reference`, `pages`, `filePath`, `href`, `internalId` y `note`.
- El branding generado previamente fue eliminado; el proyecto usa únicamente el logo oficial en `public/branding/NexoClx.png`.
- `node_modules` y `dist` están excluidos del repositorio mediante `.gitignore`.
