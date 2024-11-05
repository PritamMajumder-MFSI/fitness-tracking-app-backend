import dotenv from "dotenv";
dotenv.config();
import express, { json, NextFunction, Response, Request } from "express";
import cors from "cors";
import router from "./routes";
import { credentials } from "./constants";
import { corsConfig } from "./config";
import { closeDatabase, connectToDatabase } from "./db/singletonClient";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import cluster from "cluster";
import os from "os";
import cookieParser from "cookie-parser";
import "./utils/passport";
import passport from "passport";
import session from "express-session";
import { Server } from "http";

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
app.use(cookieParser());
app.use(cors(corsConfig));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "sesion secret",
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use((req: Request, _: Response, next: NextFunction) => {
  console.log(req.method, " request Arrived at :", req.url);
  next();
});

app.get("/", (_, res: Response) => {
  res.send("Welcome to Fitness tracker backend");
});

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
      import("./cronjobs").then(() => {
        console.log("Cron jobs scheduled in the primary process.");
      });
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
  const shutdown = (server: Server) => {
    console.log("Shutting down gracefully...");
    server.close(async () => {
      await closeDatabase();
      console.log("Closed out remaining connections.");
      process.exit(0);
    });
  };
  startChildProcess();
}
