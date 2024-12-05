import { z } from 'zod';

// Add configuration type for reusable string inputs
export type StringInputConfig = {
	minLength?: number;
	maxLength?: number;
	label?: string;
	placeholder?: string;
	successMessage?: string;
	errorMessage?: string;
};

// Keep existing schema but make it a function that accepts config
export const createStringInputSchema = (config: StringInputConfig = {}) =>
	z.object({
		stringInput: z
			.string()
			.min(config.minLength ?? 2)
			.max(config.maxLength ?? 50)
	});

// Default schema for backward compatibility
export const stringInputSchema = createStringInputSchema();

export type StringInputSchema = z.infer<typeof stringInputSchema>;
