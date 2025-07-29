import { z } from 'zod';

export const usernameValidation = z
  .string()
  .min(3, { message: 'Username must be at least 3 characters long' })
  .max(32, { message: 'Username must be at most 32 characters long' })
  .regex(/^[a-zA-Z0-9._]+$/, {
    message:
      'Username can only contain letters, numbers, underscores, and periods',
  });

export const emailValidation = z
  .string()
  .email({ message: 'Invalid email format' })
  .regex(
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    { message: 'Email must be a valid format like user@example.com' }
  );

export const signUpSchema = z.object({
  username: usernameValidation,
  email: emailValidation,
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message:
          'Password must include uppercase, lowercase, number, and special character',
      }
    ),
});
