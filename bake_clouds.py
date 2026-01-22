import os
from PIL import Image, ImageEnhance, ImageOps

directory = r'app-v1/public/images'
files = [f for f in os.listdir(directory) if f.startswith('cloud-hero') and f.endswith('.webp')]

print(f"Found {len(files)} cloud images to bake filters.")

for filename in files:
    filepath = os.path.join(directory, filename)
    
    try:
        # Open image
        img = Image.open(filepath).convert("RGBA")
        
        # 1. Grayscale
        # Create a grayscale version but keep alpha
        r, g, b, a = img.split()
        img_gray = ImageOps.grayscale(img)
        img_gray = img_gray.convert("RGB")
        
        # 2. Contrast (1.2)
        enhancer = ImageEnhance.Contrast(img_gray)
        img_gray = enhancer.enhance(1.2)
        
        # 3. Brightness (3.8)
        enhancer = ImageEnhance.Brightness(img_gray)
        img_gray = enhancer.enhance(3.8)
        
        # Re-combine with original Alpha channel
        r_new, g_new, b_new = img_gray.split()
        final_img = Image.merge("RGBA", (r_new, g_new, b_new, a))
        
        # Save overwrite
        final_img.save(filepath, 'webp', quality=85, method=4)
        
        print(f"Baked filters into: {filename}")
        
    except Exception as e:
        print(f"Error processing {filename}: {e}")

print("Filter baking complete.")
