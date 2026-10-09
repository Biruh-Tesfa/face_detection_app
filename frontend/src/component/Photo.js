import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";

function Photo({ imageURL, triggerDetect,setImageDisplayed,setDetectionStatus,setDetectionError }) {
  const imgRef = useRef(null);
  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + '/models';
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        setModelsLoaded(true);
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };
    loadModels();
  }, []);
useEffect(() => {
  setBoxes([]);
}, [imageURL]);
  useEffect(() => {
    const detectFaces = async () => {
      if (modelsLoaded && imgRef.current && imageURL && triggerDetect) {
        setBoxes([]);
        setLoading(true);
        setDetectionStatus("detecting");
        try {
          const detections = await faceapi.detectAllFaces(
            imgRef.current,
            new faceapi.TinyFaceDetectorOptions({ 
              inputSize: 608,       // Increases resolution to find smaller/distant faces (default is 416)
              scoreThreshold: 0.3   // Lowers the strictness so it accepts less obvious faces (default is 0.5)
            })
          );

          const imgWidth = imgRef.current.width;
          const imgHeight = imgRef.current.height;
          const naturalWidth = imgRef.current.naturalWidth;
          const naturalHeight = imgRef.current.naturalHeight;

          const scaledBoxes = detections.map(det => {
            const box = det.box;
            return {
              left: (box.x / naturalWidth) * imgWidth,
              top: (box.y / naturalHeight) * imgHeight,
              width: (box.width / naturalWidth) * imgWidth,
              height: (box.height / naturalHeight) * imgHeight,
            };
          });

          setBoxes(scaledBoxes);
          setDetectionStatus("detected");
        } catch (err) {
          console.error("Detection error:", err);
          setBoxes([]);
          setDetectionError("Face detection failed. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    };

    detectFaces();
  }, [imageURL, modelsLoaded, triggerDetect, setDetectionStatus,setDetectionError]);

  return (
    <div className="tc mt2">
      <div className="image-container" style={{ position: "relative" }}>
        {imageURL && (
           <img
            ref={imgRef}
            src={imageURL}
            alt="Target"
            crossOrigin="anonymous"
            onLoad={() => setImageDisplayed(true)}   //  triggers when image loads
          />
        )}
        {boxes.map((box, i) => (
          <div
            key={i}
            className="bounding-box"
            style={{
              position: "absolute",
              border: "2px solid #00ff00",
              top: box.top + "px",
              left: box.left + "px",
              width: box.width + "px",
              height: box.height + "px",
              pointerEvents: "none",
            }}
          />
        ))}
      </div>
      {loading && <p>Detecting faces...</p>}
      {!loading && triggerDetect && boxes.length > 0 && <p>Detected {boxes.length} face(s)</p>}
    </div>

  );

}

export default Photo;
