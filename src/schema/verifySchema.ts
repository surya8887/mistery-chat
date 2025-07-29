import { z } from 'zod';

export const acceptMessage = z.object({
  verifyCode: z
    .string()
    .length(6, { message: 'Code must be exactly 6 digits' })
    .regex(/^\d{6}$/, { message: 'Code must contain only digits (0-9)' }),
});
