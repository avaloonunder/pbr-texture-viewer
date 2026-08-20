export type TextureMapType = 
  | 'basecolor'
  | 'normal'
  | 'roughness'
  | 'metallic'
  | 'height'
  | 'refraction'
  | 'ambientOcclusion'
  | 'emissive';

export interface MaterialSet {
  id: string;
  name: string;
  category: string;
  isTransparent?: boolean;
  maps: Partial<Record<TextureMapType, string>>;
  sizes: Partial<Record<TextureMapType, number>>;
  totalSizeBytes: number;
}

export interface MaterialCatalog {
  generatedAt: string;
  totalMaterials: number;
  totalFiles: number;
  categories: string[];
  materials: MaterialSet[];
}

export type MeshGeometryType = 
  | 'materialBall'
  | 'plank'
  | 'sphere'
  | 'cube'
  | 'plane'
  | 'cylinder'
  | 'torus';

export type LightingPresetType = 
  | 'studio'
  | 'sunset'
  | 'cyberpunk'
  | 'industrial'
  | 'overcast';

export type BackgroundType = 
  | 'studioDark'
  | 'studioGray'
  | 'grid'
  | 'black'
  | 'transparent';

export interface PBRSettings {
  // UV
  tilingX: number;
  tilingY: number;
  tilingLocked: boolean;
  rotation: number;
  
  // PBR Multipliers & overrides
  roughness: number;
  metalness: number;
  normalScale: number;
  invertNormalY: boolean;
  displacementScale: number;
  displacementBias: number;
  
  // Transmission for Glass
  transmission: number;
  ior: number;
  thickness: number;
  
  // Active map switches (to isolate maps)
  activeMaps: Record<TextureMapType, boolean>;
  
  // Rendering options
  wireframe: boolean;
  flatShading: boolean;
  subdivisions: number;
}

export interface EnvironmentSettings {
  preset: LightingPresetType;
  lightRotation: number;
  exposure: number;
  ambientIntensity: number;
  directionalIntensity: number;
  background: BackgroundType;
  autoRotate: boolean;
  autoRotateSpeed: number;
  showShadows: boolean;
}
