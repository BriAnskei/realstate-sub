import { initDB } from "./db";
import { createServer } from "http";
import express, { Response, Request, NextFunction } from "express";
import cors from "cors";
import landRouter from "./routes/landRouter";
import lotRouter from "./routes/lotRouter";

const app = express();
const PORT = 4000;

app.use(express.json());
app.use(cors({ origin: "*" }));

const httpServer = createServer(app);

app.get("/", (req: Request, res: Response) => {
  res.send("API Working");
});

// api endpoints(Routes)
app.use("/api/land", landRouter);
app.use("/api/lot", lotRouter);

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(`Error in ${err.functionName || "unknown"}:`, err.message);
  res.status(500).json({
    error: err.message || "Something went wrong",
    function: err.functionName || "unknown",
  });
});

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`Server running on port http://localhost:${PORT}`);
});
