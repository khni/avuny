import { z, ZodTypeAny } from "zod";

/**
 * Wraps a given Zod schema into a response object format.
 * @param schema - The Zod schema to wrap in the 'data' field
 */
export const createResponseSchema = <T extends z._ZodType>(schema: T) => {
  return z.object({
    data: schema,
    success: z.literal(true),
  });
};

// --- Example Usage ---

// 1. Define your base data schema
const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  identifier: z.string().email(),
});

// 2. Create the wrapped schema
const UserResponseSchema = createResponseSchema(UserSchema);

// 3. Infer the type (TypeScript will show the full nested structure)
type UserResponse = z.infer<typeof UserResponseSchema>;

/*
  The inferred type UserResponse will be:
  {
    success: true;
    data: {
      id: number;
      name: string;
      identifier: string;
    };
  }
*/
