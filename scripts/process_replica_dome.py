import os
from PIL import Image, ImageFilter, ImageOps
import numpy as np

target_dir = r"d:\projects\Sandbox\assets\textures"
os.makedirs(target_dir, exist_ok=True)

def generate_pbr_set(src_path, prefix):
    img = Image.open(src_path).convert('RGB')
    img = img.resize((2048, 2048), Image.Resampling.LANCZOS)
    
    # 1. Base Color
    basecolor_path = os.path.join(target_dir, f"{prefix}_basecolor.png")
    img.save(basecolor_path, "PNG")
    print(f"Saved: {basecolor_path}")
    
    # 2. Grayscale & Height / Displacement
    gray = ImageOps.grayscale(img)
    gray_np = np.array(gray, dtype=np.float32) / 255.0
    
    # Height map
    height_np = np.clip((gray_np - 0.1) / 0.9, 0.0, 1.0)
    height_img = Image.fromarray((height_np * 255).astype(np.uint8))
    height_path = os.path.join(target_dir, f"{prefix}_height.png")
    height_img.save(height_path, "PNG")
    print(f"Saved: {height_path}")
    
    # 3. Normal Map
    gx = np.zeros_like(height_np)
    gy = np.zeros_like(height_np)
    gx[:, 1:-1] = (height_np[:, 2:] - height_np[:, :-2]) * 0.5
    gy[1:-1, :] = (height_np[2:, :] - height_np[:-2, :]) * 0.5
    
    strength = 3.2
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
    
    # 4. Roughness Map
    roughness_np = 0.82 + (1.0 - height_np) * 0.15
    roughness_np = np.clip(roughness_np * 255.0, 0, 255).astype(np.uint8)
    roughness_img = Image.fromarray(roughness_np)
    roughness_path = os.path.join(target_dir, f"{prefix}_roughness.png")
    roughness_img.save(roughness_path, "PNG")
    print(f"Saved: {roughness_path}")
    
    # 5. Ambient Occlusion
    ao_np = np.clip((gray_np ** 1.5) * 255.0, 0, 255).astype(np.uint8)
    ao_img = Image.fromarray(ao_np)
    ao_img = ao_img.filter(ImageFilter.GaussianBlur(radius=2))
    ao_path = os.path.join(target_dir, f"{prefix}_ambientOcclusion.png")
    ao_img.save(ao_path, "PNG")
    print(f"Saved: {ao_path}")

# Process Replica Without Window
generate_pbr_set(
    r"C:\Users\avalo\.gemini\antigravity\brain\4c7c3caf-2809-4355-b399-101999dd647b\authentic_dome_replica_1787171377171.jpg",
    "TowerClock_Replica_DomeBricks"
)

# Process Replica With Window
generate_pbr_set(
    r"C:\Users\avalo\.gemini\antigravity\brain\4c7c3caf-2809-4355-b399-101999dd647b\authentic_dome_window_replica_1787171389906.jpg",
    "TowerClock_Replica_DomeBricks_Window"
)

print("Exact replica PBR map sets generated successfully!")
