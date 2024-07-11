import { CreateLog, Service, UpdateLog, WorkLog } from "./Service";

export const mockService_0: Service = {
  getAllWorkLogs: async function(): Promise<WorkLog[]> {
    return [];
  },
  getWorkLogsByDate: async function(_year: number, _month: number, _day: number): Promise<any[]> {
    return [];
  },
  createWorkLog: async function(_log: CreateLog): Promise<number> {
    return 0;
  },
  updateWorkName: async function(_log: UpdateLog): Promise<void> {
  },
  updateEndDate: async function(_log: UpdateLog): Promise<void> {
  }
};


export const mockService_3: Service = {
  getAllWorkLogs: async function(): Promise<WorkLog[]> {
    return [];
  },
  getWorkLogsByDate: async function(_year: number, _month: number, _day: number): Promise<any[]> {
    return [{
      work_no: 1,
      work_name: 'Task 1',
      start_date: '2024-07-10T08:00:00Z',
      end_date: null,
    },
    {
      work_no: 2,
      work_name: 'Task 2',
      start_date: '2024-07-10T09:30:00Z',
      end_date: '2024-07-10T10:00:00Z',
    },
    {
      work_no: 3,
      work_name: 'Task 3',
      start_date: '2024-07-10T10:15:00Z',
      end_date: '2024-07-10T11:15:00Z',
    }];
  },
  createWorkLog: async function(_log: CreateLog): Promise<number> {
    return 0;
  },
  updateWorkName: async function(_log: UpdateLog): Promise<void> {
  },
  updateEndDate: async function(_log: UpdateLog): Promise<void> {
  }
};
