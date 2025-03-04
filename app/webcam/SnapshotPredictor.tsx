import React, { useRef, useState, useEffect } from "react";
import * as tmImage from "@teachablemachine/image";

interface Prediction {
  className: string;
  probability: number;
}

const SnapshotPredictor: React.FC = () => {
  const webcamContainerRef = useRef<HTMLDivElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Change this path if your model files are in a different directory.
  const modelPath = "/model/";

  // Load the Teachable Machine model on component mount.
  useEffect(() => {
    const loadModel = async () => {
      try {
        const modelURL = `${modelPath}model.json`;
        const metadataURL = `${modelPath}metadata.json`;
        const loadedModel = await tmImage.load(modelURL, metadataURL);
        setModel(loadedModel);
      } catch (error) {
        console.error("Error loading model:", error);
      }
    };

    loadModel();
  }, []);

  // This function turns on the camera, takes a snapshot, predicts it, displays results, and then stops the camera.
  const captureAndPredict = async () => {
    if (!model) {
      console.error("Model not loaded.");
      return;
    }
    setLoading(true);

    // Create a new webcam instance with desired width, height, and flip option.
    const flip = true;
    const width = 200;
    const height = 200;
    const webcam = new tmImage.Webcam(width, height, flip);

    try {
      await webcam.setup();
    } catch (error) {
      console.error("Error setting up webcam:", error);
      setLoading(false);
      return;
    }

    // Attach the webcam's canvas element to the container.
    if (webcamContainerRef.current) {
      webcamContainerRef.current.innerHTML = ""; // Clear previous content
      webcamContainerRef.current.appendChild(webcam.canvas);
    }

    await webcam.play();

    // Ensure a frame is ready.
    webcam.update();

    // Run prediction on the current frame from the canvas.
    try {
      const predictions: Prediction[] = await model.predict(webcam.canvas);
      if (resultsContainerRef.current) {
        resultsContainerRef.current.innerHTML = "";
        predictions.forEach((pred) => {
          const p = document.createElement("p");
          p.textContent = `${pred.className}: ${pred.probability.toFixed(2)}`;
          resultsContainerRef.current?.appendChild(p);
        });
      }
    } catch (error) {
      console.error("Error predicting image:", error);
    }

    // Stop the webcam and remove its canvas.
    webcam.stop();
    // if (webcamContainerRef.current) {
    //   webcamContainerRef.current.innerHTML = "";
    // }
    setLoading(false);
  };

  return (
    <div>
      <h2>Snapshot Predictor</h2>
      <button onClick={captureAndPredict} disabled={loading || !model}>
        {loading ? "Processing..." : "Capture and Predict"}
      </button>
      <div ref={webcamContainerRef} style={{ marginTop: "10px" }} />
      <div ref={resultsContainerRef} style={{ marginTop: "10px" }} />
    </div>
  );
};

export default SnapshotPredictor;
