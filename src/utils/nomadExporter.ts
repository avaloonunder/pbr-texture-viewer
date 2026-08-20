import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { MaterialSet, PBRSettings, MeshGeometryType } from '../types';
import { createMeshForGeometry } from './geometryHelper';
import { loadMaterialTextures } from './textureLoader';

/**
 * Downloads a Blob as a file in browser
 */
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Shares or downloads a file based on Web Share API support (iPad Safari)
 */
async function shareOrDownloadFile(file: File, filename: string, title: string, text: string): Promise<boolean> {
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title,
        text,
      });
      return true;
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return false; // User cancelled share dialog
      }
      console.warn('navigator.share failed, falling back to download:', err);
    }
  }

  // Fallback to direct download
  downloadBlob(file, filename);
  return true;
}

/**
 * Exports the height/displacement map formatted as a Nomad Sculpt brush Alpha Stamp
 */
export async function exportAlphaForNomad(materialSet: MaterialSet): Promise<boolean> {
  const alphaUrl = materialSet.maps.height || materialSet.maps.basecolor;
  if (!alphaUrl) {
    throw new Error('No height or color map available for alpha export');
  }

  const res = await fetch(alphaUrl);
  const blob = await res.blob();
  const filename = `${materialSet.id}_NomadAlpha.png`;
  const file = new File([blob], filename, { type: 'image/png' });

  return shareOrDownloadFile(
    file,
    filename,
    `${materialSet.name} Alpha (Nomad Sculpt)`,
    'Brush Alpha Stamp for Nomad Sculpt sculpting'
  );
}

/**
 * Exports a specific texture map (e.g. BaseColor, Normal) to Nomad
 */
export async function exportTextureMapForNomad(
  materialSet: MaterialSet,
  mapType: string
): Promise<boolean> {
  const mapUrl = materialSet.maps[mapType as keyof typeof materialSet.maps];
  if (!mapUrl) {
    throw new Error(`Texture map '${mapType}' not found`);
  }

  const res = await fetch(mapUrl);
  const blob = await res.blob();
  const ext = mapUrl.split('.').pop() || 'png';
  const filename = `${materialSet.id}_${mapType}.${ext}`;
  const file = new File([blob], filename, { type: 'image/png' });

  return shareOrDownloadFile(
    file,
    filename,
    `${materialSet.name} ${mapType} (Nomad)`,
    `PBR Texture Map for Nomad Sculpt`
  );
}

/**
 * Generates a .GLB binary 3D model with embedded PBR textures that opens directly in Nomad Sculpt
 */
export async function exportGlbForNomad(
  materialSet: MaterialSet,
  pbrSettings: PBRSettings,
  geometryType: MeshGeometryType = 'materialBall'
): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    try {
      const scene = new THREE.Scene();

      // Load textures
      const textures = await loadMaterialTextures(materialSet, pbrSettings);

      const material = new THREE.MeshStandardMaterial({
        map: textures.map || null,
        normalMap: textures.normalMap || null,
        roughnessMap: textures.roughnessMap || null,
        metalnessMap: textures.metalnessMap || null,
        aoMap: textures.aoMap || null,
        roughness: pbrSettings.roughness,
        metalness: pbrSettings.metalness,
      });

      if (textures.normalMap) {
        material.normalScale.set(
          pbrSettings.normalScale,
          pbrSettings.invertNormalY ? -pbrSettings.normalScale : pbrSettings.normalScale
        );
      }

      const mesh = createMeshForGeometry(geometryType, material, pbrSettings.subdivisions);
      scene.add(mesh);

      const exporter = new GLTFExporter();
      exporter.parse(
        scene,
        async (gltf) => {
          const glbBlob = new Blob([gltf as ArrayBuffer], { type: 'model/gltf-binary' });
          const filename = `${materialSet.id}_NomadModel.glb`;
          const file = new File([glbBlob], filename, { type: 'model/gltf-binary' });

          const shared = await shareOrDownloadFile(
            file,
            filename,
            `${materialSet.name} 3D Model (Nomad Sculpt)`,
            '3D Model with PBR Textures for Nomad Sculpt'
          );
          resolve(shared);
        },
        (error) => {
          console.error('GLTFExporter error:', error);
          reject(error);
        },
        { binary: true, embedImages: true }
      );
    } catch (err) {
      reject(err);
    }
  });
}
