import { z } from 'zod';

export const stringInputSchema = z.object({
	stringInput: z.string().min(2).max(50)
});

export type StringInputSchema = z.infer<typeof stringInputSchema>;
