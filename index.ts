import dotenv from "dotenv";
dotenv.config();
import express from "express";

const app = express();

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
