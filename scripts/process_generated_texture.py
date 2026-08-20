import os
from PIL import Image, ImageFilter, ImageOps
import numpy as np

src_image_path = r"C:\Users\avalo\.gemini\antigravity\brain\4c7c3caf-2809-4355-b399-101999dd647b\tower_wood_full_1787170349651.jpg"
target_dir = r"d:\projects\Sandbox\assets\textures"

os.makedirs(target_dir, exist_ok=True)

# 1. Base Color (Albedo)
img = Image.open(src_image_path).convert('RGB')
# Resize to high-res standard 2048x2048
img = img.resize((2048, 2048), Image.Resampling.LANCZOS)
basecolor_path = os.path.join(target_dir, "TowerClock_WoodFrame_basecolor.png")
img.save(basecolor_path, "PNG")
print(f"Saved: {basecolor_path}")

# Convert to grayscale for height/bump
gray = ImageOps.grayscale(img)
gray_np = np.array(gray, dtype=np.float32) / 255.0

# 2. Height / Displacement Map
# Enhance contrast for deep vertical cracks and wood grain relief
height_np = np.clip((gray_np - 0.2) / 0.8, 0.0, 1.0)
height_img = Image.fromarray((height_np * 255).astype(np.uint8))
height_path = os.path.join(target_dir, "TowerClock_WoodFrame_height.png")
height_img.save(height_path, "PNG")
print(f"Saved: {height_path}")

# 3. Normal Map using Sobel filter
# dx, dy gradients
gx = np.zeros_like(height_np)
gy = np.zeros_like(height_np)

gx[:, 1:-1] = (height_np[:, 2:] - height_np[:, :-2]) * 0.5
gy[1:-1, :] = (height_np[2:, :] - height_np[:-2, :]) * 0.5

strength = 2.5
nx = -gx * strength
ny = -gy * strength
nz = np.ones_like(height_np)

norm = np.sqrt(nx*nx + ny*ny + nz*nz)
nx = (nx / norm * 0.5 + 0.5) * 255.0
ny = (ny / norm * 0.5 + 0.5) * 255.0
nz = (nz / norm * 0.5 + 0.5) * 255.0

normal_np = np.stack([nx, ny, nz], axis=2).astype(np.uint8)
normal_img = Image.fromarray(normal_np, mode='RGB')
normal_path = os.path.join(target_dir, "TowerClock_WoodFrame_normal.png")
normal_img.save(normal_path, "PNG")
print(f"Saved: {normal_path}")

# 4. Roughness Map (Aged rustic wood is mostly rough with smoother highlights on raised grains)
roughness_np = 0.75 + (1.0 - height_np) * 0.20
roughness_np = np.clip(roughness_np * 255.0, 0, 255).astype(np.uint8)
roughness_img = Image.fromarray(roughness_np)
roughness_path = os.path.join(target_dir, "TowerClock_WoodFrame_roughness.png")
roughness_img.save(roughness_path, "PNG")
print(f"Saved: {roughness_path}")

# 5. Ambient Occlusion (AO)
ao_np = np.clip((gray_np ** 1.5) * 255.0, 0, 255).astype(np.uint8)
ao_img = Image.fromarray(ao_np)
ao_img = ao_img.filter(ImageFilter.GaussianBlur(radius=2))
ao_path = os.path.join(target_dir, "TowerClock_WoodFrame_ambientOcclusion.png")
ao_img.save(ao_path, "PNG")
print(f"Saved: {ao_path}")

print("PBR Map generation complete!")
