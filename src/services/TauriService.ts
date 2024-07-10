import { invoke } from '@tauri-apps/api/core';
import { Service, Log, CreateLog, UpdateLog } from './Service.ts';

export class TauriService implements Service {
  async getAllWorkLogs(): Promise<Log[]> {
    const logs: Log[] = await invoke('get_all_work_logs');
    return logs;
  }

  async getWorkLogsByDate(date: string): Promise<Log[]> {
    const logs: Log[] = await invoke('get_work_logs_by_date', { query: { date } });
    return logs;
  }
  async createWorkLog(log: CreateLog): Promise<void> {
    await invoke('create_work_log', { log });
  }

  async updateWorkName(log: UpdateLog): Promise<void> {
    await invoke('update_work_name', { log });
  }

  async updateEndDate(log: UpdateLog): Promise<void> {
    await invoke('update_end_date', { log });
  }

}

