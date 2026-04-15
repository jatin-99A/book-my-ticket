import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/api-error.js";

type DtoClass<T> = {
  validate: (data: unknown) => {
    errors: any | null;
    value: T | null;
  };
};

const validate =
  <T>(DtoClass: DtoClass<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { errors, value } = DtoClass.validate(req.body);

    if (errors) {
      return next(ApiError.badRequest(errors.join("; ")));
    }

    req.body = value as T;
    next();
  };

export default validate;