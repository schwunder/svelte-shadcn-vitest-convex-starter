import { z } from 'zod';

export const folderSchema = z.object({
	folderPath: z.string().min(2).max(50)
});

export type FolderSchema = z.infer<typeof folderSchema>;
