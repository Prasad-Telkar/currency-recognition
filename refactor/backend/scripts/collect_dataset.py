import os
from bing_image_downloader import downloader # type: ignore

DATASET_DIR = "dataset"
LIMIT_PER_CLASS = 60

# We will collect a few major currencies for the fallback model
CURRENCIES = {
    "USD": "US Dollar banknote",
    "INR": "Indian Rupee banknote",
    "EUR": "Euro banknote",
    "GBP": "British Pound banknote",
    "JPY": "Japanese Yen banknote",
    "CAD": "Canadian Dollar banknote",
    "AUD": "Australian Dollar banknote",
    "CHF": "Swiss Franc banknote",
    "CNY": "Chinese Yuan banknote",
    "SGD": "Singapore Dollar banknote",
    "AED": "UAE Dirham banknote",
    "NPR": "Nepalese Rupee banknote",
    "IDR": "Indonesian Rupiah banknote",
    "BRL": "Brazilian Real banknote",
    "THB": "Thai Baht banknote",
    "PKR": "Pakistani Rupee banknote",
    "BDT": "Bangladeshi Taka banknote",
    "PEN": "Peruvian Sol banknote"
}

def main():
    if not os.path.exists(DATASET_DIR):
        os.makedirs(DATASET_DIR)
        
    print(f"Starting dataset collection for {len(CURRENCIES)} currencies...")
    
    for iso, query in CURRENCIES.items():
        print(f"\n--- Downloading images for {iso} ({query}) ---")
        target_folder = os.path.join(DATASET_DIR, iso)
        
        # Skip if already downloaded
        if os.path.exists(target_folder) and len(os.listdir(target_folder)) >= LIMIT_PER_CLASS * 0.8:
            print(f"Skipping {iso}, already has enough images.")
            continue
            
        downloader.download( 
            query,
            limit=LIMIT_PER_CLASS,
            output_dir=DATASET_DIR,
            adult_filter_off=False,
            force_replace=False,
            timeout=10,
            verbose=False
        )
        
        # Rename the folder to match the ISO code for the training script
        downloaded_folder = os.path.join(DATASET_DIR, query)
        target_folder = os.path.join(DATASET_DIR, iso)
        
        if os.path.exists(downloaded_folder):
            if os.path.exists(target_folder):
                # If target already exists, move files over instead of renaming
                import shutil
                for filename in os.listdir(downloaded_folder):
                    src = os.path.join(downloaded_folder, filename)
                    dst = os.path.join(target_folder, filename)
                    if not os.path.exists(dst):
                        shutil.move(src, dst)
                shutil.rmtree(downloaded_folder)
            else:
                os.rename(downloaded_folder, target_folder)
                
            # Verify images in target_folder to prevent TensorFlow crashes
            from PIL import Image
            for filename in os.listdir(target_folder):
                filepath = os.path.join(target_folder, filename)
                try:
                    with Image.open(filepath) as img:
                        img.verify()
                        # Also check if it can actually be loaded (catches truncated files)
                    with Image.open(filepath) as img:
                        img.load()
                except Exception as e:
                    print(f"Removing corrupted image: {filepath}")
                    os.remove(filepath)
                
    print("\nDataset collection complete!")

if __name__ == "__main__":
    main()
