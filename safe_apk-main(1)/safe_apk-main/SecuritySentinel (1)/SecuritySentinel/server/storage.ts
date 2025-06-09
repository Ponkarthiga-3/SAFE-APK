import { apkAnalysis, type ApkAnalysis, type InsertApkAnalysis } from "@shared/schema";

export interface IStorage {
  createAnalysis(analysis: InsertApkAnalysis): Promise<ApkAnalysis>;
  getAnalysis(id: number): Promise<ApkAnalysis | undefined>;
  getAllAnalyses(): Promise<ApkAnalysis[]>;
  updateAnalysis(id: number, data: Partial<ApkAnalysis>): Promise<ApkAnalysis>;
}

export class MemStorage implements IStorage {
  private analyses: Map<number, ApkAnalysis>;
  private currentId: number;

  constructor() {
    this.analyses = new Map();
    this.currentId = 1;
  }

  async createAnalysis(analysis: InsertApkAnalysis): Promise<ApkAnalysis> {
    const id = this.currentId++;
    const newAnalysis: ApkAnalysis = {
      ...analysis,
      id,
      createdAt: new Date(),
    };
    this.analyses.set(id, newAnalysis);
    return newAnalysis;
  }

  async getAnalysis(id: number): Promise<ApkAnalysis | undefined> {
    return this.analyses.get(id);
  }

  async getAllAnalyses(): Promise<ApkAnalysis[]> {
    return Array.from(this.analyses.values());
  }

  async updateAnalysis(id: number, data: Partial<ApkAnalysis>): Promise<ApkAnalysis> {
    const analysis = await this.getAnalysis(id);
    if (!analysis) throw new Error("Analysis not found");
    
    const updated = { ...analysis, ...data };
    this.analyses.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
