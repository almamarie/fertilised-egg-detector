import React, { useState, useRef } from "react";
import * as tmImage from "@teachablemachine/image";

interface Prediction {
  className: string;
  probability: number;
}

// Path to your Teachable Machine model assets (adjust as needed)
const modelPath = "/model/";

const CaptureImageComponent: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string>("");
  // const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);
  // const [maxPredictions, setMaxPredictions] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const imageRef = useRef<HTMLImageElement>(null);

  // This function calls your backend API that uses the captureImage function.
  const handleCaptureImage = async () => {
    setLoading(true);
    try {
      // Call your backend capture endpoint.
      const response = await fetch("http://localhost:3000/capture");
      if (!response.ok) {
        console.log('Respone: ', response)
        throw new Error("Error capturing image");
      }
      const data = await response.json();
      // Assume data.imageUrl contains the relative URL to the captured image.
      // For example: { imageUrl: "/images/captured_20250306_143512.jpg" }
      console.log('parsed data: ', data)
      setImageSrc(`../../captured-images/${data.imageUrl}`);
    } catch (error) {
      console.error("Error capturing image:", error);
    }
    setLoading(false);
  };

  // Function to run prediction on a given image element.
  const predictImage = async (imgElement: HTMLImageElement): Promise<void> => {
    try {
      // If the model isn’t loaded yet, load it.
      
        const modelURL = `${modelPath}model.json`;
        const metadataURL = `${modelPath}metadata.json`;
        const model  = await tmImage.load(modelURL, metadataURL);
        console.log('Model: ', model)
        const maxPredictions = model.getTotalClasses();
      
      if (!model && imageRef.current) {
        // Re-check if model is loaded.
        console.error("Model not loaded.");
        return;
      }
      // Run prediction on the provided image element.
      const predictions: Prediction[] = await (model as tmImage.CustomMobileNet).predict(imgElement);
      
      // Display the prediction results in the dedicated container.
      const predictionContainer = document.getElementById("img-prediction-container");
      if (predictionContainer) {
        predictionContainer.innerHTML = "";
        predictions.forEach((pred) => {
          const div = document.createElement("div");
          div.textContent = `${pred.className}: ${pred.probability.toFixed(2)}`;
          predictionContainer.appendChild(div);
        });
      }
    } catch (error) {
      console.error("Error predicting image:", error);
    }
  };

  const scheduleImage = async ()=>{
    const response = await fetch('http://localhost:3000/schedule-auto-capture')
    const data = await response.json();
    console.log('Data: ', data);
  }

  return (
    <div>
      <h4>Predict an Image</h4>
      <button onClick={handleCaptureImage} disabled={loading}>
        {loading ? "Capturing..." : "Capture Image"}
      </button>
      {imageSrc && (
        <div>
          <img
            ref={imageRef}
            src={imageSrc}
            alt="Captured"
            style={{ maxWidth: "300px", marginTop: "10px" }}
            onLoad={() => {
              console.log("About to run prediction.");
              if (imageRef.current) {
                predictImage(imageRef.current);
              }
              console.log("Done running prediction.");
            }}
          />
          <div id="img-prediction-container" style={{ marginTop: "10px" }} />
        </div>
      )}

      <button onClick={scheduleImage}>New Eggs</button>
    </div>
  );
};

export default CaptureImageComponent;
