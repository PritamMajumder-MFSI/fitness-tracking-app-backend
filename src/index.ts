import dotenv from "dotenv";
dotenv.config();
import express, { Response } from "express";
import cors from "cors";

const app = express();

app.get("/", (_, res: Response) => {
  res.send("Welcome to Fitness tracker backend");
});

app.use(cors());

const startServer = async () => {
  try {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server Listening on port: ${process.env.PORT || 3000}`);
    });
  } catch (err) {
    console.log(
      `Error Occurred: ${err instanceof Error ? err.message : String(err)}`
    );
  }
};

startServer();
