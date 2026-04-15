import { z, ZodType } from "zod";

export default class BaseDto<T> {
  static schema: ZodType<any> = z.object({});

  static validate<T>(this: { schema: ZodType<T> }, data: unknown) {
    const result = this.schema.safeParse(data);

    if (!result.success) {
      const errors = result.error.issues.map((e) => e.message);
      return { errors, value: null };
    }

    return { errors: null, value: result.data };
  }
}