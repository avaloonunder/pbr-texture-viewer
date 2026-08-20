import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const texturesDir = path.join(__dirname, '..', 'assets', 'textures');
const publicTexturesDir = path.join(__dirname, '..', 'public', 'assets', 'textures');
const outputDir = path.join(__dirname, '..', 'src', 'data');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

if (!fs.existsSync(publicTexturesDir)) {
  fs.mkdirSync(publicTexturesDir, { recursive: true });
}

// Friendly names dictionary for special / extra assets
const friendlyNames = {
  'EXTRA_Bricks033': { name: 'Bricks 033 (Red Clay Clean)', category: 'Bricks & Masonry' },
  'EXTRA_Bricks059': { name: 'Bricks 059 (Weathered Dark)', category: 'Bricks & Masonry' },
  'EXTRA_Wood049': { name: 'Wood 049 (Oak Parquet Floor)', category: 'Wood & Timber' },
  'EXTRA_Wood066': { name: 'Wood 066 (Rustic Planks Weathered)', category: 'Wood & Timber' },
  'EXTRA_WoodFloor041': { name: 'Wood Floor 041 (Herringbone Parquet)', category: 'Wood & Timber' },
  'EXTRA_Wood026': { name: 'Wood 026 (Natural Pine Fine Grain)', category: 'Wood & Timber' },
  'TowerClock_WoodFrame': { name: 'Tower Clock Wood Frame (Central Shaft)', category: 'Wood & Timber' },
  'TowerClock_SinglePlank_Isolated': { name: 'Tower Clock Single Plank (Isolated Board)', category: 'Wood & Timber' },
  'TowerClock_SinglePlank_Full': { name: 'Tower Clock Single Plank (Edge-to-Edge)', category: 'Wood & Timber' },
  'TowerClock_DomeStone': { name: 'Tower Clock Dome Stone (Cupola Masonry)', category: 'Bricks & Masonry' },
  'TowerClock_DomeBricks_Parallel': { name: 'Tower Clock Dome Bricks (Parallel Courses)', category: 'Bricks & Masonry' },
  'TowerClock_DomeBricks_Window': { name: 'Tower Clock Dome Bricks (With Circular Window)', category: 'Bricks & Masonry' },
  'TowerClock_Replica_DomeBricks': { name: 'Tower Clock Replica Dome (No Window - Exact Game Art)', category: 'Bricks & Masonry' },
  'TowerClock_Replica_DomeBricks_Window': { name: 'Tower Clock Replica Dome (With Window - Exact Game Art)', category: 'Bricks & Masonry' },
};

function scanTextures() {
  if (!fs.existsSync(texturesDir)) {
    console.error(`Textures directory not found: ${texturesDir}`);
    return;
  }

  const files = fs.readdirSync(texturesDir);
  const materialMap = new Map();

  const mapSuffixes = [
    { type: 'basecolor', patterns: ['_basecolor', '_diffuse', '_albedo', '_col', '_color'] },
    { type: 'normal', patterns: ['_normal', '_nor', '_norm', '_nrm'] },
    { type: 'roughness', patterns: ['_roughness', '_rough', '_rgh'] },
    { type: 'metallic', patterns: ['_metallic', '_metal', '_met'] },
    { type: 'height', patterns: ['_height', '_disp', '_displacement', '_bump'] },
    { type: 'refraction', patterns: ['_refraction', '_refr', '_trans', '_transmission', '_opacity'] },
    { type: 'ambientOcclusion', patterns: ['_ao', '_ambientocclusion', '_ambientOcclusion', '_occlusion'] },
    { type: 'emissive', patterns: ['_emissive', '_emission', '_emit'] }
  ];

  for (const file of files) {
    if (!file.match(/\.(png|jpg|jpeg|webp|tga|exr)$/i)) continue;

    // Sync file to public/assets/textures for static production build (GitHub Pages)
    const srcFile = path.join(texturesDir, file);
    const publicFile = path.join(publicTexturesDir, file);
    if (!fs.existsSync(publicFile) || fs.statSync(srcFile).mtimeMs > fs.statSync(publicFile).mtimeMs) {
      fs.copyFileSync(srcFile, publicFile);
    }

    const ext = path.extname(file);
    const nameWithoutExt = path.basename(file, ext);
    const stats = fs.statSync(srcFile);

    let matchedType = null;
    let materialKey = nameWithoutExt;

    for (const { type, patterns } of mapSuffixes) {
      for (const pattern of patterns) {
        const regex = new RegExp(`${pattern}$`, 'i');
        if (regex.test(nameWithoutExt)) {
          matchedType = type;
          materialKey = nameWithoutExt.replace(regex, '');
          break;
        }
      }
      if (matchedType) break;
    }

    if (!matchedType) {
      matchedType = 'basecolor';
    }

    if (!materialMap.has(materialKey)) {
      let displayName = materialKey;
      let category = 'Other';

      if (friendlyNames[materialKey]) {
        displayName = friendlyNames[materialKey].name;
        category = friendlyNames[materialKey].category;
      } else {
        displayName = materialKey.replace(/^EXTRA_/i, '');
        displayName = displayName.replace(/([a-z])([A-Z0-9])/g, '$1 $2').trim();

        const lower = materialKey.toLowerCase();
        if (lower.includes('wood') || lower.includes('timber') || lower.includes('bark') || lower.includes('parquet')) {
          category = 'Wood & Timber';
        } else if (lower.includes('brick')) {
          category = 'Bricks & Masonry';
        } else if (lower.includes('copper') || lower.includes('metal') || lower.includes('iron') || lower.includes('gold') || lower.includes('silver') || lower.includes('steel')) {
          category = 'Metals';
        } else if (lower.includes('stone') || lower.includes('cobble') || lower.includes('floor')) {
          category = 'Stone & Concrete';
        } else if (lower.includes('glass')) {
          category = 'Glass & Crystals';
        } else if (lower.includes('roof') || lower.includes('slate')) {
          category = 'Roofing';
        } else if (lower.includes('plaster')) {
          category = 'Plaster & Walls';
        }
      }

      materialMap.set(materialKey, {
        id: materialKey,
        name: displayName || materialKey,
        category,
        isTransparent: materialKey.toLowerCase().includes('glass'),
        maps: {},
        sizes: {},
        totalSizeBytes: 0
      });
    }

    const mat = materialMap.get(materialKey);
    // Use relative path so it works in both dev and production (GitHub Pages)
    mat.maps[matchedType] = `assets/textures/${file}`;
    mat.sizes[matchedType] = stats.size;
    mat.totalSizeBytes += stats.size;
  }

  const materials = Array.from(materialMap.values()).sort((a, b) => a.name.localeCompare(b.name));

  const catalog = {
    generatedAt: new Date().toISOString(),
    totalMaterials: materials.length,
    totalFiles: files.length,
    categories: Array.from(new Set(materials.map(m => m.category))).sort(),
    materials
  };

  const outputPath = path.join(outputDir, 'materials.json');
  fs.writeFileSync(outputPath, JSON.stringify(catalog, null, 2));
  console.log(`Scan completed: Found ${materials.length} material sets from ${files.length} textures.`);
  console.log(`Synced textures to ${publicTexturesDir}`);
  console.log(`Saved catalog to ${outputPath}`);
}

scanTextures();
