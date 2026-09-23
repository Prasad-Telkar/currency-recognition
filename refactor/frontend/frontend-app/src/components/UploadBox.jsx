import { useTranslation } from "react-i18next";
import { Upload, Camera, X, Sparkles, Image as ImageIcon, ScanLine } from "lucide-react";
import { useState, useRef } from "react";

export default function UploadBox({ recognition, onPredict, fileInputRef, cameraInputRef }) {
  const { t } = useTranslation();
  const { file, preview, loading, dragging, error, setDragging, handleFileChange, handleDrop, removeImage } = recognition;

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  
  const { result } = recognition;

  const startCamera = async () => {
    // Fallback for mobile devices on local networks (HTTP) where WebRTC is blocked
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      if (cameraInputRef && cameraInputRef.current) {
        cameraInputRef.current.click();
      } else {
        alert("Camera API is not supported in this environment (requires HTTPS).");
      }
      return;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      setStream(mediaStream);
      setIsCameraOpen(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 100);
    } catch (err) {
      console.error("Camera access denied or unavailable", err);
      // Fallback if permission is denied but we have the native input
      if (cameraInputRef && cameraInputRef.current) {
        cameraInputRef.current.click();
      } else {
        alert("Could not access the camera. Please check your browser permissions.");
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const capturedFile = new File([blob], "camera_capture.jpg", { type: "image/jpeg" });
          handleFileChange({ target: { files: [capturedFile] } });
          stopCamera();
        }
      }, "image/jpeg", 0.9);
    }
  };

  return (
    <section className="recognizer-section">
      <div className="section-heading">
        <span><ScanLine size={20} /></span>
        <div>
          <h2>{t("recognizer.title")}</h2>
          <p>{t("recognizer.subtitle")}</p>
        </div>
      </div>

      <div
        className={`upload-box glass-panel ${dragging ? "dragging" : ""} ${preview ? "has-preview" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        {!preview ? (
          <>
            <div className="upload-icon"><ImageIcon size={32} /></div>
            <h3>{t("recognizer.dropTitle")}</h3>
            <p>{t("recognizer.dropSubtitle")}</p>

            <div className="upload-actions">
              <button className="primary-button" onClick={() => fileInputRef.current.click()}>
                <Upload size={16} />
                {t("recognizer.chooseImage")}
              </button>
              <button className="secondary-button" onClick={startCamera}>
                <Camera size={16} />
                {t("recognizer.camera")}
              </button>
            </div>

            <small>{t("recognizer.hint")}</small>
          </>
        ) : (
          <div className="preview-area" style={{ position: 'relative' }}>
            {loading && <div className="ai-scanning-line" />}
            <img src={preview} alt="Currency preview" />

            <div className="preview-info">
              <span>Selected image</span>
              <strong>{file?.name}</strong>
              <button className="remove-button" onClick={removeImage}>
                <X size={14} />
                {t("recognizer.remove")}
              </button>
            </div>
          </div>
        )}

        {/* Hidden inputs */}
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} hidden />
        <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileChange} hidden />
      </div>

      {isCameraOpen && (
        <div className="camera-overlay">
          <div className="camera-modal">
            <div className="camera-header">
              <h3>Take a Photo</h3>
              <button onClick={stopCamera} className="close-btn"><X size={20} /></button>
            </div>
            <div className="camera-view" style={{ position: 'relative' }}>
              <video ref={videoRef} autoPlay playsInline></video>
              
              {/* AR Overlay on live video feed */}
              {result && (
                <div className="ar-overlay" style={{
                  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                  background: 'rgba(0,0,0,0.6)', padding: '10px 20px', borderRadius: '10px',
                  color: '#22d3ee', fontSize: '32px', fontWeight: 'bold', border: '2px solid #22d3ee',
                  boxShadow: '0 0 20px rgba(34, 211, 238, 0.8)', backdropFilter: 'blur(4px)',
                  animation: 'pulse 1.5s infinite', zIndex: 10
                }}>
                  {result.denomination} {result.currencyCode}
                </div>
              )}
            </div>
            <div className="camera-actions">
              <button className="capture-button" onClick={captureImage} title="Capture">
                <Camera size={24} />
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="upload-error">
          {error.message}
        </div>
      )}

      {file && (
        <button className="predict-button" onClick={onPredict} disabled={loading}>
          {loading ? (
            <>
              <span className="spinner" />
              {t("recognizer.analyzing")}
            </>
          ) : (
            <>
              <Sparkles size={17} />
              {t("recognizer.recognize")}
            </>
          )}
        </button>
      )}
    </section>
  );
}
