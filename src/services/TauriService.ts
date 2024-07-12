import { invoke } from '@tauri-apps/api/core';
import { Service, WorkLog, CreateLog, UpdateLog } from './Service.ts';

export class TauriService implements Service {
  async getRecentWorkLogs(num: number): Promise<WorkLog[]> {
    const logs: WorkLog[] = await invoke('get_recent_work_logs_command', { num: num });
    return logs;
  }

  async getAllWorkLogs(): Promise<WorkLog[]> {
    const logs: WorkLog[] = await invoke('get_all_work_logs_command');
    return logs;
  }

  async getWorkLogsByDate(year: number, month: number, day: number): Promise<WorkLog[]> {
    const logs: WorkLog[] = await invoke('get_work_logs_by_date_command', {
      year: year, month: month, day: day
    });
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

  async deleteWorkLog(workNo: number): Promise<void> {
    await invoke('delete_work_log_command', { workNo: workNo });
  }
}

