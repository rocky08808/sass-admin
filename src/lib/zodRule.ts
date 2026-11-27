import type { Rule } from 'antd/es/form';
import type { z } from 'zod';

/** Validates a single form field against its zod schema. */
export function zodRule(schema: z.ZodType): Rule {
  return {
    required: true,
    validator: async (_, value: unknown) => {
      const result = schema.safeParse(value);
      if (!result.success) throw new Error(result.error.issues[0]?.message);
    },
  };
}
