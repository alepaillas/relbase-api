import dotenv from "dotenv";

const environment = "DEV";
dotenv.config({
  path: environment === "PROD" ? "./.env.prod" : "./.env.dev",
});

//console.log(process.env.COMPANY);

export default {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 3000,
  COMPANY: process.env.COMPANY,
  AUTHORIZATION: process.env.AUTHORIZATION,
};
