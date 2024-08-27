import express from "express";
import router from "./routes/index.mjs";
import envConfig from "./config/env.config.mjs";

// Define the port to run the server on, using the port defined in environment variables if available, otherwise default to 8080
const PORT = envConfig.PORT || 3000;

const app = express();

// To parse incoming JSON via req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the main router for all API routes
app.use("/api", router);

// Listen for requests on the defined port and log a message when the server is ready
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
