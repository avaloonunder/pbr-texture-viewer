import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  MaterialSet, 
  MeshGeometryType, 
  PBRSettings, 
  EnvironmentSettings, 
  TextureMapType 
} from '../types';
import { loadMaterialTextures, LoadedTextures } from '../utils/textureLoader';
import { createMeshForGeometry } from '../utils/geometryHelper';
import { 
  RotateCcw, 
  Eye, 
  Grid, 
  Loader2, 
  Compass, 
  Sparkles,
  Maximize2
} from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

export interface Viewport3DHandle {
  captureScreenshot: (transparent?: boolean) => string;
}

interface Viewport3DProps {
  materialSet: MaterialSet | null;
  geometry: MeshGeometryType;
  pbrSettings: PBRSettings;
  envSettings: EnvironmentSettings;
}

export const Viewport3D = forwardRef<Viewport3DHandle, Viewport3DProps>(({
  materialSet,
  geometry,
  pbrSettings,
  envSettings
}, ref) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Three.js instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const meshGroupRef = useRef<THREE.Group | null>(null);
  const lightsGroupRef = useRef<THREE.Group | null>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const loadedTexturesRef = useRef<LoadedTextures>({});

  // Loading state
  const [loadingProgress, setLoadingProgress] = useState<{ loaded: number; total: number } | null>(null);
  const [fps, setFps] = useState<number>(60);

  // Expose screenshot capture
  useImperativeHandle(ref, () => ({
    captureScreenshot: (transparent: boolean = false) => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return '';
      
      const prevBg = sceneRef.current.background;
      if (transparent) {
        sceneRef.current.background = null;
      }
      
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      const dataUrl = rendererRef.current.domElement.toDataURL('image/png');
      
      sceneRef.current.background = prevBg;
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      return dataUrl;
    }
  }));

  // Initialize Scene, Camera, Renderer, Controls
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 4.8);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 15;
    controls.minDistance = 1.2;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // 5. Mesh Group & Lights Group
    const meshGroup = new THREE.Group();
    scene.add(meshGroup);
    meshGroupRef.current = meshGroup;

    const lightsGroup = new THREE.Group();
    scene.add(lightsGroup);
    lightsGroupRef.current = lightsGroup;

    // 6. Base Material
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.5,
      metalness: 0.0,
      envMapIntensity: 1.0,
    });
    materialRef.current = material;

    // 7. Ground Shadow Plane
    const groundGeom = new THREE.PlaneGeometry(30, 30);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const ground = new THREE.Mesh(groundGeom, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.66;
    ground.receiveShadow = true;
    scene.add(ground);

    // 8. Animation & Render Loop
    let animationFrameId: number;
    let lastTime = performance.now();
    let frameCount = 0;
    let lastFpsUpdate = performance.now();

    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);

      // FPS Calculation
      frameCount++;
      if (time - lastFpsUpdate >= 1000) {
        setFps(Math.round((frameCount * 1000) / (time - lastFpsUpdate)));
        frameCount = 0;
        lastFpsUpdate = time;
      }

      // Auto Rotation
      if (envSettings.autoRotate && meshGroupRef.current) {
        meshGroupRef.current.rotation.y += 0.005 * envSettings.autoRotateSpeed;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate(performance.now());

    // 9. Resize Observer
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(containerRef.current);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      renderer.dispose();
      material.dispose();
    };
  }, []);

  // Update Background & Lighting
  useEffect(() => {
    if (!sceneRef.current || !lightsGroupRef.current || !rendererRef.current) return;
    const scene = sceneRef.current;
    const lightsGroup = lightsGroupRef.current;

    // Clear previous lights
    while (lightsGroup.children.length > 0) {
      lightsGroup.remove(lightsGroup.children[0]);
    }

    // Set Exposure
    rendererRef.current.toneMappingExposure = envSettings.exposure;

    // Apply Background
    switch (envSettings.background) {
      case 'studioDark':
        scene.background = new THREE.Color(0x0c0e14);
        break;
      case 'studioGray':
        scene.background = new THREE.Color(0x232733);
        break;
      case 'black':
        scene.background = new THREE.Color(0x000000);
        break;
      case 'grid':
        scene.background = new THREE.Color(0x10131d);
        break;
      case 'transparent':
        scene.background = null;
        break;
    }

    // Configure Lights based on Preset
    const rot = (envSettings.lightRotation * Math.PI) / 180;

    switch (envSettings.preset) {
      case 'sunset': {
        const ambient = new THREE.AmbientLight(0x2a3b5c, envSettings.ambientIntensity * 0.8);
        lightsGroup.add(ambient);

        const sunLight = new THREE.DirectionalLight(0xffaa44, envSettings.directionalIntensity * 2.2);
        sunLight.position.set(Math.cos(rot) * 6, 3, Math.sin(rot) * 6);
        sunLight.castShadow = envSettings.showShadows;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        lightsGroup.add(sunLight);

        const fill = new THREE.DirectionalLight(0x4466aa, envSettings.directionalIntensity * 0.6);
        fill.position.set(-Math.cos(rot) * 5, 2, -Math.sin(rot) * 5);
        lightsGroup.add(fill);
        break;
      }

      case 'cyberpunk': {
        const ambient = new THREE.AmbientLight(0x0a0a1a, envSettings.ambientIntensity * 0.5);
        lightsGroup.add(ambient);

        const cyanLight = new THREE.DirectionalLight(0x00e5ff, envSettings.directionalIntensity * 2.0);
        cyanLight.position.set(Math.cos(rot) * 6, 4, Math.sin(rot) * 6);
        cyanLight.castShadow = envSettings.showShadows;
        lightsGroup.add(cyanLight);

        const magentaRim = new THREE.DirectionalLight(0xff007f, envSettings.directionalIntensity * 2.5);
        magentaRim.position.set(-Math.cos(rot) * 6, 2, -Math.sin(rot) * 6);
        lightsGroup.add(magentaRim);
        break;
      }

      case 'industrial': {
        const ambient = new THREE.AmbientLight(0x8899aa, envSettings.ambientIntensity * 1.0);
        lightsGroup.add(ambient);

        const mainLight = new THREE.DirectionalLight(0xffffff, envSettings.directionalIntensity * 2.5);
        mainLight.position.set(Math.cos(rot) * 7, 6, Math.sin(rot) * 7);
        mainLight.castShadow = envSettings.showShadows;
        lightsGroup.add(mainLight);

        const groundBounce = new THREE.DirectionalLight(0x3a4b5c, envSettings.directionalIntensity * 0.8);
        groundBounce.position.set(0, -5, 0);
        lightsGroup.add(groundBounce);
        break;
      }

      case 'overcast': {
        const hemiLight = new THREE.HemisphereLight(0xeef2f7, 0x334155, envSettings.ambientIntensity * 1.5);
        lightsGroup.add(hemiLight);

        const softDir = new THREE.DirectionalLight(0xffffff, envSettings.directionalIntensity * 1.0);
        softDir.position.set(Math.cos(rot) * 4, 8, Math.sin(rot) * 4);
        softDir.castShadow = envSettings.showShadows;
        lightsGroup.add(softDir);
        break;
      }

      case 'studio':
      default: {
        const ambient = new THREE.AmbientLight(0xffffff, envSettings.ambientIntensity * 0.9);
        lightsGroup.add(ambient);

        // Key light
        const keyLight = new THREE.DirectionalLight(0xffffff, envSettings.directionalIntensity * 1.8);
        keyLight.position.set(Math.cos(rot + 0.5) * 6, 5, Math.sin(rot + 0.5) * 6);
        keyLight.castShadow = envSettings.showShadows;
        keyLight.shadow.mapSize.width = 2048;
        keyLight.shadow.mapSize.height = 2048;
        keyLight.shadow.bias = -0.0001;
        lightsGroup.add(keyLight);

        // Fill light
        const fillLight = new THREE.DirectionalLight(0xaaccff, envSettings.directionalIntensity * 0.8);
        fillLight.position.set(-Math.cos(rot) * 6, 2, -Math.sin(rot) * 6);
        lightsGroup.add(fillLight);

        // Rim / Back light
        const rimLight = new THREE.DirectionalLight(0xfff0dd, envSettings.directionalIntensity * 1.2);
        rimLight.position.set(0, 6, -5);
        lightsGroup.add(rimLight);
        break;
      }
    }
  }, [envSettings]);

  // Load and apply Textures when MaterialSet or Active Maps change
  useEffect(() => {
    if (!materialSet || !materialRef.current) return;

    let isCancelled = false;
    setLoadingProgress({ loaded: 0, total: 1 });

    loadMaterialTextures(
      materialSet,
      pbrSettings,
      (loaded, total) => {
        if (!isCancelled) {
          setLoadingProgress({ loaded, total });
        }
      }
    ).then((textures) => {
      if (isCancelled || !materialRef.current) return;

      loadedTexturesRef.current = textures;
      const mat = materialRef.current;

      // Assign texture slots
      mat.map = textures.map || null;
      mat.normalMap = textures.normalMap || null;
      mat.roughnessMap = textures.roughnessMap || null;
      mat.metalnessMap = textures.metalnessMap || null;
      mat.displacementMap = textures.displacementMap || null;
      mat.transmissionMap = textures.transmissionMap || null;
      mat.aoMap = textures.aoMap || null;

      // Glass and transmission setup
      if (materialSet.isTransparent || textures.transmissionMap) {
        mat.transmission = pbrSettings.transmission;
        mat.ior = pbrSettings.ior;
        mat.thickness = pbrSettings.thickness;
        mat.transparent = true;
        mat.opacity = 1.0;
      } else {
        mat.transmission = 0;
        mat.transparent = false;
        mat.opacity = 1.0;
      }

      mat.needsUpdate = true;
      setLoadingProgress(null);
    }).catch((err) => {
      console.error('Error loading material textures:', err);
      if (!isCancelled) setLoadingProgress(null);
    });

    return () => {
      isCancelled = true;
    };
  }, [materialSet, pbrSettings.activeMaps]);

  // Update PBR Material Properties in real-time
  useEffect(() => {
    if (!materialRef.current) return;
    const mat = materialRef.current;

    mat.roughness = pbrSettings.roughness;
    mat.metalness = pbrSettings.metalness;
    
    // Normal scale with DirectX/OpenGL Y invert
    const normScaleY = pbrSettings.invertNormalY ? -pbrSettings.normalScale : pbrSettings.normalScale;
    mat.normalScale.set(pbrSettings.normalScale, normScaleY);

    // Height / Displacement
    mat.displacementScale = pbrSettings.displacementScale;
    mat.displacementBias = pbrSettings.displacementBias;

    // Glass properties
    if (materialSet?.isTransparent || mat.transmissionMap) {
      mat.transmission = pbrSettings.transmission;
      mat.ior = pbrSettings.ior;
      mat.thickness = pbrSettings.thickness;
    }

    mat.wireframe = pbrSettings.wireframe;
    mat.flatShading = pbrSettings.flatShading;

    // UV Repeat & Rotation on all loaded textures
    const textures = loadedTexturesRef.current;
    Object.values(textures).forEach((tex) => {
      if (tex instanceof THREE.Texture) {
        tex.repeat.set(pbrSettings.tilingX, pbrSettings.tilingY);
        tex.rotation = (pbrSettings.rotation * Math.PI) / 180;
        tex.needsUpdate = true;
      }
    });

    mat.needsUpdate = true;
  }, [pbrSettings, materialSet]);

  // Update Geometry Mesh
  useEffect(() => {
    if (!meshGroupRef.current || !materialRef.current) return;
    const group = meshGroupRef.current;

    // Remove old meshes
    while (group.children.length > 0) {
      const obj = group.children[0] as THREE.Mesh;
      if (obj.geometry) obj.geometry.dispose();
      group.remove(obj);
    }

    // Create new geometry with current subdivisions
    const newMesh = createMeshForGeometry(geometry, materialRef.current, pbrSettings.subdivisions);
    group.add(newMesh);
  }, [geometry, pbrSettings.subdivisions]);

  // Camera Presets
  const setCameraView = (view: 'front' | 'top' | 'isometric' | 'reset') => {
    if (!cameraRef.current || !controlsRef.current) return;
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;

    ctrl.target.set(0, 0, 0);

    switch (view) {
      case 'front':
        cam.position.set(0, 0, 4.8);
        break;
      case 'top':
        cam.position.set(0, 5.0, 0.01);
        break;
      case 'isometric':
        cam.position.set(3.5, 3.5, 3.5);
        break;
      case 'reset':
      default:
        cam.position.set(0, 1.2, 4.8);
        if (meshGroupRef.current) {
          meshGroupRef.current.rotation.set(0, 0, 0);
        }
        break;
    }
    cam.lookAt(0, 0, 0);
    ctrl.update();
  };

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-dark-950">
      <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing outline-none" />

      {/* Loading Overlay */}
      {loadingProgress && (
        <div className="absolute inset-0 bg-dark-950/70 backdrop-blur-sm flex flex-col items-center justify-center z-20 pointer-events-none transition-all">
          <div className="bg-dark-900/90 border border-indigo-500/30 p-6 rounded-2xl shadow-2xl flex flex-col items-center max-w-xs w-full mx-4">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mb-3" />
            <h3 className="text-sm font-semibold text-white mb-1">{t.loading4K}</h3>
            <p className="text-xs text-slate-400 mb-3 text-center">
              {t.loadingSubtitle} ({loadingProgress.loaded}/{loadingProgress.total})
            </p>
            {/* Progress bar */}
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-500 h-full transition-all duration-300 rounded-full"
                style={{
                  width: `${(loadingProgress.loaded / Math.max(1, loadingProgress.total)) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Floating Viewport Quick Controls (Top-Left) */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-dark-900/80 backdrop-blur-md p-1 rounded-xl border border-slate-800/80 shadow-lg">
        <button
          onClick={() => setCameraView('reset')}
          title={t.resetCamera}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-slate-800 mx-0.5" />

        <button
          onClick={() => setCameraView('isometric')}
          title={t.viewIso}
          className="px-2 py-1 text-[11px] font-medium rounded-md text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all"
        >
          {t.viewIso}
        </button>

        <button
          onClick={() => setCameraView('front')}
          title={t.viewFront}
          className="px-2 py-1 text-[11px] font-medium rounded-md text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all"
        >
          {t.viewFront}
        </button>

        <button
          onClick={() => setCameraView('top')}
          title={t.viewTop}
          className="px-2 py-1 text-[11px] font-medium rounded-md text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all"
        >
          {t.viewTop}
        </button>
      </div>

      {/* Floating Info Badges (Bottom-Left) */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
        <div className="px-2.5 py-1 rounded-lg bg-dark-900/80 backdrop-blur-md border border-slate-800/80 text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{fps} FPS</span>
        </div>

        {pbrSettings.wireframe && (
          <div className="px-2 py-1 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-[11px] text-indigo-300 font-medium">
            {t.wireframeActive}
          </div>
        )}

        {pbrSettings.displacementScale > 0 && (
          <div className="px-2 py-1 rounded-lg bg-rose-500/20 border border-rose-500/30 text-[11px] text-rose-300 font-medium">
            Displacement {pbrSettings.displacementScale.toFixed(2)}x
          </div>
        )}
      </div>

      {/* Interaction Hint (Bottom-Right) */}
      <div className="absolute bottom-4 right-4 z-10 pointer-events-none hidden md:block">
        <div className="px-3 py-1.5 rounded-lg bg-dark-900/60 backdrop-blur-sm border border-slate-800/50 text-[11px] text-slate-400">
          {t.hintRotate}
        </div>
      </div>
    </div>
  );
});
