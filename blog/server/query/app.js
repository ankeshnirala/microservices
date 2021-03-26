import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const posts = {};

const handleEvents = (type, payload) => {
  if (type === "PostCreated") {
    const { id, title } = payload;
    posts[id] = { id, title, comments: [] };
  }

  if (type === "CommentCreated") {
    const { id, content, postId, status } = payload;
    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  if (type === "CommentUpdated") {
    const { id, content, postId, status } = payload;
    const post = posts[postId];
    const comment = post.comments.find((comment) => {
      return comment.id === id;
    });

    comment.status = status;
    comment.content = content;
  }
};

app.route("/posts").get((req, res) => {
  console.log(posts);
  res.send(posts);
});

app.route("/events").post((req, res) => {
  const { type, payload } = req.body;

  handleEvents(type, payload);

  res.send({});
});

app.listen(4002, async () => {
  console.log("Query server is listening on port 4002");

  const res = await axios.get("http://event-bus-srv:4005/events");

  for (let event of res.data) {
    if (event) {
      console.log("Processing Event", event && event.type);

      handleEvents(event.type, event.payload);
    }
  }
});
