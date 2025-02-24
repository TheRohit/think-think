import { and, desc, eq, ilike } from "drizzle-orm";
import { db } from "./index";
import { content } from "./schema";
import type { Content } from "./schema";

export async function getContentById(id: string, userId: string) {
  const result = await db
    .select()
    .from(content)
    .where(and(eq(content.id, id), eq(content.userId, userId)))
    .limit(1);

  return result[0];
}

export async function getContentByUserId(
  userId: string,
  limit = 10,
  offset = 0,
) {
  return await db
    .select()
    .from(content)
    .where(eq(content.userId, userId))
    .orderBy(desc(content.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function searchContent(
  userId: string,
  searchTerm: string,
  limit = 10,
  offset = 0,
) {
  // Note: This assumes searching through tags. Adjust based on your needs
  return await db
    .select()
    .from(content)
    .where(
      and(eq(content.userId, userId), ilike(content.tags, `%${searchTerm}%`)),
    )
    .orderBy(desc(content.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function updateContent(
  id: string,
  userId: string,
  data: Partial<Omit<Content, "id" | "userId" | "createdAt" | "updatedAt">>,
) {
  const result = await db
    .update(content)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(and(eq(content.id, id), eq(content.userId, userId)))
    .returning();

  return result[0];
}

export async function deleteContent(id: string, userId: string) {
  const result = await db
    .delete(content)
    .where(and(eq(content.id, id), eq(content.userId, userId)))
    .returning();

  return result[0];
}
