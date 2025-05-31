import { z } from "zod";

export const DocumentSchema = z.object({
  id: z.string().cuid().optional(),
  title: z.string(),
  userId: z.string(),
  isArchived: z.boolean().optional(),
  parentDocumentId: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  coverImage: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  isPublic: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type DocumentType = z.infer<typeof DocumentSchema>;