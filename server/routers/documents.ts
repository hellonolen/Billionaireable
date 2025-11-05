import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { documents } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { storagePut } from "../storage";

export const documentsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    return await db.select().from(documents).where(eq(documents.userId, ctx.user.id));
  }),

  upload: protectedProcedure
    .input(z.object({
      fileName: z.string(),
      fileData: z.string(), // base64
      mimeType: z.string(),
      fileSize: z.number(),
      category: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Convert base64 to buffer
      const base64Data = input.fileData.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');

      // Generate unique file key
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(7);
      const fileKey = `${ctx.user.id}/documents/${timestamp}-${randomSuffix}-${input.fileName}`;

      // Upload to S3
      const { url } = await storagePut(fileKey, buffer, input.mimeType);

      // Save to database
      await db.insert(documents).values({
        userId: ctx.user.id,
        fileName: input.fileName,
        fileKey,
        fileUrl: url,
        fileSize: input.fileSize,
        mimeType: input.mimeType,
        category: input.category,
        notes: input.notes,
      });

      return { success: true, url };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.delete(documents)
        .where(and(eq(documents.id, input.id), eq(documents.userId, ctx.user.id)));

      return { success: true };
    }),
});
