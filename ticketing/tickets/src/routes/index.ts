import { Request, Response, Router } from "express";

import { Ticket } from "./../models/tickets";

const router = Router();

router.route("/api/tickets").get(async (req: Request, res: Response) => {
  const tickets = await Ticket.find({});

  res.send(tickets);
});

export { router as IndexRouter };
