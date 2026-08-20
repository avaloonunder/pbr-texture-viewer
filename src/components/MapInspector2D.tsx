import React, { useState, useRef, useEffect } from 'react';
import { 
  MaterialSet, 
  TextureMapType 
} from '../types';
import { formatBytes, getMapBadgeColor } from '../utils/format';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  RotateCcw, 
  Download, 
  Eye, 
  Sliders,
  Split,
  FileImage,
  Tablet,
  Stamp
} from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';
import { exportAlphaForNomad, exportTextureMapForNomad } from '../utils/nomadExporter';

interface MapInspector2DProps {
  materialSet: MaterialSet | null;
}

export const MapInspector2D: React.FC<MapInspector2DProps> = ({ materialSet }) => {
  const { t } = useTranslation();
  if (!materialSet) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-dark-950 text-slate-500">
        <FileImage className="w-12 h-12 mb-3 text-slate-600" />
        <p className="text-sm">{t.selectMaterialPrompt}</p>
      </div>
    );
  }

  const availableMaps = Object.entries(materialSet.maps) as [TextureMapType, string][];
  const [selectedMapType, setSelectedMapType] = useState<TextureMapType>(
    availableMaps[0]?.[0] || 'basecolor'
  );

  // Split-Screen Comparison
  const [isSplitMode, setIsSplitMode] = useState<boolean>(false);
  const [secondaryMapType, setSecondaryMapType] = useState<TextureMapType>('normal');
  const [splitPos, setSplitPos] = useState<number>(50); // percentage 0 - 100
  const splitContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingSplit = useRef<boolean>(false);

  // Pan & Zoom
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggingPan = useRef<boolean>(false);
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Channel filters (RGB, R, G, B, Invert)
  const [channelFilter, setChannelFilter] = useState<'all' | 'red' | 'green' | 'blue' | 'invert'>('all');

  // Sync selected map when material changes
  useEffect(() => {
    if (materialSet.maps[selectedMapType] === undefined) {
      const firstKey = Object.keys(materialSet.maps)[0] as TextureMapType;
      if (firstKey) setSelectedMapType(firstKey);
    }
  }, [materialSet]);

  const currentMapUrl = materialSet.maps[selectedMapType];
  const secondaryMapUrl = materialSet.maps[secondaryMapType] || currentMapUrl;

  const currentSize = materialSet.sizes[selectedMapType] || 0;

  // Zoom handlers
  const handleZoomIn = () => setZoom((z) => Math.min(z * 1.25, 6));
  const handleZoomOut = () => setZoom((z) => Math.max(z / 1.25, 0.2));
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setZoom((z) => Math.min(z * 1.1, 6));
    } else {
      setZoom((z) => Math.max(z / 1.1, 0.2));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && !isDraggingSplit.current) {
      isDraggingPan.current = true;
      dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingPan.current) {
      setPan({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      });
    }

    if (isDraggingSplit.current && splitContainerRef.current) {
      const rect = splitContainerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSplitPos(percentage);
    }
  };

  const handleMouseUp = () => {
    isDraggingPan.current = false;
    isDraggingSplit.current = false;
  };

  const getFilterStyle = (): React.CSSProperties => {
    switch (channelFilter) {
      case 'invert':
        return { filter: 'invert(1)' };
      case 'red':
        return { filter: 'url(#red-channel)' };
      case 'green':
        return { filter: 'url(#green-channel)' };
      case 'blue':
        return { filter: 'url(#blue-channel)' };
      default:
        return {};
    }
  };

  return (
    <div 
      className="relative w-full h-full flex flex-col bg-dark-950 overflow-hidden select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* SVG Filters for channel isolation */}
      <svg className="hidden">
        <filter id="red-channel">
          <feColorMatrix type="matrix" values="1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 1 0" />
        </filter>
        <filter id="green-channel">
          <feColorMatrix type="matrix" values="0 1 0 0 0  0 1 0 0 0  0 1 0 0 0  0 0 0 1 0" />
        </filter>
        <filter id="blue-channel">
          <feColorMatrix type="matrix" values="0 0 1 0 0  0 0 1 0 0  0 0 1 0 0  0 0 0 1 0" />
        </filter>
      </svg>

      {/* Top Map Tab Bar */}
      <div className="h-12 bg-dark-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 flex items-center justify-between shrink-0 z-10">
        {/* Available Maps Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {availableMaps.map(([type]) => {
            const badge = getMapBadgeColor(type);
            const isSelected = selectedMapType === type;
            return (
              <button
                key={type}
                onClick={() => setSelectedMapType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? `${badge.bg} ${badge.text} border ${badge.border} shadow-sm`
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span>{type}</span>
              </button>
            );
          })}
        </div>

        {/* Toolbar: Comparison, Channel Filters, Zoom Controls */}
        <div className="flex items-center gap-2">
          {/* Split Mode Toggle */}
          <button
            onClick={() => setIsSplitMode(!isSplitMode)}
            title={t.compare}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              isSplitMode
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'bg-dark-850 text-slate-300 border-slate-700/60 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Split className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">{t.compare}</span>
          </button>

          {/* Secondary map selector for split mode */}
          {isSplitMode && (
            <select
              value={secondaryMapType}
              onChange={(e) => setSecondaryMapType(e.target.value as TextureMapType)}
              className="bg-dark-850 text-xs text-slate-200 border border-slate-700/60 rounded-lg px-2 py-1.5 outline-none focus:border-indigo-500"
            >
              {availableMaps.map(([type]) => (
                <option key={type} value={type}>
                  {t.vs} {type}
                </option>
              ))}
            </select>
          )}

          {/* Channel Selector */}
          <div className="hidden sm:flex items-center bg-dark-950 p-0.5 rounded-lg border border-slate-800 text-[11px]">
            {(['all', 'red', 'green', 'blue', 'invert'] as const).map((ch) => (
              <button
                key={ch}
                onClick={() => setChannelFilter(ch)}
                className={`px-2 py-1 rounded capitalize font-medium transition-all ${
                  channelFilter === ch
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {ch === 'all' ? 'RGB' : ch}
              </button>
            ))}
          </div>

          {/* Zoom controls */}
          <div className="flex items-center bg-dark-950 p-1 rounded-lg border border-slate-800 text-slate-400">
            <button
              onClick={handleZoomOut}
              title={t.zoomOut}
              className="p-1 hover:text-white hover:bg-slate-800 rounded transition-all"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-1.5 min-w-10 text-center text-slate-300">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              title={t.zoomIn}
              className="p-1 hover:text-white hover:bg-slate-800 rounded transition-all"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetView}
              title={t.resetView}
              className="p-1 hover:text-white hover:bg-slate-800 rounded transition-all ml-0.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas / Image Area */}
      <div
        ref={splitContainerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        className="relative flex-1 w-full h-full overflow-hidden bg-grid-pattern bg-dark-950 flex items-center justify-center cursor-grab active:cursor-grabbing"
      >
        {currentMapUrl ? (
          <div
            className="relative transition-transform duration-75"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
            }}
          >
            {/* Split Comparison Mode */}
            {isSplitMode ? (
              <div className="relative shadow-2xl rounded-lg overflow-hidden border border-slate-800 max-w-4xl">
                {/* Secondary Background Image */}
                <img
                  src={secondaryMapUrl}
                  alt={secondaryMapType}
                  className="max-h-[70vh] object-contain pointer-events-none block"
                  style={getFilterStyle()}
                  draggable={false}
                />

                {/* Primary Foreground Image (Clipped) */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${splitPos}%` }}
                >
                  <img
                    src={currentMapUrl}
                    alt={selectedMapType}
                    className="max-h-[70vh] object-contain pointer-events-none block max-w-none"
                    style={getFilterStyle()}
                    draggable={false}
                  />
                </div>

                {/* Split Divider Line */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 flex items-center justify-center shadow-lg"
                  style={{ left: `${splitPos}%`, transform: 'translateX(-50%)' }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    isDraggingSplit.current = true;
                  }}
                >
                  <div className="w-6 h-6 rounded-full bg-white text-dark-950 shadow-md flex items-center justify-center text-[10px] font-bold">
                    ↔
                  </div>
                </div>

                {/* Badges on split */}
                <div className="absolute top-3 left-3 bg-dark-900/80 backdrop-blur-md px-2.5 py-1 rounded-md text-xs font-semibold uppercase text-emerald-400 border border-emerald-500/30">
                  {selectedMapType}
                </div>
                <div className="absolute top-3 right-3 bg-dark-900/80 backdrop-blur-md px-2.5 py-1 rounded-md text-xs font-semibold uppercase text-purple-400 border border-purple-500/30">
                  {secondaryMapType}
                </div>
              </div>
            ) : (
              /* Single Map View */
              <div className="relative shadow-2xl rounded-lg overflow-hidden border border-slate-800 max-w-4xl">
                <img
                  src={currentMapUrl}
                  alt={selectedMapType}
                  className="max-h-[70vh] object-contain pointer-events-none block"
                  style={getFilterStyle()}
                  draggable={false}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="text-slate-500 text-sm">{t.mapNotAvailable}</div>
        )}

        {/* Floating Metadata & Download Badge (Bottom-Left) */}
        {currentMapUrl && (
          <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-lg bg-dark-900/85 backdrop-blur-md border border-slate-800 text-xs text-slate-300 flex items-center gap-3">
              <span className="font-semibold uppercase text-indigo-400">{selectedMapType}</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">2048 × 2048 (2K / 4K)</span>
              <span className="text-slate-600">|</span>
              <span className="font-mono text-slate-400">{formatBytes(currentSize)}</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">
                {selectedMapType === 'basecolor' ? t.colorSpaceSRGB : t.colorSpaceLinear}
              </span>
            </div>

            <button
              onClick={() => {
                if (selectedMapType === 'height') {
                  exportAlphaForNomad(materialSet);
                } else {
                  exportTextureMapForNomad(materialSet, selectedMapType);
                }
              }}
              title={t.sendAlphaToNomad}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-medium backdrop-blur-md transition-all"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Nomad Sculpt</span>
            </button>

            <a
              href={currentMapUrl}
              target="_blank"
              rel="noreferrer"
              title={t.openFullSize}
              className="p-2 rounded-lg bg-dark-900/85 backdrop-blur-md border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
