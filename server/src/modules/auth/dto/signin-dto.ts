import { z } from "zod";
import BaseDto from "../../../common/dto/dto-base";

const signinSchema = z.object({
  email: z.email("Invalid email address"),

  password: z
    .string({ message: "Password must be a string" })
    .min(6, "Password must be at least 6 characters")
    .max(66, "Password must be at most 66 characters"),
});

export type SigninDtoType = z.infer<typeof signinSchema>;

export class SigninDto extends BaseDto<SigninDtoType> {
  static schema = signinSchema;
}