import { Router } from "express";
import { createUser, getUser, getUsers, updateUser } from "../controllers/users.controller";
import { ValidateMiddleware } from "../middlewares/validate.middleware";
import { registrationDto, updateUserDto } from "../validators/public.validator";

export const AdminRouter = Router();

const adminRoutes = AdminRouter.route('/admin');

AdminRouter.post('/admin/users', ValidateMiddleware(registrationDto), createUser);

AdminRouter.get('/admin/users', getUsers);
AdminRouter.get('/admin/users/:email', getUser);
AdminRouter.patch('/admin/users/:email', ValidateMiddleware(updateUserDto), updateUser);