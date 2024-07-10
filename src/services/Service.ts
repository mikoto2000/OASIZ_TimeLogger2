export interface Log {
  work_no: number;
  work_name: string;
  start_date: string;
  end_date: string | null;
}

export interface CreateLog {
  work_name: string;
  start_date: string;
  end_date?: string | null;
}

export interface UpdateLog {
  work_no: number;
  work_name: string;
  end_date: string;
}

export interface Service {
  getAllWorkLogs(): Promise<Log[]>;
  getWorkLogsByDate(date: string): Promise<Log[]>;
  createWorkLog(log: CreateLog): Promise<void>;
  updateWorkName(log: UpdateLog): Promise<void>;
  updateEndDate(log: UpdateLog): Promise<void>;
}

