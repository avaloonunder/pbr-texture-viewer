import React, { useState } from 'react';
import { MaterialSet, PBRSettings, MeshGeometryType } from '../types';
import { 
  X, 
  Copy, 
  Check, 
  Code, 
  FileText, 
  Boxes, 
  Layers, 
  Share2, 
  ExternalLink,
  Tablet,
  Stamp,
  Box,
  Download,
  Info,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';
import { exportAlphaForNomad, exportGlbForNomad, exportTextureMapForNomad } from '../utils/nomadExporter';

interface ExportModalProps {
  materialSet: MaterialSet | null;
  pbrSettings: PBRSettings;
  geometry: MeshGeometryType;
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  materialSet,
  pbrSettings,
  geometry,
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'blender' | 'unreal' | 'unity' | 'threejs' | 'nomad' | 'paths'>('nomad');
  const [copied, setCopied] = useState<boolean>(false);
  const [exportLoading, setExportLoading] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  if (!isOpen || !materialSet) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNomadExport = async (action: 'alpha' | 'glb' | 'textures') => {
    setExportLoading(action);
    setExportSuccess(null);
    try {
      if (action === 'alpha') {
        await exportAlphaForNomad(materialSet);
        setExportSuccess(t.nomadShareSuccess);
      } else if (action === 'glb') {
        await exportGlbForNomad(materialSet, pbrSettings, geometry);
        setExportSuccess(t.nomadShareSuccess);
      } else if (action === 'textures') {
        await exportTextureMapForNomad(materialSet, 'basecolor');
        setExportSuccess(t.nomadShareSuccess);
      }
    } catch (err: any) {
      console.error('Export error:', err);
    } finally {
      setExportLoading(null);
      setTimeout(() => setExportSuccess(null), 3000);
    }
  };

  // Generate Blender Python Script
  const generateBlenderScript = () => {
    return `import bpy

# Auto-created PBR Material for: ${materialSet.name}
mat_name = "${materialSet.id}"
mat = bpy.data.materials.get(mat_name) or bpy.data.materials.new(name=mat_name)
mat.use_nodes = True
nodes = mat.node_tree.nodes
links = mat.node_tree.links

nodes.clear()

# Create Shader Nodes
output_node = nodes.new(type='ShaderNodeOutputMaterial')
output_node.location = (400, 0)

bsdf = nodes.new(type='ShaderNodeBsdfPrincipled')
bsdf.location = (0, 0)
links.new(bsdf.outputs['BSDF'], output_node.inputs['Surface'])

# Mapping & UV
coord = nodes.new(type='ShaderNodeTexCoord')
coord.location = (-1000, 0)

mapping = nodes.new(type='ShaderNodeMapping')
mapping.location = (-800, 0)
mapping.inputs['Scale'].default_value[0] = ${pbrSettings.tilingX}
mapping.inputs['Scale'].default_value[1] = ${pbrSettings.tilingY}
links.new(coord.outputs['UV'], mapping.inputs['Vector'])

${materialSet.maps.basecolor ? `# Base Color (sRGB)
tex_col = nodes.new(type='ShaderNodeTexImage')
tex_col.location = (-400, 300)
tex_col.image = bpy.data.images.load("${materialSet.maps.basecolor}")
links.new(mapping.outputs['Vector'], tex_col.inputs['Vector'])
links.new(tex_col.outputs['Color'], bsdf.inputs['Base Color'])
` : ''}
${materialSet.maps.roughness ? `# Roughness (Non-Color)
tex_rgh = nodes.new(type='ShaderNodeTexImage')
tex_rgh.location = (-400, 0)
tex_rgh.image = bpy.data.images.load("${materialSet.maps.roughness}")
tex_rgh.image.colorspace_settings.name = 'Non-Color'
links.new(mapping.outputs['Vector'], tex_rgh.inputs['Vector'])
links.new(tex_rgh.outputs['Color'], bsdf.inputs['Roughness'])
` : ''}
${materialSet.maps.normal ? `# Normal Map (Non-Color)
tex_nor = nodes.new(type='ShaderNodeTexImage')
tex_nor.location = (-600, -300)
tex_nor.image = bpy.data.images.load("${materialSet.maps.normal}")
tex_nor.image.colorspace_settings.name = 'Non-Color'
links.new(mapping.outputs['Vector'], tex_nor.inputs['Vector'])

node_nor = nodes.new(type='ShaderNodeNormalMap')
node_nor.location = (-200, -300)
node_nor.inputs['Strength'].default_value = ${pbrSettings.normalScale}
links.new(tex_nor.outputs['Color'], node_nor.inputs['Color'])
links.new(node_nor.outputs['Normal'], bsdf.inputs['Normal'])
` : ''}
${materialSet.maps.metallic ? `# Metallic (Non-Color)
tex_met = nodes.new(type='ShaderNodeTexImage')
tex_met.location = (-400, -600)
tex_met.image = bpy.data.images.load("${materialSet.maps.metallic}")
tex_met.image.colorspace_settings.name = 'Non-Color'
links.new(mapping.outputs['Vector'], tex_met.inputs['Vector'])
links.new(tex_met.outputs['Color'], bsdf.inputs['Metallic'])
` : ''}
print("Material '${materialSet.name}' setup successfully in Blender!")`;
  };

  // Three.js code snippet
  const generateThreeJsCode = () => {
    return `import * as THREE from 'three';

const loader = new THREE.TextureLoader();

function configureTexture(path, isColor = false) {
  const tex = loader.load(path);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(${pbrSettings.tilingX}, ${pbrSettings.tilingY});
  if (isColor) tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const material = new THREE.MeshPhysicalMaterial({
  ${materialSet.maps.basecolor ? `map: configureTexture('${materialSet.maps.basecolor}', true),` : ''}
  ${materialSet.maps.normal ? `normalMap: configureTexture('${materialSet.maps.normal}'),` : ''}
  ${materialSet.maps.roughness ? `roughnessMap: configureTexture('${materialSet.maps.roughness}'),` : ''}
  ${materialSet.maps.metallic ? `metalnessMap: configureTexture('${materialSet.maps.metallic}'),` : ''}
  ${materialSet.maps.height ? `displacementMap: configureTexture('${materialSet.maps.height}'),` : ''}
  ${materialSet.maps.height ? `displacementScale: ${pbrSettings.displacementScale},` : ''}
  roughness: ${pbrSettings.roughness},
  metalness: ${pbrSettings.metalness},
  ${materialSet.isTransparent ? `transmission: ${pbrSettings.transmission}, ior: ${pbrSettings.ior}, transparent: true,` : ''}
});`;
  };

  // Unreal Engine text summary
  const generateUnrealGuide = () => {
    return `=== UNREAL ENGINE 5 PBR SETUP GUIDE ===
Material: ${materialSet.name}

1. Import Textures to Content Browser:
   ${Object.entries(materialSet.maps)
     .map(([k, v]) => `- [${k.toUpperCase()}]: ${v?.split('/').pop()}`)
     .join('\n   ')}

2. Texture Settings in UE5:
   - BaseColor: sRGB [ON] | Compression: Default (DXT1/5, BC1/3)
   - Normal: sRGB [OFF] | Compression: Normalmap (BC5)
   - Roughness: sRGB [OFF] | Compression: Masks (no sRGB)
   - Metallic: sRGB [OFF] | Compression: Masks (no sRGB)
   - Height: sRGB [OFF] | Compression: Grayscale (G8 / BC4)

3. In Material Editor Graph:
   - Connect TextureSample (BaseColor) -> Base Color
   - Connect TextureSample (Roughness) -> Roughness
   - Connect TextureSample (Normal) -> Normal
   - Connect TextureSample (Metallic) -> Metallic
   - UV Tiling: Use TexCoord node with U=${pbrSettings.tilingX}, V=${pbrSettings.tilingY}`;
  };

  // Absolute file paths
  const generatePathsList = () => {
    return Object.entries(materialSet.maps)
      .map(([k, v]) => `${k.toUpperCase().padEnd(12)}: ${v}`)
      .join('\n');
  };

  const getCodeForTab = () => {
    switch (activeTab) {
      case 'blender':
        return generateBlenderScript();
      case 'threejs':
        return generateThreeJsCode();
      case 'unreal':
        return generateUnrealGuide();
      case 'paths':
        return generatePathsList();
      case 'unity':
      default:
        return `// Unity URP Lit Material Setup: ${materialSet.name}\n` +
          `// Base Map: ${materialSet.maps.basecolor?.split('/').pop()} (sRGB)\n` +
          `// Normal Map: ${materialSet.maps.normal?.split('/').pop()} (Normal Map)\n` +
          `// Metallic/Smoothness: ${materialSet.maps.metallic?.split('/').pop()}\n` +
          `// Tiling: X = ${pbrSettings.tilingX}, Y = ${pbrSettings.tilingY}\n` +
          `// Smoothness: ${(1.0 - pbrSettings.roughness).toFixed(2)}`;
    }
  };

  const currentCode = getCodeForTab();

  return (
    <div className="fixed inset-0 bg-dark-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 select-none animate-in fade-in duration-150">
      <div className="bg-dark-900 border border-slate-700/80 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Share2 className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-sm font-bold text-white">
                {t.exportTitle}: {materialSet.name}
              </h3>
              <p className="text-xs text-slate-400">
                {t.exportSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Exporter Tabs */}
        <div className="flex items-center gap-1 px-4 pt-3 border-b border-slate-800 bg-dark-950/50 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('nomad')}
            className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 border-b-2 shrink-0 ${
              activeTab === 'nomad'
                ? 'border-indigo-500 text-white bg-dark-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>{t.tabNomad}</span>
          </button>

          <button
            onClick={() => setActiveTab('blender')}
            className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 border-b-2 shrink-0 ${
              activeTab === 'blender'
                ? 'border-indigo-500 text-white bg-dark-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>{t.tabBlender}</span>
          </button>

          <button
            onClick={() => setActiveTab('unreal')}
            className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 border-b-2 shrink-0 ${
              activeTab === 'unreal'
                ? 'border-indigo-500 text-white bg-dark-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>{t.tabUnreal}</span>
          </button>

          <button
            onClick={() => setActiveTab('unity')}
            className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 border-b-2 shrink-0 ${
              activeTab === 'unity'
                ? 'border-indigo-500 text-white bg-dark-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>{t.tabUnity}</span>
          </button>

          <button
            onClick={() => setActiveTab('threejs')}
            className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 border-b-2 shrink-0 ${
              activeTab === 'threejs'
                ? 'border-indigo-500 text-white bg-dark-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>{t.tabThree}</span>
          </button>

          <button
            onClick={() => setActiveTab('paths')}
            className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 border-b-2 shrink-0 ${
              activeTab === 'paths'
                ? 'border-indigo-500 text-white bg-dark-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>{t.tabPaths}</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'nomad' ? (
          <div className="p-4 flex-1 overflow-y-auto space-y-4">
            {exportSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{exportSuccess}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Option 1: Export Alpha / Stamp */}
              <div className="bg-dark-950 p-4 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Stamp className="w-4 h-4 text-amber-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      {t.nomadAlphaButton}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400">
                    {t.nomadAlphaDesc}
                  </p>
                </div>

                <button
                  onClick={() => handleNomadExport('alpha')}
                  disabled={exportLoading === 'alpha'}
                  className="w-full py-2 px-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <Stamp className="w-3.5 h-3.5" />
                  <span>{exportLoading === 'alpha' ? 'Preparando...' : t.nomadAlphaButton}</span>
                </button>
              </div>

              {/* Option 2: Export 3D GLB Model */}
              <div className="bg-dark-950 p-4 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Box className="w-4 h-4 text-indigo-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      {t.nomadGlbButton}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400">
                    {t.nomadGlbDesc}
                  </p>
                </div>

                <button
                  onClick={() => handleNomadExport('glb')}
                  disabled={exportLoading === 'glb'}
                  className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>{exportLoading === 'glb' ? 'Generando 3D...' : t.nomadGlbButton}</span>
                </button>
              </div>
            </div>

            {/* iPad Guide Accordion */}
            <div className="bg-dark-950/80 p-4 rounded-xl border border-slate-800/80 space-y-2">
              <h5 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Tablet className="w-4 h-4 text-indigo-400" />
                {t.nomadGuideTitle}
              </h5>
              <div className="text-xs text-slate-400 space-y-1.5 pl-6 font-sans">
                <p>{t.nomadStep1}</p>
                <p>{t.nomadStep2}</p>
                <p>{t.nomadStep3}</p>
                <p>{t.nomadStep4}</p>
              </div>
            </div>
          </div>
        ) : (
          /* Code Content for other tabs */
          <div className="p-4 flex-1 overflow-hidden flex flex-col">
            <div className="relative flex-1 bg-dark-950 rounded-xl border border-slate-800 p-4 font-mono text-xs text-slate-300 overflow-auto">
              <pre>{currentCode}</pre>

              <button
                onClick={() => handleCopy(currentCode)}
                className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-sans font-medium shadow-lg transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>{t.copied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{t.copyButton}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-800 bg-dark-950/40 flex items-center justify-between text-xs text-slate-400 px-4">
          <span>{materialSet.name} ({Object.keys(materialSet.maps).length} {t.pbrMapsCount})</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-all"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
