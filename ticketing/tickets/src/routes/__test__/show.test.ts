import request from "supertest";
import { Types } from "mongoose";

import { app } from "./../../app";

it("return 404 if ticket not found", async () => {
  const id = new Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${id}`).send({}).expect(404);
});

it("return 200 if ticket found", async () => {
  const title = "adfsg";
  const price = 20;

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title, price })
    .expect(201);

  await request(app).get(`/api/tickets/${response.body.id}`).send().expect(200);

  expect(response.body.title).toEqual(title);
  expect(response.body.price).toEqual(price);
});
