import os
from PIL import Image, ImageEnhance, ImageFilter
import numpy as np

crop_path = r"C:\Users\avalo\.gemini\antigravity\brain\4c7c3caf-2809-4355-b399-101999dd647b\scratch\crop_top_dome.png"
img = Image.open(crop_path)
print(f"Crop size: {img.size}")

# Analyze colors
arr = np.array(img)
avg_color = arr.mean(axis=(0,1))
print(f"Average RGB: {avg_color}")
