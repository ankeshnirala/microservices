import mongoose from "mongoose";

import { app } from "./app";

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
