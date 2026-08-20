import * as THREE from 'three';
import { MeshGeometryType } from '../types';

export function createMeshForGeometry(
  type: MeshGeometryType,
  material: THREE.Material,
  subdivisions: number = 64
): THREE.Object3D {
  switch (type) {
    case 'plank': {
      // 3D Architectural Timber Board / Plank (Width 1.2, Height 3.8, Depth 0.22)
      const segs = Math.max(16, subdivisions);
      const geom = new THREE.BoxGeometry(1.2, 3.8, 0.22, Math.floor(segs / 2), segs * 2, Math.floor(segs / 4));
      const mesh = new THREE.Mesh(geom, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    }

    case 'sphere': {
      const segs = Math.max(32, subdivisions * 2);
      const geom = new THREE.SphereGeometry(1.6, segs, segs);
      const mesh = new THREE.Mesh(geom, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    }

    case 'cube': {
      const segs = Math.max(16, subdivisions);
      const geom = new THREE.BoxGeometry(2.4, 2.4, 2.4, segs, segs, segs);
      const mesh = new THREE.Mesh(geom, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    }

    case 'plane': {
      const segs = Math.max(32, subdivisions * 2);
      const geom = new THREE.PlaneGeometry(3.6, 3.6, segs, segs);
      const mesh = new THREE.Mesh(geom, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    }

    case 'cylinder': {
      const segs = Math.max(24, subdivisions);
      const geom = new THREE.CylinderGeometry(1.3, 1.3, 2.8, segs, segs, false);
      const mesh = new THREE.Mesh(geom, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    }

    case 'torus': {
      const segs = Math.max(32, subdivisions);
      const geom = new THREE.TorusKnotGeometry(1.2, 0.45, segs * 2, segs);
      const mesh = new THREE.Mesh(geom, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    }

    case 'materialBall':
    default: {
      // Professional multi-part Shader/Material Ball
      const group = new THREE.Group();
      const segs = Math.max(32, subdivisions * 2);

      // Main center sphere
      const mainGeom = new THREE.SphereGeometry(1.3, segs, segs);
      const mainMesh = new THREE.Mesh(mainGeom, material);
      mainMesh.castShadow = true;
      mainMesh.receiveShadow = true;
      group.add(mainMesh);

      // Outer curved protective crest/ring
      const torusGeom = new THREE.TorusGeometry(1.7, 0.22, 32, segs);
      const ringMesh = new THREE.Mesh(torusGeom, material);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.y = 0;
      ringMesh.castShadow = true;
      ringMesh.receiveShadow = true;
      group.add(ringMesh);

      // Pedestal stand base
      const baseMaterial = new THREE.MeshStandardMaterial({
        color: 0x181a20,
        roughness: 0.35,
        metalness: 0.8,
      });
      const baseGeom = new THREE.CylinderGeometry(1.5, 1.8, 0.3, 48);
      const baseMesh = new THREE.Mesh(baseGeom, baseMaterial);
      baseMesh.position.y = -1.65;
      baseMesh.receiveShadow = true;
      baseMesh.castShadow = true;
      group.add(baseMesh);

      // Inner stand connector
      const stemGeom = new THREE.CylinderGeometry(0.5, 0.7, 0.4, 32);
      const stemMesh = new THREE.Mesh(stemGeom, baseMaterial);
      stemMesh.position.y = -1.35;
      group.add(stemMesh);

      return group;
    }
  }
}
