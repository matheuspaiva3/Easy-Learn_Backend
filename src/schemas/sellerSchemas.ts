import z from 'zod';

export const sellerSchema = z
    .object({
        name: z.string().min(2).toLowerCase(),
        email: z.string().email().toLowerCase(),
        password: z.string().min(6),
        confirmPassword: z.string().min(6),
        cpf: z.string().max(14).min(10),
        phone: z.string().min(11),
    })
    .strict();

export const updatedSellerSchema = sellerSchema.partial().strict();

export type seller = z.infer<typeof sellerSchema>;
export type updatedSeller = z.infer<typeof updatedSellerSchema>;

export const loginSchema = z
    .object({
        email: z.string().email().toLowerCase(),
        password: z.string().min(6).toLowerCase(),
    })
    .strict();

export const loginToken = z
    .object({
        email: z.string().email(),
        password: z.string().min(6),
        token: z.string(),
    })
    .strict();

export type login = z.infer<typeof loginToken>;
