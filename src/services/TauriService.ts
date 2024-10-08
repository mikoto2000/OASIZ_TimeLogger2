import { invoke } from '@tauri-apps/api/core';
import { platform } from '@tauri-apps/plugin-os';
import { Service, WorkLog, CreateLog, UpdateLog } from './Service.ts';
import { DisplayMode } from '../Types.ts';
import { Store } from '@tauri-apps/plugin-store';

export class TauriService implements Service {
  private store = new Store("settings.dat");

  getPlatform() {
    return platform();
  }

  async saveDisplayMode(mode: DisplayMode) {
    this.store.set("displayMode", mode);
    this.store.save();
  }

  async getDisplayMode(): Promise<DisplayMode> {
    return await this.store.get<DisplayMode>("displayMode") as DisplayMode;
  }

  async getRecentWorkLogs(num: number): Promise<WorkLog[]> {
    const logs: WorkLog[] = await invoke('get_recent_work_logs_command', { num: num });
    return logs;
  }

  async getAllWorkLogs(): Promise<WorkLog[]> {
    const logs: WorkLog[] = await invoke('get_all_work_logs_command');
    return logs;
  }

  async getWorkLogs(
    fromYear: number,
    fromMonth: number,
    fromDay: number,
    toYear: number,
    toMonth: number,
    toDay: number): Promise<WorkLog[]> {
    const logs: WorkLog[] = await invoke('get_work_logs_command', {
      fromYear, fromMonth, fromDay,
      toYear, toMonth, toDay,
    });
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

  async getProductivityScoreByDate(year: number, month: number, day: number): Promise<number[]> {
    return await invoke('get_productivity_score_by_date_command', { year, month, day });
  }

  async getProductivityScores(fromYear: number, fromMonth: number, fromDay: number, toYear: number, toMonth: number, toDay: number): Promise<{ [key: string]: number[] }> {
    return await invoke('get_productivity_scores_command', {
      fromYear, fromMonth, fromDay,
      toYear, toMonth, toDay,
    });
  }

  async updateProductivityScoreByDate(date: Date, productivityScore: number[]): Promise<void> {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return await invoke('update_productivity_score_by_date_command', {
      year,
      month,
      day,
      productivityScore: productivityScore,
    });
  }
}

