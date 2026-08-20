# 🎨 3D PBR Material & Texture Studio

[![Deploy to GitHub Pages](https://github.com/avaloonunder/pbr-texture-viewer/actions/workflows/deploy.yml/badge.svg)](https://github.com/avaloonunder/pbr-texture-viewer/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-indigo?style=flat&logo=github)](https://avaloonunder.github.io/pbr-texture-viewer/)
[![License: CC0 & MIT](https://img.shields.io/badge/License-CC0%20%26%20MIT-blue.svg)](LICENSE)

An interactive, high-performance web-based **3D PBR (Physically Based Rendering) Material & Texture Viewer** built with **Three.js**, **React 19**, **TypeScript**, and **Tailwind CSS**.

---

## 🚀 Live Demo
👉 **[https://avaloonunder.github.io/pbr-texture-viewer/](https://avaloonunder.github.io/pbr-texture-viewer/)**

---

## 🌟 Key Features

### 1. 🌐 Real-Time 3D Viewport (Three.js & WebGL)
- **Dynamic Test Geometries**:
  - **Material Ball**: Professional curved shader sphere with pedestal and protective rim.
  - **3D Timber Plank / Beam**: Architectural wooden board with depth and edge bevels.
  - **Sphere, Rounded Cube, Plane / Wall, Cylinder, Torus Knot**.
- **Physically Based Shader Engine**:
  - Multi-map mapping: *Albedo / Base Color*, *Normal Map (with OpenGL / DirectX Y-inversion)*, *Roughness*, *Metallic*, *Height / Displacement*, *Physical Transmission / Refraction (for glass)*, and *Ambient Occlusion*.
  - Real-time **Displacement / Tessellation** with live geometry subdivision control (32 to 256 segments).
  - Real-time **Wireframe overlay** mode to inspect polygon topology.
- **Lighting & Studio Environments**:
  - 5 lighting presets: *Studio Neutral, Warm Sunset, Cyberpunk Neon, Industrial Warehouse, Soft Overcast*.
  - 360° light rotation, exposure control, dynamic soft shadows, and 360° auto-rotation.
  - Quick camera orientation buttons (**ISO, Front, Top**) and damping OrbitControls.

### 2. 🔍 High-Resolution 2D Map Inspector
- Inspect individual 2K / 4K maps (*BaseColor, Normal, Roughness, Height, Metallic, Ambient Occlusion*).
- Pan & interactive Zoom (from 20% to 600%).
- **A/B Split-Screen Comparison**: Interactive vertical divider slider to contrast two maps side-by-side (e.g. *BaseColor vs Normal*).
- **Color Channel Isolation**: Extract RGB, Red, Green, Blue, or Invert channels.

### 3. 📱 Nomad Sculpt (iPad / iPadOS) 1-Tap Export
- **Export Alpha / Stamp (Height PNG)**: Optimized brush stamp for sculpting wrinkles, rock cracks, dragon scales, wood grains, or hex patterns directly onto your 3D mesh in Nomad.
- **Open 3D Model (.GLB PBR) in Nomad**: Generates a `.glb` binary with embedded PBR textures that opens directly in Nomad Sculpt via the iOS Share Sheet!
- **iPad Files App Integration**: Save alphas straight to `On My iPad > Nomad > alphas` or textures to `On My iPad > Nomad > textures`.

### 4. 📚 100% Free & Legal Open-Source Material Catalog
- **25 Complete PBR Material Sets (119 Texture Maps)** across 7 rich categories:
  - **Sci-Fi & Cyberpunk**: Cyberpunk Hex Plating (Carbon Fiber & Titanium).
  - **Wood & Timber**: Oak Parquet, Rustic Planks, Herringbone Parquet, Natural Pine, Clock Tower Wood Frames & Single Planks.
  - **Bricks & Masonry**: Red Clay Bricks, Weathered Dark Bricks, Fantasy Dungeon Flagstone, Clock Tower Replica Domes (with and without aperture window).
  - **Tiles & Ceramics**: Modern Hexagon Ceramic Wall Tiles.
  - **Stone & Concrete**: White Carrara Luxury Marble, Kintsugi Gold Vein Marble, Architectural Concrete Panels.
  - **Fabric & Leather**: Woven Linen Cloth, Fine Grain Black Leather, Dragon Scale Armored Leather.
  - **Ground & Nature**: Forest Soil, Twigs & Pebbles.
- Instant search, category filters, and favorites system with `localStorage` persistence.

### 5. 🌍 Internationalization (i18n / Locale)
- One-click language toggle between **Español (ES)** and **English (EN)**.

### 6. ⚡ 3D Suite Exporters & 1-Click HD Capture
- **Blender (Python)**: Auto-generated script creating the complete `Principled BSDF` node tree with proper color space and UV mapping in Blender.
- **Unreal Engine 5**: Texture compression guide and Material Graph connections.
- **Unity (URP)**: Lit Shader slot mapping.
- **Three.js**: Ready-to-use TypeScript/JavaScript snippet.
- **1-Click Screenshot**: Render high-resolution PNG snapshots directly from the 3D viewport.

---

## 🛠️ Tech Stack

- **3D Engine**: [Three.js](https://threejs.org/) (WebGL2, PCFSoftShadowMap, ACESFilmicToneMapping, GLTFExporter)
- **UI Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Dev Server**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **CI/CD**: GitHub Actions (`.github/workflows/deploy.yml`) -> GitHub Pages

---

## 📦 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation
```bash
# Clone the repository
git clone https://github.com/avaloonunder/pbr-texture-viewer.git

# Enter project directory
cd pbr-texture-viewer

# Install dependencies
npm install

# Run local development server
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) in your browser.

---

## 🏗️ Building for Production

```bash
# Build static site for production (bundles into /dist)
npm run build

# Preview production build locally
npm run preview
```

---

## 📄 License & Asset Credits
- Software Code: [MIT License](LICENSE).
- All Textures: **100% Free & Open Source**:
  - **ambientCG Textures**: Dedicated to the public domain under the [Creative Commons CC0 1.0 Universal License](https://creativecommons.org/publicdomain/zero/1.0/).
  - **Procedural / Game-Art Replicas**: Custom game-ready procedural and shader textures generated for this project.
