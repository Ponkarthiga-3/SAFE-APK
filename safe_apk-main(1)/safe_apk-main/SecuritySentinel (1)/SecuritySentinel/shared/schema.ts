import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const apkAnalysis = pgTable("apk_analysis", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  fileHash: text("file_hash").notNull(),
  status: text("status").notNull().default("pending"),
  permissions: jsonb("permissions").$type<string[]>(),
  threatScore: integer("threat_score"),
  mlAnalysis: jsonb("ml_analysis").$type<{
    malwareProb: number;
    suspiciousAPIs: string[];
  }>(),
  blockchainVerified: boolean("blockchain_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertApkAnalysisSchema = createInsertSchema(apkAnalysis).omit({
  id: true,
  createdAt: true
});

export type InsertApkAnalysis = z.infer<typeof insertApkAnalysisSchema>;
export type ApkAnalysis = typeof apkAnalysis.$inferSelect;
