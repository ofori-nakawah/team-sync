import { NextFunction, Request, Response } from "express";

type AsyncControllerType = (
  req: Request,
  res: Response,
  nex: NextFunction
) => Promise<any>;

export const asyncHander =
  (controller: AsyncControllerType): AsyncControllerType =>
  async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };
