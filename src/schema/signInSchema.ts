import { z } from 'zod';

export const signINSchema = z.object({
    email: z.string().email(),
    password: z.string()


})