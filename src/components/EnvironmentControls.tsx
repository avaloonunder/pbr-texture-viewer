import React from 'react';
import { 
  EnvironmentSettings, 
  LightingPresetType, 
  BackgroundType 
} from '../types';
import { 
  Sun, 
  Moon, 
  RotateCw, 
  Palette, 
  Lightbulb, 
  Compass, 
  X,
  Sparkles,
  Layers
} from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

interface EnvironmentControlsProps {
  settings: EnvironmentSettings;
  onUpdateSettings: (newSettings: Partial<EnvironmentSettings>) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const EnvironmentControls: React.FC<EnvironmentControlsProps> = ({
  settings,
  onUpdateSettings,
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  const presets: { id: LightingPresetType; name: string; desc: string; icon: string }[] = [
    { id: 'studio', name: t.presetStudioName, desc: t.presetStudioDesc, icon: '📸' },
    { id: 'sunset', name: t.presetSunsetName, desc: t.presetSunsetDesc, icon: '🌅' },
    { id: 'cyberpunk', name: t.presetCyberpunkName, desc: t.presetCyberpunkDesc, icon: '🌆' },
    { id: 'industrial', name: t.presetIndustrialName, desc: t.presetIndustrialDesc, icon: '🏭' },
    { id: 'overcast', name: t.presetOvercastName, desc: t.presetOvercastDesc, icon: '☁️' },
  ];

  const backgrounds: { id: BackgroundType; name: string; color: string }[] = [
    { id: 'studioDark', name: t.bgStudioDark, color: 'bg-[#0c0e14]' },
    { id: 'studioGray', name: t.bgStudioGray, color: 'bg-[#232733]' },
    { id: 'black', name: t.bgBlack, color: 'bg-black' },
    { id: 'grid', name: t.bgGrid, color: 'bg-slate-900 border border-slate-700' },
    { id: 'transparent', name: t.bgTransparent, color: 'bg-indigo-950/40 border border-dashed border-indigo-400' },
  ];

  return (
    <div className="absolute top-16 right-4 w-84 bg-dark-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl p-4 z-40 select-none animate-in fade-in zoom-in-95 duration-150">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sun className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            {t.envLightingTitle}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4 pt-3 max-h-[75vh] overflow-y-auto no-scrollbar">
        {/* Presets Grid */}
        <div className="space-y-2">
          <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            {t.lightingPreset}
          </label>
          <div className="grid grid-cols-1 gap-1.5">
            {presets.map((p) => {
              const isSelected = settings.preset === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => onUpdateSettings({ preset: p.id })}
                  className={`p-2 rounded-xl text-left border transition-all flex items-center gap-2.5 ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm'
                      : 'bg-dark-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <span className="text-base">{p.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold">{p.name}</div>
                    <div className="text-[10px] text-slate-500 truncate">{p.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Light Rotation Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-slate-300">
            <span className="flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              {t.lightRotation}
            </span>
            <span className="font-mono text-slate-400">{settings.lightRotation}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            step="5"
            value={settings.lightRotation}
            onChange={(e) => onUpdateSettings({ lightRotation: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>

        {/* Exposure Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-slate-300">
            <span className="flex items-center gap-1">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              {t.exposure}
            </span>
            <span className="font-mono text-slate-400">{settings.exposure.toFixed(2)}x</span>
          </div>
          <input
            type="range"
            min="0.3"
            max="2.5"
            step="0.05"
            value={settings.exposure}
            onChange={(e) => onUpdateSettings({ exposure: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>

        {/* Background Style */}
        <div className="space-y-2">
          <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-indigo-400" />
            {t.viewportBg}
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {backgrounds.map((bg) => {
              const isSelected = settings.background === bg.id;
              return (
                <button
                  key={bg.id}
                  onClick={() => onUpdateSettings({ background: bg.id })}
                  className={`p-2 rounded-xl text-left border text-xs font-medium transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'bg-dark-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full ${bg.color} shrink-0`} />
                  <span className="truncate">{bg.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Auto Rotate Toggle & Shadows */}
        <div className="pt-2 border-t border-slate-800 space-y-2.5">
          {/* Auto rotate */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-300 flex items-center gap-1.5">
              <RotateCw className="w-3.5 h-3.5 text-indigo-400" />
              {t.autoRotate}
            </span>
            <button
              onClick={() => onUpdateSettings({ autoRotate: !settings.autoRotate })}
              className={`w-9 h-5 rounded-full transition-colors relative ${
                settings.autoRotate ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.5 left-0.5 ${
                  settings.autoRotate ? 'translate-x-4' : ''
                }`}
              />
            </button>
          </div>

          {/* Shadows */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-300 flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              {t.dynamicShadows}
            </span>
            <button
              onClick={() => onUpdateSettings({ showShadows: !settings.showShadows })}
              className={`w-9 h-5 rounded-full transition-colors relative ${
                settings.showShadows ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.5 left-0.5 ${
                  settings.showShadows ? 'translate-x-4' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
