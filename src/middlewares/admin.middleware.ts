import { NextFunction, Request, Response } from "express";

export const AdminMiddleware = () => (req: Request, res: Response, next: NextFunction) => {
  console.log('admin middleware');
  next();
}