import express from "express";
import cors from "cors";
import axios from "axios";
import { randomBytes } from "crypto";

const app = express();
app.use(express.json());
app.use(cors());

const commentsByPostId = {};

app
  .route("/posts/:id/comments")
  .post(async (req, res) => {
    const commentId = randomBytes(4).toString("hex");
    const { content } = req.body;

    const comments = commentsByPostId[req.params.id] || [];

    comments.push({ id: commentId, content, status: "pending" });
    commentsByPostId[req.params.id] = comments;

    await axios.post("http://event-bus-srv:4005/events", {
      type: "CommentCreated",
      payload: {
        id: commentId,
        content,
        postId: req.params.id,
        status: "pending",
      },
    });

    res.status(200).json(comments);
  })
  .get((req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
  });

app.route("/events").post(async (req, res) => {
  console.log("RECEIVED EVENTS", req.body);

  const { type, payload } = req.body;

  if (type === "CommentModerated") {
    const { postId, id, status, content } = payload;

    const comments = commentsByPostId[postId];

    const comment = comments.find((comment) => {
      return comment.id === id;
    });

    comment.status = status;

    await axios.post("http://event-bus-srv:4005/events", {
      type: "CommentUpdated",
      payload: { id, postId, content, status },
    });
  }

  res.send({});
});

app.listen(4001, () => {
  console.log("Comment server is listening on port 4001");
});
