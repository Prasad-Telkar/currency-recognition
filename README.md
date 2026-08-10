# currency-recognition
An image classification app that identifies Indian, Nepal, Indonesia and Brazil Currency using CNN transfer learning."
# Currency & Coin Recognition

An image classification app that identifies coins and currency notes across three currencies — Indian, Thai, and Euro — using a CNN with transfer learning.

## Overview

This project takes a photo of a coin or note and predicts its denomination using a MobileNetV2-based CNN model, trained via transfer learning. Built as part of an 8-week mentorship program.

## Team

| Member | Role |
|---|---|
| Kunal | Research + Dataset Collection |
| Vinay | Data Preparation + Feature Extraction |
| Anushka | Model Training + Model Improvement |
| Prasad | Interface + Integration + GitHub |

## Features

- Supports Indian, Thai, and Euro currency — both coins and notes
- Upload a photo, get a denomination prediction with confidence score
- Built with transfer learning (MobileNetV2) for good accuracy with limited training data
- Simple web interface (Streamlit), deployed and accessible via a public link

## Tech Stack

- **Language**: Python
- **Model**: TensorFlow / Keras, MobileNetV2 (transfer learning)
- **Training**: Google Colab (GPU)
- **Interface**: Streamlit
- **Version Control**: Git / GitHub

## Project Structure

```
currency-recognition/
├── data/
│   ├── raw/              # raw downloaded images (not tracked in git)
│   └── processed/        # train/val split, ready for training (not tracked in git)
├── models/                # trained model files (not tracked in git if large)
├── prepare_data.py        # organizes and splits raw data
├── train.py                # trains the CNN model
├── predict.py               # CLI script to test predictions on a single image
├── app.py                    # Streamlit web interface
├── requirements.txt
└── README.md
```

## Setup Instructions

1. Clone the repo:
```bash
git clone https://github.com/YOUR_USERNAME/currency-recognition.git
cd currency-recognition
```

2. Create a virtual environment and install dependencies:
```bash
python -m venv venv
source venv/bin/activate      # on Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Download the datasets (see Datasets section below) and place them in `data/raw/` following the folder structure.

4. Prepare the data:
```bash
python prepare_data.py
```

5. Train the model (recommended on Google Colab for free GPU):
```bash
python train.py
```

6. Run the app locally:
```bash
streamlit run app.py
```

## Datasets

| Currency | Type | Source |
|---|---|---|
| Indian | Coins | [Indian Coin Denomination Dataset (ICDD)](https://www.kaggle.com/datasets/lazrus/indian-coin-denomination-dataset-icdd) |
| Indian | Notes | [Indian Currency Note Images Dataset 2020](https://www.kaggle.com/datasets/vishalmane109/indian-currency-note-images-dataset-2020) |
| Thai | Coins + Notes | (add source link here) |
| Euro | Coins + Notes | [Euro coins and bills](https://www.kaggle.com/datasets/davidemartinelli710/euro-coins-and-bills) |

## How It Works

1. Images are organized and split into training/validation sets
2. A pretrained MobileNetV2 model (trained on ImageNet) is fine-tuned on our currency dataset using transfer learning
3. The trained model is loaded into a Streamlit app
4. Users upload a photo, the app preprocesses it and returns the predicted denomination with a confidence score

## Results

*(Fill in once training is complete — e.g. validation accuracy, example predictions, known limitations)*

## Future Improvements

*(Fill in during Week 8 — e.g. support more currencies, improve accuracy on worn/damaged notes, mobile camera support)*
