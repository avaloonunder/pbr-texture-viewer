export type Language = 'es' | 'en';

export const translations = {
  es: {
    appTitle: 'PBR Studio 3D',
    view3D: 'Visor 3D',
    view2D: 'Mapas 2D',
    viewSplit: 'Dividido',
    
    // Geometries
    geoMaterialBall: 'Material Ball',
    geoPlank: 'Tablón / Viga',
    geoSphere: 'Esfera',
    geoCube: 'Cubo',
    geoPlane: 'Plano / Muro',
    geoCylinder: 'Cilindro',
    geoTorus: 'Toro / Nudo',
    
    // Header actions
    lighting: 'Iluminación',
    capture: 'Capturar',
    export: 'Exportar',
    fullscreen: 'Pantalla completa',
    exitFullscreen: 'Salir de pantalla completa',
    
    // Gallery
    materialCatalog: 'Catálogo de Materiales',
    searchPlaceholder: 'Buscar materiales (ladrillo, madera...)',
    favoritesTooltip: 'Ver solo favoritos',
    noMaterialsFound: 'No se encontraron materiales',
    glassBadge: 'Cristal',
    
    // Categories
    catAll: 'Todos',
    catBricks: 'Ladrillos y Muros',
    catMetals: 'Metales',
    catGlass: 'Vidrios y Cristales',
    catStone: 'Piedra y Hormigón',
    catWood: 'Maderas',
    catRoofing: 'Tejados y Cubiertas',
    catPlaster: 'Yesos y Enlucidos',
    catOther: 'Otros',
    
    // Properties Panel
    pbrProperties: 'Propiedades PBR',
    reset: 'Reset',
    uvMapping: 'Mapeado UV (Tiling)',
    repeatU: 'Repetición U (X)',
    repeatV: 'Repetición V (Y)',
    uvRotation: 'Rotación UV',
    unlinkUV: 'Desvincular escala X/Y',
    linkUV: 'Vincular escala X/Y',
    surfaceParameters: 'Parámetros de Superficie',
    roughness: 'Rugosidad (Roughness)',
    metalness: 'Metalicidad (Metalness)',
    normalIntensity: 'Intensidad Normal Map',
    invertNormalY: 'Invertir Eje Y Normal (DirectX)',
    displacement: 'Desplazamiento Geométrico (Height)',
    glassProperties: 'Propiedades de Vidrio / Refracción',
    transmission: 'Transmisión Física',
    ior: 'Índice de Refracción (IOR)',
    meshView: 'Visualización de Malla',
    wireframeMode: 'Modo Wireframe (Malla de alambre)',
    tessellationRes: 'Resolución de Malla (Tessellation)',
    mapIsolator: 'Aislador de Mapas',
    toggleMap: 'Activar/Desactivar',
    
    // 2D Inspector
    selectMaterialPrompt: 'Selecciona un material para inspeccionar sus mapas 2D',
    compare: 'Comparar',
    vs: 'vs',
    resetView: 'Restablecer vista',
    zoomIn: 'Acercar',
    zoomOut: 'Alejar',
    colorSpaceSRGB: 'sRGB (Color)',
    colorSpaceLinear: 'Linear (Non-Color)',
    mapNotAvailable: 'Mapa no disponible para este material',
    openFullSize: 'Abrir mapa en tamaño completo',
    
    // Environment & Lighting
    envLightingTitle: 'Iluminación y Entorno',
    lightingPreset: 'Preset de Iluminación',
    lightRotation: 'Rotación de Luz',
    exposure: 'Exposición (Exposure)',
    viewportBg: 'Fondo de Viewport',
    autoRotate: 'Auto-Rotación 360°',
    dynamicShadows: 'Sombras Dinámicas',
    
    // Lighting Presets
    presetStudioName: 'Estudio Neutro',
    presetStudioDesc: 'Luz principal de estudio balanceada de 3 puntos',
    presetSunsetName: 'Atardecer Cálido',
    presetSunsetDesc: 'Luz dorada direccional con rebote azul profundo',
    presetCyberpunkName: 'Cyberpunk Neón',
    presetCyberpunkDesc: 'Contraste cyan eléctrico y magenta intenso',
    presetIndustrialName: 'Almacén Industrial',
    presetIndustrialDesc: 'Luz cenital de alto contraste',
    presetOvercastName: 'Nublado Suave',
    presetOvercastDesc: 'Iluminación difusa envolvente sin sombras duras',
    
    // Backgrounds
    bgStudioDark: 'Estudio Oscuro',
    bgStudioGray: 'Gris Neutro',
    bgBlack: 'Negro Puro',
    bgGrid: 'Rejilla 3D',
    bgTransparent: 'Transparente',
    
    // 3D Viewport Controls
    resetCamera: 'Restablecer Cámara',
    viewIso: 'ISO',
    viewFront: 'Frontal',
    viewTop: 'Superior',
    loading4K: 'Cargando Texturas 4K',
    loadingSubtitle: 'Preparando mapas PBR',
    hintRotate: 'Click + Arrastrar: Rotar | Click Derecho: Pan | Rueda: Zoom',
    wireframeActive: 'Wireframe Activo',
    
    // Exporter
    exportTitle: 'Exportar & Configurar',
    exportSubtitle: 'Snippets de código y guías de conexión para software 3D',
    tabBlender: '🟠 Blender (Python)',
    tabUnreal: '🔵 Unreal Engine 5',
    tabUnity: '⚪ Unity (URP)',
    tabThree: '🔺 Three.js',
    tabPaths: '📁 Rutas de Archivos',
    copied: '¡Copiado!',
    copyButton: 'Copiar',
    close: 'Cerrar',
    pbrMapsCount: 'mapas PBR',
  },
  en: {
    appTitle: 'PBR Studio 3D',
    view3D: '3D Viewport',
    view2D: '2D Maps',
    viewSplit: 'Split View',
    
    // Geometries
    geoMaterialBall: 'Material Ball',
    geoPlank: 'Plank / Beam',
    geoSphere: 'Sphere',
    geoCube: 'Cube',
    geoPlane: 'Plane / Wall',
    geoCylinder: 'Cylinder',
    geoTorus: 'Torus / Knot',
    
    // Header actions
    lighting: 'Lighting',
    capture: 'Screenshot',
    export: 'Export',
    fullscreen: 'Fullscreen',
    exitFullscreen: 'Exit Fullscreen',
    
    // Gallery
    materialCatalog: 'Material Catalog',
    searchPlaceholder: 'Search materials (brick, wood...)',
    favoritesTooltip: 'Favorites only',
    noMaterialsFound: 'No materials found',
    glassBadge: 'Glass',
    
    // Categories
    catAll: 'All',
    catBricks: 'Bricks & Masonry',
    catMetals: 'Metals',
    catGlass: 'Glass & Crystals',
    catStone: 'Stone & Concrete',
    catWood: 'Wood & Timber',
    catRoofing: 'Roofing & Tiles',
    catPlaster: 'Plaster & Walls',
    catOther: 'Other',
    
    // Properties Panel
    pbrProperties: 'PBR Properties',
    reset: 'Reset',
    uvMapping: 'UV Mapping (Tiling)',
    repeatU: 'Repeat U (X)',
    repeatV: 'Repeat V (Y)',
    uvRotation: 'UV Rotation',
    unlinkUV: 'Unlink X/Y Scale',
    linkUV: 'Link X/Y Scale',
    surfaceParameters: 'Surface Parameters',
    roughness: 'Roughness',
    metalness: 'Metalness',
    normalIntensity: 'Normal Map Strength',
    invertNormalY: 'Invert Normal Y (DirectX)',
    displacement: 'Displacement (Height)',
    glassProperties: 'Glass / Refraction Properties',
    transmission: 'Physical Transmission',
    ior: 'Index of Refraction (IOR)',
    meshView: 'Mesh Display Mode',
    wireframeMode: 'Wireframe Mode',
    tessellationRes: 'Mesh Resolution (Tessellation)',
    mapIsolator: 'Map Isolator',
    toggleMap: 'Toggle Map',
    
    // 2D Inspector
    selectMaterialPrompt: 'Select a material to inspect its 2D maps',
    compare: 'Compare',
    vs: 'vs',
    resetView: 'Reset View',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    colorSpaceSRGB: 'sRGB (Color)',
    colorSpaceLinear: 'Linear (Non-Color)',
    mapNotAvailable: 'Map not available for this material',
    openFullSize: 'Open full resolution map',
    
    // Environment & Lighting
    envLightingTitle: 'Lighting & Environment',
    lightingPreset: 'Lighting Preset',
    lightRotation: 'Light Rotation',
    exposure: 'Exposure',
    viewportBg: 'Viewport Background',
    autoRotate: 'Auto-Rotate 360°',
    dynamicShadows: 'Dynamic Shadows',
    
    // Lighting Presets
    presetStudioName: 'Studio Neutral',
    presetStudioDesc: 'Balanced 3-point studio lighting setup',
    presetSunsetName: 'Warm Sunset',
    presetSunsetDesc: 'Golden directional light with deep blue bounce',
    presetCyberpunkName: 'Cyberpunk Neon',
    presetCyberpunkDesc: 'Electric cyan key with vivid magenta rim',
    presetIndustrialName: 'Industrial Warehouse',
    presetIndustrialDesc: 'High contrast overhead lighting',
    presetOvercastName: 'Soft Overcast',
    presetOvercastDesc: 'Diffuse dome ambient light with soft shadows',
    
    // Backgrounds
    bgStudioDark: 'Dark Studio',
    bgStudioGray: 'Neutral Gray',
    bgBlack: 'Pure Black',
    bgGrid: '3D Grid',
    bgTransparent: 'Transparent',
    
    // 3D Viewport Controls
    resetCamera: 'Reset Camera',
    viewIso: 'ISO',
    viewFront: 'Front',
    viewTop: 'Top',
    loading4K: 'Loading 4K Textures',
    loadingSubtitle: 'Preparing PBR texture maps',
    hintRotate: 'Click + Drag: Rotate | Right Click: Pan | Wheel: Zoom',
    wireframeActive: 'Wireframe Active',
    
    // Exporter
    exportTitle: 'Export & Setup',
    exportSubtitle: 'Ready-to-use code snippets and node connection guides for 3D suites',
    tabBlender: '🟠 Blender (Python)',
    tabUnreal: '🔵 Unreal Engine 5',
    tabUnity: '⚪ Unity (URP)',
    tabThree: '🔺 Three.js',
    tabPaths: '📁 File Paths',
    copied: 'Copied!',
    copyButton: 'Copy',
    close: 'Close',
    pbrMapsCount: 'PBR maps',
  }
};
