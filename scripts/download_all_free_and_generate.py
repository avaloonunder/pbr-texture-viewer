import os
import io
import zipfile
import urllib.request
from PIL import Image, ImageFilter, ImageOps
import numpy as np

target_dir = r"d:\projects\Sandbox\assets\textures"
os.makedirs(target_dir, exist_ok=True)

# 1. AmbientCG CC0 Assets to Download
CC0_ASSETS = [
    {"id": "Tiles074", "name": "Tiles 074 (Modern Hexagon Ceramic)"},
    {"id": "Ground037", "name": "Ground 037 (Forest Soil & Pebbles)"},
    {"id": "Metal006", "name": "Metal 006 (Brushed Steel Sheet)"},
    {"id": "Concrete019", "name": "Concrete 019 (Architectural Panel)"},
    {"id": "Fabric048", "name": "Fabric 048 (Woven Linen Cloth)"},
    {"id": "Marble012", "name": "Marble 012 (White Carrara Luxury)"},
    {"id": "Leather026", "name": "Leather 026 (Fine Grain Black Leather)"}
]

def download_ambientcg_asset(asset_id, display_name):
    print(f"Downloading CC0 asset: {display_name} ({asset_id})...")
    url = f"https://ambientcg.com/get?file={asset_id}_2K-PNG.zip"
    headers = {'User-Agent': 'Mozilla/5.0'}
    req = urllib.request.Request(url, headers=headers)
    
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
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
                    target_suffix = "metallic"
                elif "displacement" in lower or "disp" in lower or "height" in lower:
                    target_suffix = "height"
                elif "ambientocclusion" in lower or "ao" in lower:
                    target_suffix = "ambientOcclusion"
                    
                if target_suffix:
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

# 2. Custom Generator for generated AI textures
CUSTOM_TEXTURES = [
    {
        "src": r"C:\Users\avalo\.gemini\antigravity\brain\4c7c3caf-2809-4355-b399-101999dd647b\cyberpunk_hex_plates_1787215857041.jpg",
        "prefix": "Cyberpunk_HexPlates",
        "is_metal": True,
        "normal_str": 3.8,
    },
    {
        "src": r"C:\Users\avalo\.gemini\antigravity\brain\4c7c3caf-2809-4355-b399-101999dd647b\fantasy_dungeon_stone_1787215877662.jpg",
        "prefix": "Fantasy_DungeonStone",
        "is_metal": False,
        "normal_str": 3.5,
    },
    {
        "src": r"C:\Users\avalo\.gemini\antigravity\brain\4c7c3caf-2809-4355-b399-101999dd647b\dragon_scale_leather_1787215899317.jpg",
        "prefix": "Dragon_ScaleLeather",
        "is_metal": False,
        "normal_str": 4.0,
    },
    {
        "src": r"C:\Users\avalo\.gemini\antigravity\brain\4c7c3caf-2809-4355-b399-101999dd647b\kintsugi_gold_marble_1787215922844.jpg",
        "prefix": "Kintsugi_GoldMarble",
        "is_metal": False,
        "is_kintsugi": True,
        "normal_str": 2.5,
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
    if item.get("is_kintsugi"):
        # Dark marble is glossy (0.15 roughness), gold veins are satin/metallic (0.25)
        roughness_np = 0.15 + (1.0 - height_np) * 0.25
    elif item.get("is_metal"):
        roughness_np = 0.35 + (1.0 - height_np) * 0.30
    else:
        roughness_np = 0.70 + (1.0 - height_np) * 0.25
        
    roughness_np = np.clip(roughness_np * 255.0, 0, 255).astype(np.uint8)
    Image.fromarray(roughness_np).save(os.path.join(target_dir, f"{prefix}_roughness.png"), "PNG")
    
    # Metallic (for Cyberpunk & Kintsugi)
    if item.get("is_metal"):
        metallic_np = (height_np * 220 + 35).astype(np.uint8)
        Image.fromarray(metallic_np).save(os.path.join(target_dir, f"{prefix}_metallic.png"), "PNG")
    elif item.get("is_kintsugi"):
        # Gold veins are metallic (mask where yellow/gold is present)
        img_np = np.array(img, dtype=np.float32)
        r, g, b = img_np[:,:,0], img_np[:,:,1], img_np[:,:,2]
        gold_mask = (r > 100) & (g > 70) & (b < 80)
        metallic_np = (gold_mask * 255).astype(np.uint8)
        Image.fromarray(metallic_np).save(os.path.join(target_dir, f"{prefix}_metallic.png"), "PNG")
        
    # AO
    ao_np = np.clip((gray_np ** 1.5) * 255.0, 0, 255).astype(np.uint8)
    Image.fromarray(ao_np).filter(ImageFilter.GaussianBlur(radius=2)).save(os.path.join(target_dir, f"{prefix}_ambientOcclusion.png"), "PNG")
    print(f"Generated {prefix} maps!")

def main():
    print("=== 1. Downloading AmbientCG CC0 Assets ===")
    for asset in CC0_ASSETS:
        download_ambientcg_asset(asset["id"], asset["name"])
        
    print("\n=== 2. Generating Custom PBR Assets ===")
    for custom in CUSTOM_TEXTURES:
        process_custom_texture(custom)
        
    print("\nAll assets downloaded and generated successfully!")

if __name__ == "__main__":
    main()
