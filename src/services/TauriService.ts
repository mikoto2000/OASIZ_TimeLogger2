import { invoke } from '@tauri-apps/api/core';
import { Service, WorkLog, CreateLog, UpdateLog } from './Service.ts';

export class TauriService implements Service {
  async getAllWorkLogs(): Promise<WorkLog[]> {
    const logs: WorkLog[] = await invoke('get_all_work_logs_command');
    return logs;
  }

  async getWorkLogsByDate(date: string): Promise<WorkLog[]> {
    const logs: WorkLog[] = await invoke('get_work_logs_by_date_command', { query: { date } });
    return logs;
  }
  async createWorkLog(log: CreateLog): Promise<number> {
    return await invoke('create_work_log_command', { ...log });
  }

  async updateWorkName(log: UpdateLog): Promise<void> {
    await invoke('update_work_name_command', { ...log });
  }

  async updateEndDate(log: UpdateLog): Promise<void> {
    await invoke('update_end_date_command', { ...log });
  }
}

