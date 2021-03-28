import { Request, Response, NextFunction } from "express";

import { NotAuthError } from "./../errors/not.auth.error";

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.currentUser) {
    throw new NotAuthError();
  }

  next();
};

export { requireAuth };
