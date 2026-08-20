import React, { useState, useRef, useEffect } from 'react';
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
  Tablet,
  ChevronDown
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isGeomDropdownOpen, setIsGeomDropdownOpen] = useState(false);
  const geomDropdownRef = useRef<HTMLDivElement>(null);

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

  // Close geometry dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (geomDropdownRef.current && !geomDropdownRef.current.contains(event.target as Node)) {
        setIsGeomDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const geometries: { id: MeshGeometryType; label: string; icon: string }[] = [
    { id: 'materialBall', label: t.geoMaterialBall, icon: '⚪' },
    { id: 'plank', label: t.geoPlank, icon: '🪵' },
    { id: 'sphere', label: t.geoSphere, icon: '🌐' },
    { id: 'cube', label: t.geoCube, icon: '🧊' },
    { id: 'plane', label: t.geoPlane, icon: '⬛' },
    { id: 'cylinder', label: t.geoCylinder, icon: '🥫' },
    { id: 'torus', label: t.geoTorus, icon: '🍩' },
  ];

  const currentGeom = geometries.find((g) => g.id === geometry) || geometries[0];

  return (
    <header className="h-14 bg-dark-900/95 backdrop-blur-md border-b border-slate-800/80 px-2 sm:px-4 flex items-center justify-between z-30 shrink-0 select-none gap-1 sm:gap-2">
      {/* Left: App Brand & Current Material */}
      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 shrink">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span className="text-xs font-bold tracking-wider uppercase hidden sm:inline">{t.appTitle}</span>
          <span className="text-xs font-bold tracking-wider uppercase sm:hidden">PBR 3D</span>
        </div>

        {currentMaterial && (
          <div className="flex items-center gap-1.5 border-l border-slate-800 pl-2 sm:pl-3 min-w-0">
            <h1 className="text-xs sm:text-sm font-semibold text-white truncate max-w-[100px] sm:max-w-[160px] md:max-w-[220px]">
              {currentMaterial.name}
            </h1>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60 font-medium hidden lg:inline shrink-0">
              {currentMaterial.category}
            </span>
          </div>
        )}
      </div>

      {/* Center: View Switcher (3D, 2D, Split) & Geometry Selector */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        {/* View Mode Buttons */}
        <div className="flex items-center bg-dark-950/90 p-0.5 sm:p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('3d')}
            title={t.view3D}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              activeTab === '3d'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{t.view3D}</span>
          </button>
          
          <button
            onClick={() => setActiveTab('2d')}
            title={t.view2D}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              activeTab === '2d'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{t.view2D}</span>
          </button>

          <button
            onClick={() => setActiveTab('split')}
            title={t.viewSplit}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              activeTab === 'split'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{t.viewSplit}</span>
          </button>
        </div>

        {/* 3D Geometry Selector: Compact Dropdown for iPad & Tablet, full bar for 2XL */}
        {(activeTab === '3d' || activeTab === 'split') && (
          <>
            {/* Compact Dropdown (iPad / Tablet / Laptop) */}
            <div className="relative flex 2xl:hidden" ref={geomDropdownRef}>
              <button
                onClick={() => setIsGeomDropdownOpen(!isGeomDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-dark-950/90 hover:bg-slate-800 text-xs font-medium text-slate-200 rounded-lg border border-slate-800 transition-all"
              >
                <span>{currentGeom.icon}</span>
                <span className="max-w-[80px] sm:max-w-[100px] truncate">{currentGeom.label}</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isGeomDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isGeomDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-44 bg-dark-900/95 backdrop-blur-xl border border-slate-700/80 rounded-xl shadow-2xl p-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {geometries.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => {
                        setGeometry(g.id);
                        setIsGeomDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-left ${
                        geometry === g.id
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <span>{g.icon}</span>
                      <span>{g.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Expanded List on Ultra-wide 2XL screens */}
            <div className="hidden 2xl:flex items-center bg-dark-950/90 p-1 rounded-lg border border-slate-800">
              {geometries.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGeometry(g.id)}
                  title={g.label}
                  className={`px-2 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${
                    geometry === g.id
                      ? 'bg-slate-700 text-white border border-slate-600'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <span>{g.icon}</span>
                  <span>{g.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Right: Actions (Language, Lighting, Screenshot, Nomad Sculpt, Export, Fullscreen) */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        {/* Language Switcher Button (ES / EN) */}
        <div className="flex items-center bg-dark-950/90 p-0.5 rounded-lg border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setLanguage('es')}
            className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[11px] sm:text-xs transition-all ${
              language === 'es'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ES
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[11px] sm:text-xs transition-all ${
              language === 'en'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            EN
          </button>
        </div>

        {/* Lighting Button */}
        <button
          onClick={onToggleEnvControls}
          title={t.lighting}
          className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            isEnvControlsOpen
              ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/50'
              : 'bg-dark-850 text-slate-300 border-slate-700/60 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Sun className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden xl:inline">{t.lighting}</span>
        </button>

        {/* Screenshot Button */}
        <button
          onClick={onTakeScreenshot}
          title={t.capture}
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium bg-dark-850 text-slate-300 border border-slate-700/60 hover:bg-slate-800 hover:text-white transition-all"
        >
          <Camera className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden xl:inline">{t.capture}</span>
        </button>

        {/* Nomad Sculpt iPad Direct Button */}
        <button
          onClick={onOpenExport}
          title={t.nomadButton}
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 shadow-sm transition-all"
        >
          <Tablet className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Nomad</span>
        </button>

        {/* Export Button */}
        <button
          onClick={onOpenExport}
          title={t.export}
          className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">{t.export}</span>
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? t.exitFullscreen : t.fullscreen}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-all hidden sm:flex"
        >
          {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
        </button>
      </div>
    </header>
  );
};
