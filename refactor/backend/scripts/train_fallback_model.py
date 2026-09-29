"""
CurrencyAI Offline Fallback Model Training Script
=================================================

This script uses Transfer Learning with MobileNetV2 to train a highly accurate,
lightweight offline model that can be used when the Gemini API is unreachable.

PREREQUISITES:
1. Create a `dataset/` directory in the same folder as this script.
2. Inside `dataset/`, create a folder for each currency you want to recognize.
   The folder name should be the ISO code (e.g., USD, INR, EUR).
3. Place at least 50-100 images of that currency inside its respective folder.
   
Example structure:
scripts/
  ├── train_fallback_model.py
  └── dataset/
      ├── USD/
      │   ├── 1.jpg
      │   ├── 2.jpg
      ├── INR/
      │   ├── 1.jpg
      │   └── 2.jpg

4. Run this script: `python train_fallback_model.py`
"""

import os
import json
import tensorflow as tf
from tensorflow.keras.preprocessing import image_dataset_from_directory # type: ignore
from tensorflow.keras.applications import MobileNetV2 # type: ignore
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout # type: ignore
from tensorflow.keras.models import Model # type: ignore

# Configuration
DATASET_DIR = "dataset"
BATCH_SIZE = 32
IMG_SIZE = (224, 224)
EPOCHS = 10
MODEL_SAVE_PATH = "../models/fallback_model.keras"
CLASS_NAMES_PATH = "../models/class_names.json"

def main():
    if not os.path.exists(DATASET_DIR):
        print(f"Error: '{DATASET_DIR}' directory not found.")
        print("Please create it and add subfolders for each currency (e.g., dataset/USD/).")
        return

    print("Loading dataset...")
    # Load training dataset with 80/20 split
    train_dataset = image_dataset_from_directory(
        DATASET_DIR,
        validation_split=0.2,
        subset="training",
        seed=123,
        image_size=IMG_SIZE,
        batch_size=BATCH_SIZE
    )

    val_dataset = image_dataset_from_directory(
        DATASET_DIR,
        validation_split=0.2,
        subset="validation",
        seed=123,
        image_size=IMG_SIZE,
        batch_size=BATCH_SIZE
    )

    class_names = train_dataset.class_names
    print(f"Found {len(class_names)} classes: {class_names}")

    # Save class names for the inference service to use
    os.makedirs(os.path.dirname(MODEL_SAVE_PATH), exist_ok=True)
    with open(CLASS_NAMES_PATH, "w") as f:
        json.dump(class_names, f)

    # Configure dataset for performance
    AUTOTUNE = tf.data.AUTOTUNE
    train_dataset = train_dataset.prefetch(buffer_size=AUTOTUNE)
    val_dataset = val_dataset.prefetch(buffer_size=AUTOTUNE)

    # Load MobileNetV2 base model (pre-trained on ImageNet)
    print("Building model architecture...")
    base_model = MobileNetV2(input_shape=IMG_SIZE + (3,), include_top=False, weights='imagenet')
    
    # Freeze the base model
    base_model.trainable = False

    # Add custom classification head
    inputs = tf.keras.Input(shape=IMG_SIZE + (3,))
    # MobileNetV2 expects inputs in [-1, 1], so we normalize [0, 255] -> [-1, 1]
    x = tf.keras.layers.Rescaling(1./127.5, offset=-1)(inputs)
    x = base_model(x, training=False)
    x = GlobalAveragePooling2D()(x)
    x = Dropout(0.2)(x)
    outputs = Dense(len(class_names), activation='softmax')(x)

    model = Model(inputs, outputs)

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
        loss=tf.keras.losses.SparseCategoricalCrossentropy(),
        metrics=['accuracy']
    )

    print("Starting training...")
    model.fit(
        train_dataset,
        validation_data=val_dataset,
        epochs=EPOCHS
    )

    # Save the model
    model.save(MODEL_SAVE_PATH)
    print(f"\nTraining complete! Model saved to {MODEL_SAVE_PATH}")
    print(f"Class names saved to {CLASS_NAMES_PATH}")
    print("The backend will automatically detect and use this model when the Gemini API is down.")

if __name__ == "__main__":
    main()
