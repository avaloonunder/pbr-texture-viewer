import React, { useState, useMemo } from 'react';
import { 
  MaterialSet, 
  TextureMapType 
} from '../types';
import { formatBytes, getMapShortLabel, getMapBadgeColor } from '../utils/format';
import { 
  Search, 
  Star, 
  Sparkles, 
  Folder, 
  Filter, 
  X, 
  Check, 
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

interface MaterialGalleryProps {
  materials: MaterialSet[];
  currentMaterial: MaterialSet | null;
  onSelectMaterial: (mat: MaterialSet) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const MaterialGallery: React.FC<MaterialGalleryProps> = ({
  materials,
  currentMaterial,
  onSelectMaterial,
  favorites,
  onToggleFavorite,
  isCollapsed,
  onToggleCollapse
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(materials.map((m) => m.category))).sort();
    return ['All', ...cats];
  }, [materials]);

  // Translate category labels
  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'All': return t.catAll;
      case 'Bricks & Masonry': return t.catBricks;
      case 'Metals': return t.catMetals;
      case 'Glass & Crystals': return t.catGlass;
      case 'Stone & Concrete': return t.catStone;
      case 'Wood & Timber': return t.catWood;
      case 'Roofing': return t.catRoofing;
      case 'Plaster & Walls': return t.catPlaster;
      case 'Tiles & Ceramics': return t.catTiles;
      case 'Ground & Nature': return t.catGround;
      case 'Fabric & Leather': return t.catFabric;
      case 'Sci-Fi & Tech': return t.catSciFi;
      case 'Ornamental & Repujado': return t.catOrnamental;
      default: return cat;
    }
  };

  // Filter materials based on search, category and favorite
  const filteredMaterials = useMemo(() => {
    return materials.filter((mat) => {
      const matchesSearch = mat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mat.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mat.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCat = selectedCategory === 'All' || mat.category === selectedCategory;
      const matchesFav = !onlyFavorites || favorites.includes(mat.id);

      return matchesSearch && matchesCat && matchesFav;
    });
  }, [materials, searchQuery, selectedCategory, onlyFavorites, favorites]);

  if (isCollapsed) {
    return (
      <div className="w-12 bg-dark-900 border-r border-slate-800 flex flex-col items-center py-3 z-20 shrink-0 select-none">
        <button
          onClick={onToggleCollapse}
          title={t.materialCatalog}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all mb-4"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <div className="flex-1 flex flex-col items-center gap-3 overflow-y-auto no-scrollbar">
          {materials.map((mat) => {
            const isSelected = currentMaterial?.id === mat.id;
            return (
              <button
                key={mat.id}
                onClick={() => onSelectMaterial(mat)}
                title={`${mat.name} (${mat.category})`}
                className={`w-8 h-8 rounded-lg overflow-hidden border transition-all ${
                  isSelected
                    ? 'border-indigo-500 ring-2 ring-indigo-500/50 shadow-lg'
                    : 'border-slate-800 hover:border-slate-600 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={mat.maps.basecolor || Object.values(mat.maps)[0]}
                  alt={mat.name}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <aside className="w-80 bg-dark-900 border-r border-slate-800/80 flex flex-col h-full z-20 shrink-0 select-none">
      {/* Search & Collapse Header */}
      <div className="p-3 border-b border-slate-800/80 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              {t.materialCatalog}
            </h2>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-mono font-medium">
              {filteredMaterials.length}
            </span>
          </div>

          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-dark-950 text-xs text-slate-200 pl-8 pr-7 py-1.5 rounded-lg border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Pills & Favorite Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            title={t.favoritesTooltip}
            className={`p-1.5 rounded-md border text-xs transition-all shrink-0 ${
              onlyFavorites
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-dark-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-dark-950 text-slate-400 border border-slate-800/80 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {getCategoryLabel(cat)}
            </button>
          ))}
        </div>
      </div>

      {/* Materials List */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
        {filteredMaterials.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Filter className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">{t.noMaterialsFound}</p>
          </div>
        ) : (
          filteredMaterials.map((mat) => {
            const isSelected = currentMaterial?.id === mat.id;
            const isFav = favorites.includes(mat.id);
            const thumbUrl = mat.maps.basecolor || Object.values(mat.maps)[0];
            const mapKeys = Object.keys(mat.maps) as TextureMapType[];

            return (
              <div
                key={mat.id}
                onClick={() => onSelectMaterial(mat)}
                className={`group relative p-2.5 rounded-xl border transition-all cursor-pointer flex gap-3 items-center ${
                  isSelected
                    ? 'bg-indigo-950/40 border-indigo-500/60 shadow-lg ring-1 ring-indigo-500/30'
                    : 'bg-dark-850/50 border-slate-800/80 hover:bg-dark-850 hover:border-slate-700/80'
                }`}
              >
                {/* Thumbnail */}
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-dark-950 border border-slate-800/80 shrink-0">
                  <img
                    src={thumbUrl}
                    alt={mat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {mat.isTransparent && (
                    <span className="absolute bottom-0.5 right-0.5 bg-sky-500/80 text-[8px] font-bold text-white px-1 rounded uppercase backdrop-blur-xs">
                      {t.glassBadge}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h3 className={`text-xs font-semibold truncate ${isSelected ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
                      {mat.name}
                    </h3>

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(mat.id);
                      }}
                      className={`p-1 rounded transition-all ${
                        isFav ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400 opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400' : ''}`} />
                    </button>
                  </div>

                  <p className="text-[10px] text-slate-400 mb-1.5 truncate">
                    {getCategoryLabel(mat.category)}
                  </p>

                  {/* Map Type Badges & Size */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {mapKeys.slice(0, 4).map((type) => {
                        const b = getMapBadgeColor(type);
                        return (
                          <span
                            key={type}
                            title={type}
                            className={`text-[9px] font-mono font-bold px-1 py-0.2 rounded border ${b.bg} ${b.text} ${b.border}`}
                          >
                            {getMapShortLabel(type)}
                          </span>
                        );
                      })}
                      {mapKeys.length > 4 && (
                        <span className="text-[9px] font-mono text-slate-500">
                          +{mapKeys.length - 4}
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] font-mono text-slate-500">
                      {formatBytes(mat.totalSizeBytes)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};
