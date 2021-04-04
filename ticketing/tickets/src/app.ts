import express, { json } from "express";

import cookieSession from "cookie-session";
import "express-async-errors";

import { errorHandler, NotFoundError, currentUser } from "@anticketings/common";

import { IndexRouter } from "./routes/index";
import { CreateTicketRouter } from "./routes/new";
import { ShowTicketRouter } from "./routes/show";
import { UpdateTicketRouter } from "./routes/update";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUser);
app.use(IndexRouter);
app.use(CreateTicketRouter);
app.use(ShowTicketRouter);
app.use(UpdateTicketRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
