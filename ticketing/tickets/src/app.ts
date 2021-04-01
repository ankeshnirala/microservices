import express, { json } from "express";

import cookieSession from "cookie-session";
import "express-async-errors";

import { errorHandler, NotFoundError } from "@anticketings/common";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
