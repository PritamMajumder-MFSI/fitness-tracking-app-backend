import dotenv from "dotenv";
dotenv.config();
import express, { json, Response } from "express";
import cors from "cors";
import router from "./routes";
import { credentials } from "./constants";
import { corsConfig } from "./config";
import { closeDatabase, connectToDatabase } from "./db/singletonClient";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import cluster from "cluster";
import os from "os";

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

const app = express();

app.use(limiter);

app.use(json({ limit: "1mb" }));

app.use(helmet());

app.get("/", (_, res: Response) => {
  res.send("Welcome to Fitness tracker backend");
});

app.use(cors(corsConfig));

app.use("/api/v1", router);

if (cluster.isPrimary) {
  const cpuCount = os.cpus().length;

  const startPrimaryProcess = async () => {
    try {
      console.log("Primary process starting...");
      await connectToDatabase();
      console.log("Forking workers...");

      for (let i = 0; i < cpuCount; i++) {
        cluster.fork();
      }

      cluster.on("exit", (worker, code, signal) => {
        console.log(
          `Worker ${worker.process.pid} exited with code: ${code}, signal: ${signal}. Restarting...`
        );
        cluster.fork();
      });
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
      process.exit(1);
    }
  };

  startPrimaryProcess();
} else {
  const startChildProcess = async () => {
    try {
      await connectToDatabase();
      const server = app.listen(credentials.PORT || 3000, () => {
        console.log(
          `Server Listening on port: ${
            credentials.PORT || 3000
          } | process pid: ${cluster.worker?.process?.pid}`
        );
      });

      process.on("SIGTERM", () => shutdown(server));
      process.on("SIGINT", () => shutdown(server));
    } catch (err) {
      console.log(
        `Error Occurred: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  };
  const shutdown = (server: any) => {
    console.log("Shutting down gracefully...");
    server.close(async () => {
      await closeDatabase();
      console.log("Closed out remaining connections.");
      process.exit(0);
    });
  };
  startChildProcess();
}
