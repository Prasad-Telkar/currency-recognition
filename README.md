# Currency Recognition

An image classification app that identifies currency notes across four countries — India, Nepal, Indonesia, and Brazil — using a CNN with transfer learning.

## Overview

This project takes a photo of a currency note and predicts its denomination and country of origin using a MobileNetV2-based CNN model, trained via transfer learning. Built as part of an 8-week mentorship program, backed by a literature review of prior classical image-processing and deep-learning approaches to currency recognition.

## Team

| Member | Role |
|---|---|
| Kunal | Research + Dataset Collection |
| Vinay | Data Preparation + Feature Extraction |
| Anushka | Model Training + Model Improvement |
| Prasad | Interface + Integration + GitHub |

## Features

- Supports Indian, Nepali, Indonesian, and Brazilian currency notes
- Upload a photo, get a denomination + currency prediction with confidence score
- Built with transfer learning (MobileNetV2) for good accuracy with limited training data
- Simple web interface (Streamlit), deployed and accessible via a public link
- Design choices grounded in a literature review of classical and CNN-based currency recognition research

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
│   │   ├── india_notes/
│   │   ├── nepal_notes/
│   │   ├── indonesia_notes/
│   │   └── brazil_notes/
│   └── processed/        # train/val split, ready for training (not tracked in git)
├── models/                # trained model files (not tracked in git if large)
├── prepare_data.py        # organizes and splits raw data
├── train.py                # trains the CNN model
├── predict.py               # CLI script to test predictions on a single image
├── app.py                    # Streamlit web interface
├── requirements.txt
├── literature_review.pdf   # research basis for the project's approach
└── README.md
```

## Setup Instructions

1. Clone the repo:
```bash
git clone https://github.com/Prasad-Telkar/currency-recognition.git
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

| Country | Type | Source |
|---|---|---|
| India | Notes | [kaggle.com/datasets/shwetadalal/currency](https://www.kaggle.com/datasets/shwetadalal/currency) |
| Nepal | Notes | [kaggle.com/datasets/sushantkumarsingh123/currency](https://www.kaggle.com/datasets/sushantkumarsingh123/currency) |
| Indonesia | Notes | [kaggle.com/datasets/najmaaaaaaaaa/currencyhp/data](https://www.kaggle.com/datasets/najmaaaaaaaaa/currencyhp/data) |
| Brazil | Notes | via [kagglehub](https://github.com/Kaggle/kagglehub) |

## Research Basis

Project design choices (MobileNetV2 + transfer learning, over classical hand-crafted features) are grounded in a literature review of prior currency/coin recognition work — see `literature_review.pdf`. Key finding: transfer learning on lightweight CNN backbones (MobileNet family) consistently outperforms classical image-processing methods and scales well to free-tier GPU training (Colab) with modest, self-collected datasets. Multi-currency note classification (vs. single-currency systems dominant in prior work) is identified as the project's key research gap contribution.

## How It Works

1. Images are organized and split into training/validation sets
2. A pretrained MobileNetV2 model (trained on ImageNet) is fine-tuned on our currency dataset using transfer learning
3. The trained model is loaded into a Streamlit app
4. Users upload a photo, the app preprocesses it and returns the predicted denomination with a confidence score

## Results

*(Fill in once training is complete — e.g. validation accuracy, example predictions, known limitations)*

## Future Improvements

*(Fill in during Week 8 — e.g. support more currencies, improve accuracy on worn/damaged notes, mobile camera support)*

