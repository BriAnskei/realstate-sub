import { initDB } from "./db";
import { createServer } from "http";
import express, { Response, Request, NextFunction } from "express";
import cors from "cors";
import { createLotRouter } from "./routes/lotRouter";
// Do the same for other routers
import landRouter from "./routes/landRouter";
import { createClientRouter } from "./routes/clientRouter";
import { UPLOAD_PATHS } from "./middleware/multer/UploadPaths";
import { createApplictionRouter } from "./routes/appRouter";

const app = express();
const PORT = 4000;

app.use(express.json());
app.use(cors({ origin: "*" }));

const httpServer = createServer(app);

app.get("/", (req: Request, res: Response) => {
  res.send("API Working");
});

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(`Error in ${err.functionName || "unknown"}:`, err.message);
  res.status(500).json({
    error: err.message || "Something went wrong",
    function: err.functionName || "unknown",
    success: false,
  });
});

// Initialize database and start server
async function startServer() {
  try {
    // Initialize database FIRST
    console.log("Initializing database...");
    const db = await initDB();
    console.log("Database initialized successfully");

    // THEN register routes (after DB is ready)
    app.use("/api/land", landRouter);
    app.use("/api/lot", createLotRouter(db)); // Pass db to factory
    app.use("/api/client", createClientRouter(db));
    app.use("/api/application", createApplictionRouter(db));

    // Static routes (images)
    app.use("/uploads/clients", express.static(UPLOAD_PATHS.CLIENTS));

    // FINALLY start the server
    httpServer.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Start the server
startServer();
