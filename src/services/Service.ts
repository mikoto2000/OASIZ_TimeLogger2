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
  getRecentWorkLogs(num: number): Promise<WorkLog[]>;
  getAllWorkLogs(): Promise<WorkLog[]>;
  getWorkLogsByDate(year: number, month: number, day: number): Promise<WorkLog[]>;
  createWorkLog(log: CreateLog): Promise<number>;
  updateWorkName(log: UpdateLog): Promise<void>;
  updateEndDate(log: UpdateLog): Promise<void>;
  deleteWorkLog(workNo: number): Promise<void>;
}

