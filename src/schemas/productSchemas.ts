import { z } from "zod";

export const productSchema = z
  .object({
    title: z.string().min(5),
    price: z.number(),
    description: z.string(),
    content: z.string(),
    category: z.string(),
  })
  .strict();
// export type product = z.infer<typeof productSchema>
export const productObject = z
  .object({
    sellerId: z.number(),
    categoryId: z.number(),
    body: z.object({
      title: z.string().min(5),
      price: z.number(),
      description: z.string(),
      content: z.string(),
      category: z.string(),
    }),
    imageName: z.string(),
    pdfNames: z.array(z.string()),
    pdfPaths: z.array(z.string()),
    videoNames: z.array(z.string()),
    videoPaths: z.array(z.string())
  })
  .strict();
export type product = z.infer<typeof productObject>;
const querySchema = z.object({
  q: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
}).strict();
export type query = z.infer<typeof querySchema>