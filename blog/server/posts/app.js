import express from "express";
import cors from "cors";
import axios from "axios";
import { randomBytes } from "crypto";

const app = express();
app.use(express.json());
app.use(cors());

const posts = {};

app.route("/posts/create").post(async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;

  posts[id] = { id, title };

  await axios.post("http://event-bus-srv:4005/events", {
    type: "PostCreated",
    payload: { id, title },
  });

  res.status(200).json(posts[id]);
});

app.route("/events").post((req, res) => {
  console.log("RECEIVED EVENTS", req.body);

  res.send({});
});

app.listen(4000, () => {
  console.log("App updaate with version - 0.0.2");
  console.log("Posts server is listening on port 4000");
});
