import { Request, Response } from 'express';
import { HttpStatuses } from '../definitions/http-statuses';
import { UserService } from "../services/db/resources/user.service";
import { catchAsync } from "../services/helpers/general.helper";

export const createUser = catchAsync(async (req: Request, res: Response) => {
  const userService = new UserService();
  await userService.create({
    last_name: req.body.last_name || '',
    first_name: req.body.first_name || '',
    email: req.body.email || ''
  });

  return res.status(200).send({
    messageCode: 'creation success'
  });
});

export const getUsers = catchAsync(async (req: Request, res: Response) => {
  const userService = new UserService();
  const userQueryResponse = await userService.getList();

  return res.status(HttpStatuses.OK).send({
    data: userQueryResponse
  });
});

export const getUser = catchAsync(async (req: Request, res: Response) => {
  const userService = new UserService();
  const userRecord = await userService.getByEmail(req.params.email);

  if (!userRecord) {
    return res.status(HttpStatuses.NOT_FOUND).send({
      message: 'user not found'
    });
  }

  return res.status(HttpStatuses.OK).send({
    data: userRecord
  });
});

export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const userService = new UserService();
  const userRecord = await userService.getByEmail(req.params.email);

  if (!userRecord) {
    return res.status(HttpStatuses.NOT_FOUND).send({
      message: 'user not found'
    });
  }

  await userService.update(userRecord, {
    last_name: req.body.last_name || '',
    first_name: req.body.first_name || '',
    email: req.body.email || ''
  });

  return res.status(HttpStatuses.OK).send({
    messageCode: 'updated successfully'
  });
});