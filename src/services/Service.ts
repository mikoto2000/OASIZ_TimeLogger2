import { DisplayMode } from "../Types";

export interface WorkLog {
  workNo: number;
  workName: string;
  startDate: string;
  endDate?: string | null;
}

export interface CreateLog {
  workName: string;
  startDate: string;
}

export interface UpdateLog {
  workNo: number;
  workName: string;
  endDate?: string | null;
}

export interface Service {
  // os
  getPlatform(): string;
  // Setting
  saveDisplayMode(mode: DisplayMode): Promise<void>;
  getDisplayMode(): Promise<DisplayMode>;
  // DB
  getRecentWorkLogs(num: number): Promise<WorkLog[]>;
  getAllWorkLogs(): Promise<WorkLog[]>;
  getWorkLogs(
    fromYear: number,
    fromMonth: number,
    fromDay: number,
    toYear: number,
    toMonth: number,
    toDay: number): Promise<WorkLog[]>;
  getWorkLogsByDate(year: number, month: number, day: number): Promise<WorkLog[]>;
  createWorkLog(log: CreateLog): Promise<number>;
  updateWorkName(log: UpdateLog): Promise<void>;
  updateEndDate(log: UpdateLog): Promise<void>;
  deleteWorkLog(workNo: number): Promise<void>;
  getProductivityScoreByDate(year: number, month: number, day: number): Promise<number[]>;
  getProductivityScores(
    fromYear: number,
    fromMonth: number,
    fromDay: number,
    toYear: number,
    toMonth: number,
    toDay: number): Promise<number[][]>;
  updateProductivityScoreByDate(date: Date, productivityScore: number[]): Promise<void>;
}

