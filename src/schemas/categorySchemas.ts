import { z } from 'zod';

export const categorySchema = z.object({
    name: z.string(),
}).strict();

export type category = z.infer<typeof categorySchema>;
