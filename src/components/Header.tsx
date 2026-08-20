import React from 'react';
import { 
  Box, 
  Layers, 
  Columns, 
  Camera, 
  Share2, 
  Maximize, 
  Minimize, 
  Sparkles,
  Sun,
  Globe
} from 'lucide-react';
import { MaterialSet, MeshGeometryType } from '../types';
import { useTranslation } from '../i18n/LanguageContext';

interface HeaderProps {
  currentMaterial: MaterialSet | null;
  activeTab: '3d' | '2d' | 'split';
  setActiveTab: (tab: '3d' | '2d' | 'split') => void;
  geometry: MeshGeometryType;
  setGeometry: (geom: MeshGeometryType) => void;
  onTakeScreenshot: () => void;
  onOpenExport: () => void;
  onToggleEnvControls: () => void;
  isEnvControlsOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentMaterial,
  activeTab,
  setActiveTab,
  geometry,
  setGeometry,
  onTakeScreenshot,
  onOpenExport,
  onToggleEnvControls,
  isEnvControlsOpen
}) => {
  const { language, setLanguage, t } = useTranslation();
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const geometries: { id: MeshGeometryType; label: string; icon: string }[] = [
    { id: 'materialBall', label: t.geoMaterialBall, icon: '⚪' },
    { id: 'plank', label: t.geoPlank, icon: '🪵' },
    { id: 'sphere', label: t.geoSphere, icon: '🌐' },
    { id: 'cube', label: t.geoCube, icon: '🧊' },
    { id: 'plane', label: t.geoPlane, icon: '⬛' },
    { id: 'cylinder', label: t.geoCylinder, icon: '🥫' },
    { id: 'torus', label: t.geoTorus, icon: '🍩' },
  ];

  return (
    <header className="h-14 bg-dark-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 flex items-center justify-between z-30 shrink-0 select-none">
      {/* Left: App Brand & Current Material */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
          <span className="text-xs font-bold tracking-wider uppercase">{t.appTitle}</span>
        </div>

        {currentMaterial && (
          <div className="flex items-center gap-2 ml-2 border-l border-slate-800 pl-4">
            <h1 className="text-sm font-semibold text-white truncate max-w-xs md:max-w-sm">
              {currentMaterial.name}
            </h1>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60 font-medium">
              {currentMaterial.category}
            </span>
          </div>
        )}
      </div>

      {/* Center: View Switcher (3D, 2D, Split) & 3D Geometry selector */}
      <div className="flex items-center gap-2">
        {/* View Mode Buttons */}
        <div className="flex items-center bg-dark-950/80 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('3d')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
              activeTab === '3d'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>{t.view3D}</span>
          </button>
          
          <button
            onClick={() => setActiveTab('2d')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
              activeTab === '2d'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{t.view2D}</span>
          </button>

          <button
            onClick={() => setActiveTab('split')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
              activeTab === 'split'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>{t.viewSplit}</span>
          </button>
        </div>

        {/* 3D Geometry Selector (if in 3D or split mode) */}
        {(activeTab === '3d' || activeTab === 'split') && (
          <div className="hidden sm:flex items-center bg-dark-950/80 p-1 rounded-lg border border-slate-800">
            {geometries.map((g) => (
              <button
                key={g.id}
                onClick={() => setGeometry(g.id)}
                title={g.label}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${
                  geometry === g.id
                    ? 'bg-slate-700 text-white border border-slate-600'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <span>{g.icon}</span>
                <span className="hidden xl:inline">{g.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right: Actions (Language Switcher, Lighting, Screenshot, Export, Fullscreen) */}
      <div className="flex items-center gap-2">
        {/* Language Switcher Button (ES / EN) */}
        <div className="flex items-center bg-dark-950/80 p-0.5 rounded-lg border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setLanguage('es')}
            className={`px-2 py-1 rounded transition-all ${
              language === 'es'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ES
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-2 py-1 rounded transition-all ${
              language === 'en'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            EN
          </button>
        </div>

        <button
          onClick={onToggleEnvControls}
          title={t.lighting}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            isEnvControlsOpen
              ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/50'
              : 'bg-dark-850 text-slate-300 border-slate-700/60 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Sun className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden md:inline">{t.lighting}</span>
        </button>

        <button
          onClick={onTakeScreenshot}
          title={t.capture}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-dark-850 text-slate-300 border border-slate-700/60 hover:bg-slate-800 hover:text-white transition-all"
        >
          <Camera className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden md:inline">{t.capture}</span>
        </button>

        <button
          onClick={onOpenExport}
          title={t.export}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden md:inline">{t.export}</span>
        </button>

        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? t.exitFullscreen : t.fullscreen}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-all"
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
