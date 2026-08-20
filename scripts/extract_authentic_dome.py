import os
from PIL import Image, ImageEnhance, ImageFilter, ImageOps
import numpy as np

src_image_path = r"C:\Users\avalo\.gemini\antigravity\brain\4c7c3caf-2809-4355-b399-101999dd647b\.user_uploaded/media_1787170300270.png"
target_dir = r"d:\projects\Sandbox\assets\textures"

img = Image.open(src_image_path)
w, h = img.size

# Extract the dome stone texture area directly from the reference image
# Dome area: x: 455..565, y: 70..190
dome_crop = img.crop((int(w * 0.45), int(h * 0.11), int(w * 0.55), int(h * 0.25)))

# Extract window area (clock/window on dome)
# Window is on the upper right of the dome
window_crop = img.crop((int(w * 0.45), int(h * 0.08), int(w * 0.55), int(h * 0.25)))

def make_seamless_tile(pil_img, output_size=2048):
    # Resize to target
    img_large = pil_img.resize((output_size, output_size), Image.Resampling.LANCZOS)
    arr = np.array(img_large, dtype=np.float32)
    
    # Mirror tiling blend to make 100% seamless
    h, w, c = arr.shape
    half_h, half_w = h // 2, w // 2
    
    # 2x2 tile
    tile = np.vstack([
        np.hstack([arr, np.fliplr(arr)]),
        np.hstack([np.flipud(arr), np.flipud(np.fliplr(arr))])
    ])
    
    # Center crop back to 2048x2048
    seamless_arr = tile[half_h:half_h+h, half_w:half_w+w]
    return Image.fromarray(np.uint8(seamless_arr))

# Process Authentic No-Window
seamless_no_window = make_seamless_tile(dome_crop, 2048)

# Enhance contrast & warmth to match original lighting perfectly
enhancer = ImageEnhance.Contrast(seamless_no_window)
seamless_no_window = enhancer.enhance(1.35)

enhancer_color = ImageEnhance.Color(seamless_no_window)
seamless_no_window = enhancer_color.enhance(1.1)

# Save Authentic Base Color
authentic_nowindow_path = os.path.join(target_dir, "TowerClock_DomeBricks_Authentic_basecolor.png")
seamless_no_window.save(authentic_nowindow_path, "PNG")
print(f"Saved: {authentic_nowindow_path}")

# Process Authentic With Window
seamless_window = make_seamless_tile(window_crop, 2048)
seamless_window = ImageEnhance.Contrast(seamless_window).enhance(1.35)
seamless_window = ImageEnhance.Color(seamless_window).enhance(1.1)

authentic_window_path = os.path.join(target_dir, "TowerClock_DomeBricks_Window_Authentic_basecolor.png")
seamless_window.save(authentic_window_path, "PNG")
print(f"Saved: {authentic_window_path}")

# Generate PBR maps for both
def generate_pbr_maps(base_img_path, prefix):
    b_img = Image.open(base_img_path).convert('RGB')
    gray = ImageOps.grayscale(b_img)
    gray_np = np.array(gray, dtype=np.float32) / 255.0
    
    # Height
    height_np = np.clip((gray_np - 0.1) / 0.9, 0.0, 1.0)
    height_img = Image.fromarray((height_np * 255).astype(np.uint8))
    height_path = os.path.join(target_dir, f"{prefix}_height.png")
    height_img.save(height_path, "PNG")
    
    # Normal
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
    Image.fromarray(normal_np, mode='RGB').save(os.path.join(target_dir, f"{prefix}_normal.png"), "PNG")
    
    # Roughness
    roughness_np = np.clip((0.85 + (1.0 - height_np) * 0.15) * 255.0, 0, 255).astype(np.uint8)
    Image.fromarray(roughness_np).save(os.path.join(target_dir, f"{prefix}_roughness.png"), "PNG")
    
    # AO
    ao_np = np.clip((gray_np ** 1.5) * 255.0, 0, 255).astype(np.uint8)
    Image.fromarray(ao_np).filter(ImageFilter.GaussianBlur(radius=2)).save(os.path.join(target_dir, f"{prefix}_ambientOcclusion.png"), "PNG")

generate_pbr_maps(authentic_nowindow_path, "TowerClock_DomeBricks_Authentic")
generate_pbr_maps(authentic_window_path, "TowerClock_DomeBricks_Window_Authentic")

print("Authentic reference textures extracted & PBR maps generated successfully!")
