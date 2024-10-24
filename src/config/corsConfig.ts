import credentials from "../constants/credentials";

export default credentials.NODE_ENV == "development"
  ? {
      origin: "http://example.com",
      optionsSuccessStatus: 200,
    }
  : {};
