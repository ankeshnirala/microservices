import request from "supertest";
import { Types } from "mongoose";

import { app } from "./../../app";

it("return 404 if provided id does not exist", async () => {
  const id = new Types.ObjectId().toHexString();
  const title = "ssdfs";
  const price = 20;

  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({ title, price })
    .expect(404);
});

it("return a 401 if the user is not authenticated", async () => {
  const id = new Types.ObjectId().toHexString();
  const title = "ssdfs";
  const price = 20;

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title, price })
    .expect(401);
});

it("return 401 if the user does not own the ticket", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "dfsfd", price: 20 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({ title: "dsd", price: 10 })
    .expect(401);
});

it("return 400 if the user provide invalid title or price", async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "dfsfd", price: 20 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 100,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: -100,
    })
    .expect(400);
});

it("update ticket provided valid input", async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "dfsfd", price: 20 });

  const title = "fgre";
  const price = 345;

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title, price })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
