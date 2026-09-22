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
    "JPY": "Japanese Yen banknote"
}

def main():
    if not os.path.exists(DATASET_DIR):
        os.makedirs(DATASET_DIR)
        
    print(f"Starting dataset collection for {len(CURRENCIES)} currencies...")
    
    for iso, query in CURRENCIES.items():
        print(f"\n--- Downloading images for {iso} ({query}) ---")
        # Bing image downloader automatically creates the query folder inside output_dir
        # We will rename it to the ISO code
        
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
                
    print("\nDataset collection complete!")

if __name__ == "__main__":
    main()
