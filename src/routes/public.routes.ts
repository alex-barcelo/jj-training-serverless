import { Router } from "express";
import { InputLogger } from "../middlewares/input-logger.middleware";
import { ValidateMiddleware } from "../middlewares/validate.middleware";
import { registrationDto } from "../validators/public.validator";

export const PublicRouter = Router();

PublicRouter.use(InputLogger('PUBLIC ROUTER'));

PublicRouter.get('/users', ValidateMiddleware(registrationDto), (req, res) => {
  res.send('public');
})

PublicRouter.get('/about', (req, res) => {
  res.send('about');
})