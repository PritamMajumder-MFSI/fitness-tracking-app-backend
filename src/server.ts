import dotenv from "dotenv";
dotenv.config();
import express, { json, Response } from "express";
import cors from "cors";
import router from "./routes";
import { credentials } from "./constants";

const app = express();

app.get("/", (_, res: Response) => {
  res.send("Welcome to Fitness tracker backend");
});

app.use(cors());

app.use(json());

app.use("/api/v1", router);

const startServer = async () => {
  try {
    app.listen(credentials.PORT || 3000, () => {
      console.log(`Server Listening on port: ${credentials.PORT || 3000}`);
    });
  } catch (err) {
    console.log(
      `Error Occurred: ${err instanceof Error ? err.message : String(err)}`
    );
  }
};

startServer();
