import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { contacts } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

export const contactsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    
    return await db.select().from(contacts).where(eq(contacts.userId, ctx.user.id));
  }),

  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      email: z.string().optional(),
      phone: z.string().optional(),
      company: z.string().optional(),
      title: z.string().optional(),
      category: z.string(),
      relationship: z.string().optional(),
      notes: z.string().optional(),
      importance: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.insert(contacts).values({
        userId: ctx.user.id,
        ...input,
      });

      return { success: true };
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      email: z.string().optional(),
      phone: z.string().optional(),
      company: z.string().optional(),
      title: z.string().optional(),
      category: z.string().optional(),
      relationship: z.string().optional(),
      notes: z.string().optional(),
      importance: z.number().optional(),
      lastContactedAt: z.date().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const { id, ...updates } = input;
      await db.update(contacts)
        .set(updates)
        .where(and(eq(contacts.id, id), eq(contacts.userId, ctx.user.id)));

      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.delete(contacts)
        .where(and(eq(contacts.id, input.id), eq(contacts.userId, ctx.user.id)));

      return { success: true };
    }),
});
