import os
from PIL import Image, ImageFilter, ImageOps
import numpy as np

target_dir = r"d:\projects\Sandbox\assets\textures"
os.makedirs(target_dir, exist_ok=True)

def generate_pbr_set(src_path, prefix, is_isolated=False):
    img = Image.open(src_path).convert('RGBA' if is_isolated else 'RGB')
    img = img.resize((2048, 2048), Image.Resampling.LANCZOS)
    
    # Basecolor
    basecolor_path = os.path.join(target_dir, f"{prefix}_basecolor.png")
    img.save(basecolor_path, "PNG")
    print(f"Saved: {basecolor_path}")
    
    # Grayscale
    gray = ImageOps.grayscale(img.convert('RGB'))
    gray_np = np.array(gray, dtype=np.float32) / 255.0
    
    # Height / Displacement
    height_np = np.clip((gray_np - 0.15) / 0.85, 0.0, 1.0)
    height_img = Image.fromarray((height_np * 255).astype(np.uint8))
    height_path = os.path.join(target_dir, f"{prefix}_height.png")
    height_img.save(height_path, "PNG")
    print(f"Saved: {height_path}")
    
    # Normal Map using Sobel
    gx = np.zeros_like(height_np)
    gy = np.zeros_like(height_np)
    gx[:, 1:-1] = (height_np[:, 2:] - height_np[:, :-2]) * 0.5
    gy[1:-1, :] = (height_np[2:, :] - height_np[:-2, :]) * 0.5
    
    strength = 3.0
    nx = -gx * strength
    ny = -gy * strength
    nz = np.ones_like(height_np)
    norm = np.sqrt(nx*nx + ny*ny + nz*nz)
    
    nx = (nx / norm * 0.5 + 0.5) * 255.0
    ny = (ny / norm * 0.5 + 0.5) * 255.0
    nz = (nz / norm * 0.5 + 0.5) * 255.0
    
    normal_np = np.stack([nx, ny, nz], axis=2).astype(np.uint8)
    normal_img = Image.fromarray(normal_np, mode='RGB')
    normal_path = os.path.join(target_dir, f"{prefix}_normal.png")
    normal_img.save(normal_path, "PNG")
    print(f"Saved: {normal_path}")
    
    # Roughness Map
    roughness_np = 0.70 + (1.0 - height_np) * 0.25
    roughness_np = np.clip(roughness_np * 255.0, 0, 255).astype(np.uint8)
    roughness_img = Image.fromarray(roughness_np)
    roughness_path = os.path.join(target_dir, f"{prefix}_roughness.png")
    roughness_img.save(roughness_path, "PNG")
    print(f"Saved: {roughness_path}")
    
    # AO Map
    ao_np = np.clip((gray_np ** 1.3) * 255.0, 0, 255).astype(np.uint8)
    ao_img = Image.fromarray(ao_np)
    ao_img = ao_img.filter(ImageFilter.GaussianBlur(radius=2))
    ao_path = os.path.join(target_dir, f"{prefix}_ambientOcclusion.png")
    ao_img.save(ao_path, "PNG")
    print(f"Saved: {ao_path}")

# Process Isolated Single Plank
generate_pbr_set(
    r"C:\Users\avalo\.gemini\antigravity\brain\4c7c3caf-2809-4355-b399-101999dd647b\single_wood_plank_1787170538470.jpg",
    "TowerClock_SinglePlank_Isolated"
)

# Process Full-Bleed Single Plank
generate_pbr_set(
    r"C:\Users\avalo\.gemini\antigravity\brain\4c7c3caf-2809-4355-b399-101999dd647b\single_plank_fullbleed_1787170551922.jpg",
    "TowerClock_SinglePlank_Full"
)

print("All single plank PBR maps generated successfully!")
