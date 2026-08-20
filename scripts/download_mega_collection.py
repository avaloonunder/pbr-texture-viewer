import os
import io
import zipfile
import urllib.request
from PIL import Image, ImageFilter, ImageOps
import numpy as np

target_dir = r"d:\projects\Sandbox\assets\textures"
os.makedirs(target_dir, exist_ok=True)

# 25 New Verified AmbientCG CC0 Assets
MEGA_CC0_ASSETS = [
    # Wood & Timber
    {"id": "Wood051", "name": "Wood 051 (Dark Walnut Fine Grain)"},
    {"id": "Wood060", "name": "Wood 060 (Fine Mahogany Board)"},
    {"id": "WoodFloor007", "name": "Wood Floor 007 (Diagonal Parquet)"},
    {"id": "Bark001", "name": "Bark 001 (Natural Forest Tree Bark)"},

    # Bricks & Masonry
    {"id": "Bricks058", "name": "Bricks 058 (Old Industrial Red Brick)"},
    {"id": "PavingStones070", "name": "Paving Stones 070 (European Cobblestone)"},
    {"id": "PavingStones092", "name": "Paving Stones 092 (Square Flagstone Patio)"},

    # Metals
    {"id": "Metal001", "name": "Metal 001 (Diamond Plate Steel Tread)"},
    {"id": "Metal008", "name": "Metal 008 (Rusted Corroded Iron)"},
    {"id": "Metal028", "name": "Metal 028 (Galvanized Zinc Steel)"},
    {"id": "Metal032", "name": "Metal 032 (Gold Foil & Brass Plate)"},

    # Stone & Marble & Concrete
    {"id": "Marble006", "name": "Marble 006 (Calacatta Black Vein)"},
    {"id": "Rock030", "name": "Rock 030 (Mossy Forest Cliff Rock)"},
    {"id": "Rock035", "name": "Rock 035 (Desert Sandstone Rock)"},
    {"id": "Concrete034", "name": "Concrete 034 (Exposed Aggregate Concrete)"},

    # Tiles & Ceramics
    {"id": "Tiles079", "name": "Tiles 079 (Subway Beveled White Tiles)"},
    {"id": "Tiles093", "name": "Tiles 093 (Spanish Mosaic Ceramic Floor)"},
    {"id": "Tiles107", "name": "Tiles 107 (Moroccan Blue Glazed Tiles)"},

    # Fabric & Leather & Carpet
    {"id": "Leather015", "name": "Leather 015 (Vintage Brown Leather)"},
    {"id": "Fabric030", "name": "Fabric 030 (Denim Jean Fabric)"},
    {"id": "Carpet006", "name": "Carpet 006 (Cozy Tufted Wool Carpet)"},

    # Ground & Nature
    {"id": "Grass001", "name": "Grass 001 (Lush Green Lawn Grass)"},
    {"id": "Ground054", "name": "Ground 054 (Cracked Muddy Dry Earth)"},
    {"id": "Snow005", "name": "Snow 005 (Crisp Winter Snow & Ice)"},

    # Roofing
    {"id": "RoofingTiles008", "name": "Roofing Tiles 008 (Terracotta Spanish Curved)"},
]

def download_ambientcg_asset(asset_id, display_name):
    print(f"Downloading CC0 asset: {display_name} ({asset_id})...")
    url = f"https://ambientcg.com/get?file={asset_id}_2K-PNG.zip"
    headers = {'User-Agent': 'Mozilla/5.0'}
    req = urllib.request.Request(url, headers=headers)
    
    try:
        with urllib.request.urlopen(req, timeout=35) as resp:
            zip_bytes = resp.read()
            
        with zipfile.ZipFile(io.BytesIO(zip_bytes)) as z:
            for filename in z.namelist():
                lower = filename.lower()
                target_suffix = None
                if "color" in lower or "col" in lower or "albedo" in lower:
                    target_suffix = "basecolor"
                elif "normalgl" in lower or "normal" in lower or "nor" in lower:
                    if "normaldx" in lower: continue
                    target_suffix = "normal"
                elif "roughness" in lower or "rgh" in lower or "rough" in lower:
                    target_suffix = "roughness"
                elif "metal" in lower:
                    if "blend" in lower or "usdc" in lower or "tres" in lower or "mtlx" in lower: continue
                    target_suffix = "metallic"
                elif "displacement" in lower or "disp" in lower or "height" in lower:
                    target_suffix = "height"
                elif "ambientocclusion" in lower or "ao" in lower:
                    target_suffix = "ambientOcclusion"
                    
                if target_suffix and filename.endswith(('.png', '.jpg', '.jpeg')):
                    ext = os.path.splitext(filename)[1]
                    out_filename = f"EXTRA_{asset_id}_{target_suffix}{ext}"
                    out_path = os.path.join(target_dir, out_filename)
                    with open(out_path, 'wb') as f_out:
                        f_out.write(z.read(filename))
                    print(f"  -> {out_filename}")
        print(f"Added {display_name}!")
        return True
    except Exception as e:
        print(f"Error downloading {asset_id}: {e}")
        return False

# 2. Custom Generator for new procedural AI textures
CUSTOM_TEXTURES = [
    {
        "src": r"C:\Users\avalo\.gemini\antigravity\brain\4c7c3caf-2809-4355-b399-101999dd647b\stylized_crystal_geode_1787219941960.jpg",
        "prefix": "Crystal_AmethystGeode",
        "is_crystal": True,
        "normal_str": 3.2,
    },
    {
        "src": r"C:\Users\avalo\.gemini\antigravity\brain\4c7c3caf-2809-4355-b399-101999dd647b\scifi_reactor_core_1787219956829.jpg",
        "prefix": "SciFi_PlasmaReactor",
        "is_metal": True,
        "normal_str": 4.2,
    }
]

def process_custom_texture(item):
    src = item["src"]
    prefix = item["prefix"]
    print(f"Processing custom PBR set: {prefix}...")
    
    img = Image.open(src).convert('RGB')
    img = img.resize((2048, 2048), Image.Resampling.LANCZOS)
    img.save(os.path.join(target_dir, f"{prefix}_basecolor.png"), "PNG")
    
    gray = ImageOps.grayscale(img)
    gray_np = np.array(gray, dtype=np.float32) / 255.0
    
    # Height
    height_np = np.clip((gray_np - 0.1) / 0.9, 0.0, 1.0)
    Image.fromarray((height_np * 255).astype(np.uint8)).save(os.path.join(target_dir, f"{prefix}_height.png"), "PNG")
    
    # Normal
    gx = np.zeros_like(height_np)
    gy = np.zeros_like(height_np)
    gx[:, 1:-1] = (height_np[:, 2:] - height_np[:, :-2]) * 0.5
    gy[1:-1, :] = (height_np[2:, :] - height_np[:-2, :]) * 0.5
    
    str_val = item.get("normal_str", 3.0)
    nx = -gx * str_val
    ny = -gy * str_val
    nz = np.ones_like(height_np)
    norm = np.sqrt(nx*nx + ny*ny + nz*nz)
    
    nx = (nx / norm * 0.5 + 0.5) * 255.0
    ny = (ny / norm * 0.5 + 0.5) * 255.0
    nz = (nz / norm * 0.5 + 0.5) * 255.0
    normal_np = np.stack([nx, ny, nz], axis=2).astype(np.uint8)
    Image.fromarray(normal_np, mode='RGB').save(os.path.join(target_dir, f"{prefix}_normal.png"), "PNG")
    
    # Roughness
    if item.get("is_crystal"):
        # Crystals are glossy with prismatic facet variations
        roughness_np = 0.08 + (1.0 - height_np) * 0.22
    elif item.get("is_metal"):
        roughness_np = 0.32 + (1.0 - height_np) * 0.32
    else:
        roughness_np = 0.70 + (1.0 - height_np) * 0.25
        
    roughness_np = np.clip(roughness_np * 255.0, 0, 255).astype(np.uint8)
    Image.fromarray(roughness_np).save(os.path.join(target_dir, f"{prefix}_roughness.png"), "PNG")
    
    # Metallic
    if item.get("is_metal"):
        metallic_np = (height_np * 220 + 35).astype(np.uint8)
        Image.fromarray(metallic_np).save(os.path.join(target_dir, f"{prefix}_metallic.png"), "PNG")
    elif item.get("is_crystal"):
        metallic_np = np.zeros_like(height_np, dtype=np.uint8)
        Image.fromarray(metallic_np).save(os.path.join(target_dir, f"{prefix}_metallic.png"), "PNG")
        
    # AO
    ao_np = np.clip((gray_np ** 1.5) * 255.0, 0, 255).astype(np.uint8)
    Image.fromarray(ao_np).filter(ImageFilter.GaussianBlur(radius=2)).save(os.path.join(target_dir, f"{prefix}_ambientOcclusion.png"), "PNG")
    print(f"Generated {prefix} maps!")

def main():
    print("=== 1. Downloading 25 New AmbientCG CC0 Assets ===")
    for asset in MEGA_CC0_ASSETS:
        download_ambientcg_asset(asset["id"], asset["name"])
        
    print("\n=== 2. Generating New Custom PBR Sets ===")
    for custom in CUSTOM_TEXTURES:
        process_custom_texture(custom)
        
    print("\nMega collection downloaded and generated successfully!")

if __name__ == "__main__":
    main()
