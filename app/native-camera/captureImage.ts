import { exec } from "child_process";
import path from "path";
import os from "os";
import { mkdir } from "fs";

// Define the callback type
type CaptureCallback = (error: Error | null, imagePath: string | null) => void;

/**
 * Captures an image using raspistill and returns the image path via a callback.
 */
function captureImage(callback: CaptureCallback): void {
  // Define the output directory
  const outputDir = path.join(
    os.homedir(),
    "Documents",
    "src",
    "fertilised-egg-detector",
    "captured-images"
  );

  // Generate a unique image name using a formatted timestamp: YYYYMMDD_HHMMSS
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  const second = String(now.getSeconds()).padStart(2, "0");
  const timestamp = `${year}${month}${day}_${hour}${minute}${second}`;
  const imageName = `captured_${timestamp}.jpg`;
  const imagePath = path.join(outputDir, imageName);

  // Ensure the output directory exists (using fs.mkdir with the recursive option)
  mkdir(outputDir, { recursive: true }, (err) => {
    if (err) {
      return callback(err, null);
    }

    // Build the raspistill command; adjust any parameters as needed.
    const cmd = `raspistill -o ${imagePath}`;

    // Execute the command
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        return callback(error, null);
      }
      // If successful, return the full image path
      callback(null, imagePath);
    });
  });
}

// Example usage of the captureImage function:
captureImage((error, imagePath) => {
  if (error) {
    console.error("Error capturing image:", error);
  } else if (imagePath) {
    console.log("Image captured at:", imagePath);
    // In your React app, you could convert this path to a URL (for example, by serving the folder via a static server)
    // and then set it as the src attribute of an <img> element.
  }
});
