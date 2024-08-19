import { z } from "zod";

export const productSchema = z.object({
    title : z.string().min(5),
    price: z.number(),
    description: z.string(),
    content: z.string(),
    category: z.string()
}).strict()
export type product = z.infer<typeof productSchema>