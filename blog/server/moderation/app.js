import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

app.route("/events").post(async (req, res) => {
  const { type, payload } = req.body;

  if (type === "CommentCreated") {
    const status = payload.content.includes("sex") ? "rejected" : "approved";

    await axios.post("http://event-bus-srv:4005/events", {
      type: "CommentModerated",
      payload: { ...payload, status },
    });
  }

  res.send({});
});

app.listen(4003, () => {
  console.log("Moderation server is running on port 4003");
});
