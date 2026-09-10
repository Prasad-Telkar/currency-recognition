import { useState } from "react";
import { predictCurrency, ApiError } from "../../services/api";
import { getConfidenceLevel } from "../../utils/confidence";
import { CURRENCIES } from "../../data/currencies";

export function useRecognition({ onResult } = {}) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState(null);

  const processFile = (selectedFile) => {
    if (!selectedFile) return;
    if (!selectedFile.type.startsWith("image/")) {
      setError({ code: "INVALID_TYPE", message: "Please select an image file." });
      return;
    }
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null);
    setError(null);
  };

  const handleFileChange = (event) => processFile(event.target.files[0]);

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    processFile(event.dataTransfer.files[0]);
  };

  const removeImage = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  const analyze = async () => {
    if (!file) {
      setError({ code: "NO_IMAGE", message: "Please upload a currency image first." });
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const prediction = await predictCurrency(file);

      // Fill in anything the backend didn't provide (legacy responses,
      // or currencies the backend hasn't been taught the full metadata
      // for yet) from the local currency knowledge base.
      const info = CURRENCIES[prediction.country];
      const merged = {
        ...prediction,
        currencyCode: prediction.currencyCode || info?.code || null,
        currencyName: prediction.currencyName || info?.name || null,
        currencySymbol: prediction.currencySymbol || info?.symbol || null,
        confidenceLevel: prediction.confidenceLevel || getConfidenceLevel(prediction.confidence),
      };

      setResult(merged);
      onResult?.(merged);
    } catch (err) {
      if (err instanceof ApiError) {
        setError({ code: err.code, message: err.message, details: err.details });
      } else {
        setError({ code: "UNKNOWN_ERROR", message: "Something went wrong. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    file, preview, result, loading, dragging, error,
    setDragging, processFile, handleFileChange, handleDrop, removeImage, analyze,
  };
}
