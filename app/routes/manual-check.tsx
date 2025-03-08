import React, { useRef, useState } from "react";
import * as tmImage from "@teachablemachine/image";

interface Prediction {
  className: string;
  probability: number;
}

const  parsePredictions = (predictions: Prediction[]): Prediction[] =>{
  if (predictions.length !== 2) {
    throw new Error("This function expects exactly 2 predictions.");
  }

  // Calculate the first prediction's percentage rounded to two decimals.
  const firstPercentage = parseFloat((predictions[0].probability * 100).toFixed(2));
  // Set the second prediction so that the total is exactly 100%.
  const secondPercentage = parseFloat((100 - firstPercentage).toFixed(2));

  return [
    {
      className: predictions[0].className,
      probability:Number( firstPercentage.toFixed(2)),
    },
    {
      className: predictions[1].className,
      probability: Number(secondPercentage.toFixed(2)),
    },
  ];
}

const ManualCheck = () => {
const modelPath = "/model/";

  const [loading, setLoading] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<Prediction[] | null>(null);
    const imageRef = useRef<HTMLImageElement>(null);
  

  const capturePredict = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/capture");
      if (!response.ok) {
        console.log('Respone: ', response)
        setError("Error capturing image");
      }
      const resData = await response.json();
      setData(`../../captured-images/${resData.imageUrl}`);
      setError(null);
    } catch (error) {
      setError("failed to capture image");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

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
        setData(`../../captured-images/${data.imageUrl}`);
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
        
        console.log('Prediction: ', predictions)
        
        const parsedPrediction = parsePredictions(predictions)
        setPrediction(parsedPrediction)
      } catch (error) {
        console.error("Error predicting image:", error);
      }
    };


  return (
    <div className="relative">
      {loading && (
        <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin absolute left-[50%] top-[50%] transform translate-[-50%, -50%]"></div>
      )}

      {!data && (
        <div className="flex flex-col items-center">
          <button className="mt-50" onClick={capturePredict} disabled={loading ?? false}>
            start
          </button>
        </div>
      )}

      {data && (
        <div className="flex flex-col items-center">
          <img src={data}   ref={imageRef} onLoad={() => {
              console.log("About to run prediction.");
              if (imageRef.current) {
                predictImage(imageRef.current);
              }
              console.log("Done running prediction.");
            }} alt="Captured Image" className="w-full h-128" />
          {prediction ? (
            <div>
              <div className="flex items-center gap-4 mt-4">
                <p>{prediction[0]?.className}:</p>
                <p>{prediction[0]?.probability}</p>
              </div>

              <div className="flex items-center gap-4 mt-4">
                <p>{prediction[1]?.className}:</p>
                <p>{prediction[1]?.probability}</p>
              </div>
            </div>
          ) : (
            <p>Error predicting image</p>
          )}

          <div className="flex flex-col items-center">
            <button onClick={capturePredict} className="mt-4" disabled={loading ?? false}>
              Take another
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManualCheck;
