import { Request, Response, Router } from "express";
import { body } from "express-validator";
import {
  NotFoundError,
  validateRequest,
  requireAuth,
  NotAuthError,
} from "@anticketings/common";

import { Ticket } from "./../models/tickets";

const router = Router();

router
  .route("/api/tickets/:id")
  .put(
    requireAuth,
    [
      body("title").not().isEmpty().withMessage("Title is required"),
      body("price")
        .isFloat({ gt: 0 })
        .withMessage("Price must be greater than 0"),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
      const ticket = await Ticket.findById(req.params.id);

      if (!ticket) {
        throw new NotFoundError();
      }

      if (ticket.userId !== req.currentUser!.id) {
        throw new NotAuthError();
      }

      ticket.set({
        title: req.body.title,
        price: req.body.price,
      });

      await ticket.save();

      res.send(ticket);
    }
  );

export { router as UpdateTicketRouter };
