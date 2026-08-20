import os
import io
import json
import zipfile
import urllib.request
import re

TEXTURES_DIR = os.path.join(os.path.dirname(__file__), '..', 'assets', 'textures')
os.makedirs(TEXTURES_DIR, exist_ok=True)

# List of top-tier CC0 PBR textures to add (Bricks & Wood)
TARGET_ASSETS = [
    {"id": "Bricks033", "category": "Bricks & Masonry", "name": "Bricks Red Clay Clean"},
    {"id": "Bricks059", "category": "Bricks & Masonry", "name": "Bricks Weathered Dark"},
    {"id": "Bricks076", "category": "Bricks & Masonry", "name": "Bricks Modern Gray Architectural"},
    {"id": "Wood049", "category": "Wood & Timber", "name": "Wood Oak Parquet Floor"},
    {"id": "Wood066", "category": "Wood & Timber", "name": "Wood Rustic Planks Weathered"},
    {"id": "WoodFloor041", "category": "Wood & Timber", "name": "Wood Herringbone Parquet Pattern"},
    {"id": "Wood026", "category": "Wood & Timber", "name": "Wood Natural Pine Fine Grain"}
]

def download_and_extract(asset_info):
    asset_id = asset_info["id"]
    display_name = asset_info["name"]
    print(f"Downloading CC0 PBR material: {display_name} ({asset_id})...")
    
    # ambientCG direct 2K-JPG/PNG zip download URL
    url = f"https://ambientcg.com/get?file={asset_id}_2K-PNG.zip"
    
    headers = {'User-Agent': 'Mozilla/5.0'}
    req = urllib.request.Request(url, headers=headers)
    
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            zip_bytes = resp.read()
            
        with zipfile.ZipFile(io.BytesIO(zip_bytes)) as z:
            for filename in z.namelist():
                lower = filename.lower()
                
                # Map to standard PBR suffix
                target_suffix = None
                if "color" in lower or "col" in lower or "albedo" in lower or "diffuse" in lower:
                    target_suffix = "basecolor"
                elif "normalgl" in lower or "normal" in lower or "nor" in lower:
                    if "normaldx" in lower: continue # Prefer OpenGL normal
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
                    out_path = os.path.join(TEXTURES_DIR, out_filename)
                    
                    with open(out_path, 'wb') as f_out:
                        f_out.write(z.read(filename))
                    print(f"  -> Extracted: {out_filename}")
        print(f"Successfully added {display_name}!")
        return True
    except Exception as e:
        print(f"Failed to download {asset_id}: {e}")
        return False

def main():
    print("Starting download of additional Wood and Brick PBR textures...")
    success_count = 0
    for asset in TARGET_ASSETS:
        if download_and_extract(asset):
            success_count += 1
            
    print(f"\nDownload finished. Added {success_count} new PBR material sets.")

if __name__ == "__main__":
    main()
