import React, { useRef, useState } from "react";
import * as tmImage from "@teachablemachine/image";
import SnapshotPredictor from "./SnapshotPredictor";

interface Prediction {
  className: string;
  probability: number;
}

const TeachableMachineLocal = () => {
  const webcamContainerRef = useRef<HTMLDivElement>(null);
  const labelContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef(null);

  const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);
  const [webcam, setWebcam] = useState<tmImage.Webcam | null>(null);
  const [maxPredictions, setMaxPredictions] = useState<number>(0);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const modelPath = "/model/"; // Change this path if necessary

  const predictWebcam = async () => {
    try {
      // Load the model from the local folder inside public/
      const modelURL = `${modelPath}model.json`;
      const metadataURL = `${modelPath}metadata.json`;

      const loadedModel = await tmImage.load(modelURL, metadataURL);
      setModel(loadedModel);
      setMaxPredictions(loadedModel.getTotalClasses());
      console.log("model: ", loadedModel);

      // Setup webcam parameters
      const flip = true; // Flip for mirror effect
      const width = 200;
      const height = 200;
      const newWebcam = new tmImage.Webcam(width, height, flip);
      await newWebcam.setup(); // Request access to the webcam

      // Attach webcam canvas to the container
      if (webcamContainerRef.current) {
        webcamContainerRef.current.innerHTML = ""; // Clear any existing content
        webcamContainerRef.current.appendChild(newWebcam.canvas);
      }

      setWebcam(newWebcam);

      // Create label elements for each class
      if (labelContainerRef.current) {
        labelContainerRef.current.innerHTML = ""; // Clear any existing labels
        for (let i = 0; i < loadedModel.getTotalClasses(); i++) {
          const div = document.createElement("div");
          labelContainerRef.current.appendChild(div);
        }
      }

      newWebcam.play();
      window.requestAnimationFrame(() => loop(newWebcam, loadedModel));
    } catch (error) {
      console.error("Error initializing Teachable Machine model:", error);
    }
  };

  const loop = async (
    webcam: tmImage.Webcam,
    model: tmImage.CustomMobileNet
  ) => {
    webcam.update();
    await predict(webcam, model);
    // window.requestAnimationFrame(() => loop(webcam, model));
  };

  const predict = async (
    webcam: tmImage.Webcam,
    model: tmImage.CustomMobileNet
  ) => {
    if (!labelContainerRef.current) return;

    const prediction = await model.predict(webcam.canvas);
    console.log("Predicted: ", prediction);
    const labels = labelContainerRef.current.childNodes;

    for (let i = 0; i < maxPredictions; i++) {
      labels[i].textContent = `${prediction[i].className}: ${prediction[
        i
      ].probability.toFixed(2)}`;
    }
  };

  // Function to predict an image
  const predictImage = async (imgElement: HTMLImageElement): Promise<void> => {
    const modelURL = `${modelPath}model.json`;
    const metadataURL = `${modelPath}metadata.json`;

    const loadedModel = await tmImage.load(modelURL, metadataURL);
    setModel(loadedModel);
    setMaxPredictions(loadedModel.getTotalClasses());
    console.log("model: ", loadedModel);

    try {
      const prediction: Prediction[] = await loadedModel.predict(imgElement);
      // Display the prediction results in the dedicated container
      const imgPredictionContainer = document.getElementById(
        "img-prediction-container"
      );
      if (imgPredictionContainer) {
        imgPredictionContainer.innerHTML = "";
        prediction.forEach((pred) => {
          const div = document.createElement("div");
          div.textContent = `${pred.className}: ${pred.probability.toFixed(2)}`;
          imgPredictionContainer.appendChild(div);
        });
      }
    } catch (error) {
      console.error("Error predicting image:", error);
    }
  };

  // Function to handle image file uploads
  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const file = event.target.files?.[0];
    if (file) {
      // Convert the file into a data URL so it can be rendered
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (result && typeof result === "string") {
          setImageSrc(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <h3>Teachable Machine Local Model</h3>
      <button onClick={predictWebcam}>Start</button>
      <div ref={webcamContainerRef} />
      <div ref={labelContainerRef}>here</div>

      {/* Section for image prediction */}
      <h4>Predict an Image</h4>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {/* Render the uploaded image */}
      {imageSrc && (
        <div>
          <img
            ref={imageRef}
            src={imageSrc}
            alt="Uploaded"
            style={{ maxWidth: "300px", marginTop: "10px" }}
            onLoad={() => {
              // When image loads, run prediction on it
              console.log("About ti run prediction.");
              if (imageRef.current) {
                predictImage(imageRef.current);
              }
              console.log("Done running prediction.");
            }}
          />
          <div id="img-prediction-container" style={{ marginTop: "10px" }} />
        </div>
      )}

      <SnapshotPredictor />
    </div>
  );
};

export default TeachableMachineLocal;

// import React, { useRef, useState } from "react";
// import * as tmImage from "@teachablemachine/image";

// interface Prediction {
//   className: string;
//   probability: number;
// }

// const TeachableMachineLocal = () => {
//   let loadedModel: any;

//   const webcamContainerRef = useRef<HTMLDivElement>(null);
//   const labelContainerRef = useRef<HTMLDivElement>(null);
//   const imageRef = useRef(null);

//   const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);
//   const [webcam, setWebcam] = useState<tmImage.Webcam | null>(null);
//   const [maxPredictions, setMaxPredictions] = useState<number>(0);
//   const [imageSrc, setImageSrc] = useState<string | null>(null);

//   const modelPath = "../../public/model/"; // Change this path if necessary

//   const loadModel = async () => {
//     // Load the model from the local folder inside public/
//     const modelURL = `${modelPath}model.json`;
//     const metadataURL = `${modelPath}metadata.json`;

//     loadedModel = await tmImage.load(modelURL, metadataURL);
//     setModel(loadedModel);
//     setMaxPredictions(loadedModel.getTotalClasses());
//     console.log("model: ", loadedModel);
//   };

//   const predictWebcam = async () => {
//     try {
//       // Setup webcam parameters
//       const flip = true; // Flip for mirror effect
//       const width = 200;
//       const height = 200;
//       const newWebcam = new tmImage.Webcam(width, height, flip);
//       await newWebcam.setup(); // Request access to the webcam

//       // Attach webcam canvas to the container
//       if (webcamContainerRef.current) {
//         webcamContainerRef.current.innerHTML = ""; // Clear any existing content
//         webcamContainerRef.current.appendChild(newWebcam.canvas);
//       }

//       setWebcam(newWebcam);

//       // Create label elements for each class
//       if (labelContainerRef.current) {
//         labelContainerRef.current.innerHTML = ""; // Clear any existing labels
//         for (let i = 0; i < loadedModel.getTotalClasses(); i++) {
//           const div = document.createElement("div");
//           labelContainerRef.current.appendChild(div);
//         }
//       }

//       newWebcam.play();
//       window.requestAnimationFrame(() => loop(newWebcam, loadedModel));
//     } catch (error) {
//       console.error("Error initializing Teachable Machine model:", error);
//     }
//   };

//   const loop = async (
//     webcam: tmImage.Webcam,
//     model: tmImage.CustomMobileNet
//   ) => {
//     webcam.update();
//     await predict(webcam, model);
//     window.requestAnimationFrame(() => loop(webcam, model));
//   };

//   const predict = async (
//     webcam: tmImage.Webcam,
//     model: tmImage.CustomMobileNet
//   ) => {
//     if (!labelContainerRef.current) return;

//     const prediction = await model.predict(webcam.canvas);
//     console.log("Predicted: ", prediction);
//     const labels = labelContainerRef.current.childNodes;

//     for (let i = 0; i < maxPredictions; i++) {
//       labels[i].textContent = `${prediction[i].className}: ${prediction[
//         i
//       ].probability.toFixed(2)}`;
//     }
//   };

//   // Function to predict an image
//   const predictImage = async (imgElement: HTMLImageElement): Promise<void> => {
//     console.log("here....");
//     if (!model) return;
//     try {
//       const prediction: Prediction[] = await model.predict(imgElement);
//       // Display the prediction results in the dedicated container
//       const imgPredictionContainer = document.getElementById(
//         "img-prediction-container"
//       );
//       if (imgPredictionContainer) {
//         imgPredictionContainer.innerHTML = "";
//         prediction.forEach((pred) => {
//           const div = document.createElement("div");
//           div.textContent = `${pred.className}: ${pred.probability.toFixed(2)}`;
//           imgPredictionContainer.appendChild(div);
//         });
//       }
//     } catch (error) {
//       console.error("Error predicting image:", error);
//     }
//   };

//   // Function to handle image file uploads
//   const handleImageUpload = (
//     event: React.ChangeEvent<HTMLInputElement>
//   ): void => {
//     const file = event.target.files?.[0];
//     if (file) {
//       // Convert the file into a data URL so it can be rendered
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const result = e.target?.result;
//         if (result && typeof result === "string") {
//           setImageSrc(result);
//         }
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   loadModel();

//   return (
//     <div>
//       <h3>Teachable Machine Local Model</h3>
//       <button onClick={predictWebcam}>Start</button>
//       <div ref={webcamContainerRef} />
//       <div ref={labelContainerRef}>here</div>

//       {/* Section for image prediction */}
//       <h4>Predict an Image</h4>
//       <input type="file" accept="image/*" onChange={handleImageUpload} />
//       {/* Render the uploaded image */}
//       {imageSrc && (
//         <div>
//           <img
//             ref={imageRef}
//             src={imageSrc}
//             alt="Uploaded"
//             style={{ maxWidth: "300px", marginTop: "10px" }}
//             onLoad={() => {
//               // When image loads, run prediction on it
//               console.log("About ti run prediction.");
//               if (imageRef.current) {
//                 predictImage(imageRef.current);
//               }
//               console.log("Done running prediction.");
//             }}
//           />
//           <div id="img-prediction-container" style={{ marginTop: "10px" }} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default TeachableMachineLocal;
