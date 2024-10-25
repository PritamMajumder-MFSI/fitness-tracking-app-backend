import credentials from "../constants/credentials";

export default credentials.NODE_ENV == "development"
  ? {
      origin: ["https://localhost:4200"],
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }
  : {
      origin: "",
      optionSuccessStatus: 200,
    };
