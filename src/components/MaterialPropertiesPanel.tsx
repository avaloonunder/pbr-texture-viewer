import React from 'react';
import { 
  PBRSettings, 
  MaterialSet, 
  TextureMapType 
} from '../types';
import { 
  Sliders, 
  Maximize2, 
  RotateCw, 
  Link, 
  Unlink, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Layers, 
  Grid, 
  Droplets,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { getMapBadgeColor } from '../utils/format';
import { useTranslation } from '../i18n/LanguageContext';

interface MaterialPropertiesPanelProps {
  materialSet: MaterialSet | null;
  settings: PBRSettings;
  onUpdateSettings: (newSettings: Partial<PBRSettings>) => void;
  onResetSettings: () => void;
}

export const MaterialPropertiesPanel: React.FC<MaterialPropertiesPanelProps> = ({
  materialSet,
  settings,
  onUpdateSettings,
  onResetSettings,
}) => {
  const { t } = useTranslation();
  if (!materialSet) return null;

  const handleTilingXChange = (val: number) => {
    if (settings.tilingLocked) {
      onUpdateSettings({ tilingX: val, tilingY: val });
    } else {
      onUpdateSettings({ tilingX: val });
    }
  };

  const handleTilingYChange = (val: number) => {
    if (settings.tilingLocked) {
      onUpdateSettings({ tilingX: val, tilingY: val });
    } else {
      onUpdateSettings({ tilingY: val });
    }
  };

  const toggleMap = (type: TextureMapType) => {
    onUpdateSettings({
      activeMaps: {
        ...settings.activeMaps,
        [type]: !settings.activeMaps[type],
      },
    });
  };

  const isGlass = materialSet.isTransparent || !!materialSet.maps.refraction;

  return (
    <aside className="w-80 bg-dark-900 border-l border-slate-800/80 flex flex-col h-full z-20 shrink-0 select-none overflow-y-auto">
      {/* Panel Header */}
      <div className="p-3 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-400" />
          <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            {t.pbrProperties}
          </h2>
        </div>

        <button
          onClick={onResetSettings}
          title={t.reset}
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-slate-800 transition-all"
        >
          <RotateCcw className="w-3 h-3" />
          <span>{t.reset}</span>
        </button>
      </div>

      <div className="p-3 space-y-5 flex-1">
        {/* Section 1: UV Mapping & Tiling */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5">
              <Grid className="w-3.5 h-3.5 text-indigo-400" />
              {t.uvMapping}
            </span>
            <button
              onClick={() => onUpdateSettings({ tilingLocked: !settings.tilingLocked })}
              title={settings.tilingLocked ? t.unlinkUV : t.linkUV}
              className={`p-1 rounded transition-all ${
                settings.tilingLocked ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {settings.tilingLocked ? <Link className="w-3.5 h-3.5" /> : <Unlink className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Repeat X */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>{t.repeatU}</span>
              <span className="font-mono text-slate-200">{settings.tilingX.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="10"
              step="0.1"
              value={settings.tilingX}
              onChange={(e) => handleTilingXChange(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Repeat Y */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>{t.repeatV}</span>
              <span className="font-mono text-slate-200">{settings.tilingY.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="10"
              step="0.1"
              value={settings.tilingY}
              onChange={(e) => handleTilingYChange(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Rotation */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>{t.uvRotation}</span>
              <span className="font-mono text-slate-200">{settings.rotation}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              step="5"
              value={settings.rotation}
              onChange={(e) => onUpdateSettings({ rotation: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>

        <div className="h-px bg-slate-800" />

        {/* Section 2: PBR Material Adjustments */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            {t.surfaceParameters}
          </div>

          {/* Roughness Multiplier */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>{t.roughness}</span>
              <span className="font-mono text-slate-200">{settings.roughness.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={settings.roughness}
              onChange={(e) => onUpdateSettings({ roughness: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Metalness Multiplier */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>{t.metalness}</span>
              <span className="font-mono text-slate-200">{settings.metalness.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={settings.metalness}
              onChange={(e) => onUpdateSettings({ metalness: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Normal Map Scale */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>{t.normalIntensity}</span>
              <span className="font-mono text-slate-200">{settings.normalScale.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="3"
              step="0.05"
              value={settings.normalScale}
              onChange={(e) => onUpdateSettings({ normalScale: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Invert Normal Y Toggle */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400">{t.invertNormalY}</span>
            <button
              onClick={() => onUpdateSettings({ invertNormalY: !settings.invertNormalY })}
              className={`w-9 h-5 rounded-full transition-colors relative ${
                settings.invertNormalY ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.5 left-0.5 ${
                  settings.invertNormalY ? 'translate-x-4' : ''
                }`}
              />
            </button>
          </div>

          {/* Displacement / Height */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>{t.displacement}</span>
              <span className="font-mono text-slate-200">{settings.displacementScale.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="0.4"
              step="0.01"
              value={settings.displacementScale}
              onChange={(e) => onUpdateSettings({ displacementScale: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>

        {/* Section 3: Glass & Transmission (If applicable) */}
        {isGlass && (
          <>
            <div className="h-px bg-slate-800" />
            <div className="space-y-3">
              <div className="text-xs font-semibold text-sky-400 flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-sky-400" />
                {t.glassProperties}
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>{t.transmission}</span>
                  <span className="font-mono text-slate-200">{settings.transmission.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.transmission}
                  onChange={(e) => onUpdateSettings({ transmission: parseFloat(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>{t.ior}</span>
                  <span className="font-mono text-slate-200">{settings.ior.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="2.5"
                  step="0.02"
                  value={settings.ior}
                  onChange={(e) => onUpdateSettings({ ior: parseFloat(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>
          </>
        )}

        <div className="h-px bg-slate-800" />

        {/* Section 4: Render & Wireframe */}
        <div className="space-y-2.5">
          <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            {t.meshView}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400">{t.wireframeMode}</span>
            <button
              onClick={() => onUpdateSettings({ wireframe: !settings.wireframe })}
              className={`w-9 h-5 rounded-full transition-colors relative ${
                settings.wireframe ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.5 left-0.5 ${
                  settings.wireframe ? 'translate-x-4' : ''
                }`}
              />
            </button>
          </div>

          {/* Subdivision Level */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>{t.tessellationRes}</span>
              <span className="font-mono text-slate-200">{settings.subdivisions} segs</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {[32, 64, 128, 256].map((res) => (
                <button
                  key={res}
                  onClick={() => onUpdateSettings({ subdivisions: res })}
                  className={`py-1 text-[11px] font-mono rounded border transition-all ${
                    settings.subdivisions === res
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-dark-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {res}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="h-px bg-slate-800" />

        {/* Section 5: Map Isolator Checklist */}
        <div className="space-y-2.5">
          <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              {t.mapIsolator}
            </span>
            <span className="text-[10px] text-slate-500 font-normal">{t.toggleMap}</span>
          </div>

          <div className="space-y-1.5">
            {(Object.keys(materialSet.maps) as TextureMapType[]).map((type) => {
              const isActive = settings.activeMaps[type] !== false;
              const badge = getMapBadgeColor(type);

              return (
                <div
                  key={type}
                  onClick={() => toggleMap(type)}
                  className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-dark-850 border-slate-700/80 text-white'
                      : 'bg-dark-950/60 border-slate-800/50 text-slate-500 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${badge.bg} ${badge.text} ${badge.border}`}>
                      {type}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isActive ? (
                      <Eye className="w-3.5 h-3.5 text-indigo-400" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-slate-600" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
};
