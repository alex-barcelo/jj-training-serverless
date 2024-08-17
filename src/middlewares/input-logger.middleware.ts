import { NextFunction, Request, Response } from "express";

export const InputLogger = (from: string) => (req: Request, res: Response, next: NextFunction) => {
  console.log(`${from} input logger`);
  next();
}