import os
import cv2
import numpy as np
import base64
from flask import Blueprint, request, jsonify

counterfeit_bp = Blueprint('counterfeit', __name__)

@counterfeit_bp.route('/check', methods=['POST'])
def counterfeit_check():
    """
    Takes an image (multipart form data) or base64,
    applies a Laplacian variance filter to highlight microprinting/edges,
    applies a heatmap colormap, and returns the resulting image as base64.
    """
    try:
        # Check if we received an image file
        if 'image' not in request.files:
            return jsonify({'error': 'No image part in request'}), 400
            
        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No selected image'}), 400

        # Read image to numpy array
        npimg = np.frombuffer(file.read(), np.uint8)
        img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

        if img is None:
            return jsonify({'error': 'Invalid image format'}), 400

        # Convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # Apply Laplacian to find edges (high frequencies)
        laplacian = cv2.Laplacian(gray, cv2.CV_64F)
        
        # Take absolute value and convert back to 8-bit
        abs_laplacian = cv2.convertScaleAbs(laplacian)

        # Apply a colormap (e.g., JET or HOT) to create a heatmap of the variance
        heatmap = cv2.applyColorMap(abs_laplacian, cv2.COLORMAP_JET)

        # Blend the original image with the heatmap for context
        # Convert original to grayscale then to BGR so we can blend it
        gray_bgr = cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)
        blended = cv2.addWeighted(gray_bgr, 0.4, heatmap, 0.6, 0)

        # Encode back to JPEG
        _, buffer = cv2.imencode('.jpg', blended)
        encoded_img = base64.b64encode(buffer).decode('utf-8')

        return jsonify({
            'heatmap': f'data:image/jpeg;base64,{encoded_img}',
            'status': 'success'
        }), 200

    except Exception as e:
        print(f"Counterfeit check error: {e}")
        return jsonify({'error': str(e)}), 500
