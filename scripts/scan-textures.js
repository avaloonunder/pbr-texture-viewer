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
  // Wood & Timber
  'EXTRA_Wood049': { name: 'Wood 049 (Oak Parquet Floor)', category: 'Wood & Timber' },
  'EXTRA_Wood066': { name: 'Wood 066 (Rustic Planks Weathered)', category: 'Wood & Timber' },
  'EXTRA_WoodFloor041': { name: 'Wood Floor 041 (Herringbone Parquet)', category: 'Wood & Timber' },
  'EXTRA_Wood026': { name: 'Wood 026 (Natural Pine Fine Grain)', category: 'Wood & Timber' },
  'EXTRA_Wood051': { name: 'Wood 051 (Dark Walnut Fine Grain)', category: 'Wood & Timber' },
  'EXTRA_Wood060': { name: 'Wood 060 (Fine Mahogany Board)', category: 'Wood & Timber' },
  'EXTRA_WoodFloor007': { name: 'Wood Floor 007 (Diagonal Parquet)', category: 'Wood & Timber' },
  'EXTRA_Bark001': { name: 'Bark 001 (Natural Forest Tree Bark)', category: 'Wood & Timber' },
  'TowerClock_WoodFrame': { name: 'Tower Clock Wood Frame (Central Shaft)', category: 'Wood & Timber' },
  'TowerClock_SinglePlank_Isolated': { name: 'Tower Clock Single Plank (Isolated Board)', category: 'Wood & Timber' },
  'TowerClock_SinglePlank_Full': { name: 'Tower Clock Single Plank (Edge-to-Edge)', category: 'Wood & Timber' },
  
  // Bricks & Masonry
  'EXTRA_Bricks033': { name: 'Bricks 033 (Red Clay Clean)', category: 'Bricks & Masonry' },
  'EXTRA_Bricks059': { name: 'Bricks 059 (Weathered Dark)', category: 'Bricks & Masonry' },
  'EXTRA_Bricks058': { name: 'Bricks 058 (Old Industrial Red Brick)', category: 'Bricks & Masonry' },
  'EXTRA_PavingStones070': { name: 'Paving Stones 070 (European Cobblestone)', category: 'Bricks & Masonry' },
  'EXTRA_PavingStones092': { name: 'Paving Stones 092 (Square Flagstone Patio)', category: 'Bricks & Masonry' },
  'Fantasy_DungeonStone': { name: 'Fantasy Dungeon Flagstone (Castle Floor)', category: 'Bricks & Masonry' },
  'TowerClock_DomeStone': { name: 'Tower Clock Dome Stone (Cupola Masonry)', category: 'Bricks & Masonry' },
  'TowerClock_DomeBricks_Parallel': { name: 'Tower Clock Dome Bricks (Parallel Courses)', category: 'Bricks & Masonry' },
  'TowerClock_DomeBricks_Window': { name: 'Tower Clock Dome Bricks (With Circular Window)', category: 'Bricks & Masonry' },
  'TowerClock_Replica_DomeBricks': { name: 'Tower Clock Replica Dome (No Window - Exact Game Art)', category: 'Bricks & Masonry' },
  'TowerClock_Replica_DomeBricks_Window': { name: 'Tower Clock Replica Dome (With Window - Exact Game Art)', category: 'Bricks & Masonry' },
  
  // Tiles & Ceramics
  'EXTRA_Tiles074': { name: 'Tiles 074 (Modern Hexagon Ceramic)', category: 'Tiles & Ceramics' },
  'EXTRA_Tiles079': { name: 'Tiles 079 (Subway Beveled White Tiles)', category: 'Tiles & Ceramics' },
  'EXTRA_Tiles093': { name: 'Tiles 093 (Spanish Mosaic Ceramic Floor)', category: 'Tiles & Ceramics' },
  'EXTRA_Tiles107': { name: 'Tiles 107 (Moroccan Blue Glazed Tiles)', category: 'Tiles & Ceramics' },
  
  // Ground & Nature
  'EXTRA_Ground037': { name: 'Ground 037 (Forest Soil & Pebbles)', category: 'Ground & Nature' },
  'EXTRA_Grass001': { name: 'Grass 001 (Lush Green Lawn Grass)', category: 'Ground & Nature' },
  'EXTRA_Ground054': { name: 'Ground 054 (Cracked Muddy Dry Earth)', category: 'Ground & Nature' },
  'EXTRA_Snow005': { name: 'Snow 005 (Crisp Winter Snow & Ice)', category: 'Ground & Nature' },
  
  // Metals & Sci-Fi
  'EXTRA_Metal006': { name: 'Metal 006 (Brushed Steel Sheet)', category: 'Metals' },
  'EXTRA_Metal001': { name: 'Metal 001 (Diamond Plate Steel Tread)', category: 'Metals' },
  'EXTRA_Metal008': { name: 'Metal 008 (Rusted Corroded Iron)', category: 'Metals' },
  'EXTRA_Metal028': { name: 'Metal 028 (Galvanized Zinc Steel)', category: 'Metals' },
  'EXTRA_Metal032': { name: 'Metal 032 (Gold Foil & Brass Plate)', category: 'Metals' },
  'Cyberpunk_HexPlates': { name: 'Cyberpunk Hex Plating (Carbon & Titanium)', category: 'Sci-Fi & Tech' },
  'SciFi_PlasmaReactor': { name: 'Sci-Fi Plasma Reactor Core Plating', category: 'Sci-Fi & Tech' },
  
  // Stone & Concrete & Luxury
  'EXTRA_Concrete019': { name: 'Concrete 019 (Architectural Panel)', category: 'Stone & Concrete' },
  'EXTRA_Concrete034': { name: 'Concrete 034 (Exposed Aggregate Concrete)', category: 'Stone & Concrete' },
  'EXTRA_Marble012': { name: 'Marble 012 (White Carrara Luxury)', category: 'Stone & Concrete' },
  'EXTRA_Marble006': { name: 'Marble 006 (Calacatta Black Vein)', category: 'Stone & Concrete' },
  'EXTRA_Rock030': { name: 'Rock 030 (Mossy Forest Cliff Rock)', category: 'Stone & Concrete' },
  'EXTRA_Rock035': { name: 'Rock 035 (Desert Sandstone Rock)', category: 'Stone & Concrete' },
  'Kintsugi_GoldMarble': { name: 'Kintsugi Black Marble & Gold Veins', category: 'Stone & Concrete' },
  
  // Fabrics & Leather & Carpet
  'EXTRA_Fabric048': { name: 'Fabric 048 (Woven Linen Cloth)', category: 'Fabric & Leather' },
  'EXTRA_Fabric030': { name: 'Fabric 030 (Denim Jean Fabric)', category: 'Fabric & Leather' },
  'EXTRA_Leather026': { name: 'Leather 026 (Fine Grain Black Leather)', category: 'Fabric & Leather' },
  'EXTRA_Leather015': { name: 'Leather 015 (Vintage Brown Leather)', category: 'Fabric & Leather' },
  'EXTRA_Carpet006': { name: 'Carpet 006 (Cozy Tufted Wool Carpet)', category: 'Fabric & Leather' },
  'Dragon_ScaleLeather': { name: 'Dragon Scale Armor Leather (Armored Hide)', category: 'Fabric & Leather' },

  // Glass & Crystals
  'Crystal_AmethystGeode': { name: 'Crystal 001 (Amethyst Gemstone Geode)', category: 'Glass & Crystals' },

  // Roofing
  'EXTRA_RoofingTiles008': { name: 'Roofing Tiles 008 (Terracotta Spanish Curved)', category: 'Roofing' },
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
        } else if (lower.includes('brick') || lower.includes('dungeon') || lower.includes('paving')) {
          category = 'Bricks & Masonry';
        } else if (lower.includes('tile')) {
          category = 'Tiles & Ceramics';
        } else if (lower.includes('fabric') || lower.includes('leather') || lower.includes('cloth') || lower.includes('scale') || lower.includes('carpet')) {
          category = 'Fabric & Leather';
        } else if (lower.includes('cyber') || lower.includes('hex') || lower.includes('tech') || lower.includes('panel') || lower.includes('reactor')) {
          category = 'Sci-Fi & Tech';
        } else if (lower.includes('ground') || lower.includes('soil') || lower.includes('rock') || lower.includes('grass') || lower.includes('snow') || lower.includes('moss')) {
          category = 'Ground & Nature';
        } else if (lower.includes('copper') || lower.includes('metal') || lower.includes('iron') || lower.includes('steel') || lower.includes('gold')) {
          category = 'Metals';
        } else if (lower.includes('stone') || lower.includes('marble') || lower.includes('concrete') || lower.includes('cobble')) {
          category = 'Stone & Concrete';
        } else if (lower.includes('roof')) {
          category = 'Roofing';
        } else if (lower.includes('glass') || lower.includes('crystal')) {
          category = 'Glass & Crystals';
        }
      }

      materialMap.set(materialKey, {
        id: materialKey,
        name: displayName || materialKey,
        category,
        isTransparent: materialKey.toLowerCase().includes('glass') || materialKey.toLowerCase().includes('crystal'),
        maps: {},
        sizes: {},
        totalSizeBytes: 0
      });
    }

    const mat = materialMap.get(materialKey);
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
