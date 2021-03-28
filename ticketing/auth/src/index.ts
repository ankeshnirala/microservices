import express, { json, Request, Response } from "express";
import mongoose from "mongoose";
import cookieSession from "cookie-session";
import "express-async-errors";

import { currentUserRouter } from "./routes/current.user";

import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";

import { errorHandler } from "./middlewares/error.handler";
import { NotFoundError } from "./errors/not.found.error";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT key must be defined!!");
  }
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Auth - Connected to MongoDB");
  } catch (error) {
    console.log("DB Connection Error", error);
  }

  app.listen(3000, () => {
    console.log("AUTH IS STARTED ON PORT 3000!");
  });
};

start();
