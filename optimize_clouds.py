import os
from PIL import Image

directory = r'app-v1/public/images'
target_width = 1080

files = [f for f in os.listdir(directory) if f.startswith('cloud-hero') and f.endswith('.png')]

print(f"Found {len(files)} cloud images to process.")

for filename in files:
    filepath = os.path.join(directory, filename)
    
    try:
        img = Image.open(filepath)
        
        # Calculate new height maintaining aspect ratio
        w_percent = (target_width / float(img.size[0]))
        
        # Only resize if image is larger than target
        if w_percent < 1:
            h_size = int((float(img.size[1]) * float(w_percent)))
            img = img.resize((target_width, h_size), Image.Resampling.LANCZOS)
            print(f"Resized {filename} to {target_width}x{h_size}")
        else:
            print(f"Skipped resizing {filename} (already smaller than target)")

        # Save as WebP
        new_filename = filename.replace('.png', '.webp')
        new_filepath = os.path.join(directory, new_filename)
        
        img.save(new_filepath, 'webp', quality=80, method=4)
        
        # Stats
        old_size = os.path.getsize(filepath) / 1024
        new_size = os.path.getsize(new_filepath) / 1024
        print(f"  Converted: {old_size:.2f}KB -> {new_size:.2f}KB")
        
        img.close()
        
        # Remove original
        os.remove(filepath)
        
    except Exception as e:
        print(f"Error processing {filename}: {e}")

print("Optimization and resizing complete.")