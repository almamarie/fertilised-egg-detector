import React, { useState } from "react";

type Prediction = {
  class: string;
  confidence: string;
};
const ManualCheck = () => {
  const [loading, setLoading] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<string | null>("/test-image.jpg");
  const [prediction, setPrediction] = useState<Prediction | null>({
    class: "dog",
    confidence: "90%",
  });

  const tcapturePredict = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/capture");
      const resData = await response.json();
      setData(resData.message);
      setError(null);
    } catch (error) {
      setError("failed to schedule auto capture");
      setData(null);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="relative">
      {loading && (
        <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin absolute left-[50%] top-[50%] transform translate-[-50%, -50%]"></div>
      )}

      {!data && (
        <div className="flex flex-col items-center">
          <button className="mt-50" disabled={loading ?? false}>
            start
          </button>
        </div>
      )}

      {data && (
        <div className="flex flex-col items-center">
          <img src={data} alt="Captured Image" className="w-full h-128" />
          {prediction ? (
            <div className="flex items-center gap-4 mt-4">
              <p>{prediction?.class}:</p>
              <p>{prediction?.confidence}</p>
            </div>
          ) : (
            <p>Error predicting image</p>
          )}

          <div className="flex flex-col items-center">
            <button className="mt-4" disabled={loading ?? false}>
              Take another
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManualCheck;
