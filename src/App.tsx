import React, { useState, useRef, useEffect } from 'react';
import catalogData from './data/materials.json';
import { 
  MaterialSet, 
  MeshGeometryType, 
  PBRSettings, 
  EnvironmentSettings, 
  TextureMapType 
} from './types';
import { Header } from './components/Header';
import { MaterialGallery } from './components/MaterialGallery';
import { Viewport3D, Viewport3DHandle } from './components/Viewport3D';
import { MapInspector2D } from './components/MapInspector2D';
import { MaterialPropertiesPanel } from './components/MaterialPropertiesPanel';
import { EnvironmentControls } from './components/EnvironmentControls';
import { ExportModal } from './components/ExportModal';

const defaultPBRSettings: PBRSettings = {
  tilingX: 1.0,
  tilingY: 1.0,
  tilingLocked: true,
  rotation: 0,
  roughness: 0.5,
  metalness: 0.0,
  normalScale: 1.0,
  invertNormalY: false,
  displacementScale: 0.0,
  displacementBias: 0.0,
  transmission: 0.95,
  ior: 1.5,
  thickness: 1.2,
  activeMaps: {
    basecolor: true,
    normal: true,
    roughness: true,
    metallic: true,
    height: true,
    refraction: true,
    ambientOcclusion: true,
    emissive: true,
  },
  wireframe: false,
  flatShading: false,
  subdivisions: 64,
};

const defaultEnvSettings: EnvironmentSettings = {
  preset: 'studio',
  lightRotation: 45,
  exposure: 1.0,
  ambientIntensity: 0.6,
  directionalIntensity: 1.2,
  background: 'studioDark',
  autoRotate: false,
  autoRotateSpeed: 1.0,
  showShadows: true,
};

export const App: React.FC = () => {
  const materials = (catalogData.materials || []) as MaterialSet[];

  const [currentMaterial, setCurrentMaterial] = useState<MaterialSet | null>(
    materials[0] || null
  );

  const [activeTab, setActiveTab] = useState<'3d' | '2d' | 'split'>('3d');
  const [geometry, setGeometry] = useState<MeshGeometryType>('materialBall');
  const [pbrSettings, setPbrSettings] = useState<PBRSettings>(defaultPBRSettings);
  const [envSettings, setEnvSettings] = useState<EnvironmentSettings>(defaultEnvSettings);

  // Favorites with localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('pbr_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // UI state
  const [isGalleryCollapsed, setIsGalleryCollapsed] = useState<boolean>(false);
  const [isEnvControlsOpen, setIsEnvControlsOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  const viewportRef = useRef<Viewport3DHandle | null>(null);

  // Toggle favorite
  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      try {
        localStorage.setItem('pbr_favorites', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Reset material settings when choosing a new material
  const handleSelectMaterial = (mat: MaterialSet) => {
    setCurrentMaterial(mat);
    // Reset roughness/metalness to defaults or tuned values for glass
    if (mat.isTransparent) {
      setPbrSettings((prev) => ({
        ...prev,
        roughness: 0.1,
        metalness: 0.1,
        transmission: 0.95,
        ior: 1.52,
      }));
    } else {
      setPbrSettings((prev) => ({
        ...prev,
        roughness: 0.5,
        metalness: 0.0,
      }));
    }
  };

  const handleUpdatePBR = (changes: Partial<PBRSettings>) => {
    setPbrSettings((prev) => ({ ...prev, ...changes }));
  };

  const handleResetPBR = () => {
    setPbrSettings(defaultPBRSettings);
  };

  const handleUpdateEnv = (changes: Partial<EnvironmentSettings>) => {
    setEnvSettings((prev) => ({ ...prev, ...changes }));
  };

  // Screenshot capture & auto-download
  const handleTakeScreenshot = () => {
    if (!viewportRef.current) return;
    const dataUrl = viewportRef.current.captureScreenshot();
    if (!dataUrl) return;

    const link = document.createElement('a');
    link.download = `${currentMaterial?.name.replace(/\s+/g, '_') || 'material'}_render_${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-dark-950 text-slate-100 overflow-hidden select-none">
      {/* Top Application Header */}
      <Header
        currentMaterial={currentMaterial}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        geometry={geometry}
        setGeometry={setGeometry}
        onTakeScreenshot={handleTakeScreenshot}
        onOpenExport={() => setIsExportModalOpen(true)}
        onToggleEnvControls={() => setIsEnvControlsOpen(!isEnvControlsOpen)}
        isEnvControlsOpen={isEnvControlsOpen}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left: Material Catalog Gallery */}
        <MaterialGallery
          materials={materials}
          currentMaterial={currentMaterial}
          onSelectMaterial={handleSelectMaterial}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          isCollapsed={isGalleryCollapsed}
          onToggleCollapse={() => setIsGalleryCollapsed(!isGalleryCollapsed)}
        />

        {/* Center Viewport Area (3D, 2D, or Split) */}
        <main className="flex-1 flex overflow-hidden relative bg-dark-950">
          {activeTab === '3d' && (
            <Viewport3D
              ref={viewportRef}
              materialSet={currentMaterial}
              geometry={geometry}
              pbrSettings={pbrSettings}
              envSettings={envSettings}
            />
          )}

          {activeTab === '2d' && (
            <MapInspector2D materialSet={currentMaterial} />
          )}

          {activeTab === 'split' && (
            <div className="w-full h-full flex flex-row">
              <div className="w-1/2 h-full border-r border-slate-800 relative">
                <Viewport3D
                  ref={viewportRef}
                  materialSet={currentMaterial}
                  geometry={geometry}
                  pbrSettings={pbrSettings}
                  envSettings={envSettings}
                />
              </div>
              <div className="w-1/2 h-full">
                <MapInspector2D materialSet={currentMaterial} />
              </div>
            </div>
          )}
        </main>

        {/* Right: PBR Properties & UV Tuning Panel */}
        <MaterialPropertiesPanel
          materialSet={currentMaterial}
          settings={pbrSettings}
          onUpdateSettings={handleUpdatePBR}
          onResetSettings={handleResetPBR}
        />

        {/* Floating Environment & Lighting Controls */}
        <EnvironmentControls
          settings={envSettings}
          onUpdateSettings={handleUpdateEnv}
          isOpen={isEnvControlsOpen}
          onClose={() => setIsEnvControlsOpen(false)}
        />
      </div>

      {/* Export & Code Snippets Modal */}
      <ExportModal
        materialSet={currentMaterial}
        pbrSettings={pbrSettings}
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
};
