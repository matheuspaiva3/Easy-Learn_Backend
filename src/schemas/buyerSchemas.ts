import z from 'zod';

export const buyerSchema = z
    .object({
        name: z.string().min(2).toLowerCase(),
        email: z.string().email().toLowerCase(),
        password: z.string().min(6),
        confirmPassword: z.string().min(6),
        cpf: z.string().max(14).min(10),
        phone: z.string().min(11),
    })
    .strict();

export type buyer = z.infer<typeof buyerSchema>;
