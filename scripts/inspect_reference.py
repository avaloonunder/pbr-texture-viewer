import os
from PIL import Image

src_image_path = r"C:\Users\avalo\.gemini\antigravity\brain\4c7c3caf-2809-4355-b399-101999dd647b\.user_uploaded\media_1787170300270.png"
out_dir = r"C:\Users\avalo\.gemini\antigravity\brain\4c7c3caf-2809-4355-b399-101999dd647b\scratch"
os.makedirs(out_dir, exist_ok=True)

img = Image.open(src_image_path)
w, h = img.size
print(f"Original Image Size: {w}x{h}")

# The dome is at the top center of the tower
# Let's crop the top dome area
dome_box = (int(w * 0.44), int(h * 0.08), int(w * 0.56), int(h * 0.30))
dome_crop = img.crop(dome_box)
dome_crop.save(os.path.join(out_dir, "crop_top_dome.png"))
print("Saved crop_top_dome.png")

# Also crop the wooden frame
wood_box = (int(w * 0.46), int(h * 0.25), int(w * 0.54), int(h * 0.45))
wood_crop = img.crop(wood_box)
wood_crop.save(os.path.join(out_dir, "crop_wood_frame.png"))
print("Saved crop_wood_frame.png")
