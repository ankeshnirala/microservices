import { Request, Response, Router } from "express";
import { NotFoundError } from "@anticketings/common";

import { Ticket } from "./../models/tickets";

const router = Router();

router.route("/api/tickets/:id").get(async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    throw new NotFoundError();
  }

  res.send(ticket);
});

export { router as ShowTicketRouter };
