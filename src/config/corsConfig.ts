import credentials from "../constants/credentials";

export default credentials.NODE_ENV == "development"
  ? {
      origin: ["http://localhost:4200"],
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    }
  : {
      origin: [""],
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    };
