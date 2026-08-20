import os
from PIL import Image, ImageFilter, ImageOps
import numpy as np

src_image_path = r"C:\Users\avalo\.gemini\antigravity\brain\4c7c3caf-2809-4355-b399-101999dd647b\tower_crown_stone_1787170706809.jpg"
target_dir = r"d:\projects\Sandbox\assets\textures"
prefix = "TowerClock_DomeStone"

os.makedirs(target_dir, exist_ok=True)

# 1. Base Color
img = Image.open(src_image_path).convert('RGB')
img = img.resize((2048, 2048), Image.Resampling.LANCZOS)
basecolor_path = os.path.join(target_dir, f"{prefix}_basecolor.png")
img.save(basecolor_path, "PNG")
print(f"Saved: {basecolor_path}")

# 2. Grayscale & Height / Displacement
gray = ImageOps.grayscale(img)
gray_np = np.array(gray, dtype=np.float32) / 255.0

# Deepen mortar joints for displacement
height_np = np.clip((gray_np - 0.2) / 0.8, 0.0, 1.0)
height_img = Image.fromarray((height_np * 255).astype(np.uint8))
height_path = os.path.join(target_dir, f"{prefix}_height.png")
height_img.save(height_path, "PNG")
print(f"Saved: {height_path}")

# 3. Normal Map using Sobel Filter
gx = np.zeros_like(height_np)
gy = np.zeros_like(height_np)
gx[:, 1:-1] = (height_np[:, 2:] - height_np[:, :-2]) * 0.5
gy[1:-1, :] = (height_np[2:, :] - height_np[:-2, :]) * 0.5

strength = 3.5
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

# 4. Roughness Map (Stone is rough ~0.8-0.95 with smooth spots on worn stone faces)
roughness_np = 0.82 + (1.0 - height_np) * 0.15
roughness_np = np.clip(roughness_np * 255.0, 0, 255).astype(np.uint8)
roughness_img = Image.fromarray(roughness_np)
roughness_path = os.path.join(target_dir, f"{prefix}_roughness.png")
roughness_img.save(roughness_path, "PNG")
print(f"Saved: {roughness_path}")

# 5. Ambient Occlusion (AO)
ao_np = np.clip((gray_np ** 1.6) * 255.0, 0, 255).astype(np.uint8)
ao_img = Image.fromarray(ao_np)
ao_img = ao_img.filter(ImageFilter.GaussianBlur(radius=2))
ao_path = os.path.join(target_dir, f"{prefix}_ambientOcclusion.png")
ao_img.save(ao_path, "PNG")
print(f"Saved: {ao_path}")

print("Dome stone brick PBR maps generated successfully!")
