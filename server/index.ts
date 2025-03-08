import express, { Request, Response } from "express";
import cors from "cors";
import { exec } from "child_process";
import path from "path";
import os from "os";
import { mkdir } from "fs";
import schedule from "node-schedule";

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Define the output directory where images are stored.
const outputDir = path.join(
  os.homedir(),
  "Documents",
  "src",
  "fertilised-egg-detector",
  "captured-images"
);

const autoOutputDir = path.join(
  os.homedir(),
  "Documents",
  "src",
  "fertilised-egg-detector",
  "auto-taken-images"
);

// Serve static files from the output directory at the /images route.
app.use("/images", express.static(outputDir));

/**
 * CaptureCallback type: called with an error (if any) and the absolute path of the captured image.
 */
type CaptureCallback = (error: Error | null, imagePath?: string | null) => void;
// type CaptureCallback = (error: Error | null, imagePath?: string) => void;

/**
 * captureImage uses raspistill to capture an image with a unique timestamp-based filename.
 * The image is saved in the output directory.
 */
function captureImage(callback: CaptureCallback): void {
  // Ensure the output directory exists.
  mkdir(outputDir, { recursive: true }, (err) => {
    if (err) {
      return callback(err, null);
    }

    // Create a unique filename using a formatted timestamp: YYYYMMDD_HHMMSS.
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

    // Build the raspistill command.
    const cmd = `rpicam-still --output ${imagePath}`;

    // Execute the command.
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        return callback(error, null);
      }
      callback(null, imagePath);
    });
  });
}

function captureImageAtOutput(outputDir: string, callback: CaptureCallback): void {
  // Ensure the output directory exists.
  mkdir(outputDir, { recursive: true }, (err) => {
    if (err) {
      return callback(err);
    }

    // Generate a unique filename with a timestamp: YYYYMMDD_HHMMSS.
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hour = String(now.getHours()).padStart(2, "0");
    const minute = String(now.getMinutes()).padStart(2, "0");
    const second = String(now.getSeconds()).padStart(2, "0");
    const timestamp = `${year}${month}${day}_${hour}${minute}${second}`;
    const fileName = `auto_${timestamp}.jpg`;
    const imagePath = path.join(outputDir, fileName);

    // Build the raspistill command.
    const cmd = `raspistill -o ${imagePath}`;

    // Execute the command.
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        return callback(error);
      }
      callback(null, imagePath);
    });
  });
}

// Define an endpoint to capture an image.
app.get("/capture", (req: Request, res: Response) => {
  captureImage((error, imagePath) => {
    if (error || !imagePath) {
      console.error("Error capturing image:", error);
      return res.status(500).json({ error: "Error capturing image" });
    }
    // Get the image filename and construct a URL for the static route.
    const imageName = path.basename(imagePath);
    const imageUrl = `${imageName}`;
    res.json({ imageUrl });
  });
});


/**
 * GET /schedule-auto-capture
 * Schedules a one-time cron job to run 7 days from now that captures an image.
 */
app.get("/schedule-auto-capture", (req: Request, res: Response) => {
  // Calculate the scheduled time: exactly 7 days from now.
  const scheduledDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // Schedule the job using node-schedule.
  const job = schedule.scheduleJob(scheduledDate, () => {
    console.log("Auto capture job running at:", new Date());
    captureImageAtOutput(autoOutputDir, (error, imagePath) => {
      if (error) {
        console.error("Error capturing auto image:", error);
      } else {
        console.log("Auto image captured at:", imagePath);
        // Here you might add additional logic (like notifying someone or logging the event)
      }
    });
  });

  res.json({
    message: `Auto capture scheduled for ${scheduledDate.toString()}`,
  });
});


// Start the server.
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
