import credentials from "../constants/credentials";

export default credentials.NODE_ENV == "development"
  ? {
      origin: "http://localhost:4200",
      optionsSuccessStatus: 200,
    }
  : {
      origin: "",
      optionSuccessStatus: 200,
    };
