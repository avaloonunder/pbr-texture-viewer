import * as THREE from 'three';
import { MaterialSet, PBRSettings, TextureMapType } from '../types';

const textureCache = new Map<string, THREE.Texture>();
const loader = new THREE.TextureLoader();

export interface LoadedTextures {
  map?: THREE.Texture;
  normalMap?: THREE.Texture;
  roughnessMap?: THREE.Texture;
  metalnessMap?: THREE.Texture;
  displacementMap?: THREE.Texture;
  transmissionMap?: THREE.Texture;
  aoMap?: THREE.Texture;
}

export async function loadMaterialTextures(
  materialSet: MaterialSet,
  settings: PBRSettings,
  onProgress?: (loaded: number, total: number) => void
): Promise<LoadedTextures> {
  const result: LoadedTextures = {};
  const activeEntries = Object.entries(materialSet.maps).filter(
    ([type]) => settings.activeMaps[type as TextureMapType] !== false
  );

  let loadedCount = 0;
  const totalCount = activeEntries.length;

  if (totalCount === 0) {
    if (onProgress) onProgress(1, 1);
    return result;
  }

  const loadPromises = activeEntries.map(async ([type, url]) => {
    if (!url) return;

    let texture: THREE.Texture;

    if (textureCache.has(url)) {
      texture = textureCache.get(url)!;
    } else {
      texture = await new Promise<THREE.Texture>((resolve, reject) => {
        loader.load(
          url,
          (tex) => {
            textureCache.set(url, tex);
            resolve(tex);
          },
          undefined,
          (err) => {
            console.error(`Failed to load texture at ${url}:`, err);
            reject(err);
          }
        );
      });
    }

    // Configure Color Spaces properly for PBR
    if (type === 'basecolor' || type === 'emissive') {
      texture.colorSpace = THREE.SRGBColorSpace;
    } else {
      texture.colorSpace = THREE.NoColorSpace;
    }

    // Setup UV Wrapping & Filtering
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(settings.tilingX, settings.tilingY);
    texture.rotation = (settings.rotation * Math.PI) / 180;
    texture.center.set(0.5, 0.5);
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;

    // Assign to corresponding PBR map slot
    switch (type) {
      case 'basecolor':
        result.map = texture;
        break;
      case 'normal':
        result.normalMap = texture;
        break;
      case 'roughness':
        result.roughnessMap = texture;
        break;
      case 'metallic':
        result.metalnessMap = texture;
        break;
      case 'height':
        result.displacementMap = texture;
        break;
      case 'refraction':
        result.transmissionMap = texture;
        break;
      case 'ambientOcclusion':
        result.aoMap = texture;
        break;
    }

    loadedCount++;
    if (onProgress) {
      onProgress(loadedCount, totalCount);
    }
  });

  await Promise.all(loadPromises);
  return result;
}

export function updateTextureTransforms(textures: LoadedTextures, settings: PBRSettings) {
  Object.values(textures).forEach((tex) => {
    if (tex instanceof THREE.Texture) {
      tex.repeat.set(settings.tilingX, settings.tilingY);
      tex.rotation = (settings.rotation * Math.PI) / 180;
      tex.needsUpdate = true;
    }
  });
}
