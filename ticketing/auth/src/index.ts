import mongoose from "mongoose";

import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined!!");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined!!");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
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
