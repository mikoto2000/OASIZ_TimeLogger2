import { useState } from "react";

import { Button, Stack } from "@mui/material";
import { Service } from "../services/Service";
import { TauriService } from "../services/TauriService";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { save } from '@tauri-apps/plugin-dialog'

import dayjs, { Dayjs } from "dayjs";
import { Parser } from '@json2csv/plainjs';
import { writeTextFile } from "@tauri-apps/plugin-fs";

export type ExportType = 'json' | 'csv';

interface FileExporterProps {
  exportType: ExportType;
  service: Service;
};

const FileExporter: React.FC<FileExporterProps> = ({ exportType, service = new TauriService() }) => {

  const [fromDate, setFromDate] = useState<Dayjs | null>(dayjs());
  const [toDate, setToDate] = useState<Dayjs | null>(dayjs());

  const exportWorkLog = async () => {
    if (fromDate && toDate) {
      const logs = await service.getWorkLogs(
        fromDate.year(),
        fromDate.month() + 1,
        fromDate.date(),
        toDate.year(),
        toDate.month() + 1,
        toDate.date(),
      );

      let data;
      if (exportType === 'json') {
        data = JSON.stringify(logs);
      } else {
        data = JSON.stringify(logs);
        try {
          const parser = new Parser({
            fields: ["work_no", "work_name", "start_date", "end_date"]
          });
          const csv = parser.parse(logs);
          data = csv;
        } catch (err) {
          console.error(err);
        }
      }

      const savePath = await save({
        title: '作業記録保存',
        defaultPath: './worklog.json',
        filters: [
          {
            name: 'json',
            extensions: [exportType],
          }
        ]
      });

      if (savePath) {
        writeTextFile(savePath, data);
      }

    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={2}>
        <DatePicker
          label="開始日"
          value={fromDate}
          onChange={(newValue) => setFromDate(newValue)}
        ></DatePicker>
        <DatePicker
          label="終了日"
          value={toDate}
          onChange={(newValue) => setToDate(newValue)}
        ></DatePicker>
        <Button onClick={exportWorkLog}>エクスポート</Button>
      </Stack>
    </LocalizationProvider>
  )
}


export default FileExporter;
