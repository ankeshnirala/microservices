import request from "supertest";

import { app } from "./../../app";

const createTicket = (title: string, price: number) => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title, price });
};

it("fetch list of tickets", async () => {
  await createTicket("sdf", 20);
  await createTicket("ddf", 20);
  await createTicket("wwe", 20);

  const response = await request(app).get("/api/tickets").send().expect(200);

  expect(response.body.length).toEqual(3);
});
